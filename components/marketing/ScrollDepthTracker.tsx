"use client";

import { useEffect } from "react";
import { trackOnce } from "@/lib/analytics";

const MARKS = [25, 50, 75, 100] as const;

/** Records anonymous scroll depth milestones once per page view. */
export function ScrollDepthTracker() {
  useEffect(() => {
    let ticking = false;
    const check = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      for (const mark of MARKS) {
        if (pct >= mark - 1) trackOnce(`scroll_depth_${mark}` as const);
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
