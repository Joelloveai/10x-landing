import { ArrowRight } from "lucide-react";
import { sectionIds, siteConfig } from "@/lib/site-config";
import { CtaLink } from "@/components/ui/CtaLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { HeroDemo } from "./HeroDemo";
import { HeroSpotlight } from "./HeroSpotlight";

const proof = [
  { name: "Marcus T. K. Loke", role: "Property Agent", quote: "Helps me keep track of follow-ups. Now less messy." },
  { name: "Audrey Wong", role: "Property Agent", quote: "Actually helped me stay more organised with follow-ups." },
  { name: "Elaine Choo", role: "Aesthetic Clinic Owner", quote: "Manage bookings and follow-ups better." },
];

const lines = [
  { text: "Stop Losing Leads", className: "text-fg" },
  { text: "After 6 PM", className: "text-fg" },
];

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

        {/* Fixed line breaks, so the web-font swap never reflows the headline (no CLS). Words reveal 0.06s apart. */}
        <h1
          id="hero-title"
          className="text-hero mx-auto mt-7 text-balance text-[clamp(2.25rem,1rem+4vw,4.5rem)] leading-[1.04] sm:mt-8 md:whitespace-nowrap"
        >
          {lines.map((line, li) => (
            <span key={line.text} className={`block ${line.className}`}>
              {line.text.split(" ").map((w, wi, arr) => {
                const i = lines.slice(0, li).reduce((n, l) => n + l.text.split(" ").length, 0) + wi;
                return (
                  <span key={`${w}-${wi}`}>
                    <span className="hero-word" style={{ ["--i" as string]: i }}>
                      {w}
                    </span>
                    {wi < arr.length - 1 ? " " : null}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <p className="text-lead mx-auto mt-6 max-w-[40rem] text-pretty text-secondary sm:mt-7">
          10X replies in seconds, books the appointment, and follows up. While your team sleeps.
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

        <p className="mx-auto mt-10 max-w-md text-pretty text-[14px] text-secondary">
          Built by a small Malaysian team. Tested on our own business first.
        </p>
        <ul aria-label="What early users say" className="mx-auto mt-4 grid max-w-4xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
          {proof.map((t) => (
            <li key={t.name} className="rounded-xl border border-border bg-white/[0.02] px-4 py-3.5">
              <figure>
                <blockquote className="text-pretty text-[14px] leading-[1.5] text-secondary">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-2.5 text-[12px] text-subtle">
                  <span className="text-secondary">{t.name}</span> · {t.role}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-x relative mt-14 pb-8 sm:mt-16">
        <HeroDemo />
        <p className="mt-4 text-center text-[13px] text-secondary">Product demo. Names and data are illustrative.</p>
      </div>
    </section>
  );
}
