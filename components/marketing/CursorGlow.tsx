"use client";

import { useEffect } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery, useRichPointer } from "@/lib/hooks/useMediaQuery";

/** Largest layer, so the glow starts fully off-screen. */
const OUTER = 1000;

const layers = [
  { size: OUTER, color: "rgba(37,99,235,0.25)" },
  { size: 500, color: "rgba(37,99,235,0.35)" },
  { size: 150, color: "rgba(37,99,235,0.55)" },
];

/**
 * Layered blue light that follows the cursor: 1000px outer glow, 500px mid glow, 150px core
 * and a 300px ring, blended with `screen`. Fast spring so movement reads instantly.
 * Desktop fine pointers only (≥1024px). Off for reduced motion.
 */
export function CursorGlow() {
  const rich = useRichPointer();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const enabled = rich && desktop;
  const x = useMotionValue(-OUTER);
  const y = useMotionValue(-OUTER);
  const opacity = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
    };
    const onLeave = () => opacity.set(0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y, opacity]);

  if (!enabled) return null;

  // A zero-size anchor sits on the cursor; every layer is centred on it.
  return (
    <m.div
      aria-hidden
      style={{ x: sx, y: sy, opacity }}
      className="pointer-events-none fixed left-0 top-0 z-[5] size-0 mix-blend-screen transition-opacity duration-300"
    >
      {layers.map((l) => (
        <span
          key={l.size}
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: l.size, height: l.size, background: `radial-gradient(closest-side, ${l.color}, transparent)` }}
        />
      ))}
      <span className="absolute left-0 top-0 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(37,99,235,0.3)]" />
    </m.div>
  );
}
