import { googleAdsPricing } from "./pricingPlans";

export const adsOffer = {
  name: "Google Ads Management",
  formula: googleAdsPricing.formulaLabel,
  summary:
    "An optional add-on for businesses that want to test or grow lead generation through simple Google Search campaigns.",
  terms: [
    "Available primarily for Growth and Leader clients",
    "Starter clients may qualify if their site or landing page is ready",
    "Client pays ad spend directly to Google",
    "Hometown Boost charges the management fee separately",
    "3-month minimum recommended",
    "Google Search Ads only to start",
    "Basic call/form conversion tracking included where possible",
    "No guaranteed leads",
    "No guaranteed cost per lead",
    "No guaranteed rankings",
  ],
};

export const adsPricingExamples = googleAdsPricing.examples.map((example) => ({
  adSpend: example.adSpend,
  managementFee: example.managementFee,
  total: example.totalInvestment,
}));

export const adsIncludes = [
  "One ad platform",
  "Google Search Ads",
  "One primary campaign",
  "Basic keyword setup",
  "Negative keywords",
  "Ad copywriting",
  "Location targeting",
  "Basic conversion tracking",
  "Monthly optimization",
  "Monthly reporting",
];

export const adsNotIncluded = [
  "Ad spend itself",
  "Meta/Facebook Ads",
  "TikTok Ads",
  "Video ads",
  "Display campaigns",
  "Advanced funnels",
  "Daily hands-on management",
  "Guaranteed lead volume",
  "Landing page design unless included in website plan or quoted separately",
];
