"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, m, useInView } from "framer-motion";
import { CalendarCheck, Check, ChevronRight, Clock, Inbox, MessageCircle } from "lucide-react";
import { sectionIds } from "@/lib/site-config";
import { useReducedMotionPref } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { Reveal } from "@/components/ui/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;
const ROTATE_MS = 4000;

const features = [
  { id: "capture", name: "Lead Capture", line: "Every enquiry becomes trackable." },
  { id: "follow-up", name: "Follow-Up", line: "Important leads don't get forgotten." },
  { id: "booking", name: "Booking", line: "Conversations become appointments." },
  { id: "automation", name: "Automation", line: "The next step moves forward on its own." },
  { id: "pipeline", name: "Pipeline", line: "See ownership and progress." },
  { id: "reporting", name: "Reporting", line: "See where enquiries become customers." },
] as const;

type FeatureId = (typeof features)[number]["id"];

const flow = ["Captured", "Assigned", "Responded", "Booked", "Followed up", "Visible"];

/** Runs `fn` every `ms` while `on` is true. */
function useTicker(on: boolean, ms: number, fn: () => void) {
  const saved = useRef(fn);
  useEffect(() => {
    saved.current = fn;
  });
  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => saved.current(), ms);
    return () => clearInterval(t);
  }, [on, ms]);
}

/** Chapter 03. An interactive explorer: pick a feature on the left, the panel on the right shows it working. */
export function HowItWorks() {
  const reduced = useReducedMotionPref();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-20% 0px" });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [withTenX, setWithTenX] = useState(false);

  // Auto-rotate every 4s. Stops for good once the visitor picks a feature; pauses on hover or focus.
  useEffect(() => {
    if (reduced || stopped || hovering || focused || !inView) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % features.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [active, reduced, stopped, hovering, focused, inView]);

  // Keep the active tab visible in the horizontal tab row on mobile. Scrolls the row only, never the page.
  useEffect(() => {
    const tab = tabRefs.current[active];
    const row = tab?.parentElement;
    if (!tab || !row || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: tab.offsetLeft - 20, behavior: reduced ? "auto" : "smooth" });
  }, [active, reduced]);

  const select = (i: number, focus = false) => {
    setStopped(true);
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (next !== undefined) {
      e.preventDefault();
      select((active + next + features.length) % features.length, true);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      select(e.key === "Home" ? 0 : features.length - 1, true);
    }
  };

  const feature = features[active];
  const animate = !reduced && inView;

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
          title="See every enquiry move."
          lead="Six parts of one system. Pick one to see it work."
        />

        <Reveal className="mt-12 md:mt-16">
          <div
            ref={rootRef}
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
            }}
            className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-6"
          >
            <div
              role="tablist"
              aria-label="Features"
              aria-orientation="vertical"
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:flex-col lg:overflow-visible lg:pb-0"
            >
              {features.map((f, i) => {
                const on = i === active;
                return (
                  <button
                    key={f.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`feature-tab-${f.id}`}
                    aria-selected={on}
                    aria-controls="feature-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(i)}
                    onKeyDown={onKeyDown}
                    className={cn(
                      "shrink-0 rounded-lg border-l-2 px-4 py-2.5 text-left transition-[background-color,box-shadow,color] duration-300 lg:rounded-xl lg:py-4",
                      on
                        ? "border-accent bg-accent/10 text-accent-text shadow-[0_0_32px_-8px_rgba(37,99,235,0.45)]"
                        : "border-transparent text-secondary hover:bg-white/[0.03] hover:text-fg",
                    )}
                  >
                    <span className="block whitespace-nowrap text-[15px] font-medium lg:text-[17px]">{f.name}</span>
                    <span className={cn("mt-1 hidden text-[15px] lg:block", on ? "text-fg" : "text-secondary")}>{f.line}</span>
                  </button>
                );
              })}
            </div>

            <div
              id="feature-panel"
              role="tabpanel"
              aria-labelledby={`feature-tab-${feature.id}`}
              className="halo-soft relative flex flex-col overflow-hidden rounded-2xl border border-border bg-elevated"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
                <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-fg">
                  {feature.id === "automation" ? "Trigger → Action" : feature.name}
                </p>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-subtle">Illustrative</span>
              </div>
              <p className="px-5 pt-4 text-[15px] text-secondary lg:hidden">{feature.line}</p>
              {/* Both panels share one grid cell, so the old one fades out while the new one fades in. */}
              <div className="grid min-h-[320px] flex-1 items-center p-5">
                <AnimatePresence initial={false}>
                  <m.div
                    key={feature.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="[grid-area:1/1]"
                  >
                    <Panel id={feature.id} animate={animate} />
                  </m.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

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
              {withTenX ? (
                <m.ol
                  key="with"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
                  className="flex flex-wrap items-center gap-x-1.5 gap-y-2"
                >
                  {flow.map((step, i) => (
                    <m.li
                      key={step}
                      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }}
                      className="flex items-center gap-1.5"
                    >
                      <span className="rounded-full bg-accent/10 px-3 py-1.5 text-[14px] text-accent-text ring-1 ring-inset ring-accent/30">
                        {step}
                      </span>
                      {i < flow.length - 1 ? <ChevronRight aria-hidden className="size-3.5 text-subtle" /> : null}
                    </m.li>
                  ))}
                </m.ol>
              ) : (
                <p className="py-1.5 text-[15px] text-secondary">
                  Enquiries sit in different chats. Nobody owns the next step. Follow-ups depend on memory.
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Panel({ id, animate }: { id: FeatureId; animate: boolean }) {
  switch (id) {
    case "capture":
      return <CapturePanel />;
    case "follow-up":
      return <FollowUpPanel animate={animate} />;
    case "booking":
      return <BookingPanel animate={animate} />;
    case "automation":
      return <AutomationPanel />;
    case "pipeline":
      return <PipelinePanel animate={animate} />;
    case "reporting":
      return <ReportingPanel />;
  }
}

function CapturePanel() {
  return (
    <div className="space-y-2.5">
      <m.div
        initial={{ opacity: 0, x: 48 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
        className="rounded-xl border border-accent/50 bg-accent/10 p-4"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[15px] font-medium text-fg">New enquiry · Sarah Tan</p>
          <span className="font-mono text-[12px] text-subtle">9:42 PM</span>
        </div>
        <p className="mt-1 text-[13px] text-secondary">WhatsApp · after hours</p>
        <p className="mt-3 rounded-lg bg-bg/60 px-3 py-2 text-[14px] text-fg">Hi, is this still available? Can I view it this week?</p>
        <p className="mt-3 flex items-center gap-2 text-[13px] text-accent-text">
          <Inbox aria-hidden className="size-3.5" />
          Captured to inbox
        </p>
      </m.div>
      {[
        { name: "Daniel Lim", via: "Website form" },
        { name: "Aisyah Rahman", via: "Call" },
      ].map((l) => (
        <div key={l.name} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-[14px]">
          <span className="text-secondary">{l.name}</span>
          <span className="text-[13px] text-subtle">{l.via}</span>
        </div>
      ))}
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
  const [lit, setLit] = useState(animate ? 0 : followUps.length - 1);
  // Lights one chip every 0.5s: a 2s loop over four chips.
  useTicker(animate, 500, () => setLit((n) => (n + 1) % followUps.length));
  return (
    <ol className="relative space-y-2.5">
      <span aria-hidden className="absolute bottom-4 left-[35px] top-4 w-px bg-border" />
      {followUps.map((f, i) => {
        const on = animate ? i <= lit : true;
        return (
          <li key={f.day} className="relative flex items-start gap-3">
            <span
              className={cn(
                "relative w-[70px] shrink-0 rounded-full py-1 text-center font-mono text-[12px] ring-1 ring-inset transition-colors duration-300",
                on ? "bg-accent text-accent-fg ring-accent" : "bg-bg text-subtle ring-white/12",
              )}
            >
              {f.day}
            </span>
            <p
              className={cn(
                "min-w-0 flex-1 rounded-lg border px-3 py-2 text-[14px] transition-colors duration-300",
                on ? "border-accent/30 text-fg" : "border-border text-secondary",
              )}
            >
              <MessageCircle aria-hidden className="mr-1.5 inline size-3.5 -translate-y-px text-subtle" />
              {f.msg}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["10 AM", "12 PM", "2 PM", "4 PM"];
const taken = new Set(["Mon-10 AM", "Tue-2 PM", "Wed-12 PM", "Thu-4 PM", "Fri-10 AM", "Sun-12 PM"]);

function BookingPanel({ animate }: { animate: boolean }) {
  const [booked, setBooked] = useState(!animate);
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setBooked(true), 1600);
    return () => clearTimeout(t);
  }, [animate]);

  return (
    <div>
      <div className="grid grid-cols-[44px_repeat(7,minmax(0,1fr))] gap-1 text-center">
        <span />
        {days.map((d) => (
          <span key={d} className="pb-1 font-mono text-[11px] text-subtle">
            {d}
          </span>
        ))}
        {times.map((t) => (
          <div key={t} className="contents">
            <span className="flex items-center font-mono text-[11px] text-subtle">{t}</span>
            {days.map((d) => {
              const key = `${d}-${t}`;
              const target = key === "Sat-2 PM";
              return (
                <div
                  key={key}
                  className={cn(
                    "relative h-9 rounded-md border",
                    target
                      ? booked
                        ? "border-success bg-success/20"
                        : "border-accent bg-accent/20"
                      : taken.has(key)
                        ? "border-border bg-white/[0.06]"
                        : "border-border bg-surface",
                  )}
                >
                  {target && !booked ? (
                    <m.span
                      aria-hidden
                      className="absolute inset-0 rounded-md bg-accent/40"
                      animate={{ opacity: [0.2, 0.9, 0.2] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ) : null}
                  {target && booked ? <Check aria-hidden className="absolute inset-0 m-auto size-4 text-success-text" /> : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
        <div>
          <p className="text-[15px] text-fg">Viewing · Sarah Tan</p>
          <p className="text-[13px] text-secondary">Saturday, 2:00 PM</p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {booked ? (
            <m.span
              key="booked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-success px-3 py-1 text-[13px] font-medium text-success-fg"
            >
              Booked
              <Check aria-hidden className="size-3.5" />
            </m.span>
          ) : (
            <m.span key="pending" exit={{ opacity: 0 }} className="text-[13px] text-accent-text">
              Confirming…
            </m.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const rules = [
  { kind: "When", text: "a new enquiry arrives" },
  { kind: "Then", text: "assign" },
  { kind: "Then", text: "Day 1 follow-up" },
  { kind: "Then", text: "notify owner" },
];

function AutomationPanel() {
  return (
    <m.ol
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } } }}
      className="space-y-2.5"
    >
      {rules.map((r, i) => (
        <m.li
          key={r.text}
          variants={
            i === 0
              ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
              : { hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } } }
          }
          className={cn(
            "flex items-center gap-3 rounded-xl border px-4 py-3.5",
            i === 0 ? "border-accent/50 bg-accent/10" : "border-border bg-surface",
            i > 0 && "ml-4 sm:ml-6",
          )}
        >
          <span
            className={cn(
              "w-12 shrink-0 font-mono text-[12px] uppercase tracking-[0.1em]",
              i === 0 ? "text-accent-text" : "text-subtle",
            )}
          >
            {r.kind}
          </span>
          <span className="text-[15px] text-fg">{r.text}</span>
        </m.li>
      ))}
    </m.ol>
  );
}

const columns = ["New", "Contacted", "Viewing", "Closed"];
const others = ["Daniel", "Aisyah", "Kumar", "Mei Ling"];

function PipelinePanel({ animate }: { animate: boolean }) {
  const [col, setCol] = useState(animate ? 0 : 2);
  // Four columns in a 3s loop.
  useTicker(animate, 750, () => setCol((c) => (c + 1) % columns.length));

  return (
    <div className="relative">
      <div className="grid grid-cols-4">
        {columns.map((c, i) => (
          <div key={c} className="px-1">
            <p className="mb-2 flex h-6 items-center truncate font-mono text-[10px] uppercase tracking-[0.04em] text-subtle sm:text-[11px] sm:tracking-[0.08em]">
              {c}
            </p>
            <div className="space-y-1.5 rounded-lg bg-white/[0.02] p-1">
              {/* Reserved slot for the moving card. */}
              <div className="h-[52px]" />
              <div className="truncate rounded-md border border-border bg-surface px-2 py-2 text-[12px] text-secondary">
                {others[i]}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* The moving card: one column wide, so translating 100% moves it exactly one column. */}
      <m.div
        className="absolute left-0 top-9 w-1/4 px-2"
        animate={{ x: `${col * 100}%` }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div
          className={cn(
            "flex h-[52px] flex-col justify-center rounded-md border px-2 text-[12px] transition-colors duration-300",
            col === columns.length - 1 ? "border-success bg-success/15 text-fg" : "border-accent bg-accent/15 text-fg",
          )}
        >
          <p className="truncate font-medium">Sarah Tan</p>
          <p className="truncate text-[11px] text-secondary">Jason</p>
        </div>
      </m.div>
      <p className="mt-4 text-[14px] text-secondary">
        Stage: <span className="text-fg">{columns[col]}</span>
      </p>
    </div>
  );
}

const brief = [
  { icon: Inbox, text: "3 new leads overnight", tone: "text-accent-text" },
  { icon: CalendarCheck, text: "1 viewing confirmed", tone: "text-success-text" },
  { icon: Clock, text: "2 follow-ups due today", tone: "text-accent-text" },
];

function ReportingPanel() {
  return (
    <div className="mx-auto max-w-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[16px] font-semibold tracking-[-0.01em] text-fg">Daily brief</p>
        <span className="font-mono text-[12px] text-subtle">8:00 AM</span>
      </div>
      <m.ul
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2, delayChildren: 0.15 } } }}
        className="mt-4 space-y-2.5"
      >
        {brief.map((b) => (
          <m.li
            key={b.text}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } } }}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-fg"
          >
            <b.icon aria-hidden className={`size-4 shrink-0 ${b.tone}`} />
            {b.text}
          </m.li>
        ))}
      </m.ul>
    </div>
  );
}
