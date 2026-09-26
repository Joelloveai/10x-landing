import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the 10X website. Draft pending legal review.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const { company, contact } = siteConfig;
  return (
    <LegalPage title="Terms of Use" updated="26 September 2026">
      <p>
        These draft terms cover use of the 10X marketing website operated by {company.name} (Registration{" "}
        {company.registration}), Malaysia. Terms for the 10X software subscription are provided separately when you sign
        up.
      </p>

      <h2>Information on this website</h2>
      <p>
        We aim to keep information on this website accurate. Product demos on this website use illustrative data.
        Capabilities marked &ldquo;Coming soon&rdquo;, &ldquo;Rollout in progress&rdquo; or &ldquo;Integration-dependent&rdquo;
        are not yet generally available.
      </p>

      <h2>Estimates</h2>
      <p>
        The opportunity calculator produces estimates from the assumptions you enter. It is an illustration, not a promise
        or guarantee of results.
      </p>

      <h2>Pricing</h2>
      <p>
        Prices shown are in Malaysian ringgit. Founding prices apply as described on the pricing section. Final pricing and
        plan scope are confirmed in writing before any subscription starts. [Subscription terms to be finalised during
        legal review.]
      </p>

      <h2>Free Lead Leakage Audit</h2>
      <p>The audit is free and carries no obligation to buy.</p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${contact.email}`}>{contact.email}</a> · <a href={`tel:${contact.phoneE164}`}>{contact.phoneDisplay}</a>
      </p>
    </LegalPage>
  );
}
