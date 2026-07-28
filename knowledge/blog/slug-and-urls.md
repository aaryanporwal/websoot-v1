---
type: Reference
title: Slug and URLs
description: How blog post filenames map to /blog/{slug}/ URLs.
tags: [blog, content, routing]
resource: src/lib/posts.ts
---

# Slug derivation

URL slugs are derived from the **filename**, not from the optional `slug` frontmatter field. The logic lives in `postSlug()` in `src/lib/posts.ts`:

```typescript
export function postSlug(post: BlogPost) {
  return post.id
    .replace(/\.(md|mdx)$/i, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}
```

Steps: strip extension, replace spaces with hyphens, lowercase.

# Examples

| Filename | URL slug | Live URL |
|----------|----------|----------|
| `my-new-post.md` | `my-new-post` | `/blog/my-new-post/` |
| `thinking-in-react.md` | `thinking-in-react` | `/blog/thinking-in-react/` |
| `GSoC_with_Ceph.md` | `gsoc_with_ceph` | `/blog/gsoc_with_ceph/` |
| `Scaling your Node.JS app like a boss.md` | `scaling-your-node.js-app-like-a-boss` | `/blog/scaling-your-node.js-app-like-a-boss/` |

# Conventions for new posts

- Use **kebab-case** filenames (e.g. `context-trap.md`).
- Avoid spaces, underscores, and mixed case in new filenames.
- Legacy posts have inconsistent names; do not rename them unless asked.

# Tag URLs

Tags are slugified separately via `tagSlug()`: lowercase, spaces replaced with hyphens. A post tagged `frontend` appears at `/blog/tags/frontend/`.
