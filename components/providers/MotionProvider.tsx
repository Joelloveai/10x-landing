"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Animation features load in a separate chunk after hydration, keeping the initial JS small.
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/** Loads only the DOM animation feature set and honours the OS reduced-motion setting. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
