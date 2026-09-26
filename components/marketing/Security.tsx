import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { sectionIds } from "@/lib/site-config";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const areas = [
  {
    icon: LockKeyhole,
    title: "Private workspaces",
    body: "Each business has its own workspace and access boundaries.",
  },
  {
    icon: KeyRound,
    title: "Controlled access",
    body: "Authentication, permissions and audit controls.",
  },
  {
    icon: ShieldCheck,
    title: "Data governance",
    body: "Built with privacy and Malaysian data-protection considerations in mind.",
  },
];

export function Security() {
  return (
    <section id={sectionIds.security} aria-labelledby="security-title" className="border-t border-border bg-surface/40 py-28 md:py-36">
      <div className="container-x">
        <SectionHeader
          id="security-title"
          eyebrow="Security"
          title="Your customer data deserves serious protection."
          lead="Connections are encrypted. Workspaces are separated. Access is controlled."
        />
        <Reveal className="mt-12 grid gap-4 md:grid-cols-3">
          {areas.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <Icon className="size-5 text-secondary" aria-hidden />
              <h3 className="mt-6 text-[18px] font-semibold tracking-[-0.01em]">{title}</h3>
              <p className="mt-2 text-[16px] text-secondary">{body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
