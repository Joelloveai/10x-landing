"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/faq";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function ObjectionFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-border py-28 md:py-40">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-5">Questions</p>
          <h2 id="faq-title" className="text-display text-balance">
            You probably have questions.
          </h2>
        </Reveal>

        <Reveal>
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
                      className="flex w-full items-center justify-between gap-6 py-6 text-left text-[18px] font-medium tracking-[-0.01em] sm:text-[20px]"
                    >
                      {f.question}
                      <Plus
                        aria-hidden
                        className={cn("size-5 shrink-0 text-secondary transition-transform duration-300", isOpen && "rotate-45")}
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
                      <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-secondary sm:text-[17px]">{f.answer}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
