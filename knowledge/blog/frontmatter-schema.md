---
type: Reference
title: Blog frontmatter schema
description: Required and optional YAML frontmatter fields for blog posts.
tags: [blog, content, schema]
resource: src/content.config.ts
---

# Schema

Blog posts are validated by the Zod schema in `src/content.config.ts`. Every `.md` or `.mdx` file under `src/content/blog/` is loaded by the Astro content collection.

| Field | Required | Default | Purpose |
|-------|----------|---------|---------|
| `title` | yes | — | Display title |
| `date` | yes | — | Publication date (coerced to `Date`; ISO or offset strings work) |
| `draft` | no | `false` | `true` hides the post from index, individual pages, tags, RSS, and the command switcher |
| `slug` | no | — | **Unused** by routing; URL slug comes from the filename instead |
| `author` | no | — | Author name |
| `tags` | no | `[]` | Tag list; drives `/blog/tags/{tag}/` pages |
| `description` | no | — | Preferred summary for index cards and RSS |
| `summary` | no | — | Fallback summary if `description` is absent |
| `tweet_id` | no | — | Set by tweet import automation |
| `source_url` | no | — | Set by tweet import automation (must be a valid URL) |

# Summary text on index cards

Priority order (see `postSummary()` in `src/lib/posts.ts`):

1. `description`
2. `summary`
3. Auto-extracted first ~220 characters of the body
