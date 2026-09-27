"use client";

import { useEffect, useRef } from "react";
import { animate, m, useInView, useMotionValue, useTransform } from "framer-motion";
import { useReducedMotionPref } from "@/lib/hooks/useMediaQuery";

type Props = {
  to: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
};

const plain = (n: number) => Math.round(n).toLocaleString("en-MY");

/**
 * Counts from 0 to `to` the first time it scrolls into view.
 * Server render and reduced motion show the final value. Screen readers always get the final value.
 */
export function CountUp({ to, format = plain, duration = 1.4, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotionPref();
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(to);
  const text = useTransform(mv, format);
  const primed = useRef(false);

  // Reset to 0 before the element is seen, so the count starts from zero.
  useEffect(() => {
    if (reduced || inView || primed.current) return;
    primed.current = true;
    mv.set(0);
  }, [reduced, inView, mv]);

  useEffect(() => {
    if (reduced) {
      mv.set(to);
      return;
    }
    if (!inView) return;
    const controls = animate(mv, to, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, reduced, to, duration, mv]);

  return (
    <span ref={ref} className={className}>
      <m.span aria-hidden>{text}</m.span>
      <span className="sr-only">{format(to)}</span>
    </span>
  );
}
