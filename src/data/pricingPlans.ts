export type PricingPlanId = "foundation" | "connect" | "marketing";

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  shortName: string;
  price: number;
  priceLabel: string;
  priceNote?: string;
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
      "Up to 5-page website with contact form and click-to-call",
      "One managed Google Business Profile + 2 posts/month",
      "Review-request emails, one reminder, and response support",
      "Review link, QR code, and website review showcase",
      "Local SEO setup + monthly text and photo updates",
      "Hosting, maintenance, and a monthly performance report",
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
    id: "marketing",
    name: "Hometown Local Marketing",
    shortName: "Local Marketing",
    price: 699,
    priceNote: "Plus your ad budget, paid directly to Google",
    minimumMonths: 12,
    websiteSize: "Up to 5 pages + 1 campaign landing page",
    bestFor: "Your website, local visibility, and Google Search campaign, managed together.",
    featured: false,
    ctaLabel: "Explore Local Marketing",
    highlights: [
      "Everything in Connect, including integrations and GBP",
      "One managed Google Search Ads campaign",
      "Keyword targeting, ad copy, and monthly optimization",
      "Call/form conversion tracking where supported",
      "Focused landing page and ongoing improvements",
      "Monthly local SEO work based on your priorities",
      "A combined website, Google profile, and campaign report",
    ],
    notIncluded: [
      "Ad spend, paid separately to Google",
      "Third-party software, messaging, or call-tracking usage",
      "Additional campaigns or ad platforms",
      "Full social media management or video production",
      "Guaranteed leads, rankings, or sales",
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
  leader: "Local Marketing",
  "local-marketing": "Local Marketing",
};

export function getPlanById(id: string | null) {
  if (!id || !Object.hasOwn(planLabelsById, id)) return undefined;
  return pricingPlans.find((plan) => plan.shortName === planLabelsById[id]);
}
