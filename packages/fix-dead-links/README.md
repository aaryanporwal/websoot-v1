# @aaryanporwal/fix-dead-links

Find dead `http(s)` links in site content and replace them with
[archive.org](https://archive.org) Wayback Machine snapshots.

## Install

```sh
npm install -D @aaryanporwal/fix-dead-links
```

## CLI

```sh
npx fix-dead-links
npx fix-dead-links ./content --dry-run
npx fix-dead-links --root . --ext .md,.ts --concurrency 4
```

By default the tool scans `<cwd>/src` for `.md`, `.ts`, and `.astro` files.

## Library

```ts
import {
  extractUrls,
  fixDeadLinks,
  isDeadLink,
  shouldCheckUrl,
} from "@aaryanporwal/fix-dead-links";

const urls = extractUrls(markdown).filter(shouldCheckUrl);
const dead = await isDeadLink(urls[0]);

await fixDeadLinks({
  root: process.cwd(),
  scanRoot: "./content",
  dryRun: true,
});
```

## Behavior

- Skips relative URLs, `mailto:`, localhost, archive.org URLs, and placeholder hosts
- Treats `401` / `403` / `429` as alive so bot blocks are not auto-archived
- Falls back from `HEAD` to `GET` when needed
- Rewrites dead links to the closest Wayback snapshot when one exists

## License

MIT
