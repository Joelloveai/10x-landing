export type PricingPlan = {
  slug: string;
  name: string;
  foundingPrice: string;
  regularPrice: string;
  setupPrice: string;
  description: string;
  highlighted?: boolean;
  cta: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    slug: "launch",
    name: "Launch",
    foundingPrice: "RM427",
    regularPrice: "RM599",
    setupPrice: "RM300",
    description: "For teams that need a simple system for leads and follow-up.",
    cta: "Get Free Audit",
  },
  {
    slug: "growth",
    name: "Growth",
    foundingPrice: "RM799",
    regularPrice: "RM1,199",
    setupPrice: "RM500",
    description: "For teams ready to automate more of the customer journey.",
    highlighted: true,
    cta: "Get Free Audit",
  },
  {
    slug: "scale",
    name: "Scale",
    foundingPrice: "RM1,499+",
    regularPrice: "RM1,999+",
    setupPrice: "RM1,000+",
    description: "For businesses requiring deeper workflows and custom implementation.",
    cta: "Talk to Sales",
  },
];
