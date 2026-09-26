"use client";

import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { sectionIds } from "@/lib/site-config";
import { verticalBySlug, verticals, type VerticalSlug } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { useVertical } from "@/components/providers/VerticalProvider";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function VerticalSelector() {
  const { vertical, setVertical } = useVertical();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const v = verticalBySlug[vertical];

  const select = (slug: VerticalSlug, focus = false) => {
    if (slug !== vertical) track("vertical_selected", { vertical: slug, location: "selector" });
    setVertical(slug);
    if (focus) tabRefs.current[verticals.findIndex((x) => x.slug === slug)]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = verticals.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      select(verticals[next]!.slug, true);
    }
  };

  return (
    <section id={sectionIds.solutions} aria-labelledby="solutions-title" className="py-28 md:py-40">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow mb-5">Solutions</p>
          <h2 id="solutions-title" className="text-display text-balance">
            Built around how your business actually runs.
          </h2>
          <p className="text-lead mt-5 text-secondary">
            Pick your business. Same 10X underneath, shaped around the way your team already works.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div
            role="tablist"
            aria-label="Choose your business type"
            className="grid grid-cols-2 gap-1 rounded-3xl border border-border bg-surface p-1 sm:inline-flex sm:rounded-full"
          >
            {verticals.map((item, i) => {
              const selected = item.slug === vertical;
              return (
                <button
                  key={item.slug}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${item.slug}`}
                  aria-selected={selected}
                  aria-controls={`panel-${item.slug}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(item.slug)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2.5 text-[15px] transition-colors sm:px-5 sm:py-2",
                    selected ? "bg-accent text-accent-fg" : "text-secondary hover:text-fg",
                  )}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`panel-${v.slug}`}
            aria-labelledby={`tab-${v.slug}`}
            tabIndex={0}
            className="mt-8 rounded-2xl focus-visible:outline-offset-8"
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={v.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]"
              >
                <div className="flex min-w-0 flex-col rounded-2xl border border-border bg-surface p-6 sm:p-8">
                  <p className="text-[14px] text-secondary">{v.audience}</p>
                  <p className="mt-3 text-title text-balance">{v.problem}</p>
                  {v.metric ? (
                    <p className="mt-3 text-[13px] text-secondary">
                      {v.metric} <span className="text-subtle">Source: {v.metricSource}</span>
                    </p>
                  ) : null}

                  <ol className="mt-8 space-y-4">
                    {v.workflow.map((w, i) => (
                      <li key={w.stage} className="flex gap-4">
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white/[0.06] font-mono text-[11px] text-secondary">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-[16px] font-medium">{w.stage}</p>
                          <p className="text-[15px] text-secondary">{w.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-auto pt-8">
                    <CtaLink
                      href={`#${sectionIds.audit}`}
                      event="cta_click"
                      eventProps={{ location: "vertical_selector", vertical: v.slug }}
                      wrap
                      className="w-full text-center sm:w-auto"
                    >
                      Get a free audit for your {v.ctaContext}
                      <ArrowRight className="size-4 shrink-0" aria-hidden />
                    </CtaLink>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                  <Board slug={v.slug} />
                  <div className="rounded-2xl border border-border bg-surface p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[15px] font-medium">What the AI employee will help with</p>
                      <StatusBadge status="Rollout in progress" />
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {v.aiActions.map((a) => (
                        <li key={a} className="rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[14px] text-secondary">
                          {a}
                        </li>
                      ))}
                    </ul>
                    {v.aiNote ? <p className="mt-4 text-[14px] text-fg">{v.aiNote}</p> : null}
                  </div>
                </div>
              </m.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** PRODUCT CONCEPT: the same pipeline board, configured with each vertical's stages. Demo data only. */
function Board({ slug }: { slug: VerticalSlug }) {
  const v = verticalBySlug[slug];
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-[#0d0d0e]" aria-label={`Illustrative ${v.name} pipeline`}>
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <span className="text-[13px] font-medium">Pipeline · {v.name}</span>
        <span className="font-mono text-[11px] text-subtle">Illustrative</span>
      </div>
      <div
        className="grid grid-cols-2 gap-2 p-3 sm:p-4 md:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
        style={{ ["--cols" as string]: v.workflow.length }}
      >
        {v.workflow.map((w) => {
          const card = v.demo.board.find((b) => b.stage === w.stage);
          return (
            <div key={w.stage} className="rounded-xl bg-white/[0.025] p-2.5">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-secondary">{w.stage}</p>
              {card ? (
                <div className="rounded-lg border border-white/[0.07] bg-elevated p-2.5">
                  <p className="truncate text-[13px] font-medium">{card.name}</p>
                  <p className="mt-0.5 truncate text-[12px] text-secondary">{card.meta}</p>
                </div>
              ) : (
                <div className="h-[54px] rounded-lg border border-dashed border-white/[0.07]" />
              )}
            </div>
          );
        })}
      </div>
      <figcaption className="flex items-center gap-2 border-t border-white/[0.06] px-5 py-3 text-[13px]">
        <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
        <span className="text-secondary">Next:</span>
        <span className="truncate">{v.demo.nextAction}</span>
      </figcaption>
    </figure>
  );
}
