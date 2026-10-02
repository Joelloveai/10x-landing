"use client";

import type { ReactNode } from "react";
import { m, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotionPref } from "@/lib/hooks/useMediaQuery";

/** Page scroll (px) over which the hero layers reach their full offset. */
const RANGE = 700;

/**
 * One depth layer of the hero. On scroll it rises by `depth` px over the first 700px, so
 * headline, sub and CTA separate (80 / 120 / 160). On mount it fades up 20px, `index` x 0.08s late.
 * Reduced motion: no parallax. `.hero-in` keeps the layer visible without JS (see layout <noscript>).
 */
export function HeroLayer({
  depth,
  index,
  children,
  className,
}: {
  depth: number;
  index: number;
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotionPref();
  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, [0, RANGE], [0, -depth], { clamp: true });
  const y = useSpring(raw, { stiffness: 120, damping: 24, mass: 0.4 });

  return (
    <m.div style={reduced || !depth ? undefined : { y, willChange: "transform" }} className={className}>
      <m.div
        className="hero-in"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </m.div>
    </m.div>
  );
}
