"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { useRichPointer } from "@/lib/hooks/useMediaQuery";

/**
 * Magnetic pull toward the cursor. Activates when the pointer is within `radius` px of the
 * element's edge and shifts it up to `strength` px. Desktop fine pointers only, off for reduced motion.
 */
export function Magnetic({
  children,
  className,
  radius = 80,
  strength = 6,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
  strength?: number;
}) {
  const enabled = useRichPointer();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  useEffect(() => {
    if (!enabled) {
      x.set(0);
      y.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Distance from the pointer to the element's box (0 when inside).
      const gapX = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const gapY = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      if (Math.hypot(gapX, gapY) > radius) {
        x.set(0);
        y.set(0);
        return;
      }
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2 + radius);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2 + radius);
      x.set(Math.max(-1, Math.min(1, dx)) * strength);
      y.set(Math.max(-1, Math.min(1, dy)) * strength);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, radius, strength, x, y]);

  return (
    <m.div ref={ref} className={className} style={enabled ? { x: sx, y: sy } : undefined}>
      {children}
    </m.div>
  );
}
