import { sectionIds } from "@/lib/site-config";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion } from "./FaqAccordion";
import { Pricing } from "./Pricing";
import { Security } from "./Security";

/** Chapter 06. Focus model: Growth is primary, price is secondary, everything else is quiet. */
export function PricingFAQ() {
  return (
    <section id={sectionIds.pricing} data-chapter aria-labelledby="pricing-title" className="border-t border-border py-24 md:py-32">
      <div className="container-x">
        <Pricing />

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
