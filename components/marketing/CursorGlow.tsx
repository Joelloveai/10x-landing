"use client";

import { useEffect } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import { useRichPointer } from "@/lib/hooks/useMediaQuery";

const SIZE = 600;

/** A faint 600px blue light that trails the cursor. Desktop fine pointers only, off for reduced motion. */
export function CursorGlow() {
  const enabled = useRichPointer();
  const x = useMotionValue(-SIZE);
  const y = useMotionValue(-SIZE);
  const opacity = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX - SIZE / 2);
      y.set(e.clientY - SIZE / 2);
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

  return (
    <m.div
      aria-hidden
      style={{ x: sx, y: sy, opacity, width: SIZE, height: SIZE }}
      className="pointer-events-none fixed left-0 top-0 z-[5] rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.06),transparent)] transition-opacity duration-500"
    />
  );
}
