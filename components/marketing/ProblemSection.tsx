"use client";

import { sectionIds } from "@/lib/site-config";
import { CountUp } from "@/components/ui/CountUp";
import { CtaLink } from "@/components/ui/CtaLink";
import { SectionItem, SectionWrapper } from "./SectionWrapper";

const pct = (n: number) => `${Math.round(n)}%`;

/** Chapter 02 opener: the after-hours gap, stated plainly. */
export function ProblemSection() {
  return (
    <SectionWrapper className="mx-auto max-w-4xl text-center">
      <SectionItem>
        <p className="mb-5 flex items-center justify-center gap-3">
          <span className="chapter-marker flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 font-mono text-[11px] text-subtle ring-1 ring-inset ring-white/12 transition-all duration-500">
            02
          </span>
          <span className="eyebrow">The leak</span>
        </p>
      </SectionItem>
      <SectionItem>
        <h2 id="leak-title" className="text-display text-balance">
          <CountUp to={40} format={pct} className="tabular-nums text-accent-text" /> of leads arrive after 6 PM. Nobody
          replies until morning.
        </h2>
      </SectionItem>
      <SectionItem>
        <p className="text-lead mx-auto mt-6 max-w-2xl text-pretty text-secondary">
          The lead books with another agent. You never knew they existed.
        </p>
      </SectionItem>
      <SectionItem>
        <p className="mx-auto mt-10 max-w-2xl text-balance text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-semibold leading-[1.3] tracking-[-0.02em] text-fg">
          <CountUp to={78} format={pct} className="tabular-nums" /> of customers buy from whoever replies first. Not the
          cheapest. Not the best. First.
        </p>
      </SectionItem>
      <SectionItem className="mt-8">
        <CtaLink href={`#${sectionIds.calculator}`} event="cta_clicked" eventProps={{ location: "problem" }} variant="link" size="inline" className="text-[16px]">
          See what you are losing
          <span aria-hidden>→</span>
        </CtaLink>
      </SectionItem>
    </SectionWrapper>
  );
}
