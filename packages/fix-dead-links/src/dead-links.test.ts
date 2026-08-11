import { afterEach, describe, expect, mock, test } from "bun:test";
import {
  extractUrls,
  getArchiveUrl,
  isDeadLink,
  isDefinitelyDeadStatus,
  mapWithConcurrency,
  replaceUrls,
  shouldCheckUrl,
  snapshotUrlFromWaybackResponse,
} from "./dead-links";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  mock.restore();
});

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

  test("trims trailing punctuation from bare URLs", () => {
    expect(extractUrls("See https://dead.example/page.")).toEqual([
      "https://dead.example/page",
    ]);
  });

  test("can skip bare URL extraction for markdown posts", () => {
    const content = [
      "[docs](https://canonical.com/docs)",
      "Bare https://canonical.com/bare should stay out.",
    ].join("\n");

    expect(extractUrls(content, { includeBareUrls: false })).toEqual([
      "https://canonical.com/docs",
    ]);
  });

  test("deduplicates repeated URLs", () => {
    const content = [
      "[one](https://canonical.com/a)",
      "https://canonical.com/a",
    ].join("\n");

    expect(extractUrls(content)).toEqual(["https://canonical.com/a"]);
  });
});

describe("shouldCheckUrl", () => {
  test("skips internal, archive, placeholder, and non-http URLs", () => {
    expect(shouldCheckUrl("/blog/post")).toBe(false);
    expect(shouldCheckUrl("#section")).toBe(false);
    expect(shouldCheckUrl("mailto:hi@example.com")).toBe(false);
    expect(shouldCheckUrl("https://web.archive.org/web/123/https://example.com")).toBe(false);
    expect(shouldCheckUrl("https://longurl.com")).toBe(false);
    expect(shouldCheckUrl("https://example.org/docs")).toBe(false);
    expect(shouldCheckUrl("https://canonical.com/page")).toBe(true);
  });

  test("skips localhost and invalid URLs", () => {
    expect(shouldCheckUrl("http://localhost:4321/blog")).toBe(false);
    expect(shouldCheckUrl("https://site.local/page")).toBe(false);
    expect(shouldCheckUrl("not a url")).toBe(false);
    expect(shouldCheckUrl("")).toBe(false);
  });

  test("allows plain http URLs", () => {
    expect(shouldCheckUrl("http://canonical.com/old")).toBe(true);
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

  test("treats success and redirects as alive", () => {
    expect(isDefinitelyDeadStatus(200)).toBe(false);
    expect(isDefinitelyDeadStatus(301)).toBe(false);
    expect(isDefinitelyDeadStatus(399)).toBe(false);
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

  test("leaves content unchanged when map is empty", () => {
    const content = "https://canonical.com";
    expect(replaceUrls(content, new Map())).toBe(content);
  });
});

describe("snapshotUrlFromWaybackResponse", () => {
  test("returns https archive URL when a snapshot is available", () => {
    expect(
      snapshotUrlFromWaybackResponse({
        archived_snapshots: {
          closest: {
            available: true,
            url: "http://web.archive.org/web/20260101000000/https://dead.example/",
          },
        },
      }),
    ).toBe("https://web.archive.org/web/20260101000000/https://dead.example/");
  });

  test("returns null when no usable snapshot exists", () => {
    expect(snapshotUrlFromWaybackResponse({})).toBeNull();
    expect(
      snapshotUrlFromWaybackResponse({
        archived_snapshots: { closest: { available: false, url: "http://web.archive.org/x" } },
      }),
    ).toBeNull();
  });
});

describe("mapWithConcurrency", () => {
  test("preserves input order", async () => {
    const results = await mapWithConcurrency([3, 2, 1], 2, async (n) => {
      await Bun.sleep(n);
      return n * 10;
    });

    expect(results).toEqual([30, 20, 10]);
  });

  test("caps in-flight work to the concurrency limit", async () => {
    let inFlight = 0;
    let maxInFlight = 0;

    await mapWithConcurrency([1, 2, 3, 4, 5], 2, async () => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await Bun.sleep(5);
      inFlight -= 1;
    });

    expect(maxInFlight).toBeLessThanOrEqual(2);
  });
});

describe("isDeadLink", () => {
  test("returns false for successful HEAD responses", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(null, { status: 200 })),
    ) as unknown as typeof fetch;

    await expect(isDeadLink("https://canonical.com")).resolves.toBe(false);
  });

  test("falls back to GET when HEAD is not allowed", async () => {
    const fetchMock = mock(((_url: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === "HEAD") {
        return Promise.resolve(new Response(null, { status: 405 }));
      }
      return Promise.resolve(new Response("ok", { status: 200 }));
    }) as typeof fetch);
    globalThis.fetch = fetchMock;

    await expect(isDeadLink("https://canonical.com")).resolves.toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test("returns true for definite client/server failures", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(null, { status: 404 })),
    ) as unknown as typeof fetch;

    await expect(isDeadLink("https://dead.example/missing")).resolves.toBe(true);
  });

  test("returns false for bot-blocked responses", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(null, { status: 403 })),
    ) as unknown as typeof fetch;

    await expect(isDeadLink("https://canonical.com")).resolves.toBe(false);
  });

  test("returns true when the request throws", async () => {
    globalThis.fetch = mock(() =>
      Promise.reject(new Error("network down")),
    ) as unknown as typeof fetch;

    await expect(isDeadLink("https://dead.example")).resolves.toBe(true);
  });
});

describe("getArchiveUrl", () => {
  test("returns a normalized snapshot URL", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        Response.json({
          archived_snapshots: {
            closest: {
              available: true,
              url: "http://web.archive.org/web/20260101000000/https://dead.example/",
            },
          },
        }),
      ),
    ) as unknown as typeof fetch;

    await expect(getArchiveUrl("https://dead.example/")).resolves.toBe(
      "https://web.archive.org/web/20260101000000/https://dead.example/",
    );
  });

  test("returns null when Wayback has no snapshot", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(Response.json({ archived_snapshots: {} })),
    ) as unknown as typeof fetch;

    await expect(getArchiveUrl("https://dead.example/")).resolves.toBeNull();
  });

  test("returns null on non-OK Wayback responses", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response("nope", { status: 500 })),
    ) as unknown as typeof fetch;

    await expect(getArchiveUrl("https://dead.example/")).resolves.toBeNull();
  });
});
