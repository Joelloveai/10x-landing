"use client";

/**
 * The page's single scroll-linked experience.
 * Desktop with motion allowed: the product panel stays pinned while scroll moves through six stages.
 * Mobile and reduced motion: the same content, driven by taps instead of scroll.
 * PRODUCT CONCEPT / DEMO STATES: all data is fictional.
 */

import { useRef, useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { CalendarDays, Check, Clock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/scroll";

const stages = [
  { num: "01", title: "Capture", text: "Every enquiry enters the workflow.", state: "Incoming leads" },
  {
    num: "02",
    title: "Respond",
    text: "The next response happens quickly.",
    state: "Lead conversation",
    note: "Sending replies through WhatsApp is integration-dependent.",
  },
  { num: "03", title: "Qualify", text: "Ask the right questions.", state: "Qualification" },
  { num: "04", title: "Book", text: "Turn interest into an appointment.", state: "Booking" },
  {
    num: "05",
    title: "Follow up",
    text: "Don't rely on memory.",
    state: "Follow-up",
    note: "Automated follow-up messages depend on messaging integrations.",
  },
  { num: "06", title: "Reactivate", text: "Bring old opportunities back.", state: "Pipeline" },
] as const;

const DESKTOP_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export function StickyProductStory() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    const i = Math.min(stages.length - 1, Math.max(0, Math.floor(p * stages.length)));
    setActive((cur) => (cur === i ? cur : i));
  });

  const go = (i: number) => {
    const el = trackRef.current;
    if (el && window.matchMedia(DESKTOP_QUERY).matches) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const scrollable = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + ((i + 0.5) / stages.length) * scrollable, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
    setActive(i);
  };

  const stage = stages[active]!;

  return (
    <div ref={trackRef} className="relative lg:motion-safe:h-[460vh]">
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-dvh lg:motion-safe:items-start lg:motion-safe:pt-[calc(var(--nav-h)+40px)]">
        <div className="container-x grid w-full gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-14">
          {/* Stage list */}
          <div className="min-w-0">
            <div className="relative">
              <span aria-hidden className="absolute bottom-3 left-[15px] top-3 hidden w-px bg-border lg:block" />
              <m.span
                aria-hidden
                style={{ scaleY: scrollYProgress }}
                className="absolute bottom-3 left-[15px] top-3 hidden w-px origin-top bg-accent lg:motion-safe:block"
              />
            <ol aria-label="Workflow stages" className="flex gap-2 overflow-x-auto scrollbar-none pb-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
              {stages.map((s, i) => {
                const isActive = i === active;
                return (
                  <li key={s.num} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "flex items-center gap-2 rounded-full px-3.5 py-2 text-left text-[14px] ring-1 ring-inset transition-colors lg:w-full lg:items-start lg:gap-4 lg:rounded-xl lg:px-0 lg:py-3 lg:ring-0",
                        isActive ? "bg-white/[0.06] text-fg ring-white/15 lg:bg-transparent" : "text-secondary ring-white/[0.08] hover:text-fg",
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[11px] lg:relative lg:z-10 lg:flex lg:size-[31px] lg:shrink-0 lg:items-center lg:justify-center lg:rounded-full lg:border lg:bg-bg",
                          isActive ? "text-accent-text lg:border-accent" : "lg:border-border",
                        )}
                      >
                        {s.num}
                      </span>
                      <span className="lg:pt-1">
                        <span className="block font-medium uppercase tracking-[0.06em] lg:text-[15px]">{s.title}</span>
                        <span
                          className={cn(
                            "hidden text-[16px] normal-case tracking-normal text-secondary transition-opacity lg:block",
                            isActive ? "lg:mt-1.5 lg:opacity-100" : "lg:h-0 lg:overflow-hidden lg:opacity-0",
                          )}
                        >
                          {s.text}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            </div>
            {/* Mobile description */}
            <div className="mt-5 lg:hidden" aria-live="polite">
              <p className="text-title">{stage.title}</p>
              <p className="mt-1 text-[16px] text-secondary">{stage.text}</p>
            </div>
          </div>

          {/* Product panel */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0d0d0e] shadow-window">
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#111112] px-4 py-2.5 sm:px-5">
                <div className="flex gap-1.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-[#2a2a2d]" />
                  <span className="size-2.5 rounded-full bg-[#2a2a2d]" />
                  <span className="size-2.5 rounded-full bg-[#2a2a2d]" />
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <m.span
                    key={stage.state}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="font-mono text-[11px] uppercase tracking-[0.12em] text-secondary"
                  >
                    {stage.state}
                  </m.span>
                </AnimatePresence>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Illustrative</span>
              </div>
              <div className="relative h-[380px] p-4 sm:h-[420px] sm:p-6">
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={active}
                    initial={{ opacity: 0, y: 16, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full"
                  >
                    <Panel index={active} />
                  </m.div>
                </AnimatePresence>
              </div>
            </div>
            <p className="mt-3 min-h-[20px] text-[13px] text-secondary">
              {"note" in stage ? stage.note : "Illustrative product demo with fictional data."}
            </p>
          </div>
        </div>
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
    { k: "Budget", v: "RM600k–RM700k" },
    { k: "Area", v: "Mont Kiara, KL" },
    { k: "Timeline", v: "Within 3 months" },
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
                    booked ? "bg-success text-accent-fg" : busy ? "bg-white/[0.06] text-subtle" : "border border-dashed border-white/[0.08] text-subtle",
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
