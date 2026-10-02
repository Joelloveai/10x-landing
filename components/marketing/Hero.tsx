import { ArrowRight } from "lucide-react";
import { sectionIds, siteConfig } from "@/lib/site-config";
import { CtaLink } from "@/components/ui/CtaLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { AgentRoster } from "./AgentRoster";
import { HeroDemo } from "./HeroDemo";
import { HeroLayer } from "./HeroLayer";
import { HeroSpotlight } from "./HeroSpotlight";

const lines = [
  { text: "Hire your AI sales team.", className: "text-fg" },
  { text: "Today.", className: "text-secondary" },
];

/**
 * Chapter 01. Focus order: headline, CTA, then product.
 * Three depth layers pull apart on scroll (80 / 120 / 160px) and fade up 0.08s apart on mount.
 */
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
        <HeroLayer depth={80} index={0}>
        <p className="mx-auto inline-flex max-w-full items-center gap-2 text-balance rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-[12px] text-secondary min-[360px]:whitespace-nowrap sm:px-3.5 sm:text-[13px]">
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
          Built for Malaysian businesses that run on WhatsApp
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
        </HeroLayer>

        <HeroLayer depth={120} index={1}>
        <p className="text-lead mx-auto mt-6 max-w-[40rem] text-balance text-secondary sm:mt-7">
          Four AI agents that answer your questions about every lead, draft your WhatsApp replies and help you find any record. One subscription.
        </p>

        <p className="mx-auto mt-7 max-w-md text-pretty text-[14px] text-secondary">
          Every feature tested on a real business before it ships.
        </p>
        </HeroLayer>

        <HeroLayer depth={160} index={2}>

        <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Magnetic>
            <CtaLink
              href={`#${sectionIds.audit}`}
              event="hero_cta_clicked"
              size="lg"
              className="w-full sm:w-auto"
            >
              {siteConfig.cta.primary}
            </CtaLink>
          </Magnetic>
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
        <AgentRoster />

        </HeroLayer>
      </div>

      <div className="container-x relative mt-14 pb-8 sm:mt-16">
        <HeroLayer depth={0} index={3}>
          <div className="[perspective:1200px]">
            <HeroDemo />
          </div>
          <p className="mt-4 text-center text-[13px] text-secondary">Product demo. Names and data are illustrative.</p>
        </HeroLayer>
      </div>
    </section>
  );
}
