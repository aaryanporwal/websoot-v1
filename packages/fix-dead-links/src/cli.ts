#!/usr/bin/env node
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fixDeadLinks } from "./fix.js";

function printHelp() {
  console.log(`Usage: fix-dead-links [options] [scan-dir]

Scan files for dead http(s) links and replace them with archive.org snapshots.

Options:
  --root <dir>          Project root for relative paths (default: cwd)
  --concurrency <n>     Concurrent link checks (default: 6)
  --dry-run             Report replacements without writing files
  --ext <list>          Comma-separated extensions (default: .md,.ts,.astro)
  --skip <list>         Comma-separated basenames to skip
  -h, --help            Show help
`);
}

function readFlagValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

export async function runCli(argv = process.argv.slice(2)): Promise<number> {
  const options: {
    root?: string;
    scanRoot?: string;
    concurrency?: number;
    dryRun?: boolean;
    extensions?: string[];
    skipFiles?: string[];
  } = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "-h" || arg === "--help") {
      printHelp();
      return 0;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--root") {
      options.root = path.resolve(readFlagValue(argv, i, arg));
      i += 1;
      continue;
    }

    if (arg === "--concurrency") {
      options.concurrency = Number(readFlagValue(argv, i, arg));
      i += 1;
      continue;
    }

    if (arg === "--ext") {
      options.extensions = readFlagValue(argv, i, arg)
        .split(",")
        .map((ext) => (ext.startsWith(".") ? ext : `.${ext}`));
      i += 1;
      continue;
    }

    if (arg === "--skip") {
      options.skipFiles = readFlagValue(argv, i, arg).split(",").filter(Boolean);
      i += 1;
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    options.scanRoot = path.resolve(arg);
  }

  await fixDeadLinks(options);
  return 0;
}

const isDirectRun =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  runCli().then(
    (code) => process.exit(code),
    (error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    },
  );
}
