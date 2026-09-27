"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { useRichPointer } from "@/lib/hooks/useMediaQuery";

/**
 * The only gradient on the site: a soft white light behind the headline (max opacity 0.08).
 * Follows the cursor across the hero on desktop. Static on touch and reduced motion.
 */
export function HeroSpotlight() {
  const rich = useRichPointer();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 40, damping: 20 });
  const sy = useSpring(y, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (!rich) return;
    const onMove = (e: PointerEvent) => {
      const hero = ref.current?.parentElement;
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      if (e.clientY > r.bottom) return;
      // Centre the 900px light on the cursor (its resting centre is 270px below the hero top).
      x.set(e.clientX - (r.left + r.width / 2));
      y.set(Math.max(-270, e.clientY - r.top - 270));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rich, x, y]);

  return (
    <m.div
      ref={ref}
      aria-hidden
      style={rich ? { x: sx, y: sy } : undefined}
      className="pointer-events-none absolute left-1/2 top-[-180px] -ml-[450px] h-[900px] w-[900px] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.075),rgb(255_255_255/0.025)_45%,transparent_75%)] max-md:top-[-120px] max-md:-ml-[300px] max-md:h-[600px] max-md:w-[600px]"
    />
  );
}
