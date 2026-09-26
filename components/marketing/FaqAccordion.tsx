"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/faq";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Accessible single-open accordion. */
export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ul className="border-t border-border">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <li key={f.question} className="border-b border-border">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(isOpen ? null : i);
                  if (!isOpen) track("faq_opened", { index: i });
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-medium tracking-[-0.01em] transition-colors sm:text-[18px]",
                  isOpen ? "text-fg" : "text-secondary hover:text-fg",
                )}
              >
                {f.question}
                <Plus
                  aria-hidden
                  className={cn(
                    "size-5 shrink-0 transition-transform duration-300",
                    isOpen ? "rotate-45 text-accent-text" : "text-secondary",
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              inert={!isOpen || undefined}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-5 text-[16px] leading-relaxed text-secondary">{f.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
