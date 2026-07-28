---
type: Playbook
title: Write a blog post
description: Create a new markdown file in src/content/blog/ and publish it to the site.
tags: [blog, content, authoring]
resource: src/content/blog/
---

# Steps

1. **Create a file** at `src/content/blog/{kebab-case}.md`.
   Use kebab-case for the filename so the URL is predictable. See [slug-and-urls.md](slug-and-urls.md).

2. **Add frontmatter** with at least `title` and `date`. See [frontmatter-schema.md](frontmatter-schema.md).

3. **Write the body** in standard Markdown (headings, code fences, images, links).

4. **Set `draft: false`** to publish. Omit `draft` or leave it `true` to keep the post hidden from the site.

5. **Preview locally:**

   ```bash
   bun run dev
   ```

   Open `http://localhost:4321/blog/{slug}/` where `{slug}` is derived from the filename.

6. **Verify** the post appears on `/blog/`, any tag pages, `/rss.xml`, and the command switcher (⌘K).

For writing tone, see [voice.md](voice.md).

# Examples

New post template:

```markdown
---
title: "Post title"
date: 2026-07-28T12:00:00+05:30
draft: true
tags:
  - "tag-name"
description: "One-line summary for index cards and RSS"
---

Opening paragraph...
```

When ready to publish, change `draft: true` to `draft: false`.
