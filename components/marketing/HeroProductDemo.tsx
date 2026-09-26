"use client";

/**
 * PRODUCT CONCEPT / DEMO STATE.
 * A CSS + Framer Motion simulation of the 10X lead workflow. All names, times and values
 * are fictional demo data. It is labelled "Illustrative" in the UI and must never be
 * presented as real customer activity.
 */

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Bell,
  CalendarDays,
  Check,
  Inbox,
  Pause,
  Play,
  Settings,
  SquareKanban,
  Users,
} from "lucide-react";
import { useReducedMotionPref, useRichPointer } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/Logo";

const STEPS = [
  { key: "lead", label: "New lead" },
  { key: "assign", label: "Assign" },
  { key: "respond", label: "Respond" },
  { key: "qualify", label: "Qualify" },
  { key: "book", label: "Book" },
  { key: "follow", label: "Follow up" },
] as const;

const STEP_MS = 2600;
const HOLD_MS = 4600;

const sarahStatus = [
  { text: "New enquiry", tone: "warning" },
  { text: "Assigned · Jason", tone: "accent" },
  { text: "Replied · 4 min", tone: "accent" },
  { text: "Qualified", tone: "accent" },
  { text: "Viewing · Sat 2 PM", tone: "success" },
  { text: "Follow-up scheduled", tone: "success" },
] as const;

const nextSteps = [
  "Assign an owner",
  "Reply to Sarah",
  "Confirm budget, area, timeline",
  "Book a viewing",
  "Viewing · Sat, 2:00 PM",
  "Follow-up Day 1 · 10:00 AM",
];

const stages = ["New", "Contacted", "Qualified", "Booked", "Follow-up"];
const stageForStep = [0, 0, 1, 2, 3, 4];

const otherLeads = [
  { name: "Daniel Lim", status: "Viewing booked", time: "Yesterday", tone: "success" },
  { name: "Aisyah Rahman", status: "Follow-up · Day 3", time: "Mon", tone: "accent" },
  { name: "Kumar S.", status: "Qualified", time: "Mon", tone: "accent" },
  { name: "Mei Ling Ong", status: "Reactivated", time: "Sun", tone: "accent" },
] as const;

const toneDot = {
  warning: "bg-warning",
  accent: "bg-accent",
  success: "bg-success",
} as const;

export function HeroProductDemo() {
  const reduced = useReducedMotionPref();
  const rich = useRichPointer();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-10% 0px -10% 0px" });

  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  // Reduced motion: no autoplay, show the full story.
  useEffect(() => {
    if (reduced) {
      setUserPaused(true);
      setStep(STEPS.length - 1);
    }
  }, [reduced]);

  const playing = !userPaused && !paused && !hovering && inView;

  useEffect(() => {
    if (!playing) return;
    const delay = step === STEPS.length - 1 ? HOLD_MS : STEP_MS;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), delay);
    return () => window.clearTimeout(t);
  }, [playing, step]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Desktop parallax: ±1.5deg around the base tilt, layers move at different depths.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
  const rotateY = useTransform(sx, (v) => -3 + v * 1.5);
  const rotateX = useTransform(sy, (v) => 2 - v * 1.5);
  const backX = useTransform(sx, (v) => v * -8);
  const backY = useTransform(sy, (v) => v * -6);
  const frontX = useTransform(sx, (v) => v * 14);
  const frontY = useTransform(sy, (v) => v * 10);

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
    <div
      ref={rootRef}
      className="relative mx-auto w-full max-w-[1120px]"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <p className="sr-only">
        Product demo with illustrative data. A new enquiry from Sarah Tan arrives at 11:42 PM, is assigned to Jason,
        gets a reply, is qualified on budget, area and timeline, a viewing is booked for Saturday at 2:00 PM, and
        follow-ups are scheduled for Day 1, 3, 7 and 30.
      </p>

      <div className="relative lg:[perspective:1200px]" aria-hidden>
        {/* BACK layer: ambient interface */}
        <m.div
          style={rich ? { x: backX, y: backY } : undefined}
          className="pointer-events-none absolute -right-5 -top-6 hidden h-[60%] w-[40%] rounded-[20px] border border-white/[0.04] bg-surface/40 p-5 lg:block"
        >
          <div className="space-y-3 opacity-25">
            {[70, 52, 84, 40, 64].map((w, i) => (
              <div key={i} className="h-2 rounded-full bg-white/10" style={{ width: `${w}%` }} />
            ))}
          </div>
        </m.div>

        {/* MIDDLE layer: the main 10X window */}
        <m.div
          style={rich ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
          className={cn(
            "relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0d0d0e] shadow-window",
            !rich && !reduced && "lg:[transform:rotateX(2deg)_rotateY(-3deg)]",
          )}
        >
          <BrowserChrome />
          <div className="grid h-[360px] grid-cols-1 sm:h-[400px] md:grid-cols-[52px_220px_minmax(0,1fr)] lg:h-[440px] lg:grid-cols-[52px_240px_minmax(0,1fr)_240px]">
            <Sidebar />
            <LeadList step={step} />
            <Thread step={step} />
            <Details step={step} />
          </div>
        </m.div>

        {/* FRONT layer: floating status elements */}
        <m.div style={rich ? { x: frontX, y: frontY } : undefined} className="pointer-events-none absolute inset-0 hidden lg:block">
          <AnimatePresence>
            {step <= 1 ? (
              <m.div
                key="toast-lead"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -left-10 top-28 w-64 rounded-2xl border border-white/10 bg-elevated/95 p-3.5 shadow-float backdrop-blur"
              >
                <div className="flex items-center gap-2 text-[12px] text-secondary">
                  <span className="size-1.5 rounded-full bg-warning" />
                  New enquiry
                  <span className="ml-auto font-mono text-[11px] text-subtle">11:42 PM</span>
                </div>
                <p className="mt-1.5 text-[14px] font-medium">Sarah Tan</p>
                <p className="mt-0.5 text-[13px] text-secondary">Hi, is this unit still available?</p>
              </m.div>
            ) : null}
            {step >= 4 ? (
              <m.div
                key="toast-booked"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -right-8 bottom-[140px] w-60 rounded-2xl border border-white/10 bg-elevated/95 p-3.5 shadow-float backdrop-blur"
              >
                <div className="flex items-center gap-2 text-[12px] text-success-text">
                  <CalendarDays className="size-3.5" />
                  Viewing booked
                </div>
                <p className="mt-1.5 text-[14px] font-medium">Saturday · 2:00 PM</p>
                <p className="mt-0.5 text-[13px] text-secondary">Sarah Tan with Jason · KL</p>
              </m.div>
            ) : null}
          </AnimatePresence>
        </m.div>
      </div>

      <StepControls
        step={step}
        playing={playing}
        userPaused={userPaused}
        onSelect={(i) => {
          setStep(i);
          setUserPaused(true);
        }}
        onTogglePlay={() => setUserPaused((p) => !p)}
      />
    </div>
  );
}

function BrowserChrome() {
  return (
    <div className="flex h-10 items-center gap-3 border-b border-white/[0.06] bg-[#111112] px-4">
      <div className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-[#2a2a2d]" />
        <span className="size-2.5 rounded-full bg-[#2a2a2d]" />
        <span className="size-2.5 rounded-full bg-[#2a2a2d]" />
      </div>
      <div className="mx-auto flex h-6 min-w-0 items-center gap-2 rounded-md bg-white/[0.04] px-3 font-mono text-[11px] text-subtle">
        <span className="size-1.5 shrink-0 rounded-full bg-success/80" />
        <span className="truncate">10X · Demo workspace · Leads</span>
      </div>
      <span className="hidden rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-subtle ring-1 ring-inset ring-white/10 sm:inline">
        Illustrative
      </span>
    </div>
  );
}

function Sidebar() {
  const items = [Inbox, Users, CalendarDays, SquareKanban, Bell];
  return (
    <div className="hidden flex-col items-center gap-2 border-r border-white/[0.06] bg-[#0f0f10] py-3 md:flex">
      <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-white/[0.06] text-[15px] text-fg">
        <LogoMark />
      </div>
      {items.map((Icon, i) => (
        <div
          key={i}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            i === 0 ? "bg-accent/15 text-accent-text" : "text-subtle",
          )}
        >
          <Icon className="size-4" />
        </div>
      ))}
      <div className="mt-auto flex size-8 items-center justify-center text-subtle">
        <Settings className="size-4" />
      </div>
    </div>
  );
}

function LeadList({ step }: { step: number }) {
  const s = sarahStatus[step]!;
  return (
    <div className="hidden flex-col border-r border-white/[0.06] md:flex">
      <div className="flex items-center justify-between px-4 pb-2 pt-3.5">
        <span className="text-[13px] font-medium">Leads</span>
        <span className="font-mono text-[11px] text-subtle">5 open</span>
      </div>
      <div className="flex gap-1.5 px-4 pb-3">
        {["All", "Mine", "Unassigned"].map((f, i) => (
          <span
            key={f}
            className={cn(
              "rounded-md px-2 py-0.5 text-[11px]",
              i === 0 ? "bg-white/[0.08] text-fg" : "text-subtle",
            )}
          >
            {f}
          </span>
        ))}
      </div>
      <div className="flex-1 space-y-0.5 px-2">
        <div className="relative rounded-lg bg-white/[0.05] px-2.5 py-2.5 ring-1 ring-inset ring-accent/30">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium">Sarah Tan</span>
            <span className="font-mono text-[10px] text-subtle">11:42 PM</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={cn("size-1.5 rounded-full transition-colors duration-500", toneDot[s.tone])} />
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={s.text}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="text-[11px] text-secondary"
              >
                {s.text}
              </m.span>
            </AnimatePresence>
          </div>
        </div>
        {otherLeads.map((l) => (
          <div key={l.name} className="rounded-lg px-2.5 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-secondary">{l.name}</span>
              <span className="font-mono text-[10px] text-subtle">{l.time}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full opacity-70", toneDot[l.tone])} />
              <span className="text-[11px] text-subtle">{l.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const itemMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

function Thread({ step }: { step: number }) {
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-[11px] font-semibold">
          ST
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium">Sarah Tan</p>
          <p className="truncate text-[11px] text-subtle">Property enquiry · Listing form · Mont Kiara</p>
        </div>
        <div className="ml-auto shrink-0">
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={step >= 1 ? "jason" : "none"}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] ring-1 ring-inset",
                step >= 1 ? "text-fg ring-white/15" : "text-warning-text ring-warning/40",
              )}
            >
              {step >= 1 ? (
                <>
                  <span className="flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-accent-fg">
                    J
                  </span>
                  Jason
                </>
              ) : (
                "Unassigned"
              )}
            </m.span>
          </AnimatePresence>
        </div>
      </div>

      <ChatViewport>
        <AnimatePresence initial={false}>
          <m.div key="sys" {...itemMotion} className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">
            New enquiry · listing form · 11:42 PM
          </m.div>
          <m.div key="in" {...itemMotion} className="max-w-[82%] self-start rounded-2xl rounded-bl-md bg-white/[0.07] px-3.5 py-2.5 text-[13px]">
            Hi, is this unit still available?
          </m.div>
          {step >= 1 ? (
            <m.div key="assign" {...itemMotion} className="flex items-center justify-center gap-2 text-[11px] text-secondary">
              <span className="h-px w-8 bg-white/10" />
              <span className="flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-accent-fg">J</span>
              Assigned to Jason
              <span className="font-mono text-subtle">11:43 PM</span>
              <span className="h-px w-8 bg-white/10" />
            </m.div>
          ) : null}
          {step >= 2 ? (
            <m.div key="out" {...itemMotion} className="max-w-[82%] self-end">
              <div className="rounded-2xl rounded-br-md bg-accent px-3.5 py-2.5 text-[13px] text-accent-fg">
                Hi Sarah, yes. I can help check availability.
              </div>
              <p className="mt-1 text-right font-mono text-[10px] text-subtle">Jason · 11:46 PM</p>
            </m.div>
          ) : null}
          {step >= 3 ? (
            <m.div key="qualify" {...itemMotion} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">Qualification</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["Budget", "RM650k"],
                  ["Area", "Mont Kiara"],
                  ["Timeline", "3 months"],
                ].map(([k, v], i) => (
                  <m.div
                    key={k}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.12, duration: 0.3 }}
                    className="min-w-0"
                  >
                    <div className="flex items-center gap-1 text-[10px] text-subtle">
                      <Check className="size-3 text-success-text" />
                      {k}
                    </div>
                    <p className="truncate text-[12px] font-medium">{v}</p>
                  </m.div>
                ))}
              </div>
            </m.div>
          ) : null}
          {step >= 4 ? (
            <m.div key="book" {...itemMotion} className="rounded-xl border border-success/30 bg-success/[0.06] p-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-success-text">Viewing booked</p>
                <CalendarDays className="size-3.5 text-success-text" />
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {["Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div
                    key={d}
                    className={cn(
                      "rounded-md py-1.5 text-center text-[11px]",
                      d === "Sat" ? "bg-success text-accent-fg" : "bg-white/[0.04] text-subtle",
                    )}
                  >
                    {d}
                    {d === "Sat" ? <span className="block font-mono text-[10px] opacity-90">2:00 PM</span> : null}
                  </div>
                ))}
              </div>
            </m.div>
          ) : null}
          {step >= 5 ? (
            <m.div key="follow" {...itemMotion} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">Follow-up sequence</p>
              <div className="flex items-center gap-1.5">
                {["Day 1", "Day 3", "Day 7", "Day 30"].map((d, i) => (
                  <m.span
                    key={d}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.1 }}
                    className={cn(
                      "flex-1 rounded-md py-1 text-center font-mono text-[10px]",
                      i === 0 ? "bg-accent/20 text-accent-text" : "bg-white/[0.05] text-secondary",
                    )}
                  >
                    {d}
                  </m.span>
                ))}
              </div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </ChatViewport>
    </div>
  );
}

/** Messages start at the top and scroll up only once the thread is full, like a real chat. */
function ChatViewport({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner || !("ResizeObserver" in window)) return;
    const update = () => setOffset(Math.min(0, outer.clientHeight - inner.scrollHeight));
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    update();
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} className={cn("relative flex-1 overflow-hidden", offset < 0 && "fade-top")}>
      <div
        ref={innerRef}
        className="absolute inset-x-0 top-0 flex flex-col gap-3 px-4 py-4 transition-transform duration-500 ease-out sm:px-5"
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      >
        {children}
      </div>
    </div>
  );
}

function Details({ step }: { step: number }) {
  const stage = stageForStep[step]!;
  return (
    <div className="hidden flex-col gap-4 border-l border-white/[0.06] bg-[#0f0f10] p-4 lg:flex">
      <p className="text-[13px] font-medium">Lead details</p>
      <div>
        <p className="mb-2 text-[11px] text-subtle">Stage</p>
        <div className="flex gap-1">
          {stages.map((st, i) => (
            <span
              key={st}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-500",
                i <= stage ? "bg-accent" : "bg-white/10",
              )}
            />
          ))}
        </div>
        <p className="mt-1.5 text-[12px] text-secondary">{stages[stage]}</p>
      </div>
      <Row label="Owner" value={step >= 1 ? "Jason" : "Unassigned"} warn={step < 1} />
      <Row label="Source" value="Listing form" />
      <Row label="First reply" value={step >= 2 ? "4 min" : "Waiting"} warn={step < 2} mono />
      <div className="mt-auto rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
        <p className="text-[11px] text-subtle">Next step</p>
        <AnimatePresence mode="wait" initial={false}>
          <m.p
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="mt-1 text-[12px] font-medium"
          >
            {nextSteps[step]}
          </m.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Row({ label, value, warn, mono }: { label: string; value: string; warn?: boolean; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-subtle">{label}</span>
      <span className={cn(warn ? "text-warning-text" : "text-fg", mono && "font-mono text-[11px]")}>{value}</span>
    </div>
  );
}

function StepControls({
  step,
  playing,
  userPaused,
  onSelect,
  onTogglePlay,
}: {
  step: number;
  playing: boolean;
  userPaused: boolean;
  onSelect: (i: number) => void;
  onTogglePlay: () => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <div role="group" aria-label="Demo steps" className="flex max-w-full items-center gap-1 overflow-x-auto scrollbar-none rounded-full border border-border bg-surface/80 p-1">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={i === step}
            onClick={() => onSelect(i)}
            className={cn(
              "relative shrink-0 overflow-hidden rounded-full px-2.5 py-1.5 text-[12px] transition-colors sm:px-3",
              i === step ? "bg-white/[0.08] text-fg" : i < step ? "text-secondary" : "text-subtle hover:text-secondary",
            )}
          >
            <span className="font-mono text-[10px] opacity-60">{i + 1}</span>
            <span className={cn("ml-1.5", i === step ? "inline" : "hidden sm:inline")}>{s.label}</span>
            {i === step && playing ? (
              <span
                key={`${step}-bar`}
                aria-hidden
                className="absolute inset-x-3 bottom-0.5 h-px origin-left bg-accent-text/70"
                style={{
                  animation: `demo-progress ${i === STEPS.length - 1 ? HOLD_MS : STEP_MS}ms linear both`,
                }}
              />
            ) : null}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={userPaused ? "Play demo" : "Pause demo"}
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface/80 text-secondary transition-colors hover:text-fg"
      >
        {userPaused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
      </button>
    </div>
  );
}
