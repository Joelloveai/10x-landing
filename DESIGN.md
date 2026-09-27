# 10X Design System

Keeps every future edit (human or AI) visually and verbally consistent.
If a change conflicts with this file, update this file first.

## 1. Principles

1. **Quietly powerful.** Big typography, restrained color, product UI as the hero. No decoration without meaning.
2. **One focal point at a time.** At any scroll position there is one primary element, one secondary, everything else quiet.
3. **Seven chapters, no more.** Hero → The leak → How it works → AI employee → Product & proof → Pricing & trust → Book a conversation. Do not add sections; merge into a chapter or cut.
4. **Honest confidence.** No fake numbers, logos, ratings, customers or photos. Demo UI says "Illustrative". Real testimonials only, verbatim, with initials avatars.
5. **Public story, not internal roadmap.** Never show "coming soon", "rollout in progress", "integration-dependent" or engineering blockers. Where a capability depends on the customer's setup, say so plainly and route to Talk to Sales. Never claim something is live when it is not.
6. **Public contact only.** Company: `BTB SOLUTIONS` (exactly). Contact: `Sales Team`, `admin@tenx.my`. Never show a personal or founder phone number.

## 2. Color tokens (`app/globals.css` → `@theme`)

| Token | Value | Use |
| --- | --- | --- |
| bg | `#0A0A0A` | Page background |
| surface | `#111111` | Cards, panels |
| elevated | `#151515` | Raised UI, inputs |
| border | `#242424` | Hairlines |
| fg | `#FFFFFF` | Headlines, primary text |
| secondary | `#A1A1AA` | Body copy |
| muted | `#71717A` | Non-text UI only (fails AA for small text) |
| subtle | `#8B8B94` | Small UI text in product simulations |
| accent | `#2563EB` | **Primary interaction color**: CTAs, active nav, selected tabs, workflow focus, links, focus rings, glow |
| accent-text | `#60A5FA` | Blue text on dark |
| accent-fg | `#FFFFFF` | Text on accent fills (5.2:1) |
| success | `#16A34A` | **Only** confirmed / completed states (booked, done, won) |
| success-fg | `#0A0A0A` | Text on success fills (white fails contrast) |
| warning | `#EA580C` | Leaks, missed items, escalations |

No decorative gradients. Exceptions: the barely visible white radial spotlight behind the hero (max opacity 0.08), the 600px blue cursor glow (0.06, desktop only), card glare (white 0.04) and the section entry glow (0 0 80px, 0.06).

## 3. Typography

Inter (variable) for everything; JetBrains Mono for timestamps, stage numbers and small data.

- `.text-hero`: 44px mobile → 88px desktop
- `.text-display` (chapter headings): 30px → 56px
- `.text-title`: 22px → 28px
- Body 16–20px. Never tiny body copy.

## 4. Guided focus system

- `FocusSystem` tracks the chapter in view and sets `<html data-focus="chapter-id">`.
- The chapter's numbered marker (`ChapterHeader`) lights blue with a soft halo only while active. Active nav link gets a blue underline glow. Desktop ≥1360px shows a small side rail; mobile uses only the 2px top progress line.
- Workflow stages: active = 100% opacity + blue ring + `.halo`; previous = 75%; future = 65%. Keep dimmed text white so it still passes contrast.
- Selected tabs (business type, AI, product features) use `.halo` + `bg-accent/10`. Growth pricing uses `.halo`. The contact card uses `.halo`.
- `.halo` = 1px blue ring + ~0.10 glow. `.halo-soft` = ~0.06 glow for active product panels. Never glow more than one thing per view.

## 5. Motion

| Level | Allowed |
| --- | --- |
| 1 Core | Hero word reveal (CSS, 0.06s stagger), section fade-up (SectionWrapper: once, -100px, 0.08s stagger), product state changes |
| 2 Premium | Hero demo (3D window, 12s CSS loop, ±2deg mouse-follow), focus glow, the single sticky workflow story, testimonial marquee (45s, pauses on hover, 3s hover progress bar), count-ups (40%, 78%, prices), calculator result spring |
| 3 Optional | Magnetic CTAs (within 80px, max 6px): hero, pricing, final CTA. Card tilt (±3deg pricing, ±4deg AI team, glare, 4px lift). Cursor glow. Cmd/Ctrl+K palette. No text scramble. |

Calm only: no flashes, zooms, shakes or moving backgrounds. The one pulse is the Growth badge (opacity 0.8 to 1, 3s). Animate transform and opacity only.

`prefers-reduced-motion` disables spotlight, parallax, tilt, magnetic pull, cursor glow, count-ups and pulses, and shows the hero demo in its finished state. The workflow becomes tap-driven and everything stays readable. The testimonial marquee stays on by request. Touch devices get no cursor-follow, magnetic pull or tilt.

## 6. Layout

- Container 1200px, 20px gutter mobile, 32px desktop. Mobile first; verified 320–1920px, no horizontal scroll.
- Chapters: `py-24 md:py-32`, separated by a single hairline.
- Radii: cards `rounded-2xl`, product windows `rounded-[20px]`, buttons `rounded-full`.

## 7. Components and data

- Server Components by default; client only for interaction.
- Content in `lib/`: `site-config.ts` (contact, CTAs, chapters), `businesses.ts` (five business types), `pricing.ts`, `testimonials.ts` (verbatim, never edit), `faq.ts`.
- Logo mark: `lib/brand.ts`, rendered via `Logo` / `LogoMark`. White on dark; never recolor or redraw.
- CTA routing: every CTA goes to `#audit`. `CtaLink intent="sales"` opens the form in Talk to Sales mode; `intent="audit"` in Free audit mode.

## 8. Words

Never use: CRM, GrokBot, AI-powered, all-in-one, unlimited, seamless, leverage, robust, revolutionary, game-changing, next-generation, cutting-edge, supercharge, synergy, disruptive, magic.
Never claim: guaranteed results, 100% secure, PDPA compliance, certifications, customer counts, partnerships.
Prefer: "See how it fits your business." "Talk to our sales team." "One clear workflow from enquiry to follow-up."
Avoid em-dashes in copy.
