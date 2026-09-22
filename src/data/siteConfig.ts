import { pricingPlans } from "./pricingPlans";

const configuredUrl = import.meta.env.PUBLIC_SITE_URL || "https://hometownboost.com";
const startingPriceMonthly = pricingPlans[0].priceLabel.replace("/mo", "/month");

export const siteConfig = {
  name: "Hometown Boost",
  tagline: "Websites and local marketing for local businesses.",
  description:
    `Website design, hosting, and ongoing care for local businesses from ${startingPriceMonthly} with $0 setup. Compare plans, support, and minimum terms.`,
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
