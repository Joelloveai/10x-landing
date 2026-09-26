"use client";

import { useRef } from "react";
import { m, useInView } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const events = [
  { t: "00:00", label: "Lead arrives." },
  { t: "00:30", label: "Response." },
  { t: "01:00", label: "Assigned." },
  { t: "02:00", label: "Qualified." },
  { t: "03:00", label: "Booking invitation." },
  { t: "DAY 1", label: "Follow-up." },
  { t: "DAY 3", label: "Follow-up." },
  { t: "DAY 7", label: "Follow-up." },
  { t: "DAY 30", label: "Reactivation." },
];

export function LeadTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section id="timeline" aria-labelledby="timeline-title" className="overflow-hidden py-28 md:py-40">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow mb-5">The life of one lead</p>
          <h2 id="timeline-title" className="text-display text-balance">
            A lead enters your business. It never becomes invisible.
          </h2>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-[12px] text-secondary">
            Example workflow · timing depends on your setup
          </p>
        </Reveal>

        <ol
          ref={ref}
          className="relative mt-16 grid gap-0 lg:grid-cols-9 lg:gap-2"
          aria-label="Example lead timeline"
        >
          {/* Rail */}
          <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-border lg:bottom-auto lg:left-0 lg:right-0 lg:top-[7px] lg:h-px lg:w-auto" />
          <m.span
            aria-hidden
            initial={false}
            animate={{ scaleX: inView ? 1 : 0, scaleY: inView ? 1 : 0 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-accent lg:bottom-auto lg:left-0 lg:right-0 lg:top-[7px] lg:h-px lg:w-auto lg:origin-left"
          />
          {events.map((e, i) => {
            const isDay = e.t.startsWith("DAY");
            return (
              <m.li
                key={`${e.t}-${i}`}
                initial={false}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.25, y: 8 }}
                transition={{ delay: 0.15 + i * 0.16, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex gap-5 pb-8 lg:flex-col lg:gap-5 lg:pb-0"
              >
                <span
                  aria-hidden
                  className={cn(
                    "relative z-10 mt-0.5 size-[15px] shrink-0 rounded-full border-2 bg-bg lg:mt-0",
                    isDay ? "border-accent-text" : "border-fg",
                  )}
                />
                <div>
                  <p className={cn("font-mono text-[13px] tracking-[0.08em]", isDay ? "text-accent-text" : "text-fg")}>{e.t}</p>
                  <p className="mt-1 text-[16px] text-secondary lg:text-[15px]">{e.label}</p>
                </div>
              </m.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
