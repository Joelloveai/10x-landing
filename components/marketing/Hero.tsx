import { ArrowRight } from "lucide-react";
import { sectionIds, siteConfig } from "@/lib/site-config";
import { heroTestimonials } from "@/lib/testimonials";
import { CtaLink } from "@/components/ui/CtaLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { HeroProduct } from "./HeroProduct";
import { HeroSpotlight } from "./HeroSpotlight";
import { TestimonialCard } from "./TestimonialCard";

const words = ["Stop", "Losing", "Leads", "After", "6 PM"];

/** Chapter 01. Focus order: headline, CTA, product, then testimonials as the trust signal. */
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
        <p className="mx-auto inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-[12px] text-secondary sm:px-3.5 sm:text-[13px]">
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
          <span className="sm:hidden">For businesses that live on enquiries</span>
          <span className="hidden sm:inline">For businesses that run on enquiries and appointments</span>
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

      <div className="container-x relative mt-14 sm:mt-16">
        <HeroProduct />
        <p className="mt-4 text-center text-[13px] text-secondary">Product demo. Names and data are illustrative.</p>
      </div>

      <div className="container-x pb-8 pt-20 sm:pt-24">
        <Reveal>
          <h2 className="eyebrow mb-6 text-center">From early users</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {heroTestimonials.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
