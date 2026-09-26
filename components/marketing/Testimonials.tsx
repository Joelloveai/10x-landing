import { testimonials } from "@/lib/testimonials";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TestimonialCard } from "./TestimonialCard";
import { TestimonialTracker } from "./TestimonialTracker";

/**
 * Mobile: horizontal swipe with snap.
 * Desktop: slow marquee that pauses on hover, focus and touch.
 * Reduced motion (desktop): a static grid. The duplicate set used for the loop is hidden from assistive tech.
 */
export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="border-t border-border py-28 md:py-36">
      <div className="container-x">
        <SectionHeader
          id="testimonials-title"
          eyebrow="Feedback"
          title="Real feedback from early users."
          lead="Actual feedback from people using 10X. Unedited."
        />
      </div>

      <Reveal className="mt-14">
        <TestimonialTracker className="marquee">
          {/* Motion-safe desktop marquee */}
          <div className="fade-x hidden overflow-hidden md:motion-safe:block">
            <div className="marquee-track items-start px-4">
              {[...testimonials, ...testimonials].map((t, i) => {
                const duplicate = i >= testimonials.length;
                return (
                  <div
                    key={`${t.name}-${i}`}
                    className="w-[400px] shrink-0"
                    aria-hidden={duplicate || undefined}
                    inert={duplicate || undefined}
                  >
                    <TestimonialCard t={t} size="lg" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile swipe list */}
          <ul
            aria-label="Testimonials"
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none px-5 pb-2 md:hidden"
          >
            {testimonials.map((t) => (
              <li key={t.name} className="w-[85%] max-w-[360px] shrink-0 snap-center">
                <TestimonialCard t={t} />
              </li>
            ))}
          </ul>

          {/* Reduced-motion desktop grid */}
          <ul className="container-x hidden gap-4 md:motion-reduce:grid md:motion-reduce:grid-cols-2 lg:motion-reduce:grid-cols-3">
            {testimonials.map((t) => (
              <li key={t.name}>
                <TestimonialCard t={t} />
              </li>
            ))}
          </ul>
        </TestimonialTracker>
        <p className="container-x mt-4 text-[13px] text-secondary md:hidden">Swipe to read more</p>
      </Reveal>
    </section>
  );
}
