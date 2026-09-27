"use client";

import { m, type Variants } from "framer-motion";
import { sectionIds } from "@/lib/site-config";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { Reveal } from "@/components/ui/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const steps = [
  { num: "01", name: "Capture", line: "Every lead from WhatsApp, forms, calls. One inbox.", role: "AI Sales Director" },
  { num: "02", name: "Respond", line: "Instant reply, day or night. English, BM, Chinese.", role: "AI Sales Director" },
  { num: "03", name: "Qualify", line: "Asks the right questions. Scores HOT/WARM/COLD.", role: "AI Sales Director" },
  { num: "04", name: "Book", line: "Books into your calendar. Sends confirmations.", role: "AI Follow-up Specialist" },
  { num: "05", name: "Follow up", line: "Day 1, 3, 7, 30. Never forgets.", role: "AI Follow-up Specialist" },
  { num: "06", name: "Report", line: "Daily brief. Flags urgent. Reports performance.", role: "AI Operations Manager" },
];

/** Chapter 03. Six steps, each owned by an AI role. Horizontal on desktop, vertical on mobile. */
export function HowItWorks() {
  return (
    <section
      id={sectionIds.howItWorks}
      data-chapter
      aria-labelledby="how-title"
      className="border-t border-border py-24 md:py-32"
    >
      <div className="container-x">
        <ChapterHeader
          num="03"
          label="How it works"
          id="how-title"
          title="Six steps. Every lead."
          lead="From first message to booked appointment. Each step has an owner."
        />

        <div className="relative mt-12 md:mt-16">
          {/* Connector: vertical on mobile, horizontal on desktop. Shows in the gaps between cards. */}
          <span aria-hidden className="absolute bottom-6 left-[28px] top-6 w-px bg-border md:hidden" />
          <span aria-hidden className="absolute left-6 right-6 top-[32px] hidden h-px bg-border lg:block" />
          <m.ol
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="relative grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6"
          >
            {steps.map((s) => (
              <m.li
                key={s.num}
                variants={item}
                className="flex gap-4 rounded-2xl border border-border bg-surface p-4 md:flex-col md:gap-0 md:p-5"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg font-mono text-[11px] text-accent-text ring-1 ring-inset ring-accent/50">
                  {s.num}
                </span>
                <div className="min-w-0 md:mt-5 md:flex md:flex-1 md:flex-col">
                  <h3 className="font-mono text-[13px] uppercase tracking-[0.1em] text-fg">{s.name}</h3>
                  <p className="mt-2 text-pretty text-[15px] leading-[1.45] text-secondary">{s.line}</p>
                  <p className="mt-4 md:mt-auto md:pt-4">
                    <span className="inline-flex rounded-lg bg-accent/10 px-2.5 py-1 text-[12px] leading-[1.35] text-accent-text ring-1 ring-inset ring-accent/30">
                      {s.role}
                    </span>
                  </p>
                </div>
              </m.li>
            ))}
          </m.ol>
        </div>

        <Reveal>
          <p
            id={sectionIds.ai}
            className="mx-auto mt-12 max-w-2xl scroll-mt-32 text-balance text-center text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-semibold leading-[1.3] tracking-[-0.02em] text-fg"
          >
            Four AI roles. One system. You own it.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
