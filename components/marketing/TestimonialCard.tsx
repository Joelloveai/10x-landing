import type { Testimonial } from "@/lib/testimonials";
import { initials } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

/** Renders a testimonial exactly as stored. Never transform `quote`. */
export function TestimonialCard({ t, className, size = "md" }: { t: Testimonial; className?: string; size?: "md" | "lg" }) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-surface",
        size === "lg" ? "p-7" : "p-6",
        className,
      )}
    >
      <blockquote className={cn("text-pretty text-fg/90", size === "lg" ? "text-[17px] leading-relaxed" : "text-[16px] leading-relaxed")}>
        <p>{t.quote}</p>
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[12px] font-semibold text-secondary ring-1 ring-inset ring-white/10"
        >
          {initials(t.name)}
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] font-medium text-fg">{t.name}</span>
          <span className="block text-[13px] text-secondary">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
