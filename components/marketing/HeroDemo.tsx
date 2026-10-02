"use client";

/**
 * PRODUCT DEMO. Four illustrative screens (pipeline, WhatsApp draft, AI chat, dashboard) that crossfade
 * in CSS, 2.5s each. All names and numbers are fictional. Labelled "Illustrative". Reduced motion
 * freezes on the first screen.
 */

import { useEffect, useRef } from "react";
import { m, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotionPref, useRichPointer } from "@/lib/hooks/useMediaQuery";
import { HeroFrames } from "./HeroFrames";

export function HeroDemo() {
  const rich = useRichPointer();
  const reduced = useReducedMotionPref();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
  // Scroll leans the window back 4deg as it passes the middle of the viewport, then levels out.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lean = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0, 4, 0]), { stiffness: 100, damping: 24 });
  // Desktop adds a base tilt rotateX(2deg) rotateY(-1.5deg), plus up to ±2deg following the cursor.
  const rotateX = useTransform([sy, lean], ([v, l]: number[]) => (rich ? 2 - v * 2 : 0) + l);
  const rotateY = useTransform(sx, (v) => (rich ? -1.5 + v * 2 : 0));

  useEffect(() => {
    if (!rich) {
      mx.set(0);
      my.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rich, mx, my]);

  return (
    <m.div
      ref={ref}
      style={reduced ? undefined : { rotateX, rotateY }}
      className="hero-3d mx-auto max-w-[1000px] rounded-[20px] border border-white/[0.08] bg-surface text-left shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_1px_0_0_rgba(255,255,255,0.06)_inset,0_60px_120px_-30px_rgba(0,0,0,0.85),0_30px_60px_-30px_rgba(37,99,235,0.28)]"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
        </div>
        <div className="mx-auto rounded-md bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-subtle">10X</div>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">Illustrative</span>
      </div>

      <HeroFrames />
    </m.div>
  );
}
