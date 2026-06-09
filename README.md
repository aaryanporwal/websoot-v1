A bold, AWWWARDS-style personal site for Aaryan Porwal — built with [Next.js](https://nextjs.org/), [Bun](https://bun.sh/), GSAP + ScrollTrigger, Framer Motion, Lenis smooth scroll, and Lottie.

## Getting Started

This project uses [Bun](https://bun.sh/) as the package manager and runner.

```bash
# Install dependencies
bun install

# Run the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Build and start production:

```bash
bun run build
bun run start
```

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Tech

- Next.js (Pages Router)
- GSAP + ScrollTrigger + SplitText (scroll-driven scenes, headline reveals)
- Framer Motion (`motion`) — microinteractions and hovers
- Lenis — smooth scroll, synced to ScrollTrigger
- Lottie (`lottie-react`) — decorative animations
- Tailwind CSS

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
