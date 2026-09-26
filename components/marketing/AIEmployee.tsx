"use client";

/**
 * Chapter 04. One tabbed section for every business type.
 * The conversation is a PRODUCT DEMO with fictional data and is labelled as such.
 * Availability is confirmed per customer by the sales team; never present it as universal.
 */

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, m, useInView } from "framer-motion";
import { Activity, ArrowRight, Check, Gauge, ListChecks, UserCheck, Wallet } from "lucide-react";
import { track } from "@/lib/analytics";
import { businessBySlug, businesses, type BusinessSlug } from "@/lib/businesses";
import { sectionIds } from "@/lib/site-config";
import { useReducedMotionPref } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useBusiness } from "@/components/providers/BusinessProvider";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";

const tabLabel = (slug: BusinessSlug) => (slug === "education" ? "Education" : businessBySlug[slug].name);

const controls = [
  { icon: UserCheck, title: "Approval rules" },
  { icon: ListChecks, title: "Permitted actions" },
  { icon: Gauge, title: "Usage tracking" },
  { icon: Activity, title: "Activity log" },
  { icon: Wallet, title: "Spending limits" },
];

export function AIEmployee() {
  const { business, setBusiness } = useBusiness();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const b = businessBySlug[business];

  const select = (slug: BusinessSlug, focus = false) => {
    if (slug !== business) track("ai_tab_selected", { vertical: slug });
    setBusiness(slug);
    if (focus) tabRefs.current[businesses.findIndex((x) => x.slug === slug)]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = businesses.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      select(businesses[next]!.slug, true);
    }
  };

  return (
    <section id={sectionIds.ai} data-chapter aria-labelledby="ai-title" className="border-t border-border py-24 md:py-32">
      <div className="container-x">
        <ChapterHeader
          num="04"
          label="Your AI employee"
          id="ai-title"
          title="Meet your AI employee."
          lead="It helps handle repetitive conversations, qualification and follow-up so your team can focus on customers."
        />

        <Reveal className="mt-12">
          <div
            role="tablist"
            aria-label="AI employee examples by business type"
            className="-mx-5 flex gap-2 overflow-x-auto scrollbar-none px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {businesses.map((item, i) => {
              const selected = item.slug === business;
              return (
                <button
                  key={item.slug}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`ai-tab-${item.slug}`}
                  aria-selected={selected}
                  aria-controls="ai-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(item.slug)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2.5 text-[15px] transition-[color,background-color,box-shadow] duration-300",
                    selected
                      ? "halo bg-accent/10 text-fg"
                      : "text-secondary ring-1 ring-inset ring-white/10 hover:text-fg hover:ring-white/20",
                  )}
                >
                  {tabLabel(item.slug)}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="ai-panel"
            aria-labelledby={`ai-tab-${b.slug}`}
            tabIndex={0}
            className="mt-6 grid grid-cols-1 gap-4 rounded-2xl focus-visible:outline-offset-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
          >
            <ChatPreview key={b.slug} />
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={b.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col rounded-2xl border border-border bg-surface p-6 sm:p-8"
              >
                <p className="text-[15px] text-secondary">What it helps with</p>
                <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {b.aiActions.map((a) => (
                    <li key={a} className="flex items-start gap-3 text-[16px] text-fg">
                      <Check className="mt-1 size-4 shrink-0 text-accent-text" aria-hidden />
                      {a}
                    </li>
                  ))}
                </ul>
                {b.aiNote ? (
                  <p className="mt-6 rounded-xl border border-accent/30 bg-accent/[0.06] px-4 py-3 text-[15px] text-fg">
                    {b.aiNote}
                  </p>
                ) : null}
                <p className="mt-auto pt-6 text-[14px] text-secondary">It supports your team. It does not replace them.</p>
              </m.div>
            </AnimatePresence>
          </div>
        </Reveal>

        {/* AI trust: compact, inside the same chapter */}
        <Reveal className="mt-4 flex flex-col gap-6 rounded-2xl border border-border p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-sm">
            <h3 className="text-title">You stay in control.</h3>
            <p className="mt-2 text-[15px] text-secondary">
              It works inside rules you set. Anything sensitive can wait for a person to approve.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 lg:max-w-xl lg:justify-end">
            {controls.map(({ icon: Icon, title }) => (
              <li
                key={title}
                className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3.5 py-2 text-[14px] text-fg ring-1 ring-inset ring-white/10"
              >
                <Icon className="size-4 text-secondary" aria-hidden />
                {title}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="mt-6 flex flex-col gap-2 text-[14px] text-secondary sm:flex-row sm:items-center sm:gap-3">
          <p>What the AI employee handles depends on your setup.</p>
          <CtaLink
            href={`#${sectionIds.audit}`}
            intent="sales"
            event="talk_to_sales_clicked"
            eventProps={{ location: "ai_employee", vertical: b.slug }}
            variant="link"
            size="inline"
          >
            Talk to our sales team about your workflow
            <ArrowRight className="size-3.5" aria-hidden />
          </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}

function ChatPreview() {
  const { business } = useBusiness();
  const b = businessBySlug[business];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduced = useReducedMotionPref();
  const [shown, setShown] = useState(1);
  const total = b.demo.chat.length;

  useEffect(() => {
    if (reduced) {
      setShown(total);
      return;
    }
    if (!inView || shown >= total) return;
    const t = window.setTimeout(() => setShown((s) => s + 1), 1000);
    return () => window.clearTimeout(t);
  }, [inView, shown, total, reduced]);

  const nextIsAi = shown < total && b.demo.chat[shown]?.from === "ai";

  return (
    <figure ref={ref} className="halo-soft flex flex-col overflow-hidden rounded-2xl border border-border bg-[#0d0d0e]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-7 items-center justify-center rounded-full bg-accent/20 font-mono text-[10px] text-accent-text"
            aria-hidden
          >
            AI
          </span>
          <span className="text-[13px] font-medium">AI employee · {tabLabel(b.slug)}</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Illustrative</span>
      </div>
      <div className="flex min-h-[340px] flex-1 flex-col justify-start gap-3 p-5">
        <AnimatePresence initial={false}>
          {b.demo.chat.slice(0, shown).map((msg, i) =>
            msg.from === "event" ? (
              <m.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "self-center rounded-full px-3 py-1 text-center font-mono text-[11px]",
                  /escalat/i.test(msg.text) ? "bg-warning/10 text-warning-text" : "bg-success/10 text-success-text",
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
                  msg.from === "lead"
                    ? "self-start rounded-bl-md bg-white/[0.07]"
                    : "self-end rounded-br-md bg-accent text-accent-fg",
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
              <span
                key={d}
                className="size-1.5 animate-pulse rounded-full bg-secondary"
                style={{ animationDelay: `${d * 150}ms` }}
              />
            ))}
          </span>
        ) : null}
      </div>
      <figcaption className="border-t border-white/[0.06] px-5 py-3 text-[13px] text-secondary">
        Example conversation with fictional data.
      </figcaption>
    </figure>
  );
}
