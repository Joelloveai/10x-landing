"use client";

import { sectionIds } from "@/lib/site-config";
import { CountUp } from "@/components/ui/CountUp";
import { CtaLink } from "@/components/ui/CtaLink";
import { LossCalculator } from "./LossCalculator";
import { SectionItem, SectionWrapper } from "./SectionWrapper";

const pct = (n: number) => `${Math.round(n)}%`;

const stats = [
  { value: 40, label: "of leads arrive after 6 PM" },
  { value: 78, label: "of customers buy from whoever replies first. Not the cheapest. Not the best. First." },
];

/** Chapter 02. The after-hours gap, two count-up stats, then the calculator inline. */
export function ProblemSection() {
  return (
    <section
      id={sectionIds.leak}
      data-chapter
      aria-labelledby="leak-title"
      className="border-t border-border py-24 md:py-32"
    >
      <div className="container-x">
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
              Nobody replies until morning.
            </h2>
          </SectionItem>
          <SectionItem>
            <p className="text-lead mx-auto mt-6 max-w-2xl text-pretty text-secondary">
              The lead books with another agent. You never knew they existed.
            </p>
          </SectionItem>
          <div className="mt-12 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
            {stats.map((s) => (
              <SectionItem key={s.value} className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <p className="text-[clamp(2.75rem,2rem+3vw,4rem)] font-semibold leading-none tracking-[-0.04em]">
                  <CountUp to={s.value} format={pct} className="tabular-nums text-accent-text" />
                </p>
                <p className="mt-4 text-pretty text-[17px] leading-[1.45] text-secondary">{s.label}</p>
              </SectionItem>
            ))}
          </div>
        </SectionWrapper>

        <div id={sectionIds.calculator} className="mx-auto mt-12 max-w-5xl scroll-mt-24 md:mt-16">
          <LossCalculator />
        </div>

        <div className="mt-8 text-center">
          <CtaLink
            href={`#${sectionIds.audit}`}
            intent="audit"
            event="cta_clicked"
            eventProps={{ location: "problem" }}
            variant="link"
            size="inline"
            className="text-[16px]"
          >
            Get your free audit
            <span aria-hidden>→</span>
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
