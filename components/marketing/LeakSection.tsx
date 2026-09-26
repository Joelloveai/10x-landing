import { sectionIds } from "@/lib/site-config";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { Reveal } from "@/components/ui/Reveal";
import { BusinessSelector } from "./BusinessSelector";
import { LossCalculator } from "./LossCalculator";

/** Chapter 02. One selector for five business types, then a compact estimate. */
export function LeakSection() {
  return (
    <section
      id={sectionIds.leak}
      data-chapter
      aria-labelledby="leak-title"
      className="border-t border-border py-24 md:py-32"
    >
      <div className="container-x">
        <ChapterHeader
          num="02"
          label="The leak"
          id="leak-title"
          title={
            <>
              Your leads don&apos;t disappear. <span className="text-secondary">They leak.</span>
            </>
          }
          lead="The enquiry arrives. Someone gets distracted. The customer moves on."
          className="max-w-4xl"
        />
        <Reveal className="mt-12">
          <BusinessSelector />
        </Reveal>
        <Reveal className="mt-4" delay={80}>
          <LossCalculator />
        </Reveal>
      </div>
    </section>
  );
}
