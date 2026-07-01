---
name: Aaryan Porwal — Web Engineer
description: A motion-led personal site with selectable themes, tokenized color, and a dark-stage default.
colors:
  body: "rgb(var(--color-body))"
  ink: "rgb(var(--color-ink))"
  surface: "rgb(var(--color-surface))"
  line: "rgb(var(--color-line))"
  muted: "rgb(var(--color-muted))"
  foreground: "rgb(var(--color-foreground))"
  accent: "rgb(var(--color-accent))"
  accent-hover: "rgb(var(--color-accent-hover))"
  accent-subtle: "rgb(var(--color-accent-subtle))"
  on-accent: "rgb(var(--color-on-accent))"
  default-body: "#08080B"
  default-foreground: "#F5F5F7"
  default-accent: "#C6FF3D"
  selected-text: "#A3A3FF"
  ramp-electric: "#3F3FFF"
  ramp-violet: "#8B5CF6"
  ramp-fuchsia: "#D946EF"
typography:
  display:
    fontFamily: "Clash Display, Inter, sans-serif"
    fontSize: "clamp(3.5rem, 0.5rem + 13vw, 12rem)"
    fontWeight: 600
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Clash Display, Inter, sans-serif"
    fontSize: "clamp(2.25rem, 1rem + 5vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Clash Display, Inter, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "General Sans, Inter, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "General Sans, Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.3em"
rounded:
  hairline: "0px"
  code: "0.35rem"
  media: "0.75rem"
  card: "24px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
  section: "128px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.on-accent}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-outline-hover:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
  button-white:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.body}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
  card-project:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.card}"
    padding: "40px"
  input-default:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    padding: "14px 20px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.hairline}"
    padding: "8px 0"
  nav-link-hover:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
---

# Design System: Aaryan Porwal — Web Engineer

## 1. Overview

**Creative North Star: "The Calm Stage"**

The default theme is a dark theater. The work is the performer. Voltage Lime is the single spot. Everything else — chrome, borders, navigation — recedes. This is not the AI-dark neon dashboard reflex (pure black + electric blue + fuchsia + acid glow stacked as personality). This is a dark stage where one signal color does the heavy lifting and the rest of the surface gets out of the way.

The live site is now themeable. The dark-stage default remains the brand baseline, but color must be expressed through CSS variables (`--color-body`, `--color-foreground`, `--color-accent`, etc.) so the light, Gruvbox, Everforest, Nature, and Rose Pine themes inherit the same hierarchy without duplicating component styles.

Density is generous. Type carries the page; motion is choreography, not effect; imagery is sparse on purpose because the visitor's eye is meant to land on the headline, then the marquee, then the work cards, then the contact moment. The brand triad from PRODUCT.md — _Playful, Warm, Technical_ — is split by surface: playful lives in motion choreography and micro-interaction, warm lives in copy voice and the named-cat contact device, technical lives in execution detail (split-text reveals, scroll-pinned horizontal scroll, scroll-velocity marquee, reduced-motion fallbacks shipped on every animation).

The system explicitly rejects: the SaaS hero-metric template, identical icon-and-text card grids, the AI-dark cyberpunk neon-purple portfolio reflex (currently the single largest pressure point in this codebase — see Colors §2 and Don'ts §6), Themeforest-style "Hello, I'm a developer" parallax, cold brutalist pure-mono, and corporate "passionate about" LinkedIn voice.

**Key Characteristics:**

- Default dark canvas at near-black `#08080B`, with two tonal steps (`#0B0B10` ink, `#121219` surface) doing all the layering work — no shadows.
- One functional accent per theme. In the default theme this is **Voltage Lime** `#C6FF3D`; in alternate themes it is `--color-accent`. It carries CTAs, eyebrow hairlines, link underlines, marquee separators, and `::selection`. Used at ≤10% of any screen.
- Display type at hero scale (up to ~12rem fluid) with `letter-spacing: -0.04em`; body type tops out at ~1.5rem and stays comfortable for long reads.
- Motion is the proof-of-craft: GSAP `SplitText` reveals, `ScrollTrigger` pinning, scrub-driven color reveal on the About statement, scroll-velocity-coupled marquee. Every animation has a `prefers-reduced-motion` fallback.
- Film-grain overlay at 5% opacity over the whole document — texture, not decoration.

## 2. Colors

A tokenized color system with one signal color carrying all functional weight in each theme. The default theme is a near-black canvas with Voltage Lime, while alternate themes remap the same semantic tokens. A legacy purple/fuchsia ramp remains held in ambient glows and is scheduled to recede.

### Theme Tokens

All production color styling should use semantic Tailwind colors backed by CSS variables:

- `body`, `ink`, `surface`, `line`, `muted`, `white`/foreground, `voltage`/accent, `voltage-hover`, `voltage-subtle`, and `on-accent`.
- Theme state lives on `document.documentElement.dataset.theme`.
- The supported theme IDs are `default`, `light`, `gruvbox`, `everforest`, `nature`, and `rose-pine`.
- Theme choice persists in `localStorage` under `aaryanporwal-theme`.
- The inline head bootstrap in `SiteLayout.astro` must set the saved theme before React loads to avoid a theme flash.

### Primary

- **Accent** (`--color-accent`; default `#C6FF3D`): The only functional accent within a theme. Used on the primary "View Work" pill, hairline eyebrow rules above every section, link underlines, marquee `✺` / `◆` separators, the rotating headline word, the `::selection` background, and the `Explore →` affordance on work cards. If a UI element needs to read as "actionable" or "live," it gets the active theme accent. Nothing else does.

### Secondary

- **Foreground** (`--color-foreground`; default `#F5F5F7`): Headlines, primary body text, the contact-CTA pill background (the inverse-emphasis variant where the accent would be too loud, e.g. the small navbar Contact button on a transparent header).

### Tertiary (legacy ramp — scheduled to recede)

- **Electric** (`#3F3FFF`): Currently only as an ambient glow (Hero top-right blur, Footer center blur, card-hover blur halo). Never on type, never on borders, never on UI affordances.
- **Violet** (`#8B5CF6`) and **Fuchsia** (`#D946EF`): Currently only in the `.animated-gradient` wordmark and the Footer hero gradient text. **This is a known anti-pattern** (gradient `background-clip: text` is on the global ban list, and the electric+violet+fuchsia stack is the AI-dark cyberpunk lane PRODUCT.md flags as the saturated 2026 portfolio reflex). New screens must not introduce more of this ramp; existing usage is scheduled for replacement in a follow-up pass.

### Neutral

- **Body** (`#08080B`): Page background. Near-black with the slightest cool tint.
- **Ink** (`#0B0B10`): One step up — used for input fills and reserved for sections that need to read as "deeper" than body.
- **Surface** (`#121219`): Two steps up — work-card backgrounds. The only consistently-elevated surface in the system.
- **Line** (`#23232E`): The single border color. Used at 1px for card edges, navbar bottom edge (when scrolled), section dividers, and outline-pill buttons. Variants: `line/60` and `line/80` for transient/scrolled states.
- **Muted** (`#9A9AB0`): Secondary text — eyebrow labels, supporting copy, nav links at rest, project tag chips, footer socials. **Contrast against body is 5.3:1** — passes WCAG AA for body text but only just; do not push the bar copy any further toward the bg.
- **Selected Text** (`#A3A3FF`): Reserved for selected-state text on dark surfaces (currently unused in components but defined as a token).

### Named Rules

**The One Spotlight Rule.** Each theme gets one functional accent. In default it is Voltage Lime; in other themes it is whatever `--color-accent` defines. Every CTA, every section-marker hairline, every active state, every selection. ≤10% of any screen by area. If you find yourself reaching for a _second_ accent color to differentiate two things, the answer is type weight or spacing, not a new color.

**The Glow-Only Rule.** The Electric / Violet / Fuchsia ramp lives in `blur(140px)` ambient halos and nowhere else. Never on type. Never on borders. Never on a button. Never on a chip. The moment one of these colors becomes a literal UI element, it has betrayed the system.

## 3. Typography

**Display Font:** Clash Display (with Inter as fallback)
**Body Font:** General Sans (with Inter as fallback)
**Local Font:** GT Walsheim Pro (loaded via `@font-face` from CDN, currently underused; available as `font-Walsheim`).

**Character:** A geometric display sans (Clash Display) paired with a neutral, slightly humanist sans (General Sans). The pairing leans on weight and scale contrast rather than form contrast — both are sans, but Clash has wider apertures and a more confident verticality, General Sans is the quieter workhorse. Headlines push to `letter-spacing: -0.04em` for visual tightness at extreme scale; body holds at `normal`.

### Hierarchy

- **Display** (600, `clamp(3.5rem, 0.5rem + 13vw, 12rem)`, line-height 0.92): Hero headline only. Paired with the `.text-stroke` outlined treatment for the second line of the hero name, creating a "filled / hollow" pairing that's the site's typographic signature.
- **Headline** (600, `clamp(2.25rem, 1rem + 5vw, 4.5rem)`, line-height 1.15): Section headers — About statement, Selected Work, Let's build something bold. Some pair with `text-stroke` for the second word, echoing the hero.
- **Title** (600, `1.875rem`–`3rem`, line-height tight): Work-card titles, mobile-menu link labels.
- **Body** (400, `1.125rem`–`1.5rem`, line-height 1.55): Hero supporting copy, work-card descriptions. Color is `muted` `#9A9AB0` against `body` — keep this contrast at or above 5.3:1; do not lighten further.
- **Label** (500, `0.75rem`–`0.875rem`, `letter-spacing: 0.3em`, uppercase): The eyebrow rail above every section ("About", "Toolbox", "Got a project?"). Currently sits next to a 40px Voltage Lime hairline `h-px w-10 bg-acid`. **This eyebrow pattern is currently used on every section** (Hero, About, Skills, Footer) — see Don'ts §6 for the planned reduction.

### Named Rules

**The Filled-Hollow Pair Rule.** When a heading runs two lines and warrants emphasis, line 1 is solid white display, line 2 is `text-stroke` outlined (1.5px stroke at 55% white). Reserved for the hero, the work header, and the contact closer. Anywhere else and it stops feeling deliberate.

**The Signature Contrast Rule.** The hero handwritten signature uses `currentColor`, not hardcoded SVG stroke colors. It follows `--color-foreground` in all themes except `light`, where `.hero-signature` is pure black `#000` for intentional contrast on the warm light canvas.

**The Single-Family-Per-Role Rule.** Clash for display and headline. General Sans for body and label. Three families counting GT Walsheim is the cap; do not pair another display serif "for editorial feel" — that's the wrong register for this brand.

## 4. Elevation

The system is **flat by tonal layering**. There are no `box-shadow` declarations anywhere in the production styles. Depth is conveyed by stepping through three near-black tones (`body` → `ink` → `surface`) and a single hairline border (`line` at 1px). The only "elevation effect" in the codebase is the ambient blur halo: a large (`42rem`+) circular div at low opacity (`/10`–`/20`) with `blur(140px)` applied, which sits behind the hero, behind the footer, and animates in on work-card hover. This is atmosphere, not affordance — it reads as light leaking onto the stage, never as a shadow under a card.

The card-hover treatment is a `whileHover={{ y: -10 }}` spring lift with the blur halo intensifying behind the card — depth-by-motion plus depth-by-atmosphere, never depth-by-shadow.

### Named Rules

**The No-Shadow Rule.** `box-shadow` is forbidden anywhere on the page. If a surface needs to read as lifted, step it up one tone (`body` → `ink` → `surface`) or pair it with the ambient glow halo. Drop-shadows are a 2014 affordance and a tell on dark backgrounds.

**The Hairline-Border Rule.** Borders are exactly 1px, always `line` `#23232E` (or its `/60` / `/80` opacity variants). Never thicker, never tinted, never colored. The hairline is the only stroke in the system.

## 5. Components

### Buttons

Three variants, all fully-rounded pills. Hover uses a spring physics scale (`{ type: "spring", stiffness: 400, damping: 20 }`) on a `scale: 1.04` lift with `0.97` on tap.

- **Primary (`button-primary`).** Voltage Lime fill, body-dark text, rounded-full pill. Padding `14px 32px`. Used for the hero "View Work" CTA, the mobile-menu Contact CTA. The "this is the action that matters" affordance.
- **Outline (`button-outline`).** Transparent fill, white text, 1px `line` border, rounded-full pill. Padding `14px 32px`. Hover transitions border color to white. Used as the secondary CTA next to a Primary ("Get in Touch" next to "View Work").
- **White (`button-white`).** White fill, body-dark text, rounded-full pill. Padding `10px 24px`. Used only for the navbar Contact button on transparent header — the inverse-emphasis case where Voltage Lime would over-saturate the chrome.

### Section Eyebrow (signature component)

Every section opens with the same affordance: a 40px Voltage Lime `h-px` hairline + a 24-32px gap + a 12-14px label in `muted`, `font-sans`, uppercase, `letter-spacing: 0.3em`. Examples: `— Personal Site — Web Engineer`, `— About`, `— Toolbox`, `— Got a project?`. This is the strongest _and_ the most overused pattern in the system; it functions as the visual table-of-contents but currently appears on 4 of 5 sections, which puts it in the AI-grammar zone (see Don'ts §6).

### Cards (work-card)

- **Corner Style:** `rounded-3xl` (24px) — soft, confident, not aggressive.
- **Background:** `surface` `#121219`.
- **Border:** 1px `line` `#23232E`.
- **Shadow Strategy:** None. The hover state is a `y: -10` spring lift plus a `bg-electric/30` blur halo appearing in the top-right corner — depth-by-motion, atmosphere-by-glow, never a drop shadow.
- **Internal Padding:** `p-8` mobile, `p-10` desktop (32–40px).
- **Structure:** Index number top-left (`font-mono`, muted), category tag top-right (1px outline pill, uppercase tracking-widest). Title and description anchored to the bottom-third. `Explore →` affordance in Voltage Lime at the foot, with the arrow translating 6px right on hover.

### Inputs / Fields

Currently no form inputs ship in the production components (contact is mailto-driven and the future "Bribe Me With a Cat Treat" interaction is not yet built). When inputs are introduced, they should: fill `ink` `#0B0B10`, 1px `line` border, rounded-full pill geometry to match the buttons, focus state lifts the border to `voltage-lime`, placeholder copy must hit 4.5:1 against `ink` (so muted gray is too light — use a darker mid-tone). No drop-shadow on focus; the border-color shift carries it.

### Navigation

Fixed top bar, transparent on first scroll, `body/70` with `backdrop-blur-xl` and a `line/80` bottom border after scrolling past 24px. Links sit in `muted` at rest and animate to `white` on hover, with a Voltage Lime underline (`h-px`) sweeping in from left to right via a `w-0 → w-full transition-all duration-300`. Wordmark "Aaryan Porwal" currently uses `.animated-gradient` (fuchsia → violet → electric, animated `background-position` shine) — this is the most prominent surviving instance of the legacy ramp and is the highest-priority replacement in the next pass (see Don'ts §6).

Mobile menu is a full-width drop-down panel, `body/95` with `backdrop-blur-xl`, each link rendered at `text-3xl` `font-display` and revealed with staggered `x: -20 → 0` on open.

### Marquee (signature component)

The Skills section is two infinite-loop marquees in opposite directions, words at `text-5xl`–`text-7xl` `font-display`, separated by a Voltage Lime `✺` (row A) or `◆` (row B) glyph. Speed couples to scroll velocity via a `ScrollTrigger.onUpdate` that boosts the `timeScale` based on `self.getVelocity()` — the rows speed up while the user is scrolling and decay back. This is the load-bearing demonstration of "the engineering is the proof" — copy claims "GSAP / Web Development / DevOps" while the marquee itself is the proof of GSAP competence.

### Scroll-Reveal Statement (signature component)

The About statement uses `SplitText` to split the paragraph into words, sets each word to `#3A3A45` (near-invisible against `body`), then scrubs each word's color toward `white` as the user scrolls past — a 100% scroll-coupled text reveal. Reduced-motion path: skip the scrub, set the whole paragraph to `white` immediately.

## 6. Do's and Don'ts

### Do:

- **Do** use **Voltage Lime** `#C6FF3D` as the _only_ functional accent. CTAs, hairline eyebrows, link underlines, marquee separators, selection, active states. ≤10% of any screen by area.
- **Do** layer depth tonally: `body` `#08080B` → `ink` `#0B0B10` → `surface` `#121219`. Three steps, no shadows.
- **Do** use 1px `line` `#23232E` for every border. Hairline is the only stroke weight.
- **Do** pair filled white display type with the `.text-stroke` outlined treatment for the second line of two-line headings (hero, work header, contact closer) — the Filled-Hollow Pair is the site's typographic signature.
- **Do** ship a `prefers-reduced-motion: reduce` alternative for **every** animation. The Hero, About, Skills, Work, and Footer all already do this; new components must match.
- **Do** keep `muted` `#9A9AB0` body copy against `body` `#08080B` at ≥5.3:1 contrast. Don't drift the muted color any further toward the background "for elegance".
- **Do** use spring physics for button hover/tap (`stiffness: 400, damping: 20`, `scale: 1.04` / `0.97`). The tactile micro-bounce is part of the brand's playful axis.
- **Do** treat motion as the proof. Performance, easing, choreography, reduced-motion correctness — these are the load-bearing demonstrations that this is an engineer's site, not the bullet list of "Skills".

### Don't:

- **Don't** introduce more of the **Electric / Violet / Fuchsia** ramp. It's a legacy, scheduled to recede. Currently confined to ambient `blur(140px)` halos and the `.animated-gradient` wordmark. New screens must not put these colors on type, borders, buttons, or chips.
- **Don't** ship `background-clip: text` gradient headlines. The current `.animated-gradient` on the wordmark and the Footer closer is the highest-priority replacement; do not propagate the pattern further. Use a single solid color (white or Voltage Lime). Emphasis via weight or scale.
- **Don't** look or read like the **AI-dark neon-purple cyberpunk dashboard** — the saturated 2026 portfolio reflex. PRODUCT.md flags this as the current lane the site is closest to and the one it must leave by ship. If your move adds a glow, a gradient, or a fuchsia accent, you are reinforcing the slop lane.
- **Don't** put a tiny-uppercase-tracked **eyebrow above every section**. The site currently does this on 4 of 5 sections and is in the AI-grammar zone for it. Cap eyebrows at 1–2 per page maximum; reach for a different cadence (a section number, a bare heading, or nothing) on the rest.
- **Don't** use `box-shadow`. Anywhere. Depth is tonal or atmospheric (the blur halo), never shadowed.
- **Don't** use `border-left` greater than 1px as a colored stripe on any card, alert, or callout. Side-stripe borders are on the global ban list.
- **Don't** add a third or fourth color font. Clash + General Sans + (sparingly) GT Walsheim is the cap. Do not pair a serif "for editorial feel" — wrong register for this brand.
- **Don't** ship the **hero-metric template** (big number, small label, supporting stats, gradient accent). The About `5+ / 30+ / ∞ / 100%` strip is on the edge of this pattern; if it gets refreshed, drop the gradient impulse and keep the type doing the work.
- **Don't** ship **identical icon-and-text card grids**. The Work-section cards are intentionally large, varied internally (index, tag, title, description, affordance), and horizontally scroll-pinned — not a uniform 3×3 grid. Keep it that way.
- **Don't** ship **all-caps body copy**. Caps are reserved for the eyebrow label (0.3em tracking) and section-marker chips. Never for sentences.
- **Don't** drift into **Themeforest "Hello, I'm a developer" parallax**, **corporate "passionate about" LinkedIn voice**, or **cold pure-monospace brutalism**. PRODUCT.md names each by name; this spec carries the line.
