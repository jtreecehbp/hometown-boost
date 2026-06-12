import { googleAdsPricing } from "./pricingPlans";

export type FAQ = {
  question: string;
  answer: string;
};

export type FAQCategory = {
  title: string;
  items: FAQ[];
};

export const faqCategories: FAQCategory[] = [
  {
    title: "Pricing",
    items: [
      {
        question: "Are there setup fees?",
        answer: "No. Hometown Boost website plans do not require setup fees.",
      },
      {
        question: "Why are there minimum terms?",
        answer:
          "Minimum terms make the no-setup-fee model possible. The website build, hosting, maintenance, and support are spread across the minimum service term instead of being charged as a large upfront website bill.",
      },
      {
        question: "Why is Lite a 24-month plan?",
        answer:
          "Lite is the lowest-cost entry plan. The 24-month minimum helps spread the cost of building and supporting the site over time while keeping the monthly price low.",
      },
      {
        question: "Can I upgrade later?",
        answer:
          "Yes. Clients can move into a higher plan as their business grows or their needs change.",
      },
      {
        question: "What happens after the minimum term?",
        answer:
          "After the minimum term is complete and the account is paid in full, the plan continues month to month unless canceled with 30 days' written notice. Clients can also discuss upgrading, reducing scope, or requesting a website export if they want to move in a different direction.",
      },
      {
        question: "What happens if I cancel?",
        answer:
          "You can request cancellation at any time, but the selected plan's minimum term still applies. After the minimum term is complete and all outstanding balances are paid, service may continue month to month unless canceled with 30 days' written notice.",
      },
    ],
  },
  {
    title: "Website Plans",
    items: [
      {
        question: "Is hosting included?",
        answer: "Yes. Hosting and SSL/security are included with the website plans.",
      },
      {
        question: "Do you write the content?",
        answer:
          "Hometown Boost includes reasonable content help based on the plan. Larger copywriting needs, blog posts, or extensive page writing may be quoted separately.",
      },
      {
        question: "What if I need more pages?",
        answer:
          "Extra website pages, service-area pages, blog posts, landing pages, and other add-ons can be quoted before work begins. We will explain the scope and cost before adding anything outside your plan.",
      },
      {
        question: "What does maintenance include?",
        answer:
          "Maintenance includes hosting support, SSL/security basics, plan-based small content updates, basic upkeep, and help keeping the published site current. Larger redesigns, major copywriting, new page builds, advanced integrations, or rush work may be quoted separately.",
      },
      {
        question: "Can I update my site?",
        answer:
          "Yes. Update support depends on the plan. Lite includes a quarterly small update, Starter includes a small monthly edit, Growth includes monthly edits, and Leader includes priority monthly updates.",
      },
      {
        question: "What do you need from me to start?",
        answer:
          "Helpful starting items include your business name, logo, contact info, services, service area, hours, photos if available, existing website if any, domain access if available, and any details customers need to know before contacting you.",
      },
      {
        question: "Do I own the website?",
        answer:
          "You own the business information, photos, logos, and written materials you provide. Hometown Boost may use its own systems, tools, design patterns, and code to build and maintain the site. After the minimum term is complete and the account is paid in full, you may request a static export of the published website content and files where technically practical. Hosting, forms, third-party tools, paid licenses, automations, and proprietary systems are not included unless agreed in writing.",
      },
    ],
  },
  {
    title: "SEO and Google Business Profile",
    items: [
      {
        question: "Can you help with my Google Business Profile?",
        answer:
          "Yes. The level of help depends on the plan. Starter includes a checkup, while Growth and Leader include more optimization support.",
      },
      {
        question: "Are results guaranteed?",
        answer:
          "No. No honest provider can guarantee rankings, lead volume, ad results, revenue, or specific business outcomes. Hometown Boost focuses on building a stronger online foundation, improving presentation, making your business easier to contact, and supporting practical local visibility.",
      },
      {
        question: "What is local SEO foundation?",
        answer:
          "Local SEO foundation means the basic website structure and page setup that helps search engines understand your business, services, and service area.",
      },
    ],
  },
  {
    title: "Google Ads",
    items: [
      {
        question: "How does Google Ads pricing work?",
        answer: `Google Ads management is ${googleAdsPricing.formulaLabel}. ${googleAdsPricing.note}`,
      },
      {
        question: "Who pays the Google Ads budget?",
        answer:
          "The client pays Google directly for ad spend. Hometown Boost charges a separate management fee.",
      },
      {
        question: "Is ad spend included in the management fee?",
        answer: "No. Ad spend is separate and paid directly to Google.",
      },
      {
        question: "Do you guarantee Google Ads results?",
        answer:
          "No. Ads can help drive targeted traffic, but lead volume, cost per lead, and results depend on the market, budget, offer, competition, website, and follow-up.",
      },
      {
        question: "What kind of ads do you manage?",
        answer:
          "Hometown Boost starts with Google Search Ads only. Meta, TikTok, display, video, and advanced campaign types are not part of the starter ads offer.",
      },
      {
        question: "Is Google Ads included?",
        answer:
          "No. Google Ads management is optional. Ad spend is separate and paid directly to Google, and the management fee is separate from website plan pricing unless a written scope says otherwise.",
      },
      {
        question: "Can I add Google Ads?",
        answer:
          "Yes. Google Ads management is optional and is usually best for Growth and Leader clients, or Starter clients with a ready landing page.",
      },
    ],
  },
  {
    title: "Terms and Support",
    items: [
      {
        question: "How do updates work?",
        answer:
          "Update support depends on the plan. Lite includes a quarterly small update, Starter includes a small monthly edit, Growth includes monthly edits, and Leader includes priority monthly updates. Larger redesigns, major copywriting, new page builds, advanced integrations, or rush requests may be quoted separately.",
      },
    ],
  },
];

export const allFaqs = faqCategories.flatMap((category) => category.items);

export function selectFaqs(questions: string[]) {
  return allFaqs.filter((faq) => questions.includes(faq.question));
}
