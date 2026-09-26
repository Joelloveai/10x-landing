import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Data Deletion",
  description: "How to ask 10X to delete information you submitted. Draft pending legal review.",
  alternates: { canonical: "/data-deletion" },
};

export default function DataDeletionPage() {
  const { contact } = siteConfig;
  return (
    <LegalPage title="Data Deletion" updated="26 September 2026">
      <p>You can ask us to delete the information you submitted through this website at any time.</p>

      <h2>How to request deletion</h2>
      <ul>
        <li>
          Email <a href={`mailto:${contact.email}?subject=Data%20deletion%20request`}>{contact.email}</a> with the subject
          &ldquo;Data deletion request&rdquo;.
        </li>
        <li>Include the WhatsApp number you submitted, so we can find your record.</li>
        <li>
          Or message us on <a href={contact.whatsappUrl}>WhatsApp</a> from the same number.
        </li>
      </ul>

      <h2>What happens next</h2>
      <p>
        We may contact you to confirm the request comes from you. We will confirm once your information has been deleted.
        [Response timeframe and any retention exceptions to be confirmed during legal review.]
      </p>

      <h2>If you use the 10X software</h2>
      <p>
        Business customers who use 10X to manage their own customers&apos; data should contact us at{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a> for account and workspace data requests.
      </p>
    </LegalPage>
  );
}
