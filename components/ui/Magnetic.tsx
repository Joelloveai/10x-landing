"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import { useRichPointer } from "@/lib/hooks/useMediaQuery";

const MAX = 4;

/** Very subtle magnetic pull (max 4px). Desktop fine pointers only. */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const enabled = useRichPointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  return (
    <m.div
      className={className}
      style={enabled ? { x: sx, y: sy } : undefined}
      onPointerMove={(e) => {
        if (!enabled) return;
        const r = e.currentTarget.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        x.set(Math.max(-1, Math.min(1, dx)) * MAX);
        y.set(Math.max(-1, Math.min(1, dy)) * MAX);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.div>
  );
}
