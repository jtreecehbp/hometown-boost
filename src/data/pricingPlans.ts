export type PricingPlanId = "lite" | "starter" | "growth" | "leader";

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

export const pricingPlans: PricingPlan[] = [
  {
    id: "lite",
    name: "Hometown Lite",
    shortName: "Lite",
    price: 99,
    priceLabel: "$99/mo",
    setupFeeLabel: "$0 setup fee",
    minimumTerm: "24-month minimum",
    minimumMonths: 24,
    minimumCommitment: "$2,376",
    websiteSize: "1-page website",
    bestFor: "Very small businesses that need a simple web presence.",
    featured: false,
    ctaLabel: "Start Simple",
    ctaHref: "/contact/?plan=lite",
    highlights: [
      "1-page website",
      "Mobile-friendly design",
      "Hosting included",
      "SSL/security included",
      "Click-to-call button",
      "Contact form",
      "Basic SEO setup",
      "Business info setup",
      "Quarterly small update",
      "Basic maintenance",
    ],
    notIncluded: [
      "Ongoing SEO",
      "Monthly Google Business Profile posting",
      "Monthly reports",
      "Advanced copywriting",
      "Blogs",
      "Service-area pages",
      "Google Ads management",
      "Unlimited edits",
    ],
  },
  {
    id: "starter",
    name: "Hometown Starter",
    shortName: "Starter",
    price: 179,
    priceLabel: "$179/mo",
    setupFeeLabel: "$0 setup fee",
    minimumTerm: "12-month minimum",
    minimumMonths: 12,
    minimumCommitment: "$2,148",
    websiteSize: "1-3 page website",
    bestFor: "Businesses that need a more complete online presence.",
    featured: false,
    ctaLabel: "Get a Professional Site",
    ctaHref: "/contact/?plan=starter",
    highlights: [
      "1-3 page website",
      "Mobile-friendly design",
      "Hosting included",
      "SSL/security included",
      "Basic maintenance",
      "Contact form",
      "Click-to-call buttons",
      "Basic SEO setup",
      "Google Business Profile checkup",
      "Monthly small edit",
      "Quarterly report",
    ],
    notIncluded: [
      "Ongoing SEO campaigns",
      "Citation cleanup",
      "Blog writing",
      "Google Ads management",
      "Monthly Google Business Profile posts",
      "Advanced landing pages",
    ],
  },
  {
    id: "growth",
    name: "Hometown Growth",
    shortName: "Growth",
    price: 329,
    priceLabel: "$329/mo",
    setupFeeLabel: "$0 setup fee",
    minimumTerm: "12-month minimum",
    minimumMonths: 12,
    minimumCommitment: "$3,948",
    websiteSize: "Up to 5-page website",
    bestFor: "Local service businesses that want more calls and better local visibility.",
    featured: true,
    badge: "Recommended",
    ctaLabel: "Get More Leads",
    ctaHref: "/contact/?plan=growth",
    highlights: [
      "Up to 5-page website",
      "Mobile-first lead-focused design",
      "Hosting included",
      "SSL/security included",
      "Website maintenance",
      "Local SEO foundation",
      "Google Business Profile optimization",
      "Review link / QR setup",
      "Lead-focused contact setup",
      "1 Google Business Profile post per month",
      "Monthly edits",
      "Monthly report",
      "Trust-building sections",
    ],
    notIncluded: [
      "Blog writing unless added",
      "Google Ads management unless added",
      "Full citation campaigns unless added",
      "Advanced CRM setup",
      "Guaranteed rankings",
    ],
  },
  {
    id: "leader",
    name: "Hometown Leader",
    shortName: "Leader",
    price: 549,
    priceLabel: "$549/mo",
    setupFeeLabel: "$0 setup fee",
    minimumTerm: "12-month minimum",
    minimumMonths: 12,
    minimumCommitment: "$6,588",
    websiteSize: "Up to 8-10 page website",
    bestFor: "Established businesses that want stronger ongoing visibility.",
    featured: false,
    ctaLabel: "Grow My Visibility",
    ctaHref: "/contact/?plan=leader",
    highlights: [
      "Up to 8-10 page website",
      "Everything in Growth",
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
  },
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

export const planLabelsById = Object.fromEntries(
  pricingPlans.map((plan) => [plan.id, plan.shortName]),
) as Record<PricingPlanId, string>;

export function getPlanById(id: string | null) {
  return pricingPlans.find((plan) => plan.id === id);
}
