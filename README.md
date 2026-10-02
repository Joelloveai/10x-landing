# 10X landing page

Marketing site for **10X** by BTB SOLUTIONS, Malaysia. https://tenx.my

One job: make the right business owner want to speak to 10X. Primary action: **Join the waitlist**, the only filled button above the fold. Everything else is a text link.

The page is seven chapters: Hero → The leak → How it works → AI employee → Product & proof → Pricing & trust → Join the waitlist.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 (tokens in `app/globals.css`, rules in `DESIGN.md`)
- Framer Motion (loaded lazily via `LazyMotion`), Lucide icons
- No database, no auth, no CMS, no analytics vendor

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build && npm start
```

## Environment

Copy `.env.example` to `.env.local`. Nothing secret is exposed to the browser.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (defaults to `https://tenx.my`) |
| `WAITLIST_WEBHOOK_URL` | Where audit requests are POSTed as JSON |
| `WAITLIST_WEBHOOK_SECRET` | Optional, sent as `X-Webhook-Secret` |
| `TENX_API_URL` / `TENX_API_KEY` | Optional 10X ingestion endpoint (Bearer auth) |

**Production requires at least one destination.** Without one, `POST /api/waitlist` returns `503` and the form shows an error pointing to the Sales Team email. It never shows success for a lead that was not stored or forwarded. In development, requests without a destination are kept in memory.

### `POST /api/waitlist`

```json
{
  "whatsapp": "012-000 0000",
  "businessType": "property | clinics | education | home-services | appointments | other",
  "monthlyLeads": "under-50 | 50-200 | 200-500 | 500-plus | not-sure",
  "source": "audit_form | talk_to_sales | audit_form_qualification",
  "page": "/",
  "utmSource": "", "utmMedium": "", "utmCampaign": "", "referral": ""
}
```

Forwarded payload: `{ "type": "lead_leakage_audit" | "sales_request", "lead": { "whatsapp": "+60123456789", ... , "submittedAt": "..." } }`.

Protection: Malaysian mobile validation and normalisation to E.164, honeypot field, minimum fill time, per-IP rate limit (in memory, per instance, so add a platform rate limit for multi-instance deployments), duplicate suppression, masked phone numbers in logs, generic error messages.

## Content

Edit data, not JSX:

- `lib/site-config.ts`: company details, public contact, CTAs, nav, chapters, founding offer switch
- `lib/businesses.ts`: the five business types (workflow, AI examples, demo data)
- `lib/pricing.ts`, `lib/testimonials.ts` (verbatim, never edit), `lib/faq.ts`

## Analytics

`lib/analytics.ts` exposes `track(event, props)`. No provider is bundled. Events go to `window.dataLayer` if present (for example GTM), or to any provider registered with `registerAnalyticsProvider`. Keys and values that look like phone numbers, emails, names or messages are stripped.

## Product truth

Demo UI uses fictional data and is labelled "Illustrative". The homepage does not publish internal roadmap status; anything that depends on a customer's setup is routed to the waitlist form. Never present an unreleased capability as live.

## Legal pages

`/privacy`, `/terms` and `/data-deletion` are clearly marked drafts pending legal review. Replace them before relying on them.
