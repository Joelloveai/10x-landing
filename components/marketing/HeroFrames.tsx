import { cn } from "@/lib/utils";

/**
 * Four illustrative product screens for the hero. Built in JSX, not screenshots.
 * All names and numbers are fictional. The AI drafts; nothing here is sent automatically.
 */

function FrameHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <p className="flex items-center gap-2 border-b border-border px-4 py-3 text-[13px] font-medium text-fg sm:px-5">
      {title}
      {meta ? <span className="ml-auto font-mono text-[11px] font-normal text-subtle">{meta}</span> : null}
    </p>
  );
}

const columns = [
  { name: "New", deals: [{ t: "3-bed condo, Mont Kiara", who: "Sarah T.", v: "RM 1.2M" }, { t: "Shoplot, Puchong", who: "Kevin L.", v: "RM 880k" }] },
  { name: "Contacted", deals: [{ t: "Terrace, Setia Alam", who: "Nurul A.", v: "RM 760k" }, { t: "Studio, Bangsar South", who: "Daniel W.", v: "RM 540k" }] },
  { name: "Viewing", deals: [{ t: "Semi-D, Kajang", who: "Ravi K.", v: "RM 1.5M" }] },
  { name: "Offer", deals: [{ t: "Condo, Cheras", who: "Mei Ling C.", v: "RM 690k" }] },
];

function PipelineFrame() {
  return (
    <div>
      <FrameHead title="Pipeline" meta="Property" />
      <div className="grid grid-cols-2 gap-3 p-4 sm:p-5 md:grid-cols-4">
        {columns.map((c) => (
          <div key={c.name} className="rounded-xl bg-white/[0.03] p-2.5">
            <p className="flex items-center justify-between px-1 pb-2 text-[12px] text-secondary">
              {c.name}
              <span className="font-mono text-[11px] text-subtle">{c.deals.length}</span>
            </p>
            <div className="space-y-2">
              {c.deals.map((d) => (
                <div key={d.t} className="rounded-lg border border-border bg-elevated p-2.5">
                  <p className="text-[13px] font-medium leading-snug text-fg">{d.t}</p>
                  <p className="mt-1 flex items-center justify-between text-[11px] text-subtle">
                    {d.who}
                    <span className="font-mono">{d.v}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhatsAppFrame() {
  return (
    <div>
      <FrameHead title="Sarah Tan" meta="WhatsApp" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-3.5 py-2.5 text-[14px] text-fg">
          Hi, is the Mont Kiara unit still available? Can I view it this week?
          <span className="mt-1 block font-mono text-[10px] text-subtle">11:02 PM</span>
        </div>
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm border border-dashed border-accent/50 bg-accent/[0.06] px-3.5 py-2.5 text-[14px] text-fg">
          Hi Sarah, yes it is still available. Would Saturday morning suit you for a viewing?
          <span className="mt-1 block text-right font-mono text-[10px] text-accent-text">Draft by Aisyah. Not sent.</span>
        </div>
        <div className="flex justify-end gap-2 text-[12px]">
          <span className="rounded-full border border-border px-3 py-1 text-secondary">Edit</span>
          <span className="rounded-full bg-accent px-3 py-1 font-medium text-accent-fg">Send</span>
        </div>
      </div>
    </div>
  );
}

function ChatFrame() {
  return (
    <div>
      <FrameHead title="Aiman" meta="Ask anything" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-white/[0.08] px-3.5 py-2.5 text-[14px] text-fg">
          How many leads came in this week?
        </div>
        <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/[0.04] px-3.5 py-3 text-[14px] text-fg">
          <p>14 new leads since Monday.</p>
          <ul className="mt-2 space-y-1 text-secondary">
            <li>9 came through WhatsApp</li>
            <li>5 came through the website</li>
            <li>3 have not had a reply yet</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const stats = [
  { label: "New leads", value: "14" },
  { label: "Open deals", value: "23" },
  { label: "Awaiting reply", value: "6" },
];
const bars = [40, 65, 35, 80, 55, 90, 70];
const days = ["M", "T", "W", "T", "F", "S", "S"];

function DashboardFrame() {
  return (
    <div>
      <FrameHead title="Your team this week" meta="Dashboard" />
      <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-[1fr_1.3fr]">
        <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-elevated p-3">
              <p className="text-[11px] text-subtle">{s.label}</p>
              <p className="mt-1 font-mono text-[22px] font-semibold text-fg">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-elevated p-3">
          <p className="text-[11px] text-subtle">Leads per day</p>
          <div className="mt-3 flex h-24 items-end gap-2">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <span className={cn("w-full rounded-sm", i === 5 ? "bg-accent" : "bg-white/15")} style={{ height: `${h}%` }} />
                <span className="font-mono text-[10px] text-subtle">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const frames = [
  { key: "pipeline", label: "Pipeline board with property deals", node: <PipelineFrame /> },
  { key: "whatsapp", label: "WhatsApp thread with a lead and a drafted reply", node: <WhatsAppFrame /> },
  { key: "chat", label: "AI chat answering a question", node: <ChatFrame /> },
  { key: "dashboard", label: "Dashboard", node: <DashboardFrame /> },
] as const;

/** Frames share one grid cell. CSS crossfades them, 2.5s each. Reduced motion freezes on the first. */
export function HeroFrames() {
  return (
    <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
      {frames.map((f, i) => (
        <div
          key={f.key}
          role={i === 0 ? "img" : undefined}
          aria-label={i === 0 ? "Product demo: pipeline board, WhatsApp thread, AI chat and dashboard" : undefined}
          aria-hidden={i === 0 ? undefined : true}
          className="hero-frame"
          style={{ animationDelay: `${i * 2.5}s` }}
        >
          {f.node}
        </div>
      ))}
    </div>
  );
}
