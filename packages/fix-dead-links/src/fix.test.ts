import { afterEach, describe, expect, mock, test } from "bun:test";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fixDeadLinks, listScannableFiles } from "./fix";
import { runCli } from "./cli";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  mock.restore();
});

describe("listScannableFiles", () => {
  test("finds supported files and skips configured basenames", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "fix-dead-links-"));
    await mkdir(path.join(root, "nested"), { recursive: true });
    await writeFile(path.join(root, "post.md"), "ok");
    await writeFile(path.join(root, "nested", "page.ts"), "ok");
    await writeFile(path.join(root, "posthog.astro"), "skip");
    await writeFile(path.join(root, "note.txt"), "skip");

    const files = await listScannableFiles(root);
    const relative = files.map((file) => path.relative(root, file)).sort();

    expect(relative).toEqual(["nested/page.ts", "post.md"]);
  });
});

describe("fixDeadLinks", () => {
  test("replaces dead links with archive snapshots", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "fix-dead-links-"));
    const scanRoot = path.join(root, "src");
    await mkdir(scanRoot, { recursive: true });
    const target = path.join(scanRoot, "work.ts");
    await writeFile(target, 'href: "https://dead.example/page",\n');

    globalThis.fetch = mock((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes("archive.org/wayback/available")) {
        return Promise.resolve(
          Response.json({
            archived_snapshots: {
              closest: {
                available: true,
                url: "http://web.archive.org/web/20260101000000/https://dead.example/page",
              },
            },
          }),
        );
      }
      if (init?.method === "HEAD" || init?.method === "GET") {
        return Promise.resolve(new Response(null, { status: 404 }));
      }
      return Promise.resolve(new Response("unexpected", { status: 500 }));
    }) as unknown as typeof fetch;

    const logs: string[] = [];
    const replacements = await fixDeadLinks({
      root,
      scanRoot,
      log: {
        log: (message) => logs.push(String(message)),
        warn: (message) => logs.push(String(message)),
      },
    });

    expect(replacements).toEqual([
      {
        original: "https://dead.example/page",
        replacement: "https://web.archive.org/web/20260101000000/https://dead.example/page",
        file: path.join("src", "work.ts"),
      },
    ]);
    expect(await readFile(target, "utf8")).toContain(
      "https://web.archive.org/web/20260101000000/https://dead.example/page",
    );
  });

  test("dry-run does not write files", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "fix-dead-links-"));
    const scanRoot = path.join(root, "src");
    await mkdir(scanRoot, { recursive: true });
    const target = path.join(scanRoot, "work.ts");
    const original = 'href: "https://dead.example/page",\n';
    await writeFile(target, original);

    globalThis.fetch = mock((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("archive.org/wayback/available")) {
        return Promise.resolve(
          Response.json({
            archived_snapshots: {
              closest: {
                available: true,
                url: "https://web.archive.org/web/1/https://dead.example/page",
              },
            },
          }),
        );
      }
      return Promise.resolve(new Response(null, { status: 404 }));
    }) as unknown as typeof fetch;

    await fixDeadLinks({
      root,
      scanRoot,
      dryRun: true,
      log: { log() {}, warn() {} },
    });

    expect(await readFile(target, "utf8")).toBe(original);
  });
});

describe("runCli", () => {
  test("prints help and exits 0", async () => {
    const log = mock(() => {});
    const originalLog = console.log;
    console.log = log;
    try {
      expect(await runCli(["--help"])).toBe(0);
      expect(log).toHaveBeenCalled();
    } finally {
      console.log = originalLog;
    }
  });
});
