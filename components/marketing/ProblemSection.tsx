"use client";

import { m, type Variants } from "framer-motion";
import { useReducedMotionPref } from "@/lib/hooks/useMediaQuery";
import { sectionIds } from "@/lib/site-config";
import { CountUp } from "@/components/ui/CountUp";
import { CtaLink } from "@/components/ui/CtaLink";
import { LossCalculator } from "./LossCalculator";
import { SectionItem, SectionWrapper } from "./SectionWrapper";

const pct = (n: number) => `${Math.round(n)}%`;

const stats: { value?: number; label: string }[] = [
  { label: "Most leads arrive when your team is offline." },
  { value: 78, label: "of customers buy from whoever replies first. Not the cheapest. Not the best. First." },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/** Pain cards slide in from the left, 0.1s apart, after the heading. */
const cardGrid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.24 } } };
const cardIn: Variants = {
  hidden: { opacity: 0, x: -24, y: 30 },
  show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** Once the cards are in and the count-up has landed, the figure nudges once to mark the loss. */
const nudge: Variants = {
  hidden: { x: 0 },
  show: { x: [0, -3, 3, 0], transition: { delay: 1.9, duration: 0.4, ease: "easeInOut" } },
};

/** Chapter 02. The after-hours gap, two count-up stats, then the calculator inline. */
export function ProblemSection() {
  const reduced = useReducedMotionPref();
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
                03
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
          <m.div variants={cardGrid} className="mt-12 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
            {stats.map((s) => (
              <m.div key={s.label} variants={cardIn} className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                {s.value === undefined ? (
                  <p className="text-balance text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-fg">
                    {s.label}
                  </p>
                ) : (
                  <>
                    <p className="text-[clamp(2.75rem,2rem+3vw,4rem)] font-semibold leading-none tracking-[-0.04em]">
                      <m.span variants={reduced ? undefined : nudge} className="inline-block">
                        <CountUp to={s.value} format={pct} className="tabular-nums text-accent-text" />
                      </m.span>
                    </p>
                    <p className="mt-4 text-pretty text-[17px] leading-[1.45] text-secondary">{s.label}</p>
                  </>
                )}
              </m.div>
            ))}
          </m.div>
        </SectionWrapper>

        <div id={sectionIds.calculator} className="mx-auto mt-12 max-w-5xl scroll-mt-24 md:mt-16">
          <LossCalculator />
        </div>

        <div className="mt-8 text-center">
          <CtaLink
            href={`#${sectionIds.audit}`}
            event="cta_clicked"
            eventProps={{ location: "problem" }}
            variant="link"
            size="inline"
            className="text-[16px]"
          >
            Join the waitlist
            <span aria-hidden>→</span>
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
