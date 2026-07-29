# Deploy

Static Astro site (`astro build` → `dist/`) on **Cloudflare Pages** project `aaryanporwal-com`. Git integration: push to `main` → production; other branches → preview. No `wrangler.toml` / `vercel.json`; do not deploy via Vercel. Live site: `https://aaryanporwal.com` (also `www` + `*.pages.dev`). Zone/UI tweaks (speculation rules, security headers) live in the Cloudflare dashboard; path cache is in-repo via `_headers`.

* [Cloudflare headers](cloudflare-headers.md) - `_headers` cache policies and footguns
