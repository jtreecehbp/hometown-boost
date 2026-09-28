export type PricingPlanId = "foundation" | "connect" | "leader";

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  shortName: string;
  price: number;
  priceLabel: string;
  setupFeeLabel: string;
  minimumTerm: string;
  minimumMonths: number;
  minimumCommitment: string;
  websiteSize: string;
  bestFor: string;
  featured: boolean;
  badge?: string;
  ctaLabel: string;
  ctaHref: string;
  highlights: string[];
  notIncluded: string[];
};

export const everyPlanFeatures = [
  "Website design, hosting, security, and maintenance",
  "Ongoing management of one Google Business Profile",
  "Two Google Business Profile posts each month",
  "Review requests, review link, and QR-code setup",
  "Monthly website text and photo updates",
  "Website and Google performance tracking and reporting",
];

export const integrationScopeNote = "We confirm the supported tools, connections, and workflows with you before work begins. Any third-party subscriptions, messaging usage, or custom development outside the agreed scope are explained and quoted separately.";

function definePlan(plan: Omit<PricingPlan, "priceLabel" | "setupFeeLabel" | "minimumTerm" | "minimumCommitment" | "ctaHref">): PricingPlan {
  return {
    ...plan,
    priceLabel: `$${plan.price}/mo`,
    setupFeeLabel: "$0 setup fee",
    minimumTerm: `${plan.minimumMonths}-month minimum`,
    minimumCommitment: `$${(plan.price * plan.minimumMonths).toLocaleString("en-US")}`,
    ctaHref: `/contact/?plan=${plan.id}`,
  };
}

export const pricingPlans: PricingPlan[] = [
  definePlan({
    id: "foundation",
    name: "Hometown Foundation",
    shortName: "Foundation",
    price: 129,
    minimumMonths: 12,
    websiteSize: "Up to 5-page website",
    bestFor: "Your website and Google Business Profile, handled together.",
    featured: false,
    ctaLabel: "Start with Foundation",
    highlights: [
      "Up to 5-page mobile-friendly website",
      "Ongoing Google Business Profile management",
      "2 Google Business Profile posts per month",
      "Review-request emails and one reminder",
      "Review link, QR code, and website review showcase",
      "Review monitoring and response support",
      "Contact form, click-to-call, and local SEO setup",
      "Monthly website updates and performance report",
      "Hosting, security, and maintenance included",
    ],
    notIncluded: [
      "CRM or job-software integrations",
      "Booking workflows and automated inquiry follow-up",
      "Ongoing SEO campaigns or new page creation",
      "Google Ads management and advertising spend",
    ],
  }),
  definePlan({
    id: "connect",
    name: "Hometown Connect",
    shortName: "Connect",
    price: 249,
    minimumMonths: 12,
    websiteSize: "Up to 5-page website",
    bestFor: "Your website, business tools, and customer follow-up working together.",
    featured: true,
    badge: "Integrations + automation",
    ctaLabel: "Explore Connect",
    highlights: [
      "Everything in Foundation, including GBP management",
      "Supported CRM or job-software connections",
      "Online booking and calendar integration",
      "Automatic inquiry acknowledgment and follow-up",
      "Lead and customer information synced to your tools",
      "Integration setup, testing, and ongoing monitoring",
      "Troubleshooting and agreed workflow adjustments",
      "Inquiry-source reporting where supported",
    ],
    notIncluded: [
      "Third-party software subscriptions or messaging usage",
      "Custom software development or unsupported integrations",
      "Ongoing SEO campaigns or new page creation",
      "Google Ads management and advertising spend",
    ],
  }),
  definePlan({
    id: "leader",
    name: "Hometown Leader",
    shortName: "Leader",
    price: 599,
    minimumMonths: 12,
    websiteSize: "Up to 8-10 page website",
    bestFor: "More service and area pages, ongoing SEO, and priority updates.",
    featured: false,
    ctaLabel: "Ask about Leader",
    highlights: [
      "Up to 8-10 page website",
      "Website care, GBP management, and review support",
      "Expanded service pages",
      "Service-area SEO pages",
      "Ongoing SEO improvements",
      "Citation cleanup starter",
      "Review growth support",
      "Priority updates",
      "Quarterly strategy call",
      "Monthly reporting",
    ],
    notIncluded: [
      "Ad spend",
      "Full social media management",
      "Large-scale SEO campaign",
      "Guaranteed rankings",
      "Video production",
    ],
  }),
];

export const googleAdsPricing = {
  baseManagementFeeLabel: "$150/month",
  adSpendPercentageLabel: "15%",
  formulaLabel: "$150/month + 15% of monthly ad spend",
  note: "Ad spend is separate and paid directly to Google.",
  examples: [
    {
      adSpend: "$300",
      managementFee: "$195",
      totalInvestment: "$495",
    },
    {
      adSpend: "$500",
      managementFee: "$225",
      totalInvestment: "$725",
    },
    {
      adSpend: "$1,000",
      managementFee: "$300",
      totalInvestment: "$1,300",
    },
    {
      adSpend: "$2,000",
      managementFee: "$450",
      totalInvestment: "$2,450",
    },
  ],
};

export const planInterestOptions = [
  "Not sure yet",
  ...pricingPlans.map((plan) => plan.shortName),
];

// Keep previously shared plan links useful after the two-plan consolidation.
export const planLabelsById: Record<string, string> = {
  ...Object.fromEntries(pricingPlans.map((plan) => [plan.id, plan.shortName])),
  lite: "Foundation",
  starter: "Foundation",
  growth: "Connect",
};

export function getPlanById(id: string | null) {
  if (!id || !Object.hasOwn(planLabelsById, id)) return undefined;
  return pricingPlans.find((plan) => plan.shortName === planLabelsById[id]);
}
