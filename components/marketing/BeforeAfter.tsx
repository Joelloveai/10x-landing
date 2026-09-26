"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  Activity,
  Bell,
  CalendarCheck,
  Check,
  Clock,
  EyeOff,
  FileSpreadsheet,
  Inbox,
  MessageCircle,
  PhoneMissed,
  Repeat,
  StickyNote,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

const before = [
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: StickyNote, label: "Notes" },
  { icon: FileSpreadsheet, label: "Spreadsheets" },
  { icon: PhoneMissed, label: "Missed calls" },
  { icon: Bell, label: "Manual reminders" },
  { icon: EyeOff, label: "No management visibility" },
];

const after = [
  { icon: Inbox, label: "Lead captured" },
  { icon: UserCheck, label: "Owner assigned" },
  { icon: Clock, label: "Response tracked" },
  { icon: CalendarCheck, label: "Appointment booked" },
  { icon: Repeat, label: "Follow-up scheduled" },
  { icon: Activity, label: "Outcome visible" },
];

const scatter = [
  { rotate: -2.2, x: 4 },
  { rotate: 1.6, x: 18 },
  { rotate: -1.1, x: 0 },
  { rotate: 2, x: 12 },
  { rotate: -1.6, x: 22 },
  { rotate: 1.1, x: 8 },
];

export function BeforeAfter() {
  const [withTenx, setWithTenx] = useState(false);

  return (
    <section id="before-after" aria-labelledby="ba-title" className="border-t border-border bg-surface/40 py-28 md:py-40">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-5">Before and after</p>
          <h2 id="ba-title" className="text-display text-balance">
            Stop running your customer process from six different places.
          </h2>
          <p className="text-lead mt-5 text-secondary">
            Leads come in. Someone needs to respond, follow up and book the appointment. 10X keeps the process moving in
            one place.
          </p>

          <div role="group" aria-label="Compare" className="mt-10 inline-flex rounded-full border border-border bg-surface p-1">
            {[
              { v: false, label: "Before" },
              { v: true, label: "With 10X" },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                aria-pressed={withTenx === opt.v}
                onClick={() => setWithTenx(opt.v)}
                className={cn(
                  "rounded-full px-5 py-2 text-[15px] transition-colors",
                  withTenx === opt.v ? (opt.v ? "bg-accent text-white" : "bg-white/[0.08] text-fg") : "text-secondary hover:text-fg",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-[#0d0d0e] p-5 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <AnimatePresence mode="wait" initial={false}>
                <m.p
                  key={String(withTenx)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className={cn("text-[15px] font-medium", withTenx ? "text-fg" : "text-warning-text")}
                  aria-live="polite"
                >
                  {withTenx ? "One workflow. Every step visible." : "Six places. No single view."}
                </m.p>
              </AnimatePresence>
            </div>

            <div className="relative">
              <m.span
                aria-hidden
                className="absolute bottom-5 left-[19px] top-5 w-px origin-top bg-accent/60"
                initial={false}
                animate={{ scaleY: withTenx ? 1 : 0, opacity: withTenx ? 1 : 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
              <ul className="relative space-y-2.5">
                {before.map((b, i) => {
                  const a = after[i]!;
                  const item = withTenx ? a : b;
                  const Icon = item.icon;
                  return (
                    <m.li
                      key={i}
                      initial={false}
                      animate={withTenx ? { rotate: 0, x: 0 } : scatter[i]}
                      transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        "flex max-w-[90%] items-center gap-3 rounded-xl border px-3 py-3 transition-colors duration-500",
                        withTenx ? "border-white/[0.08] bg-elevated" : "border-dashed border-white/[0.1] bg-white/[0.02]",
                      )}
                    >
                      <span
                        className={cn(
                          "relative z-10 flex size-[26px] shrink-0 items-center justify-center rounded-full transition-colors duration-500",
                          withTenx ? "bg-accent text-white" : "bg-white/[0.06] text-secondary",
                        )}
                      >
                        <Icon className="size-3.5" aria-hidden />
                      </span>
                      <span className={cn("flex-1 text-[15px]", withTenx ? "text-fg" : "text-secondary")}>{item.label}</span>
                      {withTenx ? (
                        <Check className="size-4 text-success-text" aria-hidden />
                      ) : (
                        <span className="size-1.5 rounded-full bg-warning/80" aria-hidden />
                      )}
                    </m.li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
