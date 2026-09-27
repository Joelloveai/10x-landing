"use client";

import { m, type Variants } from "framer-motion";
import { CalendarCheck, Clock, Inbox } from "lucide-react";
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
  { num: "06", name: "Report", line: "Daily brief. Flags urgent leads. Reports performance.", role: "AI Operations Manager" },
];

const brief = [
  { icon: Inbox, text: "3 new leads overnight", tone: "text-accent-text" },
  { icon: CalendarCheck, text: "1 viewing confirmed", tone: "text-success-text" },
  { icon: Clock, text: "2 follow-ups due today", tone: "text-accent-text" },
];

/** Chapter 03. Six steps, each owned by an AI role. Vertical on mobile, a grid beside the daily brief on desktop. */
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

        <div className="mt-12 grid grid-cols-1 gap-3 md:mt-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="relative">
          {/* Connector on mobile. Shows in the gaps between cards. */}
          <span aria-hidden className="absolute bottom-6 left-[28px] top-6 w-px bg-border md:hidden" />
          <m.ol
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="relative grid grid-cols-1 gap-3 md:grid-cols-3"
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

          {/* Right panel: what the Report step sends each morning. Example data. */}
          <Reveal>
            <aside
              aria-label="Example daily brief"
              className="halo-soft rounded-2xl border border-border bg-elevated p-5 lg:sticky lg:top-28"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[15px] font-semibold tracking-[-0.01em] text-fg">Daily brief</p>
                <span className="font-mono text-[12px] text-subtle">8:00 AM</span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {brief.map((b) => (
                  <li key={b.text} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 text-[15px] text-fg">
                    <b.icon aria-hidden className={`size-4 shrink-0 ${b.tone}`} />
                    {b.text}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-center justify-between gap-3 text-[12px] text-subtle">
                <span>AI Operations Manager</span>
                <span className="font-mono uppercase tracking-[0.08em]">Illustrative</span>
              </p>
            </aside>
          </Reveal>
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
