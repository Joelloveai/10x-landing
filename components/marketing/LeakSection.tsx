import { sectionIds } from "@/lib/site-config";
import { Reveal } from "@/components/ui/Reveal";
import { BusinessSelector } from "./BusinessSelector";
import { LostRevenueCalculator } from "./lost-revenue-calculator";
import { ProblemSection } from "./ProblemSection";

/** Chapter 02. The after-hours problem, then one selector for five business types and a compact estimate. */
export function LeakSection() {
  return (
    <section
      id={sectionIds.leak}
      data-chapter
      aria-labelledby="leak-title"
      className="border-t border-border py-24 md:py-32"
    >
      <div className="container-x">
        <ProblemSection />
        <Reveal className="mt-16 md:mt-20">
          <BusinessSelector />
        </Reveal>
        <Reveal className="mt-4" delay={80}>
          <div id={sectionIds.calculator}>
            <LostRevenueCalculator />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
