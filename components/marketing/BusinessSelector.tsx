"use client";

import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { businessBySlug, businesses, type BusinessSlug } from "@/lib/businesses";
import { sectionIds } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { useBusiness } from "@/components/providers/BusinessProvider";
import { CtaLink } from "@/components/ui/CtaLink";

/**
 * One selector, five business types. Focus model: the selected tab is primary
 * (blue border + halo), the problem statement is secondary, everything else is quiet.
 */
export function BusinessSelector() {
  const { business, setBusiness } = useBusiness();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const b = businessBySlug[business];

  const select = (slug: BusinessSlug, focus = false) => {
    if (slug !== business) track("vertical_selected", { vertical: slug, location: "leak" });
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
    <div>
      <p id="business-tabs-label" className="mb-4 text-[15px] text-secondary">
        Built for businesses that live on leads and appointments.
      </p>
      <div
        role="tablist"
        aria-labelledby="business-tabs-label"
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
              id={`tab-${item.slug}`}
              aria-selected={selected}
              aria-controls="business-panel"
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
              {item.name}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="business-panel"
        aria-labelledby={`tab-${b.slug}`}
        tabIndex={0}
        className="mt-6 rounded-2xl focus-visible:outline-offset-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={b.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
          >
            <div className="flex flex-col p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="eyebrow text-fg">{b.label}</p>
                <p className="text-[13px] text-subtle">{b.examples.join(" · ")}</p>
              </div>
              <p className="mt-6 text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-balance">
                {b.problem}
              </p>
              {b.valueRange ? (
                <p className="mt-4 font-mono text-[13px] text-secondary">
                  {b.valueLabel} <span className="text-fg">{b.valueRange}</span>
                </p>
              ) : null}
              <ol aria-label={`${b.name} workflow`} className="mt-8 flex flex-wrap items-center gap-x-1.5 gap-y-2">
                {b.workflow.map((stage, i) => (
                  <li key={stage} className="flex items-center gap-1.5">
                    <span className="rounded-md bg-white/[0.05] px-2 py-1 font-mono text-[12px] text-secondary">
                      {stage}
                    </span>
                    {i < b.workflow.length - 1 ? <ArrowRight aria-hidden className="size-3 text-subtle" /> : null}
                  </li>
                ))}
              </ol>
              <div className="mt-auto pt-8">
                <CtaLink
                  href={`#${sectionIds.audit}`}
                  intent="sales"
                  event="talk_to_sales_clicked"
                  eventProps={{ location: "business_selector", vertical: b.slug }}
                  variant="link"
                  size="inline"
                  wrap
                >
                  See how 10X fits your {b.ctaContext}
                  <ArrowRight className="size-3.5 shrink-0" aria-hidden />
                </CtaLink>
              </div>
            </div>
            <Board slug={b.slug} />
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** PRODUCT DEMO: the same pipeline, configured with each business type's stages. Fictional data. */
function Board({ slug }: { slug: BusinessSlug }) {
  const b = businessBySlug[slug];
  return (
    <figure
      className="flex flex-col border-t border-border bg-[#0d0d0e] lg:border-l lg:border-t-0"
      aria-label={`Illustrative ${b.name} pipeline`}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <span className="text-[13px] font-medium">Pipeline · {b.name}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Illustrative</span>
      </div>
      <ol className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        {b.workflow.map((stage, i) => {
          const card = b.demo.board.find((c) => c.stage === stage);
          return (
            <li
              key={stage}
              className={cn(
                "grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] items-center gap-3 rounded-xl px-3 py-2.5",
                i === 0 ? "bg-accent/[0.07] ring-1 ring-inset ring-accent/40" : "bg-white/[0.02]",
              )}
            >
              <span className="truncate font-mono text-[11px] uppercase tracking-[0.06em] text-secondary">{stage}</span>
              {card ? (
                <span className="flex min-w-0 items-baseline justify-between gap-3">
                  <span className="truncate text-[14px] font-medium">{card.name}</span>
                  <span className="shrink-0 truncate text-[12px] text-secondary">{card.meta}</span>
                </span>
              ) : (
                <span className="h-5 rounded border border-dashed border-white/[0.07]" />
              )}
            </li>
          );
        })}
      </ol>
      <figcaption className="flex items-center gap-2 border-t border-white/[0.06] px-5 py-3 text-[13px]">
        <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
        <span className="text-secondary">Next:</span>
        <span className="truncate">{b.demo.nextAction}</span>
      </figcaption>
    </figure>
  );
}
