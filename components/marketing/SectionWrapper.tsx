"use client";

import type { ReactNode } from "react";
import { m, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "-100px" } as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const glow: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: [0, 1, 0], transition: { duration: 1.8, ease: "easeInOut", times: [0, 0.35, 1] } },
};

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
};

/**
 * Fades its SectionItem children in once (stagger 0.08s) and lets a faint blue glow
 * bloom on entry. MotionConfig drops the movement for reduced motion; the glow is hidden.
 */
export function SectionWrapper({ children, className, id }: Props) {
  return (
    <m.div
      id={id}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      className={cn("relative isolate", className)}
    >
      <m.span
        aria-hidden
        variants={glow}
        className="pointer-events-none absolute inset-0 -z-10 rounded-[12px] motion-reduce:hidden shadow-[0_0_80px_rgba(37,99,235,0.06)]"
      />
      {children}
    </m.div>
  );
}

/** One staggered child of SectionWrapper. */
export function SectionItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div variants={item} className={className}>
      {children}
    </m.div>
  );
}
