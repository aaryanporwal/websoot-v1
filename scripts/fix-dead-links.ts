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
const CONTENT_DIR = path.join(ROOT, "src/content/blog");
const CONCURRENCY = 8;

async function listMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function fixDeadLinksInFile(filePath: string): Promise<LinkReplacement[]> {
  const originalContent = await readFile(filePath, "utf8");
  const urls = extractUrls(originalContent).filter(shouldCheckUrl);
  const replacements = new Map<string, string>();
  const applied: LinkReplacement[] = [];

  await mapWithConcurrency(urls, CONCURRENCY, async (url) => {
    if (replacements.has(url)) return;

    const dead = await isDeadLink(url);
    if (!dead) return;

    const archiveUrl = await getArchiveUrl(url);
    if (!archiveUrl) {
      console.warn(`Dead link with no archive snapshot: ${url} (${path.relative(ROOT, filePath)})`);
      return;
    }

    replacements.set(url, archiveUrl);
    applied.push({
      original: url,
      replacement: archiveUrl,
      file: path.relative(ROOT, filePath),
    });
    console.log(`Replaced dead link in ${path.relative(ROOT, filePath)}`);
    console.log(`  ${url}`);
    console.log(`  -> ${archiveUrl}`);
  });

  if (replacements.size === 0) return applied;

  const updatedContent = replaceUrls(originalContent, replacements);
  if (updatedContent !== originalContent) {
    await writeFile(filePath, updatedContent, "utf8");
  }

  return applied;
}

async function main() {
  const files = await listMarkdownFiles(CONTENT_DIR);
  const allReplacements: LinkReplacement[] = [];

  for (const file of files) {
    allReplacements.push(...(await fixDeadLinksInFile(file)));
  }

  if (allReplacements.length === 0) {
    console.log("No dead links found.");
    return;
  }

  console.log(`Updated ${allReplacements.length} dead link(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
