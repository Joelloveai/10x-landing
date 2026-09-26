import { heroTestimonials } from "@/lib/testimonials";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialCard } from "./TestimonialCard";

export function InitialTestimonials() {
  return (
    <section aria-labelledby="early-feedback" className="container-x pb-8 pt-20 sm:pt-24">
      <Reveal>
        <h2 id="early-feedback" className="eyebrow mb-6 text-center">
          From early users
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {heroTestimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
