"use client";

import { m } from "framer-motion";
import { Clock, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { staggerGrid, TiltCard } from "./AIEmployee";

const body = [
  "We are a small team in Malaysia. We run our own business, and we built 10X to run it with just two people.",
  "Not because we could not afford to hire. Because we did not need to.",
  "One system. Every lead captured. Every follow-up sent. Every booking confirmed. Every report generated. The work that used to require a team of five is now handled by one system. The same system we are offering you.",
  "We do not sell anything we have not tested on ourselves first.",
  "This is what we mean by 10X. Not 10 times the effort. 10 times the output, with the same number of people.",
];

const proof: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Clock, title: "Save time", body: "The work that used to take 8 hours now runs in the background." },
  { icon: Wallet, title: "Save cost", body: "One system replaces the cost of 2-3 hires." },
  { icon: TrendingUp, title: "Scale output", body: "Do more deals without hiring more people." },
];

/** Why 10X exists: a small team runs its own business on it. No founder photos, bios or names. */
export function OnePersonCompany() {
  return (
    <section id="one-person-company" aria-labelledby="opc-title" className="border-t border-border py-24 md:py-32">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 id="opc-title" className="text-display text-balance">
            Built by a small team. Tested on our own business.
          </h2>
          <p className="text-lead mt-5 text-secondary">
            We run our own company with two people. This is the system that makes it possible.
          </p>
        </Reveal>

        <Reveal delay={80} className="mx-auto mt-10 max-w-[56ch] space-y-5 text-center text-[17px] leading-relaxed text-secondary">
          {body.map((para) => (
            <p key={para} className="text-pretty">
              {para}
            </p>
          ))}
        </Reveal>

        <m.ul
          variants={staggerGrid(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {proof.map(({ icon: Icon, title, body: text }) => (
            <li key={title}>
              <TiltCard>
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent-text ring-1 ring-inset ring-accent/25">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.02em]">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-secondary">{text}</p>
              </TiltCard>
            </li>
          ))}
        </m.ul>
      </div>
    </section>
  );
}
