"use client";

import { useEffect, useRef } from "react";
import { trackOnce } from "@/lib/analytics";

/** Fires "pricing_viewed" once when the pricing cards are at least 40% visible. */
export function PricingViewTracker() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          trackOnce("pricing_viewed");
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <span ref={ref} hidden />;
}
