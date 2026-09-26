import { sectionIds } from "@/lib/site-config";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { ProductStory } from "./ProductStory";

/** Chapter 03. One workflow, one sticky product story. */
export function Workflow() {
  return (
    <section
      id={sectionIds.howItWorks}
      data-chapter
      aria-labelledby="how-title"
      className="border-t border-border pt-24 md:pt-32"
    >
      <div className="container-x">
        <ChapterHeader
          num="03"
          label="How 10X works"
          id="how-title"
          title="One workflow. Every lead."
          lead="Capture, respond, qualify, book, follow up, reactivate. One clear workflow from first enquiry to the next step."
        />
      </div>
      <div className="mt-12 pb-24 md:pb-32 lg:motion-safe:mt-0 lg:motion-safe:pb-0">
        <ProductStory />
      </div>
    </section>
  );
}
