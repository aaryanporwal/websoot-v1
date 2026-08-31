---
title: "English SEO Is a Losing Battle"
date: 2026-08-31T17:45:00+05:30
draft: false
tags:
  - "seo"
  - "astro"
  - "i18n"
description: "English keyword fights rarely pay off. Translate single-purpose micro-tools and watch keyword difficulty drop to zero."
---

English SEO is a losing battle. Your hard work will rarely be rewarded with traffic growth. The real advantage lies in translating beautiful, single-purpose, micro-tools into a less common language (Portuguese, Spanish) and watching Keyword Difficulty drop to zero in the rankings.

This article covers the exact technical setup for building, localizing and ranking micro-tools like the one above. We'll be using two tools: Astro (static site generator) and Cloudflare Pages (we'll use it to build and deploy our sites).

## Astro i18n & Hreflang Routing

Astro provides a couple of simple features for adding support for multiple languages. The first tweak we can make adds important signals to search engines:

- Generate all our pages under different subdirectories like `/pt` and `/es`
- Make sure document head dynamically passes the correct language code (we'll expand on this below)

Although the text on the site will be translated, and the URL will change, search engines still need explicit signals. Otherwise, you're essentially just swapping a couple of text strings but not actually localizing anything.

## Kill the .pages.dev SEO Penalty

Cloudflare Pages auto-generates a `your-project.pages.dev` URL. If you also point a custom domain at the same project, you might end up with a duplicate content penalty as Google indexes both your custom domain and `.pages.dev`. The fix is simple: add a file called `_headers` to your public folder with the following contents.

## Consolidate Apex Domain Equity

The second tweak solves a very common problem in SEO: splitting SEO equity between root (`yourdomain.com`) and `www.yourdomain.com`. To avoid this, always add only your root domain to your list of custom domains in Cloudflare Pages. Finally, go to the Cloudflare Dashboard and setup a Redirect Rule:

- Source: `www.yourdomain.com/*`
- Target: `yourdomain.com/*`
- Status: 301 (Permanent Redirect)
- Preserve Query String: Enabled

This will make sure `www.yourdomain.com` redirects to `yourdomain.com`, consolidating your brand and SEO equity.

## The Workflow

Once you're happy with the logic of your project, build the project once in English (or whichever of your primary languages you're trying to pivot from) to make sure it works. Then pass the codebase (preserving all your existing logic and styling) to your favourite AI agent - one of my favourites is Claude and also Anti-Gravity. It may be a while before AI agents are mature enough to perform SEO and LSI analysis, but I've tested enough of them to be very confident they'll be able to implement Astro i18n with no tweaks if you ask them to. All you have to do is explain your strategy then pass them an example URL in the primary language and its localized equivalent in the target language. Once they've added the additional languages and localized keywords you're satisfied with, just deploy, patch the headers, redirect the root and sit back and let it rank.
