import { ArrowRight } from "lucide-react";
import { sectionIds, siteConfig } from "@/lib/site-config";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCTA() {
  return (
    <section aria-labelledby="final-title" className="relative isolate overflow-hidden border-t border-border py-32 md:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.05),transparent_75%)]"
      />
      <Reveal className="container-x text-center">
        <h2 id="final-title" className="text-display mx-auto max-w-4xl text-balance">
          Stop losing leads. Start closing more.
        </h2>
        <p className="text-lead mx-auto mt-6 max-w-xl text-secondary">
          Find the leaks in your current process before spending more money on more leads.
        </p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <CtaLink href={`#${sectionIds.audit}`} event="cta_click" eventProps={{ location: "final" }} size="lg" className="w-full sm:w-auto">
            {siteConfig.cta.primary}
          </CtaLink>
          <CtaLink
            href={`#${sectionIds.howItWorks}`}
            event="see_how_it_works_click"
            eventProps={{ location: "final" }}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            {siteConfig.cta.secondary}
            <ArrowRight className="size-4" aria-hidden />
          </CtaLink>
        </div>
        <p className="mt-4 text-[14px] text-secondary">{siteConfig.cta.microcopy}</p>
      </Reveal>
    </section>
  );
}
