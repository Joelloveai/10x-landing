import { siteConfig } from "@/lib/site-config";
import { Reveal } from "@/components/ui/Reveal";
import { TrackedAnchor } from "@/components/ui/TrackedAnchor";
import { Logo } from "@/components/ui/Logo";

export function CompanyTrust() {
  const { company, contact } = siteConfig;
  return (
    <section aria-labelledby="company-title" className="py-24 md:py-32">
      <div className="container-x">
        <Reveal className="grid gap-10 rounded-2xl border border-border p-6 sm:p-10 grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-center">
          <div>
            <h2 id="company-title" className="sr-only">
              About the company
            </h2>
            <Logo className="text-[40px]" />
            <p className="mt-3 max-w-xs text-[16px] text-secondary">
              A Malaysian company building 10X with early service businesses.
            </p>
          </div>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <Item label="A product of">{company.name}</Item>
            <Item label="Registration">
              <span className="font-mono">{company.registration}</span>
            </Item>
            <Item label="Country">{company.country}</Item>
            <Item label="Email">
              <TrackedAnchor href={`mailto:${contact.email}`} event="email_clicked" eventProps={{ location: "company" }} className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                {contact.email}
              </TrackedAnchor>
            </Item>
            <Item label="Phone and WhatsApp">
              <TrackedAnchor href={`tel:${contact.phoneE164}`} event="phone_clicked" eventProps={{ location: "company" }} className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                {contact.phoneDisplay}
              </TrackedAnchor>
              <span className="text-secondary"> · </span>
              <TrackedAnchor href={contact.whatsappUrl} event="whatsapp_clicked" eventProps={{ location: "company" }} external className="text-accent-text underline decoration-accent-text/40 underline-offset-4 hover:decoration-accent-text">
                WhatsApp
              </TrackedAnchor>
            </Item>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[13px] text-secondary">{label}</dt>
      <dd className="mt-1 text-[16px]">{children}</dd>
    </div>
  );
}
