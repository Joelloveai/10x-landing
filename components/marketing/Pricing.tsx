"use client";

import { useState } from "react";
import { m, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { pricingCopy, pricingPlans, yearOne } from "@/lib/pricing";
import { sectionIds, siteConfig } from "@/lib/site-config";
import { cn, formatRM } from "@/lib/utils";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { CountUp } from "@/components/ui/CountUp";
import { CtaLink } from "@/components/ui/CtaLink";
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

/** Junior hire range for the compare line. RM keeps the Malaysian figure; other currencies swap the symbol. */
const juniorHire = (symbol: string) => (symbol === "RM" ? "RM2,500-3,500/month" : `${symbol}500-900/month`);

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const card: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Chapter 06 header and plans. Growth is the one featured card. */
export function Pricing() {
  const [currency, setCurrency] = useState<CurrencyCode>("RM");
  // Prices count up once on first view; after a currency switch they change instantly.
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
          num="06"
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
          const isSales = plan.cta === siteConfig.cta.sales;
          const p = price(plan);
          return (
            <m.li key={plan.slug} variants={card} className={cn("min-w-0", plan.highlighted && "lg:-my-3")}>
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
                        <span className="text-[44px] font-semibold leading-none tracking-[-0.04em] tabular-nums">{format(p.monthly)}</span>
                      ) : (
                        <CountUp to={p.monthly} format={format} className="text-[44px] font-semibold leading-none tracking-[-0.04em] tabular-nums" />
                      )}
                      <span className="text-[15px] text-secondary">/mo</span>
                    </p>
                    <p className="mt-2 text-[14px] text-secondary">+ {format(p.setup)} setup</p>
                    <p className="mt-1 text-[14px] text-secondary">
                      Year 1: <span className="text-fg">{format(p.monthly * 12 + p.setup)}</span>
                    </p>
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
                      <CtaLink
                        href={`#${sectionIds.audit}`}
                        intent={isSales ? "sales" : "audit"}
                        event={isSales ? "talk_to_sales_clicked" : "pricing_cta_clicked"}
                        eventProps={{ plan: plan.slug, location: "pricing" }}
                        variant={plan.highlighted ? "primary" : "secondary"}
                        className="w-full"
                        aria-label={`${plan.cta} (${plan.name} plan)`}
                      >
                        {plan.cta}
                      </CtaLink>
                    </Magnetic>
                  </div>
                </article>
              </Tilt>
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
