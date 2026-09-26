import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How the 10X website collects and uses information. Draft pending legal review.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const { company, contact } = siteConfig;
  return (
    <LegalPage title="Privacy Policy" updated="26 September 2026">
      <p>
        This policy explains what information the 10X website ({siteConfig.url.replace("https://", "")}) collects and how
        it is used. 10X is a product of {company.name} (Registration {company.registration}), Malaysia.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong className="text-fg">Audit requests.</strong> When you request a Lead Leakage Audit, we collect your
          WhatsApp number and, if you choose to tell us, your business type and approximate monthly enquiry volume.
        </li>
        <li>
          <strong className="text-fg">Campaign information.</strong> If you arrive from a link with campaign tags (for
          example utm_source), we store those tags and the referring website with your request.
        </li>
        <li>
          <strong className="text-fg">Anonymous usage events.</strong> The website can record anonymous interaction events
          (for example, that a pricing section was viewed). These events never include your phone number, name, email or
          message content. The website does not set its own tracking cookies.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To contact you about the audit you requested.</li>
        <li>To prepare for that conversation.</li>
        <li>To understand which parts of the website are useful, in aggregate.</li>
      </ul>

      <h2>Where it goes</h2>
      <p>
        Audit requests are forwarded to the systems we use to manage enquiries. We do not sell your information.
        [Final list of processors and data locations to be confirmed during legal review.]
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. See{" "}
        <a href="/data-deletion">Data Deletion</a>.
      </p>

      <h2>Contact</h2>
      <p>
        {company.name}
        <br />
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <br />
        <a href={`tel:${contact.phoneE164}`}>{contact.phoneDisplay}</a>
      </p>
    </LegalPage>
  );
}
