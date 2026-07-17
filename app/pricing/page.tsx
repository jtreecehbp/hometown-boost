import { createPageMetadata } from "../page-metadata";
import {
  FinalCTA,
  PageHero,
  SectionTitle,
  SiteFooter,
  SiteHeader,
} from "../components";
import styles from "../core-pages.module.css";

export const metadata = createPageMetadata({
  title: "Hometown Boost Pricing",
  description:
    "Compare Hometown Lite, Starter, Growth, and Leader monthly website and local-marketing plans, starting at $99 per month with $0 setup fees.",
  path: "/pricing",
});

const everyPlanFeatures = [
  "$0 setup fee",
  "Website hosting",
  "SSL security",
  "Mobile-friendly design",
  "Ongoing website maintenance",
  "The ability to upgrade as the business grows",
] as const;

const plans = [
  {
    id: "hometown-lite",
    name: "Hometown Lite",
    price: "$99",
    term: "24-month minimum",
    commitment: "$2,376 minimum commitment",
    fit: "Lowest monthly cost",
    popular: false,
    description:
      "Best for very small businesses that need a simple, professional web presence at the lowest possible monthly cost.",
    features: [
      "One-page website",
      "Mobile-friendly design",
      "Website hosting",
      "SSL and basic website security",
      "Basic website maintenance",
      "Click-to-call phone button",
      "Contact or quote-request form",
      "Basic SEO setup",
      "Business information setup",
      "One small website update each quarter",
    ],
    exclusions: [
      "Ongoing SEO work",
      "Google Business Profile management",
      "Monthly Google Business Profile posts",
      "Monthly reports",
      "Blog writing",
      "Service-area pages",
      "Advanced copywriting",
      "Unlimited edits",
      "Google Ads management",
    ],
  },
  {
    id: "hometown-starter",
    name: "Hometown Starter",
    price: "$179",
    term: "12-month minimum",
    commitment: "$2,148 minimum commitment",
    fit: "A more complete starting point",
    popular: false,
    description:
      "Best for small businesses that need a more complete professional website and basic help getting their online presence in order.",
    features: [
      "One-to-three-page website",
      "Mobile-friendly design",
      "Website hosting",
      "SSL and basic website security",
      "Basic website maintenance",
      "Contact or quote-request form",
      "Click-to-call phone buttons",
      "Basic on-page SEO setup",
      "Google Business Profile checkup",
      "One small website edit each month",
      "Quarterly performance report",
    ],
    exclusions: [
      "Ongoing SEO campaigns",
      "Citation cleanup",
      "Monthly Google Business Profile posts",
      "Blog writing",
      "Advanced landing pages",
      "Google Ads management",
    ],
  },
  {
    id: "hometown-growth",
    name: "Hometown Growth",
    price: "$329",
    term: "12-month minimum",
    commitment: "$3,948 minimum commitment",
    fit: "Strong local growth support",
    popular: true,
    description:
      "Best for active local service businesses that want a stronger website, better local visibility, more trust, and more opportunities for calls and quote requests.",
    features: [
      "Website with up to five pages",
      "Mobile-first, lead-focused website design",
      "Website hosting",
      "SSL and basic website security",
      "Ongoing website maintenance",
      "Local SEO foundation",
      "Google Business Profile optimization",
      "Review-request link and QR-code setup",
      "Lead-focused contact and quote-request setup",
      "Click-to-call buttons",
      "Trust-building website sections",
      "One Google Business Profile post per month",
      "Monthly website edits",
      "Monthly performance report",
    ],
    exclusions: [
      "Blog writing unless added",
      "Full citation campaign unless added",
      "Service-area pages unless added",
      "Advanced CRM setup",
      "Google Ads management unless added",
      "Guaranteed rankings or lead volume",
    ],
  },
  {
    id: "hometown-leader",
    name: "Hometown Leader",
    price: "$549",
    term: "12-month minimum",
    commitment: "$6,588 minimum commitment",
    fit: "Expanded market leadership",
    popular: false,
    description:
      "Best for established businesses that want to compete across several services or locations and receive stronger ongoing SEO and visibility support.",
    features: [
      "Website with up to eight-to-ten pages",
      "Everything included in the Growth plan",
      "Expanded individual service pages",
      "Limited service-area SEO pages",
      "Ongoing SEO improvements",
      "Deeper Google Business Profile optimization",
      "One Google Business Profile post per month",
      "Citation-cleanup starter package",
      "Review-growth support",
      "Priority monthly website updates",
      "Monthly reporting",
      "Quarterly strategy call",
    ],
    exclusions: [
      "Paid advertising spend",
      "Full social-media management",
      "Large-scale or national SEO campaigns",
      "Video production",
      "Guaranteed rankings or lead volume",
    ],
  },
] as const;

const advertisingFeatures = [
  "Google Search Ads",
  "One primary advertising campaign",
  "Basic keyword research and setup",
  "Negative-keyword management",
  "Ad copywriting",
  "Geographic and service-area targeting",
  "Basic call and form conversion tracking where possible",
  "Monthly campaign optimization",
  "Monthly advertising report",
] as const;

const generalTerms = [
  "There are no setup fees because the website build and initial work are spread across the minimum service term.",
  "After the minimum term, service continues month to month.",
  "Clients may cancel after completing the minimum term with 30 days' written notice.",
  "Larger updates and services outside the selected plan are quoted before work begins.",
  "Hometown Boost does not guarantee rankings, leads, revenue, advertising performance, or other business outcomes.",
] as const;

const faqItems = [
  {
    question: "Is there a setup fee?",
    answer:
      "No. Every Hometown Boost plan has a $0 setup fee because the website build and initial work are spread across the minimum service term.",
  },
  {
    question: "What is the minimum service term?",
    answer:
      "Hometown Lite has a 24-month minimum. Hometown Starter, Growth, and Leader each have a 12-month minimum.",
  },
  {
    question: "What happens after the minimum term?",
    answer:
      "Service continues month to month. Clients may cancel after completing the minimum term with 30 days' written notice.",
  },
  {
    question: "Can a plan change later?",
    answer:
      "Yes. Every plan can be upgraded as the business grows. Any larger update or service outside the selected plan is quoted before work begins.",
  },
  {
    question: "Is Google Ads management included?",
    answer:
      "Google Ads management is optional at $150 per month plus 15% of monthly ad spend. The client pays Google directly for the advertising budget, which stays separate from the Hometown Boost management fee.",
  },
  {
    question: "Will rankings, leads, or revenue be guaranteed?",
    answer:
      "No. Hometown Boost does not guarantee rankings, leads, revenue, advertising performance, or other business outcomes.",
  },
] as const;

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

function PricingScene() {
  return (
    <div className={`${styles.heroScene} ${styles.pricingScene}`} aria-hidden="true">
      <div className={styles.pricingStack}>
        <span className={styles.pricingLayer}><b>Lite</b><i /><i /></span>
        <span className={styles.pricingLayer}><b>Starter</b><i /><i /><i /></span>
        <span className={styles.pricingLayer}><b>Growth</b><i /><i /><i /></span>
        <span className={styles.pricingLayer}><b>Leader</b><i /><i /><i /></span>
      </div>
      <span className={`${styles.pricingToken} ${styles.pricingTokenOne}`}>$0</span>
      <span className={`${styles.pricingToken} ${styles.pricingTokenTwo}`}>HB</span>
      <div className={styles.scenePanel}>Start with the right plan. Upgrade when the business is ready.</div>
      <div className={styles.sceneRing} />
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main-content" className={styles.main}>
        <PageHero
          hideDefaultArt
          eyebrow="Simple monthly pricing"
          title="Hometown Boost Pricing"
          description="Simple monthly website and local-marketing plans for hometown businesses. Plans start at $99 per month with $0 setup fees, clear minimum terms, and room to upgrade as your business grows."
        >
          <PricingScene />
        </PageHero>

        <nav className={styles.anchorNav} aria-label="Pricing sections">
          <a href="#every-plan">Every plan</a>
          <a href="#plans">Plans</a>
          <a href="#advertising">Google Ads</a>
          <a href="#general-terms">General terms</a>
          <a href="#pricing-faq">Questions</a>
        </nav>

        <section className={styles.sectionTint} id="every-plan">
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="Included from day one"
              title="Every plan includes the essentials."
              description="No setup fee, no separate hosting bill, and a website foundation designed to keep working as the business grows."
              align="center"
            />
            <ul className={styles.everyPlanGrid}>
              {everyPlanFeatures.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </div>
        </section>

        <section className={styles.section} id="plans">
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="Choose the right starting point"
              title="Four clear monthly plans."
              description="Compare the website size, ongoing support, minimum term, and included local-marketing work before choosing a plan."
              align="center"
            />
            <div className={styles.planGrid}>
              {plans.map((plan) => (
                <article
                  className={`${styles.planCard} ${plan.popular ? styles.planCardRecommended : ""}`}
                  id={plan.id}
                  key={plan.name}
                >
                  {plan.popular ? <span className={styles.recommended}>Most Popular</span> : null}
                  <p className={styles.planFit}>{plan.fit}</p>
                  <h2>{plan.name}</h2>
                  <p className={styles.planPrice}>
                    <strong>{plan.price}</strong>
                    <span>/month</span>
                  </p>
                  <p className={styles.planTerm}>
                    <strong>{plan.term}</strong>
                    <span>{plan.commitment}</span>
                  </p>
                  <p className={styles.planDescription}>{plan.description}</p>

                  <div className={styles.planSection}>
                    <h3>Includes</h3>
                    <ul className={styles.planList}>
                      {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  </div>

                  <div className={styles.planSection}>
                    <h3>Does not include</h3>
                    <ul className={styles.exclusionList}>
                      {plan.exclusions.map((exclusion) => <li key={exclusion}>{exclusion}</li>)}
                    </ul>
                  </div>

                  <a className={styles.textLink} href="/contact">
                    Talk through {plan.name}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionTint} id="advertising">
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="Optional Google Ads management"
              title="Add paid search when the foundation is ready."
              description="Primarily available for Growth and Leader clients. Starter clients may qualify when their website or landing page is ready for advertising."
              align="center"
            />
            <div className={styles.pricingNote}>
              <div className={styles.addonPriceBlock}>
                <p className={styles.eyebrow}>Management fee</p>
                <h2>$150 <span>per month</span></h2>
                <p className={styles.addonPercent}>plus 15% of monthly ad spend</p>
                <p>A three-month minimum is recommended for Google Ads testing.</p>
              </div>
              <div>
                <h3>Includes</h3>
                <ul className={styles.planList}>
                  {advertisingFeatures.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <p className={styles.adSpendNote}>
                  The client pays Google directly for the advertising budget. Ad spend is separate from the Hometown Boost management fee.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="general-terms">
          <div className={`${styles.shell} ${styles.legalWrap}`}>
            <SectionTitle
              eyebrow="General terms"
              title="Clear expectations before work begins."
              align="center"
            />
            <article className={styles.legalCard}>
              <ul className={styles.legalList}>
                {generalTerms.map((term) => <li key={term}>{term}</li>)}
              </ul>
            </article>
          </div>
        </section>

        <section className={styles.sectionTint} id="pricing-faq">
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="Before you choose"
              title="Plain answers to practical questions."
            />
            <div className={styles.grid2}>
              {faqItems.map((item) => (
                <article className={styles.card} key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <FinalCTA
          title="Choose a plan that fits where your business is now."
          body="We will review your goals, current website, service area, and capacity before confirming the right plan and scope."
          primaryLabel="Get My Free Game Plan"
          secondaryLabel="View Our Services"
          secondaryHref="/services"
        />
      </main>
      <SiteFooter />
    </div>
  );
}
