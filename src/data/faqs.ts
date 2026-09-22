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
        answer: "No. Every website plan has a $0 setup fee. Your website build and ongoing support are covered by the monthly plan, with a 24-month minimum for Lite and a 12-month minimum for Starter, Growth, and Leader.",
      },
      {
        question: "Why are there minimum terms?",
        answer:
          "The minimum term spreads the cost of your website build, hosting, maintenance, and support over monthly payments. You can see both the monthly price and the total minimum commitment for each plan on the Pricing page.",
      },
      {
        question: "Why is Lite a 24-month plan?",
        answer:
          "Lite has our lowest monthly price. Its 24-month minimum spreads the cost of building and supporting your one-page website over a longer period.",
      },
      {
        question: "Can I upgrade later?",
        answer:
          "Yes. You can move to a higher plan when you need more pages or support. Get in touch to discuss the right scope for your business.",
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
        question: "Which plan is right for my business?",
        answer:
          "Lite gives you a simple one-page website. Starter adds room for more information and a small monthly edit. Growth pairs a website of up to five pages with Google Business Profile support. Leader adds more service and service-area pages, ongoing SEO improvements, and priority updates. If you’re unsure, tell us about your business and we’ll recommend a starting point.",
      },
      {
        question: "Is hosting included?",
        answer: "Yes. Every website plan includes hosting, SSL/security, and maintenance, so your website and its ongoing care are covered by one monthly plan.",
      },
      {
        question: "Do you write the content?",
        answer:
          "We include reasonable content help based on your plan, using the business and service details you provide. Larger copywriting projects, blog posts, or extensive page writing may be quoted separately.",
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
          "We handle updates according to your plan. Lite includes a quarterly small update, Starter includes a small monthly edit, Growth includes monthly edits, and Leader includes priority monthly updates.",
      },
      {
        question: "What do you need from me to start?",
        answer:
          "Start with your business name, contact details, services, service area, and hours. A logo, business photos, and your current website are helpful if you have them. When it’s time to build, we’ll also need any required domain access and the details customers should know before contacting you.",
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
          "Yes. Starter includes a Google Business Profile checkup. Growth and Leader include profile optimization, review link / QR setup, and one profile post per month.",
      },
      {
        question: "Are results guaranteed?",
        answer:
          "No. Search rankings, lead volume, ad results, and revenue depend on your market, competition, and other factors outside our control. We focus on a useful website, a clear path to contact you, and practical support for your local visibility.",
      },
      {
        question: "What is local SEO foundation?",
        answer:
          "It’s the website structure and page setup that helps search engines understand what you do and where you work. Growth includes this foundation; Leader adds ongoing SEO improvements and service-area pages.",
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
          "You pay your ad budget directly to Google. Hometown Boost charges the monthly management fee separately.",
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
          "The offer covers one primary Google Search campaign for your main service or priority offer, targeted to your service area. Meta, TikTok, display, video, and advanced campaign types are outside this offer.",
      },
      {
        question: "Is Google Ads included?",
        answer:
          "No. Google Ads management is optional. Ad spend is separate and paid directly to Google, and the management fee is separate from website plan pricing unless a written scope says otherwise.",
      },
      {
        question: "Can I add Google Ads?",
        answer:
          "Yes. Google Ads management is optional and is usually best for Growth and Leader clients, or Starter clients with a ready landing page. We can help you assess your services, service area, and website before you start.",
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
