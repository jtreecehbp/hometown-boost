import { pricingPlans } from "./pricingPlans";

const configuredUrl = import.meta.env.PUBLIC_SITE_URL || "https://hometownboost.com";
const startingPriceMonthly = pricingPlans[0].priceLabel.replace("/mo", "/month");

export const siteConfig = {
  name: "Hometown Boost",
  tagline: "Websites and local marketing for hometown businesses.",
  description:
    `Professional websites for hometown businesses with no setup fees. Hometown Boost builds, hosts, and supports websites for local service businesses starting at ${startingPriceMonthly}.`,
  url: configuredUrl.replace(/\/$/, ""),
  email: "hello@hometownboost.com",
  phone: "",
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
  },
  defaultCta: {
    label: "Find my plan",
    href: "/contact/",
  },
};
