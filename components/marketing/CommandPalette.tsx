"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { sectionIds } from "@/lib/site-config";
import { track } from "@/lib/analytics";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

export const OPEN_PALETTE_EVENT = "tenx:open-palette";

const commands = [
  { label: "Go to Product", target: sectionIds.product },
  { label: "Go to Solutions", target: sectionIds.solutions },
  { label: "Go to How It Works", target: sectionIds.howItWorks },
  { label: "Go to Pricing", target: sectionIds.pricing },
  { label: "Go to Security", target: sectionIds.security },
  { label: "Get Free Audit", target: sectionIds.audit, primary: true },
] as const;

/** Optional Cmd/Ctrl+K quick navigation. A convenience, never the main path. */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(dialogRef, open, close);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    track("command_palette_opened");
    setQuery("");
    setActive(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const results = useMemo(
    () => commands.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  const run = (index: number) => {
    const cmd = results[index];
    if (!cmd) return;
    setOpen(false);
    if (cmd.target === sectionIds.audit) track("cta_click", { location: "command_palette" });
    requestAnimationFrame(() => scrollToId(cmd.target));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[15vh]">
      <button
        type="button"
        aria-label="Close quick navigation"
        tabIndex={-1}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Quick navigation"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-elevated shadow-float"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 text-subtle" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(results.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                run(active);
              }
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `palette-${active}` : undefined}
            aria-label="Search sections"
            placeholder="Jump to…"
            className="h-12 w-full bg-transparent text-[15px] text-fg placeholder:text-subtle focus:outline-none"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-subtle">Esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" aria-label="Sections" className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-[14px] text-secondary">No matches</li>
          ) : (
            results.map((cmd, i) => (
              <li
                key={cmd.label}
                id={`palette-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => run(i)}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-[14px]",
                  i === active ? "bg-white/[0.06] text-fg" : "text-secondary",
                )}
              >
                <span className={cn("primary" in cmd && cmd.primary && "text-accent-text")}>{cmd.label}</span>
                <ArrowRight className="size-3.5 opacity-60" aria-hidden />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
