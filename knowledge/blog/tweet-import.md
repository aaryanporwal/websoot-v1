---
type: Playbook
title: Tweet import
description: Import tweets from X/Twitter as draft blog posts.
tags: [blog, content, automation, twitter]
resource: scripts/tweet-to-draft.ts
---

# Overview

The tweet import pipeline fetches your X/Twitter timeline and writes draft markdown files to `src/content/blog/tweets/`. Imported posts have `draft: true` and must be edited and published manually.

# Run locally

```bash
bun run tweet:import
```

Add `--dry-run` to preview without writing files:

```bash
bun run scripts/tweet-to-draft.ts --dry-run
```

# Environment variables

Set these in `.env` (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `TWITTER_AUTH_TOKEN` | X/Twitter auth token |
| `TWITTER_CT0` | X/Twitter ct0 cookie |
| `X_USERNAME` | Your X handle (default: `aaryan7476`) |

Optional: `MAX_TWEETS` (default `20`) limits how many tweets to fetch.

# Output

- **Files:** `src/content/blog/tweets/tweet-{id}.md`
- **State:** `scripts/.tweet-state.json` (dedup tracking)

Example imported frontmatter:

```yaml
---
title: "First line of tweet text..."
date: 2025-01-15T10:30:00.000Z
draft: true
tags:
  - "tweet"
description: "Imported from @aaryan7476"
tweet_id: "1234567890"
source_url: "https://x.com/aaryan7476/status/1234567890"
---
```

# Publish a tweet draft

1. Open the draft in `src/content/blog/tweets/`.
2. Edit the title, body, and tags as needed.
3. Set `draft: false`.
4. Preview with `bun run dev`.

# CI automation

`.github/workflows/tweet-draft.yml` runs daily at 6:00 AM UTC (and on manual dispatch). It runs `tweet:import` and `tweets:fetch`, then auto-commits new drafts to `src/content/blog/tweets/*.md`.

Note: `tweets:fetch` updates `src/data/recent-tweets.json` for the homepage widget. That is separate from blog posts. CI runs this daily; local builds use the committed file. To refresh manually:

```bash
bun run tweets:fetch
```

Pass `--force` to rewrite the file even when tweet content is unchanged (for example, to refresh like/view counts).
