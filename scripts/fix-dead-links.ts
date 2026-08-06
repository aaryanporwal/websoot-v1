#!/usr/bin/env bun

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
} from "./lib/dead-links";

const ROOT = path.resolve(import.meta.dir, "..");
const SCAN_ROOT = path.join(ROOT, "src");
const SCAN_EXTENSIONS = new Set([".md", ".ts", ".astro"]);
const SKIP_FILES = new Set(["posthog.astro"]);
const CONCURRENCY = 6;

async function listScannableFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listScannableFiles(fullPath)));
      continue;
    }

    if (!entry.isFile() || SKIP_FILES.has(entry.name)) continue;
    if (!SCAN_EXTENSIONS.has(path.extname(entry.name))) continue;

    files.push(fullPath);
  }

  return files;
}

async function main() {
  const files = await listScannableFiles(SCAN_ROOT);
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

  await mapWithConcurrency(urls, CONCURRENCY, async (url) => {
    const dead = await isDeadLink(url);
    if (!dead) return;

    const archiveUrl = await getArchiveUrl(url);
    if (!archiveUrl) {
      console.warn(`Dead link with no archive snapshot: ${url}`);
      return;
    }

    replacements.set(url, archiveUrl);
    console.log(`Will replace dead link:`);
    console.log(`  ${url}`);
    console.log(`  -> ${archiveUrl}`);
  });

  const allReplacements: LinkReplacement[] = [];

  for (const { filePath, content } of fileContents) {
    const updatedContent = replaceUrls(content, replacements);
    if (updatedContent === content) continue;

    await writeFile(filePath, updatedContent, "utf8");

    for (const [original, replacement] of replacements) {
      if (!content.includes(original)) continue;
      allReplacements.push({
        original,
        replacement,
        file: path.relative(ROOT, filePath),
      });
    }

    console.log(`Updated ${path.relative(ROOT, filePath)}`);
  }

  if (allReplacements.length === 0) {
    console.log("No dead links found.");
    return;
  }

  console.log(`Updated ${allReplacements.length} dead link reference(s) across ${new Set(allReplacements.map((item) => item.file)).size} file(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
