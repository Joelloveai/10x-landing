import { ArrowRight } from "lucide-react";
import { agents } from "@/lib/agents";
import { sectionIds } from "@/lib/site-config";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { CtaLink } from "@/components/ui/CtaLink";

/** Chapter 02. Four agents, one card each. Capabilities come from lib/agents.ts and list only what works today. */
export function MeetYourTeam() {
  return (
    <section
      id={sectionIds.team}
      data-chapter
      aria-labelledby="team-title"
      className="border-t border-border py-24 md:py-32"
    >
      <div className="container-x">
        <ChapterHeader
          num="02"
          label="Your AI team"
          id="team-title"
          title="Meet your team."
          lead="Four agents. Each one answers and drafts. You decide what gets sent."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((a) => (
            <li key={a.name} className="flex flex-col rounded-2xl border border-border bg-surface p-6">
              <AgentAvatar agent={a} />
              <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.02em]">{a.name}</h3>
              <p className="text-[14px] text-subtle">{a.role}</p>
              <ul className="mt-5 space-y-2.5 text-[15px] text-secondary">
                {a.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-subtle" />
                    {b}
                  </li>
                ))}
              </ul>
              <CtaLink
                href={`#${sectionIds.howItWorks}`}
                eventProps={{ agent: a.name }}
                variant="link"
                size="inline"
                className="mt-auto pt-6"
              >
                See what {a.name} can do
                <ArrowRight className="size-3.5" aria-hidden />
              </CtaLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
