"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  CalendarDays,
  ChartColumn,
  Check,
  ChevronRight,
  Flag,
  Inbox,
  ListChecks,
  MessageCircle,
  Repeat,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { sectionIds } from "@/lib/site-config";
import { useReducedMotionPref } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { ChapterHeader } from "@/components/ui/ChapterHeader";

const EASE = [0.16, 1, 0.3, 1] as const;
const FADE = { duration: 0.4, ease: "easeInOut" } as const;

const steps: readonly { num: string; label: string; title: string; line: string; icon: LucideIcon }[] = [
  { num: "01", label: "Capture", title: "Lead Capture", line: "Every enquiry lands in one inbox. Nothing slips.", icon: Inbox },
  { num: "02", label: "Respond", title: "Respond", line: "AI replies in seconds. Day or night.", icon: MessageCircle },
  { num: "03", label: "Qualify", title: "Qualify", line: "Asks the right questions. Scores the lead.", icon: ListChecks },
  { num: "04", label: "Book", title: "Book", line: "Customer books directly into your calendar.", icon: CalendarDays },
  { num: "05", label: "Follow Up", title: "Follow Up", line: "Day 1, 3, 7, 30. Automatically.", icon: Repeat },
  { num: "06", label: "Report", title: "Report", line: "Daily brief. Flags urgent. Reports performance.", icon: ChartColumn },
];

// Scroll progress where each step begins. The last step runs to 1.
const STARTS = [0, 0.16, 0.33, 0.5, 0.66, 0.83];
// Connector length at each step start: it reaches step i's node as step i lights up.
const LINE_AT = STARTS.map((_, i) => i / (STARTS.length - 1));

const flow = {
  before: ["Missed", "Unassigned", "Unanswered", "No booking", "Forgotten", "Invisible"],
  after: ["Captured", "Assigned", "Responded", "Booked", "Followed up", "Visible"],
};

/** Counts from 0 to `total`, one tick every `ms` after `delay`. Starts at `total` when not animating. */
function useSequence(total: number, ms: number, animate: boolean, delay = 0) {
  const [n, setN] = useState(animate ? 0 : total);
  useEffect(() => {
    if (!animate) return;
    const timers = Array.from({ length: total }, (_, i) => setTimeout(() => setN(i + 1), delay + ms * i));
    return () => timers.forEach(clearTimeout);
  }, [animate, total, ms, delay]);
  return n;
}

/**
 * Chapter 03, the centrepiece. A scroll-driven walk through six stages: a rail of stages
 * (horizontal on desktop, a vertical stack on mobile) lights the active one, a connector draws
 * between them, and the panel below shows the step working.
 * Lighting: active = scale 1.05 + accent glow + one icon turn; past = 0.6; future = 0.35.
 * Reduced motion: no sticky scroll, stages are tap-driven, nothing scales or turns.
 */
export function HowItWorks() {
  const reduced = useReducedMotionPref();
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const seen = useInView(stickyRef, { once: true, amount: 0.4 });
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(0);
  const [withTenX, setWithTenX] = useState(false);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const activeStep = useTransform(scrollYProgress, (v) => STARTS.filter((s) => s > 0 && v >= s).length);
  useMotionValueEvent(activeStep, "change", (v) => setActive(v));
  const line = useSpring(useTransform(scrollYProgress, STARTS, LINE_AT), { stiffness: 140, damping: 30, restDelta: 0.001 });

  const step = reduced ? picked : active;
  const current = steps[step];

  const goTo = (i: number) => {
    const el = containerRef.current;
    if (reduced) {
      setPicked(i);
      return;
    }
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + range * (STARTS[i] + 0.02), behavior: "smooth" });
  };

  return (
    <section id={sectionIds.howItWorks} data-chapter aria-labelledby="how-title" className="border-t border-border py-24 md:py-32">
      <div className="container-x">
        <ChapterHeader
          num="03"
          label="How it works"
          id="how-title"
          title="See every enquiry move."
          lead="Six steps. One enquiry. Scroll to follow it."
        />
      </div>

      <div ref={containerRef} className={cn("relative", reduced ? "mt-12 md:mt-16" : "h-[300vh] lg:h-[400vh]")}>
        <div
          ref={stickyRef}
          className={cn(!reduced && "sticky top-0 flex h-svh flex-col justify-center pb-6 pt-20 lg:h-screen lg:pb-10 lg:pt-24")}
        >
          <div className="container-x flex min-h-0 w-full flex-1 flex-col gap-4 lg:flex-none lg:gap-8">
            <div>
              <StepRail step={step} line={reduced ? step / (steps.length - 1) : line} reduced={reduced} onSelect={goTo} />
              {/* Only the active step's line shows, under the rail. */}
              <div className="mt-3 grid min-h-[24px] lg:mt-6 lg:justify-items-center">
                <AnimatePresence initial={false}>
                  <m.p
                    key={current.num}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={FADE}
                    className="text-[15px] text-fg [grid-area:1/1] lg:text-[17px]"
                  >
                    {current.line}
                  </m.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-elevated lg:mx-auto lg:min-h-[420px] lg:w-full lg:max-w-4xl">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,#2563EB,transparent_70%)] opacity-[0.06]"
              />
              <div className="relative flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
                <p aria-live="polite" className="font-mono text-[12px] uppercase tracking-[0.1em] text-fg">
                  <span className="text-subtle">{current.num}</span> {current.title}
                </p>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-subtle">Illustrative</span>
              </div>
              {/* Panels share one grid cell, so the old one fades out while the new one fades in. */}
              <div className="relative grid min-h-0 flex-1 items-center overflow-hidden p-4 sm:p-5">
                <AnimatePresence initial={false}>
                  {seen || reduced ? (
                    <m.div
                      key={current.num}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={FADE}
                      className="[grid-area:1/1]"
                    >
                      <Panel index={step} animate={!reduced} />
                    </m.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x">
        <div className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <div role="group" aria-label="Compare" className="inline-flex rounded-full border border-border bg-bg p-1">
            {[
              { label: "Before", on: !withTenX, value: false },
              { label: "With 10X", on: withTenX, value: true },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                aria-pressed={b.on}
                onClick={() => setWithTenX(b.value)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[14px] transition-colors",
                  b.on ? "bg-accent text-accent-fg" : "text-secondary hover:text-fg",
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
          <div aria-live="polite" className="mt-4 min-h-[36px]">
            <m.ol
              key={withTenX ? "after" : "before"}
              initial={reduced ? false : "hidden"}
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              className="flex flex-wrap items-center gap-x-1.5 gap-y-2"
            >
              {(withTenX ? flow.after : flow.before).map((s, i, arr) => (
                <m.li
                  key={s}
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[14px] ring-1 ring-inset",
                      withTenX ? "bg-accent/10 text-accent-text ring-accent/30" : "bg-warning/10 text-warning-text ring-warning/30",
                    )}
                  >
                    {s}
                  </span>
                  {i < arr.length - 1 ? <ChevronRight aria-hidden className="size-3.5 text-subtle" /> : null}
                </m.li>
              ))}
            </m.ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The six stages plus the connector that draws between them as the visitor scrolls. */
function StepRail({
  step,
  line,
  reduced,
  onSelect,
}: {
  step: number;
  line: MotionValue<number> | number;
  reduced: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <ol aria-label="Steps" className="relative flex flex-col lg:grid lg:grid-cols-6">
      {/* Connector: across the node centres on desktop, down the node column on mobile. */}
      <Connector line={line} className="absolute left-[calc(100%/12)] top-[23px] hidden h-[2px] w-[calc(100%*10/12)] lg:block" vertical={false} />
      <Connector line={line} className="absolute left-[25px] top-[22px] h-[calc(100%-44px)] w-[2px] lg:hidden" vertical />
      {steps.map((s, i) => (
        <StepItem key={s.num} index={i} state={i === step ? "on" : i < step ? "past" : "future"} reduced={reduced} onSelect={() => onSelect(i)} />
      ))}
    </ol>
  );
}

function Connector({ line, className, vertical }: { line: MotionValue<number> | number; className: string; vertical: boolean }) {
  const d = vertical ? "M1 0 V100" : "M0 1 H100";
  return (
    <svg aria-hidden viewBox={vertical ? "0 0 2 100" : "0 0 100 2"} preserveAspectRatio="none" className={className}>
      <path d={d} stroke="rgb(255 255 255 / 0.1)" strokeWidth={2} fill="none" />
      <m.path d={d} stroke="#2563EB" strokeWidth={2} fill="none" style={{ pathLength: line }} />
    </svg>
  );
}

const LIGHT = { on: 1, past: 0.6, future: 0.35 } as const;

function StepItem({
  index,
  state,
  reduced,
  onSelect,
}: {
  index: number;
  state: keyof typeof LIGHT;
  reduced: boolean;
  onSelect: () => void;
}) {
  const s = steps[index];
  const on = state === "on";
  const Icon = s.icon;

  return (
    <li className="relative">
      <m.button
        type="button"
        aria-current={on ? "step" : undefined}
        onClick={onSelect}
        initial={false}
        animate={{ scale: on && !reduced ? 1.05 : 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex w-full origin-left items-center gap-3 rounded-xl px-2 py-1 text-left lg:origin-center lg:flex-col lg:gap-3 lg:px-2 lg:py-0 lg:text-center"
      >
        <span className="relative grid size-9 shrink-0 place-items-center lg:size-12">
          {/* Solid disc under the node so the connector never shows through a dimmed stage. */}
          <span aria-hidden className="absolute inset-0 rounded-full bg-bg" />
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 rounded-full shadow-[0_0_28px_2px_rgba(37,99,235,0.55)] transition-opacity duration-[400ms] motion-reduce:transition-none",
              on ? "opacity-100" : "opacity-0",
            )}
          />
          <m.span
            initial={false}
            animate={{ opacity: LIGHT[state] }}
            transition={{ duration: 0.4 }}
            className={cn(
              "relative grid size-full place-items-center rounded-full ring-1 ring-inset",
              on ? "bg-accent/15 text-accent-text ring-accent" : "bg-surface text-fg ring-white/15",
            )}
          >
            <m.span
              initial={false}
              animate={{ rotate: on && !reduced ? 360 : 0 }}
              transition={on ? { duration: 1.6, ease: [0.45, 0, 0.55, 1] } : { duration: 0 }}
              className="grid place-items-center"
            >
              <Icon aria-hidden className="size-4 lg:size-5" />
            </m.span>
          </m.span>
        </span>
        <m.span
          initial={false}
          animate={{ opacity: LIGHT[state] }}
          transition={{ duration: 0.4 }}
          className="flex items-baseline gap-2 font-mono text-[12px] uppercase tracking-[0.08em] lg:text-[13px]"
        >
          <span className={on ? "text-accent-text" : "text-fg"}>{s.num}</span>
          <span className="whitespace-nowrap text-fg">{s.label}</span>
        </m.span>
      </m.button>
    </li>
  );
}

function Panel({ index, animate }: { index: number; animate: boolean }) {
  switch (index) {
    case 0:
      return <CapturePanel animate={animate} />;
    case 1:
      return <RespondPanel animate={animate} />;
    case 2:
      return <QualifyPanel animate={animate} />;
    case 3:
      return <BookPanel animate={animate} />;
    case 4:
      return <FollowUpPanel animate={animate} />;
    default:
      return <ReportPanel animate={animate} />;
  }
}

const leads = [
  { name: "Daniel Lim", via: "Website form", time: "6:15 PM" },
  { name: "Aisyah Rahman", via: "Call", time: "8:03 PM" },
  { name: "Sarah Tan", via: "WhatsApp · after hours", time: "9:42 PM" },
];

function CapturePanel({ animate }: { animate: boolean }) {
  return (
    <m.ul
      initial={animate ? "hidden" : false}
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.25, delayChildren: 0.1 } } }}
      className="space-y-2.5"
    >
      {leads.map((l, i) => {
        const last = i === leads.length - 1;
        return (
          <m.li
            key={l.name}
            variants={{ hidden: { opacity: 0, x: 48 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } } }}
            className={cn(
              "rounded-xl border px-4 py-3",
              last ? "border-accent/50 bg-accent/10 shadow-[0_0_32px_-12px_rgba(37,99,235,0.6)]" : "border-border bg-surface",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <p className={cn("text-[15px]", last ? "font-medium text-fg" : "text-secondary")}>{l.name}</p>
              <span className="font-mono text-[12px] text-subtle">{l.time}</span>
            </div>
            <p className="mt-0.5 text-[13px] text-subtle">{l.via}</p>
            {last ? (
              <p className="mt-2 flex items-center gap-2 text-[13px] text-accent-text">
                <Inbox aria-hidden className="size-3.5" />
                Captured to inbox
              </p>
            ) : null}
          </m.li>
        );
      })}
    </m.ul>
  );
}

function RespondPanel({ animate }: { animate: boolean }) {
  // 0: inbound only. 1: typing. 2: reply and badge.
  const phase = useSequence(2, 1200, animate, 500);
  return (
    <div className="space-y-3">
      <div className="max-w-[85%] rounded-xl rounded-tl-sm border border-border bg-surface px-4 py-3">
        <p className="text-[13px] text-subtle">Sarah Tan · 9:42 PM</p>
        <p className="mt-1 text-[15px] text-fg">Hi, is the unit still available? Can I view it this weekend?</p>
      </div>
      <div className="grid justify-items-end">
        <AnimatePresence initial={false}>
          {phase === 1 ? (
            <m.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex gap-1 rounded-xl rounded-tr-sm bg-accent/15 px-4 py-3.5 [grid-area:1/1]"
            >
              {[0, 1, 2].map((d) => (
                <m.span
                  key={d}
                  className="size-1.5 rounded-full bg-accent-text"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                />
              ))}
            </m.div>
          ) : null}
          {phase === 2 ? (
            <m.div
              key="reply"
              initial={animate ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="max-w-[85%] rounded-xl rounded-tr-sm border border-accent/40 bg-accent/10 px-4 py-3 [grid-area:1/1]"
            >
              <p className="text-[13px] text-accent-text">Reply · 9:42 PM</p>
              <p className="mt-1 text-[15px] text-fg">Hi Sarah. Yes, it is. Saturday 2 PM or Sunday 11 AM are open. Which suits you?</p>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="flex min-h-[30px] justify-end">
        {phase === 2 ? (
          <m.span
            initial={animate ? { opacity: 0, scale: 0.9 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: EASE, delay: animate ? 0.3 : 0 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 font-mono text-[12px] text-success-text ring-1 ring-inset ring-success/30"
          >
            <Check aria-hidden className="size-3.5" />
            Replied in 28s
          </m.span>
        ) : null}
      </div>
    </div>
  );
}

const fields = [
  { label: "Budget", value: "RM 650k" },
  { label: "Timeline", value: "Within 3 months" },
  { label: "Area", value: "Mont Kiara" },
  { label: "Financing", value: "Pre-approved" },
];

function QualifyPanel({ animate }: { animate: boolean }) {
  const n = useSequence(fields.length + 1, 450, animate, 300);
  const scored = n > fields.length;
  return (
    <div className="space-y-2.5">
      {fields.map((f, i) => (
        <div key={f.label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-2.5">
          <span className="text-[14px] text-secondary">{f.label}</span>
          <m.span
            initial={false}
            animate={{ opacity: n > i ? 1 : 0, x: n > i ? 0 : 8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="text-[15px] text-fg"
          >
            {f.value}
          </m.span>
        </div>
      ))}
      <m.div
        initial={false}
        animate={{ opacity: scored ? 1 : 0, y: scored ? 0 : 6 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="rounded-xl border border-accent/50 bg-accent/10 px-4 py-3"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-[14px] text-secondary">Lead score</span>
          <span className="font-mono text-[15px] text-fg">
            87/100 · <span className="text-accent-text">HOT</span>
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <m.div
            initial={false}
            animate={{ scaleX: scored ? 0.87 : 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: animate ? 0.15 : 0 }}
            className="h-full origin-left bg-accent"
          />
        </div>
      </m.div>
    </div>
  );
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["10 AM", "12 PM", "2 PM", "4 PM"];
const taken = new Set(["Mon-10 AM", "Tue-2 PM", "Wed-12 PM", "Thu-4 PM", "Fri-10 AM", "Sun-12 PM"]);

function BookPanel({ animate }: { animate: boolean }) {
  // 0: slot pulses. 1: confirmed. 2: SMS sent.
  const phase = useSequence(2, 800, animate, 1400);
  const booked = phase >= 1;
  return (
    <div>
      <div className="grid grid-cols-[40px_repeat(7,minmax(0,1fr))] gap-1 text-center">
        <span />
        {days.map((d) => (
          <span key={d} className="pb-1 font-mono text-[11px] text-subtle">
            {d}
          </span>
        ))}
        {times.map((t) => (
          <div key={t} className="contents">
            <span className="flex items-center font-mono text-[10px] text-subtle sm:text-[11px]">{t}</span>
            {days.map((d) => {
              const key = `${d}-${t}`;
              const target = key === "Sat-2 PM";
              return (
                <div
                  key={key}
                  className={cn(
                    "relative h-8 rounded-md border lg:h-9",
                    target ? "border-accent bg-accent/20" : taken.has(key) ? "border-border bg-white/[0.06]" : "border-border bg-surface",
                  )}
                >
                  {target && !booked ? (
                    <m.span
                      aria-hidden
                      className="absolute inset-0 rounded-md bg-accent/50"
                      animate={{ opacity: [0.2, 0.9, 0.2] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ) : null}
                  {target && booked ? (
                    <m.span
                      aria-hidden
                      initial={animate ? { opacity: 0, scale: 0.6 } : false}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="absolute inset-0 grid place-items-center rounded-md bg-accent"
                    >
                      <Check className="size-4 text-accent-fg" />
                    </m.span>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 min-h-[88px]">
        <m.div
          initial={false}
          animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 8 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="rounded-xl border border-border bg-surface px-4 py-3"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-subtle">SMS · Sarah Tan</p>
            <span className="inline-flex items-center gap-1 text-[13px] text-success-text">
              <Check aria-hidden className="size-3.5" />
              Confirmed
            </span>
          </div>
          <p className="mt-1.5 text-[14px] text-fg">Your viewing is booked for Saturday, 2:00 PM. Reply to reschedule.</p>
        </m.div>
      </div>
    </div>
  );
}

const followUps = [
  { day: "Day 1", msg: "Hi Sarah, thanks for asking. Would Saturday suit you for a viewing?" },
  { day: "Day 3", msg: "Just checking in. The unit is still open for viewing this week." },
  { day: "Day 7", msg: "Happy to answer any questions before you decide." },
  { day: "Day 30", msg: "Still looking? New units just came in that fit your budget." },
];

function FollowUpPanel({ animate }: { animate: boolean }) {
  const lit = useSequence(followUps.length, 650, animate, 300);
  return (
    <ol className="relative space-y-2.5">
      <span aria-hidden className="absolute bottom-4 left-[35px] top-4 w-px bg-border" />
      {followUps.map((f, i) => {
        const on = i < lit;
        return (
          <li key={f.day} className="relative flex items-start gap-3">
            <span className="relative grid w-[70px] shrink-0 overflow-hidden rounded-full bg-bg py-1 text-center font-mono text-[12px] text-subtle ring-1 ring-inset ring-white/12">
              {f.day}
              <m.span
                aria-hidden
                initial={false}
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 grid place-items-center bg-accent text-accent-fg"
              >
                {f.day}
              </m.span>
            </span>
            <m.p
              initial={false}
              animate={{ opacity: on ? 1 : 0.35, x: on ? 0 : 6 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-[14px] text-fg"
            >
              <MessageCircle aria-hidden className="mr-1.5 inline size-3.5 -translate-y-px text-subtle" />
              {f.msg}
            </m.p>
          </li>
        );
      })}
    </ol>
  );
}

const brief = [
  { icon: Inbox, text: "4 new leads overnight", tone: "text-accent-text" },
  { icon: Flag, text: "Urgent: Sarah Tan wants a viewing today", tone: "text-warning-text" },
  { icon: TrendingUp, text: "Average reply time 28s this week", tone: "text-success-text" },
];

function ReportPanel({ animate }: { animate: boolean }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[16px] font-semibold tracking-[-0.01em] text-fg">Daily brief</p>
        <span className="font-mono text-[12px] text-subtle">8:00 AM</span>
      </div>
      <m.ul
        initial={animate ? "hidden" : false}
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.3, delayChildren: 0.2 } } }}
        className="mt-4 space-y-2.5"
      >
        {brief.map((b) => (
          <m.li
            key={b.text}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } }}
            className="flex items-center gap-3 rounded-lg border border-border bg-bg/60 px-4 py-3 text-[15px] text-fg"
          >
            <b.icon aria-hidden className={cn("size-4 shrink-0", b.tone)} />
            {b.text}
          </m.li>
        ))}
      </m.ul>
    </div>
  );
}
