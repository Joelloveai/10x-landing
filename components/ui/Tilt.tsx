"use client";

import type { ReactNode } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRichPointer } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees on each axis. */
  max?: number;
  /** Soft white light that follows the cursor across the surface. */
  glare?: boolean;
  /** Lift the card by this many px on hover. */
  lift?: number;
};

/**
 * Pointer tilt for cards. Transform and opacity only.
 * Desktop fine pointers only; touch and reduced motion get a static card.
 */
export function Tilt({ children, className, max = 3, glare = false, lift = 0 }: Props) {
  const enabled = useRichPointer();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 22 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22 });
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);
  const glareOpacity = useMotionValue(0);
  const glareX = useTransform(gx, (v) => v - 200);
  const glareY = useTransform(gy, (v) => v - 200);

  return (
    <div className="h-full [perspective:1000px]">
      <m.div
        style={enabled ? { rotateX: srx, rotateY: sry } : undefined}
        whileHover={enabled && lift ? { y: -lift } : undefined}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onPointerMove={(e) => {
          if (!enabled) return;
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry.set((px - 0.5) * 2 * max);
          rx.set(-(py - 0.5) * 2 * max);
          if (glare) {
            gx.set(e.clientX - r.left);
            gy.set(e.clientY - r.top);
            glareOpacity.set(1);
          }
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
          glareOpacity.set(0);
        }}
        className={cn("relative h-full", glare && "overflow-hidden", className)}
      >
        {children}
        {glare && enabled ? (
          <m.span
            aria-hidden
            style={{ x: glareX, y: glareY, opacity: glareOpacity }}
            className="pointer-events-none absolute left-0 top-0 size-[400px] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.04),transparent)] transition-opacity duration-300"
          />
        ) : null}
      </m.div>
    </div>
  );
}
