import { Check } from "lucide-react";
import { liveCapabilities, pricingPlans } from "@/lib/pricing";
import { sectionIds, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PricingViewTracker } from "./PricingViewTracker";

export function Pricing() {
  const { foundingOffer } = siteConfig;
  return (
    <section id={sectionIds.pricing} aria-labelledby="pricing-title" className="py-28 md:py-40">
      <div className="container-x">
        <SectionHeader
          id="pricing-title"
          eyebrow="Pricing"
          title="Start with the system your team will actually use."
          lead="Simple monthly plans in Malaysian ringgit. We recommend a plan after your audit, based on your workflow."
        />

        <Reveal className="relative mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          <PricingViewTracker />
          {pricingPlans.map((plan) => (
            <article
              key={plan.slug}
              aria-labelledby={`plan-${plan.slug}`}
              className={cn(
                "relative flex min-w-0 flex-col rounded-2xl border p-6 sm:p-8",
                plan.highlighted
                  ? "border-accent/60 bg-elevated shadow-[0_0_0_1px_rgb(37_99_235/0.25),0_30px_80px_-30px_rgb(37_99_235/0.35)] lg:-my-3 lg:py-11"
                  : "border-border bg-surface",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 id={`plan-${plan.slug}`} className="text-[20px] font-semibold tracking-[-0.02em]">
                  {plan.name}
                </h3>
                {plan.highlighted ? (
                  <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-white">
                    Our recommendation
                  </span>
                ) : null}
              </div>
              <p className="mt-3 min-h-[48px] text-[15px] text-secondary">{plan.description}</p>

              <div className="mt-8">
                {foundingOffer.enabled ? (
                  <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-accent-text">Founding price</p>
                ) : null}
                <p className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
                  <span className="text-[44px] font-semibold leading-none tracking-[-0.04em]">
                    {foundingOffer.enabled ? plan.foundingPrice : plan.regularPrice}
                  </span>
                  <span className="text-[15px] text-secondary">/month</span>
                </p>
                {foundingOffer.enabled ? (
                  <p className="mt-2 text-[14px] text-secondary">
                    Normally <s className="decoration-white/40">{plan.regularPrice}/month</s>
                  </p>
                ) : null}
                <p className="mt-1 text-[14px] text-secondary">Setup fee: {plan.setupPrice}</p>
              </div>

              <div className="mt-auto pt-8">
                <CtaLink
                  href={`#${sectionIds.audit}`}
                  event="pricing_cta_click"
                  eventProps={{ plan: plan.slug }}
                  variant={plan.highlighted ? "primary" : "secondary"}
                  className="w-full"
                  aria-label={`${plan.cta} (${plan.name} plan)`}
                >
                  {plan.cta}
                </CtaLink>
              </div>
            </article>
          ))}
        </Reveal>

        <Reveal className="mt-10 grid grid-cols-1 gap-8 rounded-2xl border border-border p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div>
            <h3 className="text-[16px] font-semibold">What 10X includes today</h3>
            <p className="mt-2 text-[15px] text-secondary">
              Plans differ in how much of your workflow we set up and automate. We confirm exactly what your plan covers after the audit.
            </p>
          </div>
          <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {liveCapabilities.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[15px] text-secondary">
                <Check className="size-4 shrink-0 text-success-text" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {foundingOffer.enabled ? (
          <Reveal>
            <p className="mx-auto mt-8 max-w-2xl text-center text-[15px] text-secondary">
              Founding pricing is available to the first {foundingOffer.customerLimit} customers while we continue refining
              10X with early businesses. WhatsApp costs are passed through at cost.
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
