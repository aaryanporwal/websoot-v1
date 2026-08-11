import { describe, expect, test } from "bun:test";
import {
  extractUrls,
  isDefinitelyDeadStatus,
  replaceUrls,
  shouldCheckUrl,
} from "./dead-links";

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

  test("extracts bare URLs from source files", () => {
    const content = 'href: "https://ubuntu.com/blog/tag/ubuntu-summit-2024",';
    expect(extractUrls(content)).toEqual(["https://ubuntu.com/blog/tag/ubuntu-summit-2024"]);
  });

  test("extracts markdown links with parentheses in the URL", () => {
    const content =
      "[load balance](https://en.wikipedia.org/wiki/Load_balancing_(computing))";
    expect(extractUrls(content, { includeBareUrls: false })).toEqual([
      "https://en.wikipedia.org/wiki/Load_balancing_(computing)",
    ]);
  });
});

describe("shouldCheckUrl", () => {
  test("skips internal, archive, placeholder, and non-http URLs", () => {
    expect(shouldCheckUrl("/blog/post")).toBe(false);
    expect(shouldCheckUrl("#section")).toBe(false);
    expect(shouldCheckUrl("mailto:hi@example.com")).toBe(false);
    expect(shouldCheckUrl("https://web.archive.org/web/123/https://example.com")).toBe(false);
    expect(shouldCheckUrl("https://longurl.com")).toBe(false);
    expect(shouldCheckUrl("https://canonical.com/page")).toBe(true);
  });
});

describe("isDefinitelyDeadStatus", () => {
  test("treats bot blocks as alive", () => {
    expect(isDefinitelyDeadStatus(403)).toBe(false);
    expect(isDefinitelyDeadStatus(401)).toBe(false);
    expect(isDefinitelyDeadStatus(429)).toBe(false);
    expect(isDefinitelyDeadStatus(404)).toBe(true);
    expect(isDefinitelyDeadStatus(522)).toBe(true);
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
