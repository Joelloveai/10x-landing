"use client";

/**
 * Testimonials: infinite marquee on a layered background.
 * Layers (bottom → top): page dark, blue radial glow, grid, drifting orbs, grain, cursor glow.
 * Motion is transform/opacity only. Reduced motion keeps the marquee but drops orbs,
 * cursor glow and tilt. Touch devices get native drag instead of tilt and glow.
 */

import { useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, m, useMotionValue, useSpring, type Variants } from "framer-motion";
import { trackOnce } from "@/lib/analytics";
import { useReducedMotionPref, useRichPointer } from "@/lib/hooks/useMediaQuery";
import { testimonials, type Testimonial } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const HEADLINE = "Real feedback. Not paid. Not actors.".split(" ");

const fadeUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { delay, duration: 0.6, ease: EASE } },
});

const headlineVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  // Only the first visible batch staggers; the rest arrive with the last of them.
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + Math.min(i, 4) * 0.05, duration: 0.6, ease: EASE },
  }),
};

export function Testimonials() {
  const rich = useRichPointer();
  const reduced = useReducedMotionPref();
  const [paused, setPaused] = useState(false);
  const [glowOn, setGlowOn] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Cursor glow: follows the pointer inside this section only (desktop, motion allowed).
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);
  const sx = useSpring(gx, { stiffness: 150, damping: 20, mass: 0.5 });
  const sy = useSpring(gy, { stiffness: 150, damping: 20, mass: 0.5 });
  const glowEnabled = rich && !reduced;

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!glowEnabled || !sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    gx.set(e.clientX - r.left - 200);
    gy.set(e.clientY - r.top - 200);
    if (!glowOn) setGlowOn(true);
  };

  const interacted = () => trackOnce("testimonial_interacted");

  return (
    <m.div
      ref={sectionRef}
      id="testimonials"
      onPointerMove={onPointerMove}
      onPointerLeave={() => setGlowOn(false)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="relative isolate mx-[calc(50%-50vw)] mt-24 overflow-hidden py-24 md:py-28"
    >
      {/* Background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,0.06),transparent_60%)]" />
        <div className="tm-grid absolute inset-0" />
        <div className="tm-orb-a absolute left-[12%] top-[18%] size-[200px] rounded-full bg-[rgba(37,99,235,0.05)] blur-3xl motion-reduce:hidden" />
        <div className="tm-orb-b absolute bottom-[12%] right-[10%] hidden size-[300px] rounded-full bg-[rgba(37,99,235,0.05)] blur-3xl md:motion-safe:block" />
        <div className="tm-noise absolute inset-0" />
        {glowEnabled ? (
          <m.div
            style={{ x: sx, y: sy }}
            animate={{ opacity: glowOn ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-0 size-[400px] rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.08),transparent)]"
          />
        ) : null}
      </div>

      {/* Pause indicator */}
      <AnimatePresence>
        {paused ? (
          <m.p
            key="paused"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute left-1/2 top-6 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-elevated/90 px-3 py-1 font-mono text-[11px] text-secondary backdrop-blur"
            aria-hidden
          >
            Paused · hover to resume
          </m.p>
        ) : null}
      </AnimatePresence>

      {/* Header */}
      <div className="container-x">
        <m.div variants={fadeUp(0)} className="flex items-center justify-between gap-4">
          <p className="font-mono text-[12px] text-accent-text">// real feedback</p>
          <p className="font-mono text-[12px] text-subtle">{testimonials.length} real reviews</p>
        </m.div>

        <m.h3
          variants={headlineVariants}
          className="mt-5 max-w-3xl text-balance text-[clamp(32px,4.5vw,52px)] font-extrabold leading-[1.05] tracking-[-0.035em]"
        >
          {HEADLINE.map((word, i) => (
            <span key={`${word}-${i}`}>
              <m.span variants={wordVariants} className="inline-block">
                {word}
              </m.span>
              {i < HEADLINE.length - 1 ? " " : null}
            </span>
          ))}
        </m.h3>

        <m.div variants={fadeUp(0.1)} className="mt-6">
          <span aria-hidden className="tm-divider block h-[2px] w-10 bg-[linear-gradient(90deg,#2563EB,transparent)]" />
        </m.div>

        <m.p variants={fadeUp(0.2)} className="mt-5 text-[16px] text-secondary">
          Real people. Real businesses. Real results.
        </m.p>
      </div>

      {/* Marquee */}
      <m.div variants={fadeUp(0.3)} className="relative mt-12">
        <div
          className="tm-marquee scrollbar-none overflow-x-auto md:overflow-hidden"
          onMouseEnter={() => {
            setPaused(true);
            interacted();
          }}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => {
            setPaused(true);
            interacted();
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
          }}
          onTouchStart={interacted}
        >
          <ul className="tm-track px-5 py-4 md:px-8" aria-label="Customer feedback">
            {[...testimonials, ...testimonials].map((t, i) => (
              <Card key={`${t.name}-${i}`} t={t} index={i} duplicate={i >= testimonials.length} tilt={rich} />
            ))}
          </ul>
        </div>
        {/* Edge fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#0A0A0A_0%,transparent_8%,transparent_92%,#0A0A0A_100%)]"
        />
      </m.div>
    </m.div>
  );
}

function Card({ t, index, duplicate, tilt }: { t: Testimonial; index: number; duplicate: boolean; tilt: boolean }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 20 });
  const sry = useSpring(ry, { stiffness: 220, damping: 20 });

  return (
    <li
      className="w-[320px] shrink-0 [perspective:800px] md:w-[400px]"
      aria-hidden={duplicate || undefined}
      inert={duplicate || undefined}
    >
      <m.figure
        custom={index}
        variants={cardVariants}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={tilt ? { rotateX: srx, rotateY: sry } : undefined}
        onPointerMove={(e) => {
          if (!tilt) return;
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        tabIndex={duplicate ? -1 : 0}
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7",
          "transition-[border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "hover:border-[rgba(37,99,235,0.4)] hover:shadow-[0_12px_40px_-12px_rgba(37,99,235,0.3)]",
          "focus-visible:border-[rgba(37,99,235,0.4)] focus-visible:outline-none",
        )}
      >
        <QuoteMark />
        <figcaption className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2563EB,#1E40AF)] text-[13px] font-semibold text-white"
          >
            {t.initial}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-medium text-fg">{t.name}</span>
            <span className="block truncate text-[13px] text-secondary">{t.role}</span>
            <span className="block truncate text-[12px] text-subtle">{t.city}</span>
          </span>
        </figcaption>
        <Stars />
        <blockquote className="mt-4 text-[15px] leading-[1.65] text-secondary">
          <p>{t.text}</p>
        </blockquote>
      </m.figure>
    </li>
  );
}

function Stars() {
  return (
    <span aria-hidden className="mt-4 flex gap-[2px]">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#2563EB">
          <path d="M12 2.5l2.95 6.3 6.9.75-5.15 4.7 1.45 6.8L12 17.6l-6.15 3.45 1.45-6.8-5.15-4.7 6.9-.75L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}

function QuoteMark() {
  return (
    <svg
      aria-hidden
      width="60"
      height="60"
      viewBox="0 0 24 24"
      fill="#2563EB"
      className="pointer-events-none absolute right-4 top-3 opacity-[0.08]"
    >
      <path d="M9.6 5C6.4 6.5 4 9.6 4 13.4V19h6v-6H6.9c.2-2.3 1.7-4.2 3.6-5.2L9.6 5zm10 0c-3.2 1.5-5.6 4.6-5.6 8.4V19h6v-6h-3.1c.2-2.3 1.7-4.2 3.6-5.2L19.6 5z" />
    </svg>
  );
}
