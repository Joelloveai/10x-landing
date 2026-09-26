"use client";

/**
 * AI employee. STATUS: rollout in progress, not generally live.
 * The chat is a PRODUCT CONCEPT preview with fictional data and is labelled as such.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "framer-motion";
import { Activity, Check, Gauge, ListChecks, ShieldCheck, UserCheck, Wallet } from "lucide-react";
import { track } from "@/lib/analytics";
import { productStatus } from "@/lib/site-config";
import { verticalBySlug, verticals } from "@/lib/verticals";
import { useReducedMotionPref } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useVertical } from "@/components/providers/VerticalProvider";
import { Reveal } from "@/components/ui/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function AIEmployee() {
  const { vertical, setVertical } = useVertical();
  const v = verticalBySlug[vertical];

  return (
    <section id="ai-employee" aria-labelledby="ai-title" className="py-28 md:py-40">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <p className="eyebrow">AI employee</p>
            <StatusBadge status="Rollout in progress" />
          </div>
          <h2 id="ai-title" className="text-display text-balance">
            Meet your AI employee. <span className="text-secondary">It never sleeps.</span>
          </h2>
          <p className="text-lead mt-5 text-secondary">
            It helps handle repetitive conversations, qualification and follow-up so your team can focus on customers.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div role="group" aria-label="Show AI employee for" className="flex flex-wrap gap-2">
            {verticals.map((item) => (
              <button
                key={item.slug}
                type="button"
                aria-pressed={item.slug === vertical}
                onClick={() => {
                  if (item.slug !== vertical) track("vertical_selected", { vertical: item.slug, location: "ai_employee" });
                  setVertical(item.slug);
                }}
                className={cn(
                  "rounded-full px-4 py-2 text-[14px] ring-1 ring-inset transition-colors",
                  item.slug === vertical ? "bg-white/[0.08] text-fg ring-white/20" : "text-secondary ring-white/10 hover:text-fg",
                )}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <ChatPreview key={v.slug} />
            <div className="flex flex-col rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <p className="text-[15px] font-medium">For {v.name.toLowerCase()} teams, it is being built to handle</p>
              <ul className="mt-5 space-y-3">
                {v.aiActions.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-[16px] text-secondary">
                    <Check className="mt-1 size-4 shrink-0 text-accent-text" aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
              {v.aiNote ? (
                <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-fg">{v.aiNote}</p>
              ) : null}
              <p className="mt-auto pt-6 text-[14px] text-secondary">
                It supports your team. It does not replace them.
              </p>
            </div>
          </div>
        </Reveal>

        <ControlPanel />
        <ProductTruth />
      </div>
    </section>
  );
}

function ChatPreview() {
  const { vertical } = useVertical();
  const v = verticalBySlug[vertical];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduced = useReducedMotionPref();
  const [shown, setShown] = useState(1);
  const total = v.demo.chat.length;

  useEffect(() => {
    if (reduced) {
      setShown(total);
      return;
    }
    if (!inView || shown >= total) return;
    const t = window.setTimeout(() => setShown((s) => s + 1), 1100);
    return () => window.clearTimeout(t);
  }, [inView, shown, total, reduced]);

  const nextIsAi = shown < total && v.demo.chat[shown]?.from === "ai";

  return (
    <figure ref={ref} className="overflow-hidden rounded-2xl border border-border bg-[#0d0d0e]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-accent/20 font-mono text-[10px] text-accent-text" aria-hidden>
            AI
          </span>
          <span className="text-[13px] font-medium">AI employee · {v.name}</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Concept preview</span>
      </div>
      <div className="flex min-h-[360px] flex-col justify-start gap-3 p-5">
        <AnimatePresence initial={false}>
          {v.demo.chat.slice(0, shown).map((msg, i) =>
            msg.from === "event" ? (
              <m.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center justify-center gap-2 self-center rounded-full px-3 py-1 text-center font-mono text-[11px]",
                  /escalat/i.test(msg.text) ? "bg-warning/10 text-warning-text" : "bg-white/[0.05] text-secondary",
                )}
              >
                {msg.text}
              </m.p>
            ) : (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
                  msg.from === "lead" ? "self-start rounded-bl-md bg-white/[0.07]" : "self-end rounded-br-md bg-accent/90 text-white",
                )}
              >
                {msg.text}
              </m.div>
            ),
          )}
        </AnimatePresence>
        {inView && nextIsAi && !reduced ? (
          <span className="flex gap-1 self-end rounded-full bg-white/[0.05] px-3 py-2" aria-hidden>
            {[0, 1, 2].map((d) => (
              <span key={d} className="size-1.5 animate-pulse rounded-full bg-secondary" style={{ animationDelay: `${d * 150}ms` }} />
            ))}
          </span>
        ) : null}
      </div>
      <figcaption className="border-t border-white/[0.06] px-5 py-3 text-[13px] text-secondary">
        Concept preview with fictional data. Not a live conversation.
      </figcaption>
    </figure>
  );
}

const controls = [
  { icon: ListChecks, title: "Permitted actions", body: "Choose what it may do: answer FAQs, offer slots, send reminders." },
  { icon: UserCheck, title: "Approval rules", body: "Pricing exceptions, discounts and sensitive replies wait for a person." },
  { icon: ShieldCheck, title: "Message review", body: "Review conversations before or after they go out." },
  { icon: Wallet, title: "Spending limits", body: "Cap monthly usage so costs never surprise you." },
  { icon: Gauge, title: "Usage tracking", body: "See how many conversations it handled and what they cost." },
  { icon: Activity, title: "Activity log", body: "Every action is recorded with time and outcome." },
];

function ControlPanel() {
  return (
    <div className="mt-24 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
      <Reveal>
        <h3 className="text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          You stay in control.
        </h3>
        <p className="text-lead mt-4 max-w-md text-secondary">
          The AI works inside rules you set. Anything sensitive can require your approval first.
        </p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {controls.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <p className="flex items-center gap-2 text-[15px] font-medium">
                <Icon className="size-4 text-secondary" aria-hidden />
                {title}
              </p>
              <p className="mt-1 text-[15px] text-secondary">{body}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={100}>
        {/* PRODUCT CONCEPT: settings UI preview. */}
        <figure className="overflow-hidden rounded-2xl border border-border bg-[#0d0d0e] shadow-window" aria-label="Concept preview of AI employee controls">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
            <span className="text-[13px] font-medium">AI employee · Controls</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Concept preview</span>
          </div>
          <div className="divide-y divide-white/[0.06]" aria-hidden>
            {[
              { k: "Answer pricing FAQs", on: true },
              { k: "Offer booking slots", on: true },
              { k: "Send quotations", on: false, tag: "Needs approval" },
              { k: "Offer discounts", on: false, tag: "Never" },
            ].map((r) => (
              <div key={r.k} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-[14px]">{r.k}</span>
                <span className="flex items-center gap-3">
                  {r.tag ? <span className="font-mono text-[11px] text-secondary">{r.tag}</span> : null}
                  <span className={cn("relative h-5 w-9 rounded-full transition-colors", r.on ? "bg-accent" : "bg-white/10")}>
                    <span className={cn("absolute top-0.5 size-4 rounded-full bg-white transition-all", r.on ? "left-[18px]" : "left-0.5")} />
                  </span>
                </span>
              </div>
            ))}
            <div className="px-5 py-4">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-secondary">Monthly spending limit</span>
                <span className="font-mono">RM120 / RM300</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[40%] rounded-full bg-accent" />
              </div>
            </div>
            <div className="space-y-2 px-5 py-4 font-mono text-[11px] text-secondary">
              <p>
                <span className="text-subtle">10:42</span> Offered Sat 2:00 PM slot · approved by Jason
              </p>
              <p>
                <span className="text-subtle">10:39</span> Quotation drafted · waiting for approval
              </p>
              <p>
                <span className="text-subtle">10:31</span> Escalated to team · outside permitted topics
              </p>
            </div>
          </div>
        </figure>
      </Reveal>
    </div>
  );
}

function ProductTruth() {
  return (
    <Reveal className="mt-24 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[18px] font-semibold tracking-[-0.01em]">Available now</h3>
          <StatusBadge status="Available now" />
        </div>
        <ul className="mt-5 space-y-2.5">
          {productStatus.availableNow.map((item) => (
            <li key={item} className="flex items-center gap-3 text-[16px] text-secondary">
              <Check className="size-4 shrink-0 text-success-text" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h3 className="text-[18px] font-semibold tracking-[-0.01em]">Coming to 10X</h3>
        <ul className="mt-5 space-y-3">
          {productStatus.comingTo10x.map((item) => (
            <li key={item.label} className="flex flex-wrap items-center justify-between gap-2 text-[16px] text-secondary">
              {item.label}
              <StatusBadge status={item.status} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[14px] text-secondary">
          We&apos;ll tell you exactly what is live for your workflow during the audit.
        </p>
      </div>
    </Reveal>
  );
}
