import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const metrics = [
  { name: "Response time", desc: "How fast a new enquiry gets its first reply." },
  { name: "Booked appointments", desc: "Enquiries that became viewings, consults or jobs." },
  { name: "Follow-up completion", desc: "Scheduled follow-ups that actually happened." },
  { name: "No-show rate", desc: "Booked appointments that did not turn up." },
  { name: "Reactivated leads", desc: "Old opportunities brought back into the pipeline." },
  { name: "Conversion rate", desc: "Enquiries that became paying customers." },
];

/** Deliberately empty until verified results exist. Never fill with invented numbers. */
export function CaseStudy() {
  return (
    <section id="results" aria-labelledby="results-title" className="py-28 md:py-36">
      <div className="container-x">
        <SectionHeader
          id="results-title"
          eyebrow="Results"
          title="We measure what matters."
          lead="We are collecting before-and-after data with early users. Numbers appear here only once they are verified."
        />
        <Reveal className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.name} className="flex flex-col bg-surface p-6 sm:p-7">
              <p className="text-[15px] font-medium">{m.name}</p>
              <p className="mt-1 text-[14px] text-secondary">{m.desc}</p>
              <div className="mt-8 flex items-end justify-between gap-3">
                <span className="font-mono text-[32px] leading-none text-subtle" aria-label="No verified data yet">
                  --
                </span>
                <span className="rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-secondary ring-1 ring-inset ring-white/10">
                  Measuring
                </span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
