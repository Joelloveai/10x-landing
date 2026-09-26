"use client";

import { useEffect, useState } from "react";
import { sectionIds, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { CtaLink } from "@/components/ui/CtaLink";

/** Mobile-only bottom CTA. Hidden near the top of the page and whenever the audit form is on screen. */
export function MobileStickyCTA() {
  const [pastHero, setPastHero] = useState(false);
  const [auditVisible, setAuditVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const audit = document.getElementById(sectionIds.audit);
    let io: IntersectionObserver | undefined;
    if (audit && "IntersectionObserver" in window) {
      io = new IntersectionObserver(([entry]) => setAuditVisible(!!entry?.isIntersecting), { threshold: 0.05 });
      io.observe(audit);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const visible = pastHero && !auditVisible;

  return (
    <div
      className={cn(
        "pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 px-4 pt-3 backdrop-blur-md transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
      aria-hidden={!visible}
      inert={!visible || undefined}
    >
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-[13px] leading-tight text-secondary">
          Free 15-minute review.
          <span className="block">No obligation.</span>
        </p>
        <CtaLink href={`#${sectionIds.audit}`} event="sticky_cta_click" size="md" className="shrink-0">
          {siteConfig.cta.primaryShort}
        </CtaLink>
      </div>
    </div>
  );
}
