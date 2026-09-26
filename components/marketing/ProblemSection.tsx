import { ArrowRight, CalendarClock, MessageCircle, PhoneMissed } from "lucide-react";
import { verticalBySlug, type Vertical, type VerticalSlug } from "@/lib/verticals";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const leaks = [
  "nobody replied",
  "nobody followed up",
  "nobody knew who owned it",
  "nobody booked the appointment",
  "the customer forgot",
  "the team missed a call",
  "the lead went cold",
  "management couldn't see what happened",
];

export function ProblemSection() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="py-28 md:py-40">
      <div className="container-x">
        <SectionHeader
          id="problem-title"
          eyebrow="The problem"
          title={
            <>
              Your leads don&apos;t disappear.
              <br className="hidden sm:block" /> <span className="text-secondary">They leak.</span>
            </>
          }
          lead="A lead can be lost before the customer ever says no."
          width="max-w-5xl"
        />

        <Reveal className="mt-10">
          <ul aria-label="Common reasons a lead leaks" className="flex flex-wrap gap-2">
            {leaks.map((l) => (
              <li
                key={l}
                className="rounded-full border border-border px-3 py-1.5 text-[14px] text-secondary"
              >
                <span aria-hidden className="mr-1.5 inline-block size-1.5 -translate-y-px rounded-full bg-warning/80" />
                {l}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          <Scenario slug="property" wide />
          <Scenario slug="aesthetic" />
          <Scenario slug="dental" />
          <Scenario slug="home-services" />
        </div>
      </div>
    </section>
  );
}

function Scenario({ slug, wide }: { slug: VerticalSlug; wide?: boolean }) {
  const v = verticalBySlug[slug];
  return (
    <Reveal
      as="article"
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-surface",
        wide && "lg:col-span-3 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]",
      )}
    >
      <div className={cn("flex flex-1 flex-col p-6 sm:p-8", wide && "lg:p-10")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow text-fg">{v.label}</p>
          <p className="font-mono text-[12px] text-secondary">
            {v.valueLabel} <span className="text-fg">{v.valueRange}</span>
          </p>
        </div>
        <h3 className={cn("mt-6 text-balance font-semibold tracking-[-0.025em]", wide ? "text-[clamp(1.5rem,1rem+1.8vw,2.5rem)] leading-[1.1]" : "text-[22px] leading-tight")}>
          {v.scene[0]}
        </h3>
        <p className={cn("mt-2 text-warning-text", wide ? "text-[18px]" : "text-[16px]")}>{v.scene[1]}</p>
        {wide ? <p className="mt-4 max-w-md text-[16px] text-secondary">{v.problem}</p> : null}
        <Workflow v={v} className="mt-auto pt-8" />
      </div>
      <div className={cn("border-t border-border bg-[#0d0d0e] p-5 sm:p-6", wide && "lg:border-l lg:border-t-0 lg:p-10")}>
        <SceneVisual slug={slug} />
      </div>
    </Reveal>
  );
}

function Workflow({ v, className }: { v: Vertical; className?: string }) {
  return (
    <ol aria-label={`${v.name} workflow`} className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-2", className)}>
      {v.workflow.map((w, i) => (
        <li key={w.stage} className="flex items-center gap-1.5">
          <span className="rounded-md bg-white/[0.05] px-2 py-1 font-mono text-[12px] text-secondary">{w.stage}</span>
          {i < v.workflow.length - 1 ? <ArrowRight aria-hidden className="size-3 text-subtle" /> : null}
        </li>
      ))}
    </ol>
  );
}

/** Small, fictional scenes. Decorative, described by the surrounding copy. */
function SceneVisual({ slug }: { slug: VerticalSlug }) {
  if (slug === "property") {
    const items = [
      { t: "11:42 PM", msg: "Hi, is this unit still available?" },
      { t: "11:58 PM", msg: "Can view this weekend?" },
      { t: "12:20 AM", msg: "What's the maintenance fee?" },
    ];
    return (
      <div aria-hidden className="space-y-2.5">
        <div className="mb-4 flex items-center justify-between font-mono text-[11px] text-subtle">
          <span>After hours</span>
          <span>3 unread</span>
        </div>
        {items.map((it) => (
          <div
            key={it.t}
            className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"
          >
            <span className="mt-1 size-2 shrink-0 rounded-full bg-warning" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-medium">New enquiry</span>
                <span className="font-mono text-[11px] text-subtle">{it.t}</span>
              </div>
              <p className="truncate text-[13px] text-secondary">{it.msg}</p>
            </div>
            <span className="shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] text-warning-text ring-1 ring-inset ring-warning/40">
              No owner
            </span>
          </div>
        ))}
      </div>
    );
  }
  if (slug === "aesthetic") {
    const msgs = ["Can book tmr 3pm?", "Price for pico laser?", "Still got slot Sat?", "Hi, follow up on my booking"];
    return (
      <div aria-hidden className="relative">
        <div className="mb-3 flex items-center gap-2 text-[12px] text-secondary">
          <MessageCircle className="size-3.5" />
          Booking requests
          <span className="ml-auto rounded-full bg-warning/15 px-2 py-0.5 font-mono text-[11px] text-warning-text">14 unreplied</span>
        </div>
        <div className="space-y-1.5">
          {msgs.map((msg, i) => (
            <div key={msg} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-[13px]" style={{ marginLeft: `${(i % 2) * 12}px` }}>
              <span className="truncate text-secondary">{msg}</span>
              <span className="ml-3 shrink-0 font-mono text-[10px] text-subtle">{["10:02", "10:04", "10:05", "10:09"][i]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (slug === "dental") {
    return (
      <div aria-hidden className="space-y-1.5">
        <div className="mb-3 flex items-center gap-2 text-[12px] text-secondary">
          <PhoneMissed className="size-3.5 text-warning-text" />
          Front desk · Tuesday
        </div>
        {["10:14 AM", "10:32 AM", "11:05 AM", "11:48 AM"].map((t) => (
          <div key={t} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-[13px]">
            <span className="text-secondary">Missed call</span>
            <span className="font-mono text-[11px] text-subtle">{t}</span>
          </div>
        ))}
        <p className="pt-2 font-mono text-[11px] text-subtle">Called back: 0 of 4</p>
      </div>
    );
  }
  return (
    <div aria-hidden className="space-y-2">
      <div className="mb-3 flex items-center gap-2 text-[12px] text-secondary">
        <CalendarClock className="size-3.5" />
        Today&apos;s jobs
      </div>
      {[
        { job: "Aircon service · Puchong", from: "2:00 PM", to: "4:30 PM" },
        { job: "Pipe leak · Cheras", from: "3:00 PM", to: "3:00 PM" },
      ].map((j, i) => (
        <div key={j.job} className="rounded-lg bg-white/[0.03] px-3 py-2.5 text-[13px]">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate">{j.job}</span>
            <span className="shrink-0 font-mono text-[11px] text-subtle">
              {i === 0 ? (
                <>
                  <s className="opacity-60">{j.from}</s> {j.to}
                </>
              ) : (
                j.to
              )}
            </span>
          </div>
          {i === 0 ? <p className="mt-1 font-mono text-[11px] text-warning-text">Rescheduled · customer not updated</p> : null}
        </div>
      ))}
    </div>
  );
}
