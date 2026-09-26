"use client";

import type { ReactNode } from "react";
import { trackOnce } from "@/lib/analytics";

/** Records a single anonymous "testimonial_interacted" event on first touch, hover or focus. */
export function TestimonialTracker({ children, className }: { children: ReactNode; className?: string }) {
  const fire = () => trackOnce("testimonial_interacted");
  return (
    <div className={className} onPointerDown={fire} onFocusCapture={fire} onPointerEnter={fire}>
      {children}
    </div>
  );
}
