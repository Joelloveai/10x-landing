"use client";

import { useState } from "react";
import { m, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { track } from "@/lib/analytics";
import { useReducedMotionPref } from "@/lib/hooks/useMediaQuery";
import { pricingCopy, pricingPlans } from "@/lib/pricing";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { CountUp } from "@/components/ui/CountUp";
import { ctaClasses } from "@/components/ui/CtaLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { PricingViewTracker } from "./PricingViewTracker";

const EASE = [0.16, 1, 0.3, 1] as const;
const launch = pricingPlans.find((p) => p.slug === "launch") ?? pricingPlans[0];

type Price = { monthly: number; setup: number };

/** Fixed prices per currency, set by hand (not converted). RM comes from lib/pricing. */
const currencies = [
  { code: "RM", symbol: "RM", prices: null },
  {
    code: "USD",
    symbol: "$",
    prices: { launch: { monthly: 99, setup: 75 }, growth: { monthly: 179, setup: 149 }, scale: { monthly: 339, setup: 249 } },
  },
  {
    code: "SGD",
    symbol: "S$",
    prices: { launch: { monthly: 129, setup: 99 }, growth: { monthly: 239, setup: 199 }, scale: { monthly: 449, setup: 329 } },
  },
  {
    code: "EUR",
    symbol: "€",
    prices: { launch: { monthly: 89, setup: 69 }, growth: { monthly: 169, setup: 139 }, scale: { monthly: 319, setup: 239 } },
  },
  {
    code: "AUD",
    symbol: "A$",
    prices: { launch: { monthly: 149, setup: 109 }, growth: { monthly: 279, setup: 229 }, scale: { monthly: 499, setup: 369 } },
  },
] as const satisfies readonly { code: string; symbol: string; prices: Record<string, Price> | null }[];

type CurrencyCode = (typeof currencies)[number]["code"];

/** Prepaid terms. The discount applies to the monthly price; setup is unchanged. */
const terms = [
  { id: "monthly", label: "Monthly", months: 1, discount: 0 },
  { id: "1y", label: "1 Year", months: 12, discount: 0.1 },
  { id: "3y", label: "3 Years", months: 36, discount: 0.2 },
  { id: "5y", label: "5 Years", months: 60, discount: 0.3 },
] as const;

type TermId = (typeof terms)[number]["id"];

/** Junior hire range for the compare line. RM keeps the Malaysian figure; other currencies swap the symbol. */
const juniorHire = (symbol: string) => (symbol === "RM" ? "RM2,500-3,500/month" : `${symbol}500-900/month`);

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const card: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Posts the tier to /api/checkout and sends the visitor to Stripe in the same tab. */
function CheckoutButton({ tier, name, primary, reduced }: { tier: string; name: string; primary: boolean; reduced: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  const start = async () => {
    if (state === "loading") return;
    setState("loading");
    track("pricing_cta_clicked", { plan: tier, location: "pricing" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = (await res.json()) as { url?: string };
      if (!res.ok || !data.url) throw new Error("checkout_failed");
      window.location.assign(data.url);
    } catch {
      setState("error");
    }
  };

  return (
    <>
      <m.button
        type="button"
        // Pulses once (scale 1 to 1.04 to 1) the first time it comes into view.
        whileInView={reduced ? undefined : { scale: [1, 1.04, 1] }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeInOut" }}
        onClick={start}
        aria-busy={state === "loading"}
        aria-label={`${siteConfig.cta.checkout} (${name} plan)`}
        className={cn(ctaClasses(primary ? "primary" : "secondary", "md", "w-full"), state === "loading" && "opacity-70")}
      >
        {state === "loading" ? "Opening checkout" : siteConfig.cta.checkout}
      </m.button>
      <p role="status" className="mt-2 min-h-5 text-center text-[13px] text-secondary">
        {state === "error" ? (
          <>
            Checkout did not open. Try again or email{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-fg underline decoration-white/30 underline-offset-4">
              {siteConfig.contact.email}
            </a>
            .
          </>
        ) : null}
      </p>
    </>
  );
}

/** Chapter 06 header and plans. Growth is the one featured card. */
export function Pricing() {
  const reduced = useReducedMotionPref();
  const [currency, setCurrency] = useState<CurrencyCode>("RM");
  const [termId, setTermId] = useState<TermId>("monthly");
  const term = terms.find((t) => t.id === termId) ?? terms[0];
  // Prices count up once on first view; after a currency or term switch they change instantly.
  const [switched, setSwitched] = useState(false);
  const cur = currencies.find((c) => c.code === currency) ?? currencies[0];
  const format = (n: number) => `${cur.symbol}${Math.round(n).toLocaleString("en-US")}`;
  const price = (plan: (typeof pricingPlans)[number]): Price => {
    const table: Record<string, Price> | null = cur.prices;
    return table?.[plan.slug] ?? { monthly: plan.monthly, setup: plan.setup };
  };

  return (
    <>
      <div>
        <ChapterHeader
          num="05"
          label="Pricing & trust"
          id="pricing-title"
          title={pricingCopy.title}
          lead={`${format(price(launch).monthly)} per month. ${format(price(launch).monthly / 30)} per day. If 10X helps you close one extra deal this year, it pays for itself.`}
        />
      </div>

      {/* Currency pills, centred over the cards, so above Growth on desktop. */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <div role="group" aria-label="Currency" className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {currencies.map(({ code }) => (
            <button
              key={code}
              type="button"
              aria-pressed={currency === code}
              onClick={() => {
                setCurrency(code);
                setSwitched(true);
              }}
              className={cn(
                "min-w-12 rounded-full border px-2.5 py-1.5 font-mono text-[13px] transition-colors sm:min-w-[52px] sm:px-3",
                currency === code
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-border text-secondary hover:border-white/25 hover:text-fg",
              )}
            >
              {code}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Billing term" className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {terms.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={termId === t.id}
              onClick={() => {
                setTermId(t.id);
                setSwitched(true);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors",
                termId === t.id
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-border text-secondary hover:border-white/25 hover:text-fg",
              )}
            >
              {t.label}
              {t.discount ? (
                <span className={cn("font-mono text-[11px]", termId === t.id ? "text-accent-fg/80" : "text-accent-text")}>
                  -{Math.round(t.discount * 100)}%
                </span>
              ) : null}
            </button>
          ))}
        </div>
        <p className="text-[13px] text-secondary">Flat monthly subscription. No surprises.</p>
      </div>

      <div className="relative mt-8">
        <PricingViewTracker />
        <m.ul
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch"
        >
        {pricingPlans.map((plan) => {
          const p = price(plan);
          // Discounted monthly equivalent, rounded; the upfront total is built from it so the two always agree.
          const perMonth = Math.round(p.monthly * (1 - term.discount));
          const upfront = perMonth * term.months;
          return (
            <m.li
              key={plan.slug}
              variants={card}
              whileHover={reduced ? undefined : { scale: plan.highlighted ? 1.03 : 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={cn("min-w-0", plan.highlighted && "lg:-my-3")}
            >
              {/* Growth floats gently; the others stay still. */}
              <m.div
                className="h-full"
                animate={plan.highlighted && !reduced ? { y: [0, -5, 0] } : undefined}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                style={plan.highlighted && !reduced ? { willChange: "transform" } : undefined}
              >
              <Tilt max={3}>
                <article
                  aria-labelledby={`plan-${plan.slug}`}
                  className={cn(
                    "group relative flex h-full flex-col rounded-2xl border p-6 sm:p-8",
                    plan.highlighted
                      ? "border-accent/70 bg-elevated shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_0_64px_-8px_rgba(37,99,235,0.28)] lg:py-11"
                      : "border-border bg-surface",
                  )}
                >
                  {/* Hover border: an accent ring fades in (opacity only). */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 ring-1 ring-accent transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 id={`plan-${plan.slug}`} className="text-[20px] font-semibold tracking-[-0.02em]">
                      {plan.name}
                    </h3>
                    {plan.highlighted ? (
                      <span className="badge-pulse rounded-full bg-accent px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-fg">
                        Most popular
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-[15px] text-secondary">{plan.description}</p>

                  <div className="mt-8">
                    <p className="flex flex-wrap items-baseline gap-x-1.5">
                      {switched ? (
                        <span className="text-[44px] font-semibold leading-none tracking-[-0.04em] tabular-nums">{format(perMonth)}</span>
                      ) : (
                        <CountUp to={p.monthly} format={format} className="text-[44px] font-semibold leading-none tracking-[-0.04em] tabular-nums" />
                      )}
                      <span className="text-[15px] text-secondary">/mo</span>
                      {term.discount ? (
                        <span className="ml-1 text-[14px] text-subtle line-through">{format(p.monthly)}</span>
                      ) : null}
                    </p>
                    <p className="mt-2 text-[14px] text-secondary">+ {format(p.setup)} setup</p>
                    {term.discount ? (
                      <p className="mt-1 text-[14px] text-secondary">
                        Paid upfront: <span className="text-fg">{format(upfront)}</span> for {term.label.toLowerCase()}
                      </p>
                    ) : (
                      <p className="mt-1 text-[14px] text-secondary">
                        Year 1: <span className="text-fg">{format(p.monthly * 12 + p.setup)}</span>
                      </p>
                    )}
                  </div>

                  <ul className="mt-8 space-y-3 border-t border-border pt-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-3 text-[15px] text-secondary">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <Magnetic>
                      <CheckoutButton tier={plan.slug} name={plan.name} primary={!!plan.highlighted} reduced={reduced} />
                    </Magnetic>
                  </div>
                </article>
              </Tilt>
              </m.div>
            </m.li>
          );
        })}
        </m.ul>
      </div>

      <Reveal className="mx-auto mt-10 max-w-2xl text-center">
        <p className="text-balance text-[16px] text-secondary">
          Compare: one junior hire costs {juniorHire(cur.symbol)} in most markets. 10X {launch.name} starts at{" "}
          <span className="text-fg">{format(price(launch).monthly)}/month</span>.
        </p>
      </Reveal>
    </>
  );
}
