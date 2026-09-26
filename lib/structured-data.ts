import { faqs } from "./faq";
import { pricingPlans } from "./pricing";
import { siteConfig } from "./site-config";

const priceNumber = (p: string) => Number(p.replace(/[^\d.]/g, ""));

/** JSON-LD for the homepage. Contains only visible, factual content. No ratings or reviews. */
export function homepageJsonLd() {
  const { url, company, contact } = siteConfig;
  const orgId = `${url}/#organization`;
  const prices = pricingPlans.map((p) => priceNumber(p.foundingPrice));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: company.name,
        legalName: company.name,
        url,
        logo: `${url}/icon.svg`,
        email: contact.email,
        telephone: contact.phoneE164,
        address: { "@type": "PostalAddress", addressCountry: company.countryCode },
        identifier: { "@type": "PropertyValue", propertyID: "SSM Registration Number", value: company.registration },
        brand: { "@type": "Brand", name: "10X" },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: contact.email,
          telephone: contact.phoneE164,
          areaServed: "MY",
          availableLanguage: ["en", "ms"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: "10X",
        inLanguage: "en-MY",
        publisher: { "@id": orgId },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${url}/#software`,
        name: "10X",
        url,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: siteConfig.description,
        publisher: { "@id": orgId },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "MYR",
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: pricingPlans.length,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
