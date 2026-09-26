import type { ReactNode } from "react";
import { ArrowDown, CalendarDays, Globe, FileText, UserPlus } from "lucide-react";
import { sectionIds } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge, type Status } from "@/components/ui/StatusBadge";
import { TiltCard } from "@/components/ui/TiltCard";

export function FeatureShowcase() {
  return (
    <section id={sectionIds.product} aria-labelledby="product-title" className="border-t border-border py-28 md:py-40">
      <div className="container-x">
        <SectionHeader
          id="product-title"
          eyebrow="Product"
          title="The daily work, not a list of features."
          lead="Six parts of 10X your team will actually touch. Each one exists to stop a specific leak."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-6">
          <Module
            className="lg:col-span-4"
            label="Lead capture"
            title="Every enquiry becomes trackable."
            status="Available now"
          >
            <CaptureUI />
          </Module>
          <Module className="lg:col-span-2" label="Follow-up" title="Keep important leads from being forgotten." status="Available now">
            <FollowUI />
          </Module>
          <Module className="lg:col-span-2" label="Booking" title="Turn conversations into appointments." status="Available now">
            <BookingUI />
          </Module>
          <Module
            className="lg:col-span-4"
            label="Automation"
            title="Move the next step forward automatically."
            status="Integration-dependent"
            note="Automated steps are being rolled out. Message-sending steps depend on messaging integrations."
          >
            <AutomationUI />
          </Module>
          <Module className="lg:col-span-3" label="Team pipeline" title="See ownership and progress." status="Available now">
            <TeamUI />
          </Module>
          <Module
            className="lg:col-span-3"
            label="Reporting"
            title="Understand where opportunities become customers."
            status="Coming soon"
            note="Pipeline visibility is available now. Advanced reporting is coming soon."
          >
            <ReportUI />
          </Module>
        </div>
      </div>
    </section>
  );
}

function Module({
  label,
  title,
  status,
  note,
  className,
  children,
}: {
  label: string;
  title: string;
  status: Status;
  note?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Reveal as="article" className={cn("min-w-0", className)}>
      <TiltCard className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface hover:border-border-strong hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)]">
        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="eyebrow text-fg">{label}</h3>
            <StatusBadge status={status} />
          </div>
          <p className="mt-4 text-[22px] font-semibold leading-tight tracking-[-0.025em]">{title}</p>
          {note ? <p className="mt-2 text-[14px] text-secondary">{note}</p> : null}
        </div>
        <div className="mt-auto px-4 pb-4 sm:px-5 sm:pb-5" aria-hidden>
          <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0e] p-4">{children}</div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

function CaptureUI() {
  const sources = [
    { icon: FileText, label: "Listing form" },
    { icon: Globe, label: "Website" },
    { icon: CalendarDays, label: "Booking page" },
    { icon: UserPlus, label: "Added by team" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.1fr)] sm:items-center">
      <div className="flex flex-wrap gap-1.5 sm:flex-col">
        {sources.map(({ icon: Icon, label }) => (
          <span key={label} className="inline-flex items-center gap-2 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[12px] text-secondary">
            <Icon className="size-3.5" /> {label}
          </span>
        ))}
      </div>
      <ArrowDown className="mx-auto size-4 text-subtle sm:-rotate-90" />
      <div className="rounded-lg border border-white/[0.08] bg-elevated p-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium">Sarah Tan</span>
          <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] text-accent-text">NEW</span>
        </div>
        <div className="mt-2 space-y-1 font-mono text-[11px] text-secondary">
          <p>source: listing form</p>
          <p>owner: Jason</p>
          <p>received: 11:42 PM</p>
        </div>
      </div>
    </div>
  );
}

function FollowUI() {
  return (
    <div className="space-y-1.5">
      {[
        ["Day 1", "Done", "text-success-text"],
        ["Day 3", "Today", "text-accent-text"],
        ["Day 7", "Scheduled", "text-secondary"],
        ["Day 30", "Scheduled", "text-secondary"],
      ].map(([d, s, c]) => (
        <div key={d} className="flex items-center justify-between rounded-md bg-white/[0.03] px-3 py-2">
          <span className="font-mono text-[12px]">{d}</span>
          <span className={cn("font-mono text-[11px]", c)}>{s}</span>
        </div>
      ))}
    </div>
  );
}

function BookingUI() {
  return (
    <div>
      <p className="text-[12px] text-secondary">Pick a time · Saturday</p>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {["10:00", "11:00", "12:00", "2:00", "3:00", "4:00"].map((t) => (
          <span
            key={t}
            className={cn(
              "rounded-md py-1.5 text-center font-mono text-[11px]",
              t === "2:00" ? "bg-accent text-accent-fg" : "bg-white/[0.04] text-secondary",
            )}
          >
            {t}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-success-text">Viewing confirmed · 2:00 PM</p>
    </div>
  );
}

function AutomationUI() {
  const steps = [
    { k: "When", v: "New enquiry arrives", tone: "" },
    { k: "Then", v: "Assign to next available agent", tone: "" },
    { k: "Then", v: "Create Day 1 follow-up task", tone: "" },
    { k: "Then", v: "Send confirmation message", tone: "dep" },
  ];
  return (
    <ol className="relative space-y-2">
      {steps.map((s, i) => (
        <li key={i} className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
          <span className="w-10 shrink-0 font-mono text-[11px] uppercase text-subtle">{s.k}</span>
          <span className="min-w-0 flex-1 truncate text-[13px]">{s.v}</span>
          {s.tone === "dep" ? (
            <span className="shrink-0 font-mono text-[10px] text-secondary">integration</span>
          ) : (
            <span className="size-1.5 shrink-0 rounded-full bg-white/25" />
          )}
        </li>
      ))}
    </ol>
  );
}

function TeamUI() {
  const team = [
    { n: "Jason", open: 12, pct: 72 },
    { n: "Aina", open: 9, pct: 58 },
    { n: "Wei Jie", open: 7, pct: 40 },
  ];
  return (
    <div className="space-y-3">
      {team.map((t) => (
        <div key={t.n} className="flex items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-[11px] font-semibold">{t.n[0]}</span>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between text-[12px]">
              <span>{t.n}</span>
              <span className="font-mono text-secondary">{t.open} open</span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-accent/80" style={{ width: `${t.pct}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportUI() {
  const stages = [
    { k: "Enquiries", w: 100 },
    { k: "Replied", w: 82 },
    { k: "Qualified", w: 56 },
    { k: "Booked", w: 34 },
  ];
  return (
    <div className="space-y-2">
      {stages.map((s) => (
        <div key={s.k} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-[12px] text-secondary">{s.k}</span>
          <div className="h-5 flex-1 rounded bg-white/[0.03]">
            <div className="h-full rounded bg-white/[0.12]" style={{ width: `${s.w}%` }} />
          </div>
        </div>
      ))}
      <p className="pt-1 font-mono text-[10px] text-subtle">Illustrative shape, not real data</p>
    </div>
  );
}
