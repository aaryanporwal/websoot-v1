import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  extractUrls,
  getArchiveUrl,
  isDeadLink,
  mapWithConcurrency,
  replaceUrls,
  shouldCheckUrl,
  type LinkReplacement,
} from "./dead-links.js";

export type FixDeadLinksOptions = {
  /** Project root used for relative paths in the result. Defaults to cwd. */
  root?: string;
  /** Directory to scan recursively. Defaults to `<root>/src`. */
  scanRoot?: string;
  /** File extensions to include. Defaults to `.md`, `.ts`, `.astro`. */
  extensions?: string[];
  /** Basenames to skip. Defaults to `posthog.astro`. */
  skipFiles?: string[];
  /** Max concurrent link checks. Defaults to 6. */
  concurrency?: number;
  /** When true, report replacements without writing files. */
  dryRun?: boolean;
  /** Optional logger. Defaults to console. */
  log?: Pick<Console, "log" | "warn">;
};

const DEFAULT_EXTENSIONS = [".md", ".ts", ".astro"];
const DEFAULT_SKIP_FILES = ["posthog.astro"];

export async function listScannableFiles(
  dir: string,
  options?: { extensions?: string[]; skipFiles?: string[] },
): Promise<string[]> {
  const extensions = new Set(options?.extensions ?? DEFAULT_EXTENSIONS);
  const skipFiles = new Set(options?.skipFiles ?? DEFAULT_SKIP_FILES);
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listScannableFiles(fullPath, options)));
      continue;
    }

    if (!entry.isFile() || skipFiles.has(entry.name)) continue;
    if (!extensions.has(path.extname(entry.name))) continue;

    files.push(fullPath);
  }

  return files;
}

export async function fixDeadLinks(options: FixDeadLinksOptions = {}): Promise<LinkReplacement[]> {
  const root = path.resolve(options.root ?? process.cwd());
  const scanRoot = path.resolve(options.scanRoot ?? path.join(root, "src"));
  const concurrency = options.concurrency ?? 6;
  const dryRun = options.dryRun ?? false;
  const log = options.log ?? console;

  const files = await listScannableFiles(scanRoot, {
    extensions: options.extensions,
    skipFiles: options.skipFiles,
  });
  const fileContents = await Promise.all(
    files.map(async (filePath) => ({ filePath, content: await readFile(filePath, "utf8") })),
  );

  const uniqueUrls = new Set<string>();
  for (const { filePath, content } of fileContents) {
    const includeBareUrls = !filePath.endsWith(".md");
    for (const url of extractUrls(content, { includeBareUrls }).filter(shouldCheckUrl)) {
      uniqueUrls.add(url);
    }
  }

  const replacements = new Map<string, string>();
  const urls = [...uniqueUrls];

  await mapWithConcurrency(urls, concurrency, async (url) => {
    const dead = await isDeadLink(url);
    if (!dead) return;

    const archiveUrl = await getArchiveUrl(url);
    if (!archiveUrl) {
      log.warn(`Dead link with no archive snapshot: ${url}`);
      return;
    }

    replacements.set(url, archiveUrl);
    log.log(`Will replace dead link:`);
    log.log(`  ${url}`);
    log.log(`  -> ${archiveUrl}`);
  });

  const allReplacements: LinkReplacement[] = [];

  for (const { filePath, content } of fileContents) {
    const updatedContent = replaceUrls(content, replacements);
    if (updatedContent === content) continue;

    if (!dryRun) {
      await writeFile(filePath, updatedContent, "utf8");
    }

    for (const [original, replacement] of replacements) {
      if (!content.includes(original)) continue;
      allReplacements.push({
        original,
        replacement,
        file: path.relative(root, filePath),
      });
    }

    log.log(`${dryRun ? "Would update" : "Updated"} ${path.relative(root, filePath)}`);
  }

  if (allReplacements.length === 0) {
    log.log("No dead links found.");
    return [];
  }

  log.log(
    `${dryRun ? "Would update" : "Updated"} ${allReplacements.length} dead link reference(s) across ${new Set(allReplacements.map((item) => item.file)).size} file(s).`,
  );

  return allReplacements;
}
