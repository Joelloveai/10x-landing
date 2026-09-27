"use client";

import type { ReactNode } from "react";
import { m, useMotionValue, useSpring, type Variants } from "framer-motion";
import {
  Calendar,
  ClipboardList,
  FileText,
  Filter,
  MessageSquare,
  Moon,
  Repeat,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { sectionIds } from "@/lib/site-config";
import { useRichPointer } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { Reveal } from "@/components/ui/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const capabilities: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: MessageSquare,
    title: "Captures every enquiry, 24/7",
    body: "WhatsApp, web forms, social channels, calls. Every lead in one place. Nothing slips through.",
  },
  {
    icon: Zap,
    title: "Responds in seconds, not hours",
    body: "Instant, natural replies day or night. Handles FAQs, pricing, availability. Speaks English, Bahasa Malaysia, Chinese.",
  },
  {
    icon: Filter,
    title: "Qualifies leads before they reach you",
    body: "Asks the right questions. Scores HOT / WARM / COLD. Routes hot leads immediately.",
  },
  {
    icon: Calendar,
    title: "Books appointments without human touch",
    body: "Inserts bookings into your calendar. Sends confirmations and reminders. Handles reschedules.",
  },
  {
    icon: Repeat,
    title: "Never forgets a follow-up",
    body: "Day 1, 3, 7, 30 sequences run automatically. Reactivates cold leads from your history.",
  },
  {
    icon: FileText,
    title: "Gives you a daily brief",
    body: "Summarises what happened while you slept. Flags leads that need attention. Reports team performance.",
  },
  {
    icon: ClipboardList,
    title: "Handles administrative work",
    body: "Drafts quotes, follow-ups, proposals. Manages reminders. Answers team questions from your data.",
  },
  {
    icon: Moon,
    title: "Works while everyone sleeps",
    body: "Your team goes home at 6 PM. The AI does not. You wake up to a fully worked pipeline.",
  },
];

/** Grid that staggers its TiltCard children in once, when scrolled into view. */
export function staggerGrid(stagger: number): Variants {
  return { hidden: {}, show: { transition: { staggerChildren: stagger } } };
}

const cardIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * Card with a ±3deg pointer tilt and a blue border glow on hover.
 * Tilt runs on desktop fine pointers only; MotionConfig handles reduced motion.
 */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const tilt = useRichPointer();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 22 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22 });

  return (
    <m.div variants={cardIn} className="h-full [perspective:1000px]">
      <m.div
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
        className={cn(
          "h-full rounded-2xl border border-border bg-surface p-6 sm:p-7",
          "transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "hover:border-accent/50 hover:shadow-[0_0_0_1px_rgba(37,99,235,0.25),0_16px_48px_-16px_rgba(37,99,235,0.35)]",
          className,
        )}
      >
        {children}
      </m.div>
    </m.div>
  );
}

export function AIEmployee() {
  return (
    <section id={sectionIds.ai} data-chapter aria-labelledby="ai-title" className="border-t border-border py-24 md:py-32">
      <div className="container-x">
        <ChapterHeader
          num="04"
          label="Your AI employee"
          id="ai-title"
          title="Your business runs 24/7. Your team doesn't have to."
          lead="Your AI employee handles repetitive work so your team can focus on what matters."
        />

        <m.ul
          variants={staggerGrid(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {capabilities.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <TiltCard>
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent-text ring-1 ring-inset ring-accent/25">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.02em]">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-secondary">{body}</p>
              </TiltCard>
            </li>
          ))}
        </m.ul>

        <Reveal className="mx-auto mt-16 max-w-3xl text-center">
          <p className="text-balance text-[clamp(1.375rem,1.05rem+1.2vw,2rem)] font-semibold leading-[1.25] tracking-[-0.025em]">
            The work that used to take 3 people now takes one system. You save time. You reduce cost. You close more
            deals.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
