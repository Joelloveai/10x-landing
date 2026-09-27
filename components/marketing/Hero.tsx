import { ArrowRight } from "lucide-react";
import { sectionIds, siteConfig } from "@/lib/site-config";
import { CtaLink } from "@/components/ui/CtaLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { HeroProduct } from "./HeroProduct";
import { HeroSpotlight } from "./HeroSpotlight";

const words = ["Stop", "Losing", "Leads", "After", "6 PM"];

/** Chapter 01. Focus order: headline, CTA, then product. */
export function Hero() {
  return (
    <section
      id={sectionIds.hero}
      data-chapter
      aria-labelledby="hero-title"
      className="relative isolate overflow-x-clip pt-[calc(var(--nav-h)+56px)] sm:pt-[calc(var(--nav-h)+80px)] lg:pt-[calc(var(--nav-h)+96px)]"
    >
      <HeroSpotlight />
      <div className="container-x relative text-center">
        <p className="mx-auto inline-flex max-w-full items-center gap-2 text-balance rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-[12px] text-secondary min-[360px]:whitespace-nowrap sm:px-3.5 sm:text-[13px]">
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
          The AI system that runs your business 24/7
        </p>

        {/* Explicit line breaks keep the layout identical before and after the web font loads (no CLS). */}
        <h1 id="hero-title" className="text-hero mx-auto mt-7 whitespace-nowrap sm:mt-8">
          {words.map((w, i) => (
            <span key={w}>
              <span className="hero-word" style={{ ["--i" as string]: i }}>
                {w}
              </span>
              {i === 0 ? <br className="md:hidden" /> : null}
              {i === 2 ? <br /> : null}
              {i < words.length - 1 && i !== 2 ? " " : null}
            </span>
          ))}
        </h1>

        <p className="text-lead mx-auto mt-6 max-w-[36rem] text-pretty text-secondary sm:mt-7">
          10X helps your team capture enquiries, respond faster, book appointments and keep follow-up moving.
        </p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Magnetic>
            <CtaLink
              href={`#${sectionIds.audit}`}
              intent="audit"
              event="hero_cta_clicked"
              size="lg"
              className="w-full sm:w-auto"
            >
              {siteConfig.cta.primary}
            </CtaLink>
          </Magnetic>
          <CtaLink
            href={`#${sectionIds.audit}`}
            intent="sales"
            event="talk_to_sales_clicked"
            eventProps={{ location: "hero" }}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            {siteConfig.cta.sales}
          </CtaLink>
        </div>
        <div className="mt-5 flex flex-col items-center gap-2 text-[14px] sm:flex-row sm:justify-center sm:gap-4">
          <CtaLink
            href={`#${sectionIds.howItWorks}`}
            event="see_how_it_works_clicked"
            eventProps={{ location: "hero" }}
            variant="link"
            size="inline"
          >
            {siteConfig.cta.secondary}
            <ArrowRight className="size-3.5" aria-hidden />
          </CtaLink>
          <span aria-hidden className="hidden text-subtle sm:inline">
            ·
          </span>
          <p className="text-secondary">{siteConfig.cta.microcopy}</p>
        </div>
      </div>

      <div className="container-x relative mt-14 pb-8 sm:mt-16">
        <HeroProduct />
        <p className="mt-4 text-center text-[13px] text-secondary">Product demo. Names and data are illustrative.</p>
      </div>
    </section>
  );
}
