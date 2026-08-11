const USER_AGENT = "websoot-dead-link-checker/1.0 (+https://aaryanporwal.com)";
const REQUEST_TIMEOUT_MS = 15_000;
const MARKDOWN_LINK = /!?\[[^\]]*\]\(((?:[^()]|\([^)]*\))*)\)/g;
const BARE_URL = /https?:\/\/[^\s"'`)>\]]+/g;
const PLACEHOLDER_HOSTS = new Set([
  "example.com",
  "example.org",
  "example.net",
  "longurl.com",
  "shorturl.com",
]);

export type LinkReplacement = {
  original: string;
  replacement: string;
  file: string;
};

function trimTrailingPunctuation(url: string): string {
  return url.replace(/[.,;:!?]+$/, "");
}

export function extractUrls(content: string, options?: { includeBareUrls?: boolean }): string[] {
  const includeBareUrls = options?.includeBareUrls ?? true;
  const urls = new Set<string>();

  for (const match of content.matchAll(MARKDOWN_LINK)) {
    const url = match[1]?.trim();
    if (url) urls.add(trimTrailingPunctuation(url));
  }

  if (includeBareUrls) {
    for (const match of content.matchAll(BARE_URL)) {
      const url = match[0]?.trim();
      if (url) urls.add(trimTrailingPunctuation(url));
    }
  }

  return [...urls];
}

export function isDefinitelyDeadStatus(status: number): boolean {
  if (status < 400) return false;
  // Bot blocks and rate limits are ambiguous; don't auto-replace these.
  if (status === 401 || status === 403 || status === 429) return false;
  return true;
}

export function shouldCheckUrl(url: string): boolean {
  if (!url || url.startsWith("#") || url.startsWith("/")) return false;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) return false;
  if (parsed.hostname === "localhost" || parsed.hostname.endsWith(".local")) return false;
  if (parsed.hostname.includes("archive.org") || parsed.hostname.includes("web.archive.org")) {
    return false;
  }
  if (PLACEHOLDER_HOSTS.has(parsed.hostname)) return false;

  return true;
}

export async function isDeadLink(url: string): Promise<boolean> {
  const headers = { "User-Agent": USER_AGENT };

  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    }

    return isDefinitelyDeadStatus(response.status);
  } catch {
    return true;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getArchiveUrl(url: string): Promise<string | null> {
  const apiUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (response.status === 429) {
        await sleep(1000 * (attempt + 1));
        continue;
      }

      if (!response.ok) return null;

      const data = (await response.json()) as {
        archived_snapshots?: {
          closest?: {
            available?: boolean;
            url?: string;
          };
        };
      };

      const snapshot = data.archived_snapshots?.closest;
      if (!snapshot?.available || !snapshot.url) return null;

      return snapshot.url.replace(/^http:\/\//, "https://");
    } catch {
      if (attempt === 2) return null;
      await sleep(1000 * (attempt + 1));
    }
  }

  return null;
}

export function replaceUrls(content: string, replacements: Map<string, string>): string {
  let next = content;

  for (const [original, replacement] of replacements) {
    next = next.replaceAll(original, replacement);
  }

  return next;
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}
