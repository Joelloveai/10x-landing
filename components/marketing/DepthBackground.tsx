"use client";

/**
 * Fixed, full-viewport depth layer behind the page (z-0; content sits at z-10).
 * L0 aurora, L1 grid (tilts slightly with scroll), L2 rising particles, L2b beams,
 * L3 the whole layer drifts ±20px with scroll. Transform/opacity only.
 * Mobile: 10 particles, no beams. Reduced motion: static layers, no scroll effects.
 */

import { m, useScroll, useTransform } from "framer-motion";
import { useReducedMotionPref } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const PARTICLES = 25;
const MOBILE_PARTICLES = 10;

// Deterministic pseudo-random values so server and client render the same markup.
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const particles = Array.from({ length: PARTICLES }, (_, i) => ({
  left: `${(rand(i + 1) * 100).toFixed(2)}%`,
  top: `${(20 + rand(i + 101) * 80).toFixed(2)}%`,
  size: rand(i + 201) > 0.5 ? 3 : 2,
  duration: `${(15 + rand(i + 301) * 15).toFixed(1)}s`,
  // Negative delays start each particle mid-flight, so the layer is never empty on load.
  delay: `-${(rand(i + 401) * 30).toFixed(1)}s`,
}));

export function DepthBackground() {
  const reduced = useReducedMotionPref();
  const { scrollYProgress } = useScroll();
  const shiftY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const gridTilt = useTransform(scrollYProgress, [0, 1], [2, 4]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <m.div style={reduced ? undefined : { y: shiftY }} className="absolute -inset-10">
        {/* L0 Aurora */}
        <div className="depth-aurora absolute -inset-[15%] bg-[radial-gradient(40%_40%_at_30%_30%,rgba(37,99,235,0.06),transparent_70%),radial-gradient(45%_45%_at_70%_70%,rgba(37,99,235,0.04),transparent_70%)]" />

        {/* L1 Grid */}
        <div className="absolute inset-0 [perspective:1200px]">
          <m.div
            style={{ rotateX: reduced ? 2 : gridTilt }}
            className="absolute -inset-x-[10%] -inset-y-[20%] origin-top bg-[linear-gradient(to_right,rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.03]"
          />
        </div>

        {/* L2b Beams */}
        <div className="depth-beam absolute -top-[20%] left-[18%] hidden h-[150%] w-[220px] rotate-[-30deg] bg-[linear-gradient(90deg,transparent,rgba(37,99,235,0.035),transparent)] md:block" />
        <div
          className="depth-beam absolute -top-[20%] right-[12%] hidden h-[150%] w-[300px] rotate-[-30deg] bg-[linear-gradient(90deg,transparent,rgba(37,99,235,0.03),transparent)] md:block"
          style={{ animationDelay: "-4s" }}
        />

        {/* L2 Particles */}
        {particles.map((p, i) => (
          <span
            key={i}
            className={cn(
              "depth-particle absolute rounded-full bg-accent/70",
              i >= MOBILE_PARTICLES && "hidden md:block",
            )}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </m.div>
    </div>
  );
}
