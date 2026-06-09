# Product

## Register

brand

## Users

Mixed audience landing on a single personal site:

- **Hiring managers and recruiters** evaluating Aaryan for engineering roles. Skimming for signal in 30–90 seconds; want proof of capability, not adjectives.
- **Prospective clients** sizing him up for freelance or consulting work. Looking for taste and trust before they reach out.
- **Peer engineers and design-dev community** (the AWWWARDS-adjacent crowd). They notice craft, motion quality, and interaction detail. They reward boldness.

The site has to land for all three from the same surface, in the same voice. No mode switching, no audience toggles.

## Product Purpose

A personal site for Aaryan Porwal — Web Engineer — that converts a visit into a real conversation. The headline action is a gamified contact moment ("Bribe Me With a Cat Treat"): Anya, his cat, is the gatekeeper to the inbox. Shake the treat bag, get the channel. Reaching out should feel like a small game worth playing, not a generic "contact form" obligation.

Beyond the contact moment, the site demonstrates engineering quality through how it behaves: smooth scroll, motion choreography, performance, interaction detail. The work showcase and skills sections support that, but the personality and the contact device are the lead.

Success: a visitor leaves with a clear sense of who Aaryan is and either (a) sends a DM / email through the bribe flow, or (b) remembers the site enough to come back.

## Brand Personality

Three words: **Playful. Warm. Technical.**

- **Playful** is the lead. Named characters (Anya), gamified interactions, copy that has a sense of humor. The site can crack a joke.
- **Warm** keeps it human. This is one person's site, not a studio. First person, specific references, not corporate distance.
- **Technical** is the floor. Every playful or warm move must be backed by execution detail: motion that respects reduced-motion, type that holds up at every breakpoint, perceived performance that says "I know how to ship." The craft is the proof.

Voice: first person, witty without trying too hard, concrete. "Anya runs my schedule" is on-voice. "Empowering digital transformation" is not.

## Anti-references

This should NOT look or read like:

- **Generic SaaS landing** — hero metric template, identical icon-and-text card grids, tiny uppercase tracked eyebrows over every section, gradient text headlines, "supercharge / streamline / leverage" copy.
- **Default "AI-dark" neon-purple cyberpunk dashboard** — the saturated 2026 portfolio reflex (pure black body + electric blue + fuchsia + acid green glow). The current palette in `tailwind.config.js` is currently in this lane; this is a design-system pressure point for follow-up work, not an instruction to dump the colors, but the site should not read as "another AI-dark neon portfolio" by the time it ships.
- **Corporate / LinkedIn-style portfolio** — stock professional photography, "passionate about" copy, formal third person, muted blues-and-grays-for-trust.
- **Themeforest / generic dev portfolio template** — recognizable purchased-template grids, "Hello, I'm a developer" hero, parallax-for-parallax's-sake.
- **Cold brutalist / pure-monospace dev aesthetic** — full mono body type, raw HTML look as the whole personality, deliberately ugly as a statement. Engineer-credible is not the same as deliberately unstyled.

## Design Principles

1. **Anya runs my schedule.** Named characters and specific moments carry the brand, not abstractions. When in doubt, reach for the concrete person/animal/project/tool over the generic noun. "My cat holds the keys to my inbox" beats "Get in touch below."

2. **Earn the playfulness with craft.** A playful concept (gamified contact, witty copy, named cat) only works when the execution detail is impeccable. Motion timing, micro-interaction polish, type hierarchy, perceived performance — these are what separate "charming" from "trying too hard." If a playful move isn't executed well, cut it.

3. **Show the engineering, don't claim it.** The site is the portfolio piece. Performance, motion choreography, interaction quality, responsive behavior, accessibility — these prove the technical claim more than any "Skills" list. Treat the build itself as the lead case study.

4. **One voice for three audiences.** Recruiters, clients, and peers all see the same site. Don't water down the personality to be "safe for HR" and don't crank up the AWWWARDS-experimental dial so far that a hiring manager bounces. The bar is: bold enough that peers notice, clear enough that recruiters can read it in 60 seconds.

5. **Specific over abstract, everywhere.** Real project names. Real tools (the ones in `package.json`). Real outcomes. Real contact channels (LinkedIn, email — not "let's connect"). The site rewards specificity at every level: copy, work descriptions, even the contact CTA.

## Accessibility & Inclusion

- **WCAG 2.1 AA** as the floor across the site. Body text ≥4.5:1, large text ≥3:1, including placeholder and muted secondary copy.
- **Reduced motion** must be honored everywhere. The Hero already does this with `prefers-reduced-motion: reduce`; that pattern is the standard for any new motion, including the cat-treat shake interaction (intense shake → instant or simple cross-fade for reduced-motion users).
- **Keyboard reachable**: the bribe-the-cat contact device must be operable by keyboard (Enter / Space triggers the shake), not click-only. Focus states visible.
- **Audio is never required**: if the `playShakeSound()` placeholder ships, it must be silent by default or clearly toggleable, and the success state must work without sound.
- **No color-only signaling**: success states, CTA hierarchy, and link affordances rely on shape/weight/icon in addition to color.
