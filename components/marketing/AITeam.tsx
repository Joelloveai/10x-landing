"use client";

import type { ReactNode } from "react";
import { m, type Variants } from "framer-motion";
import { FileText, Moon, Repeat, Target, type LucideIcon } from "lucide-react";
import { sectionIds } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";

const EASE = [0.16, 1, 0.3, 1] as const;

const team: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Target,
    title: "Your AI Sales Director",
    body: "Captures every lead 24/7. Qualifies budget, timeline, intent. Books viewings into your calendar.",
  },
  {
    icon: Repeat,
    title: "Your AI Follow-up Specialist",
    body: "Runs Day 1, 3, 7, 30 sequences. Reactivates cold leads. Nurtures until ready to buy.",
  },
  {
    icon: Moon,
    title: "Your AI Operations Manager",
    body: "Summarises overnight activity. Flags urgent leads. Reports response time, bookings, revenue.",
  },
  {
    icon: FileText,
    title: "Your AI Admin Assistant",
    body: "Drafts quotes, proposals, follow-ups. Manages reminders. Answers team questions from your data.",
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

const titleIn: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { delay: 0.15, duration: 0.6, ease: EASE } },
};

/**
 * Card with a pointer tilt, cursor glare and hover lift, plus a blue border on hover.
 * Tilt, glare and lift run on desktop fine pointers only.
 */
export function TiltCard({
  children,
  className,
  max = 3,
  glare = false,
  lift = 0,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  lift?: number;
}) {
  return (
    <m.div variants={cardIn} className="h-full">
      <Tilt
        max={max}
        glare={glare}
        lift={lift}
        className={cn(
          "group rounded-2xl border border-border bg-surface p-6 sm:p-7",
          "transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "hover:border-accent/50 hover:shadow-[0_0_0_1px_rgba(37,99,235,0.25),0_16px_48px_-16px_rgba(37,99,235,0.35)]",
          className,
        )}
      >
        {children}
      </Tilt>
    </m.div>
  );
}

export function AITeam() {
  return (
    <section id={sectionIds.ai} data-chapter aria-labelledby="ai-title" className="border-t border-border py-24 md:py-32">
      <div className="container-x">
        <ChapterHeader
          num="04"
          label="Your AI team"
          id="ai-title"
          title="Meet your AI team. It never sleeps."
          lead="Not a chatbot. A team of AI specialists working together."
        />

        <m.ul
          variants={staggerGrid(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {team.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <TiltCard max={4} glare lift={4}>
                <span className="icon-pulse flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent-text ring-1 ring-inset ring-accent/25">
                  <Icon className="size-5" aria-hidden />
                </span>
                <m.h3 variants={titleIn} className="mt-5 text-[19px] font-semibold tracking-[-0.02em]">
                  {title}
                </m.h3>
                <p className="mt-2 text-[15px] leading-relaxed text-secondary">{body}</p>
              </TiltCard>
            </li>
          ))}
        </m.ul>

        <Reveal className="mx-auto mt-16 max-w-3xl text-center">
          <p className="text-balance text-[clamp(1.375rem,1.05rem+1.2vw,2rem)] font-semibold leading-[1.25] tracking-[-0.025em]">
            The work of a five-person team. Handled by one system. You own the system.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
