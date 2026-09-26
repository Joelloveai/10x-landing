"use client";

/**
 * The page's single scroll-linked experience.
 * Desktop with motion allowed: the product panel stays pinned while scroll moves through six stages.
 * Mobile and reduced motion: a vertical list driven by taps; the active stage opens its panel inline.
 * Guided focus: active stage = full opacity + blue halo, previous = 75%, future = 65%.
 * PRODUCT DEMO STATES: all data is fictional.
 */

import { useRef, useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { CalendarDays, Check, Clock, RotateCcw } from "lucide-react";
import { trackOnce } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/scroll";

const stages = [
  { num: "01", title: "Capture", text: "Every enquiry enters the workflow, with an owner.", state: "Lead arrives" },
  { num: "02", title: "Respond", text: "The first reply happens while the lead is still interested.", state: "Response" },
  { num: "03", title: "Qualify", text: "Budget, needs and timing, captured before the call.", state: "Qualification" },
  { num: "04", title: "Book", text: "Interest becomes an appointment on the calendar.", state: "Booking" },
  { num: "05", title: "Follow up", text: "Day 1, 3, 7 and 30. Scheduled, not remembered.", state: "Follow-up" },
  { num: "06", title: "Reactivate", text: "Old opportunities come back into the pipeline.", state: "Reactivation" },
] as const;

const DESKTOP_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export function ProductStory() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  const activate = (i: number) => {
    setActive((cur) => (cur === i ? cur : i));
    trackOnce("workflow_stage_changed", { stage: stages[i]!.title }, `stage_${i}`);
  };

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    activate(Math.min(stages.length - 1, Math.max(0, Math.floor(p * stages.length))));
  });

  const go = (i: number) => {
    const el = trackRef.current;
    if (el && window.matchMedia(DESKTOP_QUERY).matches) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const scrollable = el.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: top + ((i + 0.5) / stages.length) * scrollable,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }
    activate(i);
  };

  return (
    <div ref={trackRef} className="relative lg:motion-safe:h-[330vh]">
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-dvh lg:motion-safe:items-start lg:motion-safe:pt-[calc(var(--nav-h)+48px)]">
        <div className="container-x grid w-full grid-cols-1 gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-14">
          {/* Stage list: vertical on every size */}
          <div className="relative min-w-0">
            <span aria-hidden className="absolute bottom-4 left-[15px] top-4 w-px bg-border" />
            <m.span
              aria-hidden
              style={{ scaleY: scrollYProgress }}
              className="absolute bottom-4 left-[15px] top-4 hidden w-px origin-top bg-accent shadow-[0_0_8px_rgb(37_99_235/0.7)] lg:motion-safe:block"
            />
            <ol aria-label="Workflow stages" className="relative flex flex-col">
              {stages.map((s, i) => {
                const isActive = i === active;
                const isPast = i < active;
                return (
                  <li
                    key={s.num}
                    className={cn(
                      "transition-opacity duration-500",
                      isActive ? "opacity-100" : isPast ? "opacity-75" : "opacity-65",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={isActive ? "step" : undefined}
                      aria-expanded={isActive}
                      className="flex w-full items-start gap-4 rounded-xl py-3 text-left"
                    >
                      <span
                        className={cn(
                          "relative z-10 flex size-[31px] shrink-0 items-center justify-center rounded-full border bg-bg font-mono text-[11px] transition-all duration-500",
                          isActive
                            ? "halo border-accent text-accent-text"
                            : isPast
                              ? "border-accent/40 text-fg"
                              : "border-border text-fg",
                        )}
                      >
                        {s.num}
                      </span>
                      <span className="pt-1">
                        <span className="block text-[15px] font-medium uppercase tracking-[0.06em] text-fg">{s.title}</span>
                        <span
                          className={cn(
                            "block text-[16px] text-secondary transition-all duration-500",
                            isActive ? "mt-1.5 opacity-100" : "h-0 overflow-hidden opacity-0",
                          )}
                        >
                          {s.text}
                        </span>
                      </span>
                    </button>
                    {/* Mobile / reduced motion: the active stage opens its panel inline. */}
                    {isActive ? (
                      <div className="mb-4 mt-1 sm:pl-12 lg:motion-safe:hidden">
                        <PanelFrame active={active} compact />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Desktop product panel */}
          <div className="hidden min-w-0 lg:motion-safe:block">
            <PanelFrame active={active} />
            <p className="mt-3 text-[13px] text-secondary">Illustrative product demo with fictional data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelFrame({ active, compact }: { active: number; compact?: boolean }) {
  const stage = stages[active]!;
  return (
    <div className="halo-soft overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0d0d0e] shadow-window">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#111112] px-4 py-2.5 sm:px-5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#2a2a2d]" />
          <span className="size-2.5 rounded-full bg-[#2a2a2d]" />
          <span className="size-2.5 rounded-full bg-[#2a2a2d]" />
        </div>
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg">
          <span aria-hidden className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(37_99_235/0.9)]" />
          {stage.state}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Illustrative</span>
      </div>
      <div className={cn("relative p-4 sm:p-6", compact ? "h-[340px]" : "h-[420px]")}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <Panel index={active} />
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const rise = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.05 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
});

function Panel({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <IncomingLeads />;
    case 1:
      return <Conversation />;
    case 2:
      return <Qualification />;
    case 3:
      return <Booking />;
    case 4:
      return <FollowUp />;
    default:
      return <Pipeline />;
  }
}

function IncomingLeads() {
  const leads = [
    { name: "Sarah Tan", src: "Listing form", time: "11:42 PM", owner: "Jason" },
    { name: "Daniel Lim", src: "Website", time: "11:15 PM", owner: "Aina" },
    { name: "Aisyah Rahman", src: "Booking page", time: "9:03 PM", owner: "Jason" },
    { name: "Kumar S.", src: "Added by team", time: "7:48 PM", owner: "Wei Jie" },
  ];
  return (
    <div className="flex h-full flex-col" aria-hidden>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[15px] font-medium">New enquiries</p>
        <p className="font-mono text-[12px] text-secondary">4 new · 4 with an owner</p>
      </div>
      <div className="space-y-2">
        {leads.map((l, i) => (
          <m.div key={l.name} {...rise(i)} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 sm:px-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-[11px] font-semibold">
              {l.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium">{l.name}</p>
              <p className="truncate text-[12px] text-secondary">{l.src}</p>
            </div>
            <span className="hidden rounded-full px-2 py-0.5 text-[12px] text-secondary ring-1 ring-inset ring-white/10 sm:inline">
              {l.owner}
            </span>
            <span className="font-mono text-[11px] text-subtle">{l.time}</span>
          </m.div>
        ))}
      </div>
    </div>
  );
}

function Conversation() {
  return (
    <div className="flex h-full flex-col" aria-hidden>
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div>
          <p className="text-[15px] font-medium">Sarah Tan</p>
          <p className="text-[12px] text-secondary">Owner: Jason</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 font-mono text-[11px] text-success-text">
          <Clock className="size-3" /> First reply · 4 min
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-3">
        <m.div {...rise(0)} className="max-w-[80%] self-start rounded-2xl rounded-bl-md bg-white/[0.07] px-4 py-2.5 text-[14px]">
          Hi, is this unit still available?
        </m.div>
        <m.div {...rise(1)} className="max-w-[80%] self-end rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-[14px] text-accent-fg">
          Hi Sarah, yes. I can help check availability.
        </m.div>
        <m.div {...rise(2)} className="max-w-[80%] self-start rounded-2xl rounded-bl-md bg-white/[0.07] px-4 py-2.5 text-[14px]">
          Great. Can view this weekend?
        </m.div>
        <m.p {...rise(3)} className="self-end font-mono text-[11px] text-subtle">
          Jason is typing…
        </m.p>
      </div>
    </div>
  );
}

function Qualification() {
  const fields = [
    { k: "Budget", v: "RM700k" },
    { k: "Area", v: "Mont Kiara, KL" },
    { k: "Timeline", v: "This month" },
    { k: "Purpose", v: "Own stay" },
  ];
  return (
    <div className="flex h-full flex-col" aria-hidden>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[15px] font-medium">Qualification · Sarah Tan</p>
        <m.span {...rise(4)} className="rounded-full bg-accent/15 px-2.5 py-1 font-mono text-[11px] text-accent-text">
          Qualified
        </m.span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {fields.map((f, i) => (
          <m.div key={f.k} {...rise(i)} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="flex items-center gap-1.5 text-[12px] text-secondary">
              <Check className="size-3.5 text-success-text" /> {f.k}
            </p>
            <p className="mt-1.5 text-[15px] font-medium">{f.v}</p>
          </m.div>
        ))}
      </div>
    </div>
  );
}

function Booking() {
  const days = ["Wed", "Thu", "Fri", "Sat", "Sun"];
  const slots = ["10:00", "11:00", "2:00", "4:00"];
  return (
    <div className="flex h-full flex-col" aria-hidden>
      <div className="mb-4 flex items-center justify-between">
        <p className="flex items-center gap-2 text-[15px] font-medium">
          <CalendarDays className="size-4 text-secondary" /> Jason&apos;s calendar
        </p>
        <span className="font-mono text-[12px] text-secondary">This week</span>
      </div>
      <div className="grid flex-1 grid-cols-5 gap-1.5">
        {days.map((d, di) => (
          <div key={d} className="flex flex-col gap-1.5">
            <p className="text-center font-mono text-[11px] text-secondary">{d}</p>
            {slots.map((s, si) => {
              const booked = d === "Sat" && s === "2:00";
              const busy = (di + si) % 3 === 0 && !booked;
              return (
                <m.div
                  key={s}
                  {...rise(di * 0.5 + si * 0.3)}
                  className={cn(
                    "flex flex-1 items-center justify-center rounded-md text-[11px]",
                    booked ? "bg-success text-success-fg" : busy ? "bg-white/[0.06] text-subtle" : "border border-dashed border-white/[0.08] text-subtle",
                  )}
                >
                  {booked ? "2:00 PM" : busy ? "Busy" : s}
                </m.div>
              );
            })}
          </div>
        ))}
      </div>
      <m.div {...rise(6)} className="mt-4 flex items-center justify-between rounded-xl border border-success/30 bg-success/[0.07] px-4 py-3">
        <div>
          <p className="text-[14px] font-medium">Viewing · Sarah Tan</p>
          <p className="text-[12px] text-secondary">Saturday, 2:00 PM · with Jason</p>
        </div>
        <Check className="size-4 text-success-text" />
      </m.div>
    </div>
  );
}

function FollowUp() {
  const items = [
    { d: "Day 1", t: "Thank Sarah, share viewing details", s: "Done" },
    { d: "Day 3", t: "Send two similar units", s: "Due today" },
    { d: "Day 7", t: "Check financing progress", s: "Scheduled" },
    { d: "Day 30", t: "Reconnect if still searching", s: "Scheduled" },
  ];
  return (
    <div className="flex h-full flex-col" aria-hidden>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[15px] font-medium">Follow-up · Sarah Tan</p>
        <span className="font-mono text-[12px] text-secondary">Owner: Jason</span>
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <m.div key={it.d} {...rise(i)} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
            <span className="w-14 shrink-0 font-mono text-[12px] text-secondary">{it.d}</span>
            <span className="min-w-0 flex-1 truncate text-[14px]">{it.t}</span>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 font-mono text-[11px]",
                it.s === "Done" ? "bg-success/10 text-success-text" : it.s === "Due today" ? "bg-accent/15 text-accent-text" : "text-secondary ring-1 ring-inset ring-white/10",
              )}
            >
              {it.s}
            </span>
          </m.div>
        ))}
      </div>
    </div>
  );
}

function Pipeline() {
  const cols = [
    { name: "Cold", cards: ["Chong W."], ghost: true },
    { name: "Contacted", cards: ["Mei Ling Ong", "Kumar S."], reactivated: "Mei Ling Ong" },
    { name: "Viewing", cards: ["Sarah Tan", "Daniel Lim"] },
    { name: "Offer", cards: ["Aisyah R."] },
  ];
  return (
    <div className="flex h-full flex-col" aria-hidden>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[15px] font-medium">Pipeline</p>
        <span className="flex items-center gap-1.5 font-mono text-[12px] text-accent-text">
          <RotateCcw className="size-3.5" /> 1 reactivated
        </span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
        {cols.map((c, ci) => (
          <div key={c.name} className="flex flex-col gap-2 rounded-xl bg-white/[0.025] p-2">
            <p className="px-1 font-mono text-[11px] uppercase tracking-[0.08em] text-secondary">{c.name}</p>
            {c.ghost ? <div className="h-12 rounded-lg border border-dashed border-accent/30" /> : null}
            {c.cards.map((card, i) => {
              const hl = "reactivated" in c && c.reactivated === card;
              return (
                <m.div
                  key={card}
                  {...(hl ? { initial: { opacity: 0, x: -24 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] } } : rise(ci + i))}
                  className={cn(
                    "rounded-lg border p-2.5",
                    hl ? "border-accent/50 bg-accent/10" : "border-white/[0.07] bg-elevated",
                  )}
                >
                  <p className="truncate text-[13px] font-medium">{card}</p>
                  {hl ? <p className="mt-0.5 font-mono text-[10px] text-accent-text">Reactivated</p> : null}
                </m.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
