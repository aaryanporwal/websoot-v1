import { describe, expect, test } from "bun:test";
import { extractUrls, replaceUrls, shouldCheckUrl } from "./dead-links";

describe("extractUrls", () => {
  test("extracts markdown links and image URLs", () => {
    const content = [
      "Read [the docs](https://example.com/docs).",
      "![diagram](https://example.com/diagram.png)",
    ].join("\n");

    expect(extractUrls(content)).toEqual([
      "https://example.com/docs",
      "https://example.com/diagram.png",
    ]);
  });
});

describe("shouldCheckUrl", () => {
  test("skips internal, archive, and non-http URLs", () => {
    expect(shouldCheckUrl("/blog/post")).toBe(false);
    expect(shouldCheckUrl("#section")).toBe(false);
    expect(shouldCheckUrl("mailto:hi@example.com")).toBe(false);
    expect(shouldCheckUrl("https://web.archive.org/web/123/https://example.com")).toBe(false);
    expect(shouldCheckUrl("https://example.com/page")).toBe(true);
  });
});

describe("replaceUrls", () => {
  test("replaces every occurrence of a URL", () => {
    const content = [
      "[one](https://dead.example/a)",
      "https://dead.example/a",
    ].join("\n");
    const replacements = new Map([
      ["https://dead.example/a", "https://web.archive.org/web/1/https://dead.example/a"],
    ]);

    expect(replaceUrls(content, replacements)).toBe(
      [
        "[one](https://web.archive.org/web/1/https://dead.example/a)",
        "https://web.archive.org/web/1/https://dead.example/a",
      ].join("\n"),
    );
  });
});
