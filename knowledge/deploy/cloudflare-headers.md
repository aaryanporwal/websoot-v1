---
type: Reference
title: Cloudflare Pages headers and cache pitfalls
description: public/_headers Cache-Control rules and stale-asset footguns.
tags: [deploy, cloudflare, cache]
resource: public/_headers
---

# Source

`public/_headers` → Astro `dist/` → Cloudflare Pages. Sets `Cache-Control` only. HTML stays Pages default (`max-age=0`). `astro preview` does not apply these rules; verify on a real deploy. Project: `aaryanporwal-com`.

# Policies

| Path | Cache-Control | Notes |
|------|---------------|-------|
| `/_astro/*` | 1y + `immutable` | Fingerprinted; new content → new URL |
| `/fonts/*`, `/sounds/*`, `/works/*`, `/anya/*` | 1y + `immutable` | **Stable URLs** — see pitfall |
| favicons, `og-image.jpg` | 7d | Same URL can change |
| `/rss.xml` | 1h | Feed may lag; HTML does not |

# Pitfalls

1. **In-place replace under `immutable`:** Overwriting a font/sound/image at the same path leaves browsers on old bytes for up to `max-age` (no revalidate). Rename the file and update references, or drop `immutable` / shorten `max-age`.
2. **CF purge ≠ browser purge:** Edge purge does not evict clients that already cached an `immutable` response. Hard reload / clear site data, or ship a new URL.
3. **Dashboard conflict:** Cache/Transform Rules that also set `Cache-Control` can diverge from `_headers`. Check live: `curl -sI <url> \| grep -i cache-control`.
4. **Never long-cache HTML:** Do not add `/*` with long `max-age`/`immutable`.
5. **RSS lag:** New posts can take up to 1h to appear in feeds.
