export type PricingPlan = {
  slug: string;
  name: string;
  /** Monthly price in RM. */
  monthly: number;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    slug: "starter",
    name: "Starter",
    monthly: 99,
    description: "Solo owners who need every enquiry answered.",
    // "CRM" is a forbidden word (DESIGN.md §8).
    features: ["Lead capture and pipeline", "Booking page", "Basic automation", "Daily brief"],
  },
  {
    slug: "business",
    name: "Business",
    monthly: 397,
    description: "Teams ready to automate follow-up.",
    features: [
      "Everything in Starter",
      "AI Sales Director",
      "AI Follow-up Specialist",
      "WhatsApp, Instagram, Facebook, Email",
      "Team reporting",
    ],
    highlighted: true,
  },
  {
    slug: "operator",
    name: "Operator",
    monthly: 897,
    description: "10+ staff or multiple outlets.",
    features: [
      "Everything in Business",
      "AI Operations Manager",
      "AI Admin Assistant",
      "Multiple pipelines",
      "Priority support",
    ],
  },
];

export const pricingCopy = {
  title: "Start free. Pick a plan after.",
  lead: "7 days free. Full access. We set it up with you.",
  compare: "Compare: one junior hire costs RM2,500-3,500/month. 10X does the same work for a fraction.",
} as const;
