"use client";

/**
 * Chapter 05. One product window, six features and a compact before/after toggle.
 * All product UI is illustrative with fictional data.
 */

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  Clock,
  EyeOff,
  FileSpreadsheet,
  Inbox,
  MessageCircle,
  PhoneMissed,
  Repeat,
  SquareKanban,
  StickyNote,
  UserCheck,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { track } from "@/lib/analytics";
import { sectionIds } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { Reveal } from "@/components/ui/Reveal";

const features = [
  { key: "capture", icon: Inbox, name: "Lead Capture", line: "Every enquiry becomes trackable.", state: "New enquiry" },
  { key: "follow", icon: Repeat, name: "Follow-Up", line: "Important leads don't get forgotten.", state: "Day 1 / Day 3 / Day 7" },
  { key: "booking", icon: CalendarDays, name: "Booking", line: "Conversations become appointments.", state: "Calendar" },
  { key: "automation", icon: WorkflowIcon, name: "Automation", line: "The next step moves forward on its own.", state: "Trigger → Action" },
  { key: "pipeline", icon: SquareKanban, name: "Pipeline", line: "See ownership and progress.", state: "New → Qualified → Booked → Closed" },
  { key: "reporting", icon: BarChart3, name: "Reporting", line: "See where enquiries become customers.", state: "Enquiries → Appointments → Outcomes" },
] as const;

export function ProductFeatures() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const f = features[active]!;

  const select = (i: number, focus = false) => {
    if (i !== active) track("product_feature_selected", { feature: features[i]!.key });
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = features.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      select(next, true);
    }
  };

  return (
    <section id={sectionIds.product} data-chapter aria-labelledby="product-title" className="border-t border-border py-24 md:py-32">
      <div className="container-x">
        <ChapterHeader
          num="05"
          label="Product & proof"
          id="product-title"
          title="Built around the work your team already does."
        />

        <Reveal className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Product features"
            className="-mx-5 flex gap-2 overflow-x-auto scrollbar-none px-5 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
          >
            {features.map((item, i) => {
              const selected = i === active;
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`feature-tab-${item.key}`}
                  aria-selected={selected}
                  aria-controls="feature-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    "flex shrink-0 items-start gap-3 rounded-xl px-4 py-3 text-left transition-[background-color,box-shadow,opacity] duration-300",
                    selected ? "halo bg-accent/[0.07]" : "opacity-70 ring-1 ring-inset ring-white/[0.06] hover:opacity-100 lg:ring-0",
                  )}
                >
                  <Icon className={cn("mt-0.5 size-4 shrink-0", selected ? "text-accent-text" : "text-secondary")} aria-hidden />
                  <span>
                    <span className="block whitespace-nowrap text-[15px] font-medium">{item.name}</span>
                    <span className="hidden text-[14px] text-secondary lg:block">{item.line}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="feature-panel"
            aria-labelledby={`feature-tab-${f.key}`}
            tabIndex={0}
            className="halo-soft min-w-0 overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0d0d0e] focus-visible:outline-offset-4"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#111112] px-5 py-2.5">
              <span className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-fg">{f.state}</span>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Illustrative</span>
            </div>
            <p className="px-5 pt-4 text-[15px] text-secondary lg:hidden">{f.line}</p>
            <div className="h-[320px] p-5 sm:p-6">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={f.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                  aria-hidden
                >
                  <FeatureUI k={f.key} />
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        <BeforeAfter />


        <Reveal>
          <p className="mt-10 text-center text-[14px] text-secondary">
            Measured customer stories will be published as verified results become available.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function FeatureUI({ k }: { k: (typeof features)[number]["key"] }) {
  switch (k) {
    case "capture":
      return <CaptureUI />;
    case "follow":
      return <FollowUI />;
    case "booking":
      return <BookingUI />;
    case "automation":
      return <AutomationUI />;
    case "pipeline":
      return <PipelineUI />;
    default:
      return <ReportUI />;
  }
}

function CaptureUI() {
  const rows = [
    { name: "Sarah Tan", src: "Listing form", time: "11:42 PM", isNew: true },
    { name: "Mrs. Wong", src: "Website form", time: "9:40 PM", isNew: true },
    { name: "Aircon service", src: "Booking page", time: "8:12 PM" },
    { name: "Jess L.", src: "Added by team", time: "6:55 PM" },
  ];
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div
          key={r.name}
          className={cn(
            "flex items-center gap-3 rounded-xl border px-3.5 py-3",
            i === 0 ? "border-accent/40 bg-accent/[0.06]" : "border-white/[0.06] bg-white/[0.02]",
          )}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-[11px] font-semibold">
            {r.name.split(" ").map((p) => p[0]!.toUpperCase()).slice(0, 2).join("")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-medium">{r.name}</p>
            <p className="truncate text-[12px] text-secondary">{r.src}</p>
          </div>
          {r.isNew ? (
            <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] text-accent-text">NEW</span>
          ) : null}
          <span className="font-mono text-[11px] text-subtle">{r.time}</span>
        </div>
      ))}
    </div>
  );
}

function FollowUI() {
  const items = [
    { d: "Day 1", t: "Share viewing details", s: "Done", c: "text-success-text" },
    { d: "Day 3", t: "Send two similar units", s: "Due today", c: "text-accent-text" },
    { d: "Day 7", t: "Check on financing", s: "Scheduled", c: "text-secondary" },
    { d: "Day 30", t: "Reconnect if still searching", s: "Scheduled", c: "text-secondary" },
  ];
  return (
    <div>
      <p className="mb-3 text-[14px] font-medium">
        Sarah Tan <span className="font-normal text-secondary">· Owner: Jason</span>
      </p>
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.d} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
            <span className="w-14 shrink-0 font-mono text-[12px] text-secondary">{it.d}</span>
            <span className="min-w-0 flex-1 truncate text-[14px]">{it.t}</span>
            <span className={cn("shrink-0 font-mono text-[11px]", it.c)}>{it.s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingUI() {
  const days = ["Wed", "Thu", "Fri", "Sat", "Sun"];
  const slots = ["10:00", "11:00", "2:00", "4:00"];
  return (
    <div className="flex h-full flex-col">
      <p className="mb-3 flex items-center gap-2 text-[14px] font-medium">
        <CalendarDays className="size-4 text-secondary" /> Jason&apos;s calendar
      </p>
      <div className="grid flex-1 grid-cols-5 gap-1.5">
        {days.map((d, di) => (
          <div key={d} className="flex flex-col gap-1.5">
            <p className="text-center font-mono text-[11px] text-secondary">{d}</p>
            {slots.map((s, si) => {
              const booked = d === "Sat" && s === "2:00";
              const busy = (di + si) % 3 === 0 && !booked;
              return (
                <div
                  key={s}
                  className={cn(
                    "flex flex-1 items-center justify-center rounded-md text-[11px]",
                    booked
                      ? "bg-success text-success-fg"
                      : busy
                        ? "bg-white/[0.06] text-subtle"
                        : "border border-dashed border-white/[0.08] text-subtle",
                  )}
                >
                  {booked ? "Booked" : busy ? "Busy" : s}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function AutomationUI() {
  const steps = [
    { k: "When", v: "A new enquiry arrives" },
    { k: "Then", v: "Assign to the next available team member" },
    { k: "Then", v: "Create a Day 1 follow-up" },
    { k: "Then", v: "Notify the owner" },
  ];
  return (
    <ol className="relative space-y-2">
      <span aria-hidden className="absolute bottom-6 left-[27px] top-6 w-px bg-accent/40" />
      {steps.map((s, i) => (
        <li
          key={i}
          className={cn(
            "relative flex items-center gap-3 rounded-xl border px-3.5 py-3",
            i === 0 ? "border-accent/40 bg-accent/[0.06]" : "border-white/[0.06] bg-elevated",
          )}
        >
          <span className="w-10 shrink-0 font-mono text-[11px] uppercase text-accent-text">{s.k}</span>
          <span className="min-w-0 flex-1 truncate text-[14px]">{s.v}</span>
        </li>
      ))}
    </ol>
  );
}

function PipelineUI() {
  const cols = [
    { name: "New", cards: ["Sarah Tan", "Mrs. Wong"] },
    { name: "Qualified", cards: ["Daniel Lim"] },
    { name: "Booked", cards: ["Aisyah R.", "Jess L."] },
    { name: "Closed", cards: ["Kumar S."], done: true },
  ];
  return (
    <div className="grid h-full grid-cols-2 gap-2 sm:grid-cols-4">
      {cols.map((c) => (
        <div key={c.name} className="flex flex-col gap-2 rounded-xl bg-white/[0.025] p-2">
          <p className="px-1 font-mono text-[11px] uppercase tracking-[0.08em] text-secondary">{c.name}</p>
          {c.cards.map((card) => (
            <div key={card} className="rounded-lg border border-white/[0.07] bg-elevated p-2.5">
              <p className="truncate text-[13px] font-medium">{card}</p>
              {c.done ? <p className="mt-0.5 font-mono text-[10px] text-success-text">Won</p> : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ReportUI() {
  const stages = [
    { k: "Enquiries", w: 100 },
    { k: "Appointments", w: 58 },
    { k: "Outcomes", w: 34 },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      {stages.map((s, i) => (
        <div key={s.k}>
          <p className="mb-1.5 text-[13px] text-secondary">{s.k}</p>
          <div className="h-8 rounded-lg bg-white/[0.03]">
            <div
              className={cn("h-full rounded-lg", i === stages.length - 1 ? "bg-accent/70" : "bg-white/[0.12]")}
              style={{ width: `${s.w}%` }}
            />
          </div>
        </div>
      ))}
      <p className="font-mono text-[10px] text-subtle">Illustrative shape, not real data</p>
    </div>
  );
}

const before = [
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: StickyNote, label: "Notes" },
  { icon: FileSpreadsheet, label: "Spreadsheets" },
  { icon: PhoneMissed, label: "Missed calls" },
  { icon: Bell, label: "Manual reminders" },
  { icon: EyeOff, label: "No visibility" },
];
const after = [
  { icon: Inbox, label: "Captured" },
  { icon: UserCheck, label: "Assigned" },
  { icon: MessageCircle, label: "Responded" },
  { icon: CalendarDays, label: "Booked" },
  { icon: Clock, label: "Followed up" },
  { icon: Check, label: "Visible" },
];

/** Compact before/after inside the product chapter. */
function BeforeAfter() {
  const [withTenx, setWithTenx] = useState(true);
  const items = withTenx ? after : before;
  return (
    <Reveal className="mt-4 flex flex-col gap-5 rounded-2xl border border-border p-5 sm:p-6 lg:flex-row lg:items-center">
      <div role="group" aria-label="Compare" className="inline-flex shrink-0 self-start rounded-full border border-border bg-surface p-1 lg:self-center">
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
              "rounded-full px-4 py-1.5 text-[14px] transition-colors",
              withTenx === opt.v ? (opt.v ? "bg-accent text-accent-fg" : "bg-white/[0.08] text-fg") : "text-secondary hover:text-fg",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <ul className="flex flex-1 flex-wrap items-center gap-x-1.5 gap-y-2" aria-live="polite">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <li key={`${withTenx}-${it.label}`} className="flex items-center gap-1.5">
              <m.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[14px]",
                  withTenx ? "bg-white/[0.05] text-fg" : "border border-dashed border-white/[0.12] text-secondary",
                )}
              >
                <Icon className={cn("size-3.5", withTenx ? "text-accent-text" : "text-warning-text")} aria-hidden />
                {it.label}
              </m.span>
              {withTenx && i < items.length - 1 ? <ArrowRight aria-hidden className="size-3 text-subtle" /> : null}
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
