# 10X Landing - Project Context

Read this first. Every session. It is the source of truth about this project. Update it when something changes.

Last updated: 2 Oct 2026.

## Who

- Joel: owner. Writes code, runs deploys.
- Claude Code: the assistant. Edits code, runs local checks, commits, pushes to origin. Does not SSH. Does not run the deploy command.

## What this is

The marketing site for 10X. Lives at tenx.my.

Two other systems exist and are not this repo:
- The app at app.tenx.my (repo kaibin330/10x-crm)
- The internal landing inside the app (same repo as above)

This repo does one job: make the right business owner want to try 10X.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4
- Framer Motion (lazy-loaded via LazyMotion)
- Lucide icons
- No database, no auth, no CMS, no analytics vendor

Deploy: Cloudflare Workers via OpenNext.
- Build command on Cloudflare: `npm run build` (runs `next build`)
- Deploy command on Cloudflare: `npx wrangler deploy`, which detects OpenNext and runs `opennextjs-cloudflare deploy`
- The build depends on `@opennextjs/cloudflare` being installed and `open-next.config.ts` + `wrangler.jsonc` existing at the repo root.

Local clone: ~/Documents/10x-landing
Remote: https://github.com/Joelloveai/10x-landing
Branch: `claude/amazing-goodall-yqsun9` (the production branch)
The Cloudflare project is 10x-landing, watching that branch.

## Deploy process

Cloudflare auto-deploys on git push to origin on the production branch. There is no `npm run deploy` script.

1. Claude Code commits and pushes to origin/claude/amazing-goodall-yqsun9.
2. Cloudflare picks it up within 30 seconds and starts a build.
3. Watch it in the Cloudflare dashboard: Workers & Pages, 10x-landing, Deployments.
4. If it fails, read the build log. Most failures are missing dependencies.

If auto-deploy is off, click Deployments, then Retry on the latest commit.

## Brand rules

Read CLAUDE.md, DESIGN.md, AGENTS.md before any change.

- Company: BTB SOLUTIONS (exact)
- Contact: admin@tenx.my only. Never a phone number.
- No personal or founder phone numbers anywhere.
- Dark theme, background #0A0A0A, accent #2563EB (single accent).
- Font: Inter.
- No emojis, no em dashes, no exclamation marks.

Banned words: CRM, AI-powered, all-in-one, unlimited, seamless, leverage, robust, revolutionary, game-changing, next-generation, cutting-edge, supercharge, synergy, disruptive, magic.

- Never present unreleased capabilities as live.
- Never publish internal roadmap labels (coming soon, rollout, etc.).
- Never fake testimonials or logos.

## Chapters

Rendered, in order: Hero, Meet your team (`#team`), The leak (`#solutions`), How it works (`#how-it-works`, the 11pm story), Pricing & trust (`#pricing`), Waitlist (`#audit`). Product & proof exists in the repo but is not rendered.

## The AI team

Four named agents: Aisyah (Sales), Daniel (Marketing), Priya (Ops), Aiman (Admin). Data lives in `lib/agents.ts`. Faces are initials in a circle.

Capabilities are only what works today. The AI answers and drafts. Sending is OFF. Auto-booking does not exist. Never write that the AI replies, books or updates records on its own. If a bullet stops being true, remove it.

## Positioning

The site serves five business types, not property only:

1. Property
2. Clinics
3. Education
4. Home services
5. Appointments

The hero sells the outcome, not the vertical. The business selector below the hero handles the vertical. Every headline must work for all five.

- Wrong: "Built for Malaysian property teams."
- Right: "Hire your AI sales team. Today."

## CTA strategy

One primary CTA: "Join the waitlist". It goes to the waitlist form at the bottom of the page (`#audit`).

The primary button is the only filled button above the fold. Everything else is a text link: "Open app", "Sign in", "See how it works".

The pricing cards have "Get started" buttons that open a Stripe Checkout session (via `app/api/checkout/route.ts`). These are below the fold and do not compete with the hero CTA.

Deleted forever: "Get Free Audit", "Talk to Sales", "Book a Demo", "Schedule a Call", "Contact Sales". Do not add them back.

The waitlist form posts `type: "waitlist"` with source `waitlist_form` or `waitlist_form_qualification`.

## Upstream

This is not an open-source project. Do not mention the upstream base (trycompai / trycomp.ai / Comp AI) in any user-visible string, link, or docstring.

The LICENSE file stays (MIT requires keeping the copyright notice). It lives in the repo root, not user-visible. Do not delete it.

If a grep finds "trycomp", "compai", "open source", "fork", "GitHub", or a GitHub link in user-visible code, remove it. The only exceptions are test files and the LICENSE file itself.

## What is pending

- Real testimonials: none yet. The section is hidden until real customers give verbatim quotes with name, role, city.
- Social links: Instagram, LinkedIn, TikTok, X all currently point at tenx.my. When the accounts exist, update the socials file (check components/marketing/).
- Stripe Payment Links: the checkout integration exists but the actual prices may not be configured yet. Check Cloudflare env vars.
- Git history: an old founder phone number still exists in earlier commits (4b79e4a through 8f4e2b4, plus 3c05d1c, b57fe83, 021b50c). It is gone from the current tree. Joel decides whether to rewrite history.

Done: anchor fix (commit 6df0bff). The "AI Team" nav link was removed because that section is not rendered. The chapter rail now lists only rendered sections.

## Cloudflare environment variables

Production secrets in Cloudflare project 10x-landing:

- CRM_API_KEY
- CRM_API_URL
- STRIPE_PRICE_GROWTH
- STRIPE_PRICE_LAUNCH
- STRIPE_PRICE_SCALE
- STRIPE_SECRET_KEY
- STRIPE_SETUP_GROWTH
- STRIPE_SETUP_LAUNCH
- STRIPE_SETUP_SCALE
- STRIPE_WEBHOOK_SECRET

Runtime compatibility flag: `nodejs_compat`.

Never commit these to the repo.

## Rules for Claude Code

Never:
- Commit .env, secrets, tokens, or real client data
- Add a new npm dependency without asking. If code imports a package that is not in package.json, that is a bug: install it and commit package.json + package-lock.json in the same commit.
- Use emojis, em dashes, or exclamation marks
- Use any banned word from DESIGN.md
- Add a section beyond the chapter list below. The page has a fixed number of chapters.
- Edit testimonial quotes
- Add a phone number anywhere
- Push --force

Always:
- Run `npm run typecheck && npm run build` before every commit
- Red build = stop and report
- Commit format: `polish(landing):` / `fix(landing):` / `feat(landing):`
- If a change touches the Stripe integration or the waitlist API: print "RISKY CHANGE PROPOSED", two sentences, wait
- Report in short sentences, active voice

## Recent history: why things are the way they are

The site was rebuilt in early October 2026 to remove upstream branding and reposition for five verticals.

1. Dark theme kept. Premium is restraint, not color. Linear, Vercel, Attio all use dark.
2. One primary CTA. Was five buttons above the fold. Now one.
3. No phone number. A real number was published in the footer and removed. Email only.
4. Five verticals, not one. The hero sells the outcome. The business selector handles the vertical.
5. Stripe Checkout added (not Payment Link). The pricing buttons create a Checkout session via `app/api/checkout/route.ts`.
6. The OpenNext adapter is required because Cloudflare Workers cannot run Next.js natively.
7. The `stripe` package was missing from package.json. It was installed locally but never committed, and the Cloudflare build failed until it was added.

## How to use this file

Start every session with: "Read PROJECT-CONTEXT.md, CLAUDE.md, DESIGN.md, AGENTS.md first. Then <task>."

Update this file when a page or section changes, the CTA changes, testimonials are added, social accounts are created, Stripe config changes, or the Cloudflare env vars change.
