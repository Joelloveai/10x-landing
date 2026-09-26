"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import { useRichPointer } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const MAX_DEG = 3;

/** Product card with subtle perspective tilt on desktop. Static on touch and reduced motion. */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const enabled = useRichPointer();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 22 });
  const sry = useSpring(ry, { stiffness: 200, damping: 22 });

  return (
    <div className="h-full [perspective:1000px]">
      <m.div
        className={cn(
          "group h-full transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5",
          className,
        )}
        style={enabled ? { rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" } : undefined}
        onPointerMove={(e) => {
          if (!enabled) return;
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ry.set(px * MAX_DEG * 2);
          rx.set(-py * MAX_DEG * 2);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
      >
        {children}
      </m.div>
    </div>
  );
}
