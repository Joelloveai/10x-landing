"use client";

/**
 * PRODUCT DEMO. A 12s CSS loop of the 10X lead flow: a lead arrives, is assigned, gets an
 * instant reply, a slot is booked, and follow-ups are scheduled. All names and times are
 * fictional. Labelled "Illustrative" in the UI. Reduced motion shows the finished state.
 */

import { useEffect } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CalendarDays, Check, Inbox, UserRound } from "lucide-react";
import { useRichPointer } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const SLOTS = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];
const BOOKED = 2;
const FOLLOW_UPS = ["Day 1", "Day 3", "Day 7", "Day 30"];

export function HeroDemo() {
  const rich = useRichPointer();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
  // Base tilt rotateX(2deg) rotateY(-1.5deg), plus up to ±2deg following the cursor.
  const rotateX = useTransform(sy, (v) => 2 - v * 2);
  const rotateY = useTransform(sx, (v) => -1.5 + v * 2);

  useEffect(() => {
    if (!rich) {
      mx.set(0);
      my.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rich, mx, my]);

  return (
    <m.div
      style={rich ? { transformPerspective: 1200, rotateX, rotateY } : undefined}
      className="hero-3d mx-auto max-w-[1000px] rounded-[20px] border border-white/[0.08] bg-surface text-left shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_1px_0_0_rgba(255,255,255,0.06)_inset,0_60px_120px_-30px_rgba(0,0,0,0.85),0_30px_60px_-30px_rgba(37,99,235,0.28)]"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
        </div>
        <div className="mx-auto rounded-md bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-subtle">10X · Inbox</div>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">Illustrative</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]">
        {/* Inbox */}
        <div className="border-b border-border p-4 md:border-b-0 md:border-r sm:p-5">
          <p className="flex items-center gap-2 text-[13px] font-medium text-fg">
            <Inbox className="size-4 text-subtle" aria-hidden /> New leads
            <span className="ml-auto font-mono text-[11px] text-subtle">9:42 PM</span>
          </p>

          <div className="demo-step demo-lead mt-4 rounded-xl border border-accent/40 bg-accent/[0.06] p-3">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[12px] font-semibold"
              >
                ST
              </span>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium">Sarah Tan</p>
                <p className="truncate text-[12px] text-subtle">WhatsApp · after hours</p>
              </div>
            </div>
            <div className="demo-step demo-assign mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-fg">
              <UserRound className="size-3" aria-hidden /> Assigned · Jason
            </div>
          </div>

          <div aria-hidden className="mt-3 space-y-2 opacity-50">
            {["Daniel Lim", "Aisyah Rahman"].map((n) => (
              <div key={n} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="size-6 rounded-full bg-white/[0.06]" />
                <span className="text-[13px] text-secondary">{n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation and booking */}
        <div className="space-y-4 p-4 sm:p-5">
          <div className="demo-step demo-lead max-w-[85%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-3.5 py-2.5 text-[14px] text-fg">
            Hi, is this still available? Can I view it this week?
          </div>
          <div className="demo-step demo-reply ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-accent px-3.5 py-2.5 text-[14px] text-accent-fg">
            Hi Sarah, yes it is. Would Saturday suit you for a viewing?
            <span className="mt-1 block text-right font-mono text-[10px] text-white/75">Auto-reply · 8 sec</span>
          </div>

          <div className="demo-step demo-cal rounded-xl border border-border bg-elevated p-3.5">
            <p className="flex items-center gap-2 text-[13px] font-medium">
              <CalendarDays className="size-4 text-subtle" aria-hidden /> Saturday
              <span className="demo-step demo-booked ml-auto inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-0.5 text-[11px] font-semibold text-success-fg">
                Booked <Check className="size-3" aria-hidden />
              </span>
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SLOTS.map((slot, i) => (
                <div
                  key={slot}
                  className="relative overflow-hidden rounded-lg border border-border px-2 py-2 text-center font-mono text-[12px] text-secondary"
                >
                  {slot}
                  {i === BOOKED ? (
                    <span
                      aria-hidden
                      className="demo-step demo-slot absolute inset-0 flex items-center justify-center bg-accent text-accent-fg"
                    >
                      {slot}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="demo-step demo-cal text-[12px] text-subtle">Follow-up</span>
            {FOLLOW_UPS.map((d, i) => (
              <span
                key={d}
                className={cn(
                  "demo-step rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[11px] text-accent-text",
                  `demo-chip-${i + 1}`,
                )}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </m.div>
  );
}
