# Agent Guide

Start at [knowledge/index.md](knowledge/index.md) (Open Knowledge Format bundle).

## Quick blog reference

- Write posts to `src/content/blog/{kebab-case}.md`
- Required frontmatter: `title`, `date`
- Publish: `draft: false`
- Full playbook: [knowledge/blog/write-post.md](knowledge/blog/write-post.md)

## Other tasks

| Task | Read |
|------|------|
| Blog frontmatter schema | [knowledge/blog/frontmatter-schema.md](knowledge/blog/frontmatter-schema.md) |
| Slug and URL rules | [knowledge/blog/slug-and-urls.md](knowledge/blog/slug-and-urls.md) |
| Tweet import pipeline | [knowledge/blog/tweet-import.md](knowledge/blog/tweet-import.md) |
| Cloudflare deploy / `_headers` | [knowledge/deploy/](knowledge/deploy/) |
| Writing voice | [knowledge/blog/voice.md](knowledge/blog/voice.md) |
| Product voice (full) | [PRODUCT.md](PRODUCT.md) |
| Visual design | [DESIGN.md](DESIGN.md) |

## Cursor Cloud specific instructions

This is an Astro + React + GSAP static site that uses **Bun** as the runtime and package manager (see `bun.lock`). Bun is preinstalled at `$HOME/.bun/bin` and on `PATH` in interactive shells via `~/.bashrc`; non-interactive scripts can call it as `$HOME/.bun/bin/bun`.

Standard commands live in `package.json` scripts:
- Dev server: `bun run dev` (Astro serves on `http://localhost:4321`, not the default 3000; add `--host` to expose on the network).
- Tests: `bun test` (Bun's built-in test runner; specs live next to source, e.g. `components/Dither/*.test.ts`).
- Build: `bun run build`; preview a build with `bun run preview`.
- Lint: `bun run lint` (and `bun run lint:fix`). ESLint 9 flat config lives in `eslint.config.js` (TypeScript + React + React Hooks + jsx-a11y + Astro).

Gotchas:
- Lint is expected to exit 0 with a handful of warnings. Several opinionated rules (`react-hooks/set-state-in-effect`, `react-hooks/refs`, `jsx-a11y/no-static-element-interactions`, `jsx-a11y/no-autofocus`, `exhaustive-deps`) are intentionally set to `warn` because the existing components use patterns (react-three-fiber refs, theme menus) that would need refactors; keep them as warnings unless you are deliberately addressing them.
- `eslint.config.js` ignores `src/components/posthog.astro` (a vendored minified PostHog snippet). Do not run `--fix` expecting it to touch that file, and avoid auto-fixing vendored snippets.
- `astro check` is still not wired up (`@astrojs/check` is not a dependency and its installer prompt is interactive), so use `bun run lint` for static checks.
- Copy `.env.example` to `.env` for local runs; all values in it are public PostHog keys, so no secrets are required to run or build the site.
- Blog content is Astro content collections under `src/content/blog/*.md`; a post needs `draft: false` to appear on `/blog/`, tag pages, `/rss.xml`, and the ⌘K switcher. The dev server hot-reloads new/edited posts.
- Git hooks live in `.githooks/` (`core.hooksPath`). `bun install` runs `prepare` to point git at them. The `commit-msg` hook strips any `Co-authored-by` trailers from commit messages.
