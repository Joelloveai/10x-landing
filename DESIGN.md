# 10X Design System

This file keeps every future edit (human or AI) visually and verbally consistent.
If a change conflicts with this file, update this file first.

## 1. Principles

1. **The product is the hero.** Product UI is the main visual. No stock photos, no fake people, no abstract 3D blobs.
2. **Honesty over hype.** Never present an unreleased capability as live. Demo UI is labelled as demo. No invented numbers, logos, ratings or activity.
3. **One idea per section.** Short sentences. Every sentence answers: what problem, how 10X solves it, can I trust them, what does it cost, what next.
4. **Restraint.** Deep black surfaces, one controlled green accent, generous space. Motion explains, it does not decorate.
5. **Every CTA leads to the audit** (`#audit`). "See How It Works" leads to `#how-it-works`.

## 2. Color tokens

Defined in `app/globals.css` under `@theme` and used as Tailwind utilities.

| Token | Value | Tailwind | Use |
| --- | --- | --- | --- |
| bg | `#0A0A0A` | `bg-bg` | Page background |
| surface | `#111111` | `bg-surface` | Cards, panels |
| elevated | `#161616` | `bg-elevated` | Raised UI, popovers, inputs |
| border | `#242424` | `border-border` | Hairlines, dividers |
| fg | `#FFFFFF` | `text-fg` | Headlines, primary text |
| secondary | `#A1A1AA` | `text-secondary` | Body copy (7.8:1 on bg) |
| muted | `#71717A` | `bg-muted`, `border-muted` | Decorative dots, dividers, non-text UI. Below AA for small text, so not used for text |
| subtle | `#8B8B94` | `text-subtle` | Small UI text inside product simulations, timestamps, placeholders (AA on all surfaces) |
| accent | `#16A34A` | `bg-accent` | Buttons, active states, progress, focus rings |
| accent-fg | `#0A0A0A` | `text-accent-fg` | Text on accent fills. White on `#16A34A` is only 3.3:1 |
| accent-text | `#4ADE80` | `text-accent-text` | Green text on dark (links, active labels) |
| success | `#16A34A` | `text-success` | Completed workflow states |
| warning | `#EA580C` | `text-warning` | Leaks, missed items, "before" states |

Rules:
- Green is for action and progress only. Never make a whole section green.
- Accent and success share `#16A34A`. Status badges keep "Available now" (solid dot) distinct from "Rollout in progress" (hollow dot, neutral text).
- Logo: the mark lives in `lib/brand.ts` (traced from the official artwork). Render it through `Logo` / `LogoMark` in `components/ui/Logo.tsx`, white on dark. Never recolor or redraw it.
- No decorative gradients. The only allowed gradient is the hero spotlight: a white radial light at max opacity `0.08`.
- Success/warning appear inside product UI and status labels, not as section backgrounds.

## 3. Typography

- **Inter** (variable, `next/font/google`) for everything.
- **JetBrains Mono** only for timestamps, workflow states, technical labels and small data values (`font-mono`).
- Fluid sizes via `clamp()` (utilities in `globals.css`):
  - `.text-hero`: 44px (320px viewport) to 100px (1280px+). Tracking `-0.045em`, leading `0.95`.
  - `.text-display`: 28px to 64px section headings. Tracking `-0.035em`.
  - `.text-lead`: 17px to 20px intro copy.
  - Body minimum 16px. UI micro-labels (12-13px) only inside product simulations and eyebrows.
- Eyebrows: 12px mono, uppercase, `tracking-[0.16em]`, `text-secondary`.

## 4. Spacing and layout

- Container: `max-w-[1200px]`, side gutter 20px mobile, 32px desktop (`.container-x`).
- Section rhythm varies on purpose: `py-24` for dense sections, `py-32 md:py-44` for statement sections. Never make every section the same height.
- Grid: 4 columns mobile, 12 columns desktop mental model. Most content uses 1 or 2 columns.

## 5. Radii

- Buttons, inputs, pills: `rounded-full` (buttons) / `rounded-xl` (inputs)
- Cards and panels: `rounded-2xl` (16px)
- Product windows: `rounded-[20px]`
- Small UI chips inside product: `rounded-md`

## 6. Shadows and depth

- Depth comes from layering, perspective and shadow, not glow.
- `.shadow-window`: large soft black shadow + 1px inner white hairline at 6% opacity.
- Product windows use CSS perspective `1200px`, base tilt `rotateX(2deg) rotateY(-3deg)`, desktop only.
- Card tilt: perspective `1000px`, max `±3deg`, desktop fine pointers only.

## 7. Motion

Three levels. Default to fewer animations.

| Level | Allowed |
| --- | --- |
| 1 Required | Hero word reveal (CSS), button feedback, section fade-up, product workflow states |
| 2 Premium | Product perspective/parallax, selected card tilt, vertical selector transition, the single sticky scroll story, testimonial marquee |
| 3 Optional | Command palette (Cmd/Ctrl+K), magnetic hero CTA (max 4px). No text scramble. |

- Section reveal: opacity 0 to 1, translateY 20px to 0, 0.6s, `cubic-bezier(0.22, 1, 0.36, 1)`, once, `-100px` root margin.
- Hero words: 0.06s stagger, 18px rise, total under 1s.
- Only **one** scroll-linked experience: `StickyProductStory`.
- `prefers-reduced-motion: reduce` disables spotlight, magnetic, marquee, parallax, tilt and scroll-linking. Content stays fully available.
- Touch / coarse pointers: no cursor effects, no tilt, no parallax.

## 8. Breakpoints

Mobile first. Tailwind defaults: `sm 640`, `md 768`, `lg 1024`, `xl 1280`.
Verified widths: 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920. No horizontal scroll at any width.

## 9. Component principles

- Server Components by default. Client Components only for interaction (demo, calculator, selector, scroll story, form, FAQ, nav, palette).
- Content lives in `lib/*.ts` (verticals, pricing, testimonials, FAQ, site config). Components render data, they do not hardcode copy that may change.
- Testimonial quotes are stored and rendered verbatim. Never edit, trim or "fix" them.
- Product simulations use obviously fictional demo data (Sarah Tan, Jason, KL, Saturday 2:00 PM) and carry a visible "illustrative" caption.
- Status labels for capabilities: `Available now`, `Rollout in progress`, `Integration-dependent`, `Coming soon`, `Concept`.

## 10. Words

Never use: CRM, AI-powered, all-in-one, unlimited, seamless, leverage, robust, revolutionary, game-changing, next-generation, cutting-edge, effortless, synergy, disrupt, redefine, supercharge, magic.
Never claim: guaranteed results, 100% secure, PDPA compliance, customer counts, partnerships, certifications, live AI or live WhatsApp sending (until they are live).
Avoid em-dashes in copy. Use commas or full stops.
