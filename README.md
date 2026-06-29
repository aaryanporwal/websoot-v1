A bold, AWWWARDS-style personal site for Aaryan Porwal — built with [Astro](https://astro.build/), [Bun](https://bun.sh/), React islands, GSAP + ScrollTrigger, Motion, Lenis smooth scroll, Lottie, and a native Astro blog.

## Getting Started

This project uses [Bun](https://bun.sh/) as the package manager and runner.

```bash
# Install dependencies
bun install

# Run the development server
bun dev
```

Open the local URL printed by Astro, usually [http://localhost:4321](http://localhost:4321).

Build and start production:

```bash
bun run build
bun run preview
```

You can start editing the homepage by modifying `components/HomeApp.tsx` and the imported React components. Blog posts live in `src/content/blog`.

## Tech

- Astro static site
- React islands for the interactive homepage
- GSAP + ScrollTrigger + SplitText (scroll-driven scenes, headline reveals)
- Motion (`motion`) — microinteractions and hovers
- Lenis — smooth scroll, synced to ScrollTrigger
- Lottie (`lottie-react`) — decorative animations
- Tailwind CSS
- Astro content collections for `/blog`, post pages, tag pages, and `/rss.xml`

## Learn More

To learn more about Astro, take a look at:

- [Astro Documentation](https://docs.astro.build/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)

## Blog

The old Hugo blog content has been copied into this repo. Draft posts are excluded from the content collection output. The first migration preserves core blog parity: published posts, tags, syntax highlighting, metadata, and RSS. Search and comments are intentionally deferred.

## Deploy

This is a static Astro site. It can deploy to Vercel, Netlify, Cloudflare Pages, or any CDN that serves the generated `dist/` directory.
