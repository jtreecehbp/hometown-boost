import { googleAdsPricing, pricingPlans } from "./pricingPlans";

const startingPriceMonthly = pricingPlans[0].priceLabel.replace("/mo", "/month");

export const pageMetadata = {
  home: {
    title: "Hometown Boost | Websites & Local Marketing for Local Businesses",
    description:
      `Help customers find your business and get in touch. Website design, hosting, and ongoing care from ${startingPriceMonthly} with $0 setup. Minimum terms apply.`,
  },
  pricing: {
    title: "Pricing | Hometown Boost Website Plans",
    description:
      `Simple monthly website plans starting at ${startingPriceMonthly} with no setup fee, hosting included, maintenance included, and clear minimum commitments.`,
  },
  services: {
    title: "Services | Hometown Boost",
    description:
      "Website design, hosting, maintenance, local SEO foundation, Google Business Profile support, review tools, and optional Google Ads management.",
  },
  howItWorks: {
    title: "How It Works | Hometown Boost",
    description:
      "See the simple Hometown Boost process: choose a plan, send your business basics, review the site, launch, and keep your website maintained.",
  },
  industries: {
    title: "Industries We Serve | Hometown Boost",
    description:
      "Websites and local marketing support for plumbers, HVAC companies, electricians, roofers, landscapers, lawn care, towing companies, shops, and other local businesses.",
  },
  googleAds: {
    title: "Google Ads Management | Hometown Boost",
    description:
      `Simple Google Search Ads management for local businesses, priced at ${googleAdsPricing.formulaLabel}.`,
  },
  about: {
    title: "About Hometown Boost | Practical Website Help for Local Businesses",
    description:
      "Hometown Boost helps local businesses get professional websites, hosting, maintenance, and practical local visibility support without a big upfront website bill.",
  },
  faq: {
    title: "FAQ | Hometown Boost",
    description:
      "Answers to common questions about Hometown Boost website plans, pricing, hosting, SEO, Google Business Profile help, and Google Ads management.",
  },
  contact: {
    title: "Find Your Website Plan | Hometown Boost",
    description:
      "Tell us what your business needs. Get a website plan recommendation by email, with clear pricing and scope before you commit.",
  },
  resources: {
    title: "Resources | Hometown Boost",
    description:
      "Helpful website, local SEO, Google Business Profile, and Google Ads resources for local businesses.",
  },
  privacy: {
    title: "Privacy Policy | Hometown Boost",
    description:
      "Read the basic Hometown Boost privacy policy for website visitors and prospective clients.",
  },
  terms: {
    title: "Terms of Service | Hometown Boost",
    description:
      "Read the basic Hometown Boost terms of service for website visitors and prospective clients.",
  },
};
