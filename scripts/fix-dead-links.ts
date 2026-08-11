#!/usr/bin/env bun
import path from "node:path";
import { fixDeadLinks } from "../packages/fix-dead-links/src/fix.ts";

const ROOT = path.resolve(import.meta.dir, "..");

await fixDeadLinks({
  root: ROOT,
  scanRoot: path.join(ROOT, "src"),
  skipFiles: ["posthog.astro"],
});
