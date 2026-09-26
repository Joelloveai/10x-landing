import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { sectionIds } from "@/lib/site-config";
import { Reveal } from "@/components/ui/Reveal";

const areas = [
  { icon: LockKeyhole, title: "Private workspaces", body: "Each business has its own workspace and access boundaries." },
  { icon: KeyRound, title: "Controlled access", body: "Sign-in, permissions and a record of who did what." },
  { icon: ShieldCheck, title: "Data governance", body: "Built with privacy and data governance in mind." },
];

/** Compact trust block inside the pricing chapter. No certifications or badges are claimed. */
export function Security() {
  return (
    <Reveal>
      <div id={sectionIds.security} className="rounded-2xl border border-border p-6 sm:p-8">
        <h3 className="text-title">Built for real business data.</h3>
        <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {areas.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <p className="flex items-center gap-2.5 text-[16px] font-medium">
                <Icon className="size-4 text-accent-text" aria-hidden />
                {title}
              </p>
              <p className="mt-1.5 text-[15px] text-secondary">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
