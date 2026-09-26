import { pricingPlans } from "@/lib/pricing";
import { sectionIds, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion } from "./FaqAccordion";
import { PricingViewTracker } from "./PricingViewTracker";
import { Security } from "./Security";

/** Chapter 06. Focus model: Growth is primary, price is secondary, everything else is quiet. */
export function PricingFAQ() {
  const { foundingOffer } = siteConfig;
  return (
    <section id={sectionIds.pricing} data-chapter aria-labelledby="pricing-title" className="border-t border-border py-24 md:py-32">
      <div className="container-x">
        <ChapterHeader
          num="06"
          label="Pricing & trust"
          id="pricing-title"
          title="A simpler way to run the follow-up."
          lead="Monthly plans in Malaysian ringgit. We recommend the right plan after your audit."
        />

        <Reveal className="relative mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          <PricingViewTracker />
          {pricingPlans.map((plan) => {
            const isSales = plan.cta === siteConfig.cta.sales;
            return (
              <article
                key={plan.slug}
                aria-labelledby={`plan-${plan.slug}`}
                className={cn(
                  "relative flex min-w-0 flex-col rounded-2xl border p-6 transition-opacity sm:p-8",
                  plan.highlighted ? "halo border-accent/60 bg-elevated lg:-my-3 lg:py-11" : "border-border bg-surface",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 id={`plan-${plan.slug}`} className="text-[20px] font-semibold tracking-[-0.02em]">
                    {plan.name}
                  </h3>
                  {plan.highlighted ? (
                    <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-fg">
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
                  <p className="mt-1 text-[14px] text-secondary">Setup {plan.setupPrice}</p>
                </div>

                <div className="mt-auto pt-8">
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
                </div>
              </article>
            );
          })}
        </Reveal>

        {foundingOffer.enabled ? (
          <Reveal>
            <p className="mx-auto mt-8 max-w-2xl text-center text-[15px] text-secondary">
              Founding pricing is available to the first {foundingOffer.customerLimit} customers while we work closely
              with early businesses. WhatsApp costs are passed through at cost where applicable.
            </p>
          </Reveal>
        ) : null}

        <div className="mt-16">
          <Security />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
          <Reveal>
            <h3 id="faq" className="text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
              You probably have questions.
            </h3>
          </Reveal>
          <Reveal>
            <FaqAccordion />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
