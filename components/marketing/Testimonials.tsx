import { testimonials } from "@/lib/testimonials";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialCard } from "./TestimonialCard";
import { TestimonialTracker } from "./TestimonialTracker";

/**
 * All seven testimonials, verbatim, with initials avatars (no photos, no ratings).
 * Mobile: swipe. Desktop: slow marquee that pauses on hover/focus/touch. Reduced motion: grid.
 */
export function Testimonials() {
  return (
    <div id="testimonials" className="mt-24">
      <Reveal className="max-w-2xl">
        <h3 className="text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
          Real feedback from early users.
        </h3>
        <p className="mt-3 text-[16px] text-secondary">Actual feedback. Unedited.</p>
      </Reveal>

      <Reveal className="mt-10">
        <TestimonialTracker className="marquee -mx-5 md:-mx-8 min-[1264px]:mx-[calc((1200px-100vw)/2+32px)]">
          <div className="fade-x hidden overflow-hidden md:motion-safe:block">
            <div className="marquee-track items-start px-4">
              {[...testimonials, ...testimonials].map((t, i) => {
                const duplicate = i >= testimonials.length;
                return (
                  <div
                    key={`${t.name}-${i}`}
                    className="w-[380px] shrink-0"
                    aria-hidden={duplicate || undefined}
                    inert={duplicate || undefined}
                  >
                    <TestimonialCard t={t} />
                  </div>
                );
              })}
            </div>
          </div>

          <ul aria-label="Testimonials" className="flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none px-5 pb-2 md:hidden">
            {testimonials.map((t) => (
              <li key={t.name} className="w-[85%] max-w-[360px] shrink-0 snap-center">
                <TestimonialCard t={t} />
              </li>
            ))}
          </ul>

          <ul className="hidden gap-4 px-8 md:motion-reduce:grid md:motion-reduce:grid-cols-2 lg:motion-reduce:grid-cols-3">
            {testimonials.map((t) => (
              <li key={t.name}>
                <TestimonialCard t={t} />
              </li>
            ))}
          </ul>
        </TestimonialTracker>
        <p className="mt-4 text-[13px] text-secondary md:hidden">Swipe to read more</p>
      </Reveal>
    </div>
  );
}
