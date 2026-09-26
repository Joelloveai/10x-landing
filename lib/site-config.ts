export const siteConfig = {
  name: "10X",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tenx.my").replace(/\/$/, ""),
  title: "10X | Stop Losing Leads After 6 PM",
  description:
    "10X helps Malaysian service businesses capture enquiries, respond faster, book appointments and keep follow-up moving.",
  company: {
    name: "BTB SOLUTIONS Sdn Bhd",
    shortName: "BTB SOLUTIONS",
    registration: "202503175924",
    country: "Malaysia",
    countryCode: "MY",
  },
  contact: {
    email: "admin@tenx.my",
    phoneDisplay: "+60 12-372 8392",
    phoneE164: "+60123728392",
    whatsappUrl: `https://wa.me/60123728392?text=${encodeURIComponent(
      "Hi 10X, I'd like to ask about the Lead Leakage Audit.",
    )}`,
  },
  cta: {
    primary: "Get Your Free Lead Leakage Audit",
    primaryShort: "Get Free Audit",
    secondary: "See How It Works",
    formSubmit: "Get My Free Audit",
    microcopy: "Free 15-minute review. No obligation.",
  },
  /** Founding offer. Only rendered while `enabled` is true. */
  foundingOffer: {
    enabled: true,
    customerLimit: 10,
  },
  copyrightYear: 2026,
} as const;

export const sectionIds = {
  product: "product",
  solutions: "solutions",
  howItWorks: "how-it-works",
  pricing: "pricing",
  security: "security",
  audit: "audit",
} as const;

export const navLinks = [
  { label: "Product", href: `#${sectionIds.product}` },
  { label: "Solutions", href: `#${sectionIds.solutions}` },
  { label: "How It Works", href: `#${sectionIds.howItWorks}` },
  { label: "Pricing", href: `#${sectionIds.pricing}` },
  { label: "Security", href: `#${sectionIds.security}` },
] as const;

/**
 * Honest product status. Update this list as capabilities go live.
 * Only items under `availableNow` may be described as current capabilities.
 */
export const productStatus = {
  availableNow: [
    "Lead capture and forms",
    "Contact management",
    "Opportunities and pipelines",
    "Calendars and booking pages",
    "Websites and funnels",
    "Staff management and ownership",
    "Private multi-tenant workspaces",
  ],
  comingTo10x: [
    { label: "AI employee", status: "Rollout in progress" },
    { label: "WhatsApp message sending", status: "Integration-dependent" },
    { label: "Outbound email sequences", status: "Rollout in progress" },
    { label: "Payments and payment reminders", status: "Coming soon" },
    { label: "Advanced reporting", status: "Coming soon" },
  ],
} as const;
