import { sectionIds } from "@/lib/site-config";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { StickyProductStory } from "./StickyProductStory";

const model = ["Capture", "Respond", "Qualify", "Book", "Follow up", "Reactivate", "Close"];

export function WorkflowSection() {
  return (
    <section id={sectionIds.howItWorks} aria-labelledby="how-title" className="border-t border-border pt-28 md:pt-40">
      <div className="container-x">
        <SectionHeader
          id="how-title"
          eyebrow="How it works"
          title="One system. Every lead. Every step."
          lead="From the first enquiry to the next follow-up, 10X keeps the process visible."
        />
        <Reveal className="mt-10">
          <ol aria-label="The 10X operating model" className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[12px] uppercase tracking-[0.12em] text-secondary">
            {model.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className={i === model.length - 1 ? "text-fg" : undefined}>{step}</span>
                {i < model.length - 1 ? <span aria-hidden className="text-subtle">→</span> : null}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
      <div className="mt-14 pb-28 md:pb-32 lg:mt-4 lg:motion-safe:pb-0">
        <StickyProductStory />
      </div>
    </section>
  );
}
