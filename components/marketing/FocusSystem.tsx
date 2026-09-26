"use client";

import { useEffect } from "react";
import { chapters } from "@/lib/site-config";
import { setActiveChapter, useActiveChapter } from "@/lib/hooks/useActiveChapter";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/**
 * Tracks which chapter is in focus and exposes it as <html data-focus="chapter-id">.
 * CSS uses that to light the chapter marker; everything else stays quiet.
 * Also renders a small progress rail on wide desktops.
 */
export function FocusSystem() {
  const active = useActiveChapter();

  useEffect(() => {
    const els = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = els[0]?.id ?? "top";
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
      setActiveChapter(current);
      // Set on <html>, not on the sections: sections may still be hydrating inside Suspense.
      document.documentElement.dataset.focus = current;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      aria-label="Page chapters"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 min-[1360px]:block"
    >
      <ol className="flex flex-col gap-3">
        {chapters.map((c) => {
          const isActive = c.id === active;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-label={`${c.num} ${c.label}`}
                aria-current={isActive ? "location" : undefined}
                title={c.label}
                onClick={(e) => {
                  if (scrollToId(c.id)) e.preventDefault();
                }}
                className={cn(
                  "flex items-center justify-end gap-2 font-mono text-[10px] transition-colors duration-300",
                  isActive ? "text-accent-text" : "text-subtle/60 hover:text-secondary",
                )}
              >
                {c.num}
                <span
                  aria-hidden
                  className={cn(
                    "block h-px transition-all duration-300",
                    isActive ? "w-6 bg-accent shadow-[0_0_8px_rgb(37_99_235/0.8)]" : "w-3 bg-white/20",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
