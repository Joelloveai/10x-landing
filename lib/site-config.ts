export const siteConfig = {
  name: "10X",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tenx.my").replace(/\/$/, ""),
  /** The signed-in product. "CRM" is a forbidden word, so the button says "Open app". */
  appUrl: "https://app.tenx.my",
  signInUrl: "https://app.tenx.my/sign-in",
  title: "10X | Your AI Operations Team",
  description:
    "Hire an AI operations team for a fraction of a human hire. Built for Malaysian service businesses.",
  company: {
    /** Public company name. Always exactly this. */
    name: "BTB SOLUTIONS",
    registration: "202503175924",
    country: "Malaysia",
    countryCode: "MY",
  },
  /** Public business contact only. Never add personal or founder contact details. */
  contact: {
    label: "Sales Team",
    email: "admin@tenx.my",
  },
  cta: {
    primary: "Join the waitlist",
    primaryShort: "Join the waitlist",
    secondary: "See How It Works",
    formSubmit: "Join the waitlist",
    microcopy: "We will message you on WhatsApp. No obligation.",
    app: "Open app",
    signIn: "Sign in",
    checkout: "Get started",
  },
  copyrightYear: 2026,
} as const;

export const salesMailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent("10X waitlist")}`;

export const sectionIds = {
  hero: "top",
  leak: "solutions",
  calculator: "calculator",
  howItWorks: "how-it-works",
  ai: "ai-employee",
  product: "product",
  pricing: "pricing",
  security: "security",
  audit: "audit",
} as const;

export const navLinks = [
  { label: "Solutions", href: `#${sectionIds.leak}` },
  { label: "How It Works", href: `#${sectionIds.howItWorks}` },
  { label: "AI Team", href: `#${sectionIds.ai}` },
  { label: "Pricing", href: `#${sectionIds.pricing}` },
  { label: "Security", href: `#${sectionIds.security}` },
] as const;

/** The seven chapters of the page, used by the focus rail and active navigation. */
export const chapters = [
  { id: sectionIds.hero, num: "01", label: "Overview" },
  { id: sectionIds.leak, num: "02", label: "The leak" },
  { id: sectionIds.howItWorks, num: "03", label: "How it works" },
  { id: sectionIds.ai, num: "04", label: "AI team" },
  { id: sectionIds.product, num: "05", label: "Product & proof" },
  { id: sectionIds.pricing, num: "06", label: "Pricing & trust" },
  { id: sectionIds.audit, num: "07", label: "Talk to us" },
] as const;
