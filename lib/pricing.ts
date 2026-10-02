export type PricingPlan = {
  slug: string;
  name: string;
  /** Monthly price in RM. */
  monthly: number;
  /** One-time setup fee in RM. */
  setup: number;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    slug: "launch",
    name: "Launch",
    monthly: 427,
    setup: 300,
    description: "Small teams that need a clear system.",
    // "CRM" is a forbidden word (DESIGN.md §8).
    features: ["Lead capture and pipeline", "Booking page", "Basic automation", "Daily brief"],
  },
  {
    slug: "growth",
    name: "Growth",
    monthly: 797,
    setup: 600,
    description: "Teams ready to automate.",
    features: [
      "Everything in Launch",
      "AI Sales Director",
      "AI Follow-up Specialist",
      "WhatsApp, Instagram, Facebook, Email",
      "Team reporting",
    ],
    highlighted: true,
  },
  {
    slug: "scale",
    name: "Scale",
    monthly: 1497,
    setup: 1000,
    description: "10+ staff or multiple outlets.",
    features: [
      "Everything in Growth",
      "AI Operations Manager",
      "AI Admin Assistant",
      "Multiple pipelines",
      "Priority support",
    ],
  },
];

/** First-year cost: twelve months plus setup. */
export const yearOne = (plan: PricingPlan) => plan.monthly * 12 + plan.setup;

export const pricingCopy = {
  title: "One system. One price. No surprises.",
  lead: "RM427 per month. RM14 per day. If 10X helps you close one extra deal this year, it pays for itself.",
  compare: "Compare: one junior hire costs RM2,500-3,500/month. 10X does the same work for a fraction.",
} as const;
