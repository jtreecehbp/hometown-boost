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
  title: "Local Marketing Plans",
  description:
    "Compare Foundation, Growth, and Market Leader support for local-business websites, Google visibility, reviews, reporting, and ongoing marketing improvements.",
  path: "/pricing",
});

const plans = [
  {
    name: "Foundation",
    fit: "Build the essentials",
    recommended: false,
    description: "For a local business that needs a credible home base and a cleaner path from search to conversation.",
    features: [
      "Website foundation and hosting",
      "Core service and contact paths",
      "Google Business Profile cleanup",
      "Baseline local visibility review",
      "Essential measurement setup",
      "Planned website updates",
      "Clear recurring report",
    ],
  },
  {
    name: "Growth",
    fit: "Improve and expand",
    recommended: true,
    description: "For an established business ready for consistent visibility, review, content, and conversion work.",
    features: [
      "Everything in Foundation",
      "Ongoing local SEO priorities",
      "Google profile activity and upkeep",
      "Review-growth support",
      "Service and location content",
      "Call or lead tracking options",
      "Regular optimization plan",
    ],
  },
  {
    name: "Market Leader",
    fit: "Compete across a wider market",
    recommended: false,
    description: "For businesses with broader services, multiple locations, dealer needs, or a more active growth plan.",
    features: [
      "Everything in Growth",
      "Expanded service and market strategy",
      "Multi-location or dealer options",
      "Deeper content roadmap",
      "Advanced lead-source review",
      "Campaign landing-page support",
      "More frequent planning and iteration",
    ],
  },
] as const;

const faqItems = [
  {
    question: "Is there a setup fee?",
    answer:
      "Any one-time work should be stated clearly in the proposal. The amount depends on the condition and scope of the website, tracking, profiles, and other starting assets.",
  },
  {
    question: "Can a plan change later?",
    answer:
      "Yes. The structure is designed to let support expand or narrow as priorities, capacity, service areas, and growth goals change.",
  },
  {
    question: "Are contracts long term?",
    answer:
      "The final agreement will state the term, renewal, and cancellation details before work begins. Do not rely on a page summary in place of the signed agreement.",
  },
  {
    question: "What about multiple locations?",
    answer:
      "Multi-location and dealer needs are scoped separately because profile count, content, coordination, and reporting can vary significantly.",
  },
  {
    question: "Is call tracking included?",
    answer:
      "Call and lead tracking may be included or offered as an option depending on the plan, phone setup, reporting needs, and applicable consent requirements.",
  },
  {
    question: "Will rankings or revenue be guaranteed?",
    answer:
      "No. Hometown Boost can commit to the agreed work, clear reporting, and thoughtful improvement—not a guaranteed ranking, lead volume, or revenue result.",
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
        <span className={styles.pricingLayer}><b>Foundation</b><i /><i /></span>
        <span className={styles.pricingLayer}><b>Growth</b><i /><i /><i /></span>
        <span className={styles.pricingLayer}><b>Market Leader</b><i /><i /><i /></span>
      </div>
      <span className={`${styles.pricingToken} ${styles.pricingTokenOne}`}>HB</span>
      <span className={`${styles.pricingToken} ${styles.pricingTokenTwo}`}>✓</span>
      <div className={styles.scenePanel}>Build the right layer. Add the next when it earns its place.</div>
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
          eyebrow="Straightforward plans"
          title="Simple plans built for real local growth."
          description="Choose the level of ongoing support that fits your business now. We’ll define the exact scope after learning what you already have, what needs attention, and where you want to grow."
        >
          <PricingScene />
        </PageHero>

        <nav className={styles.anchorNav} aria-label="Pricing sections">
          <a href="#plans">Plans</a>
          <a href="#advertising">Advertising</a>
          <a href="#plan-details">What changes by plan</a>
          <a href="#pricing-faq">Pricing questions</a>
        </nav>

        <section className={styles.section} id="plans">
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="Choose the right level of support"
              title="A clear structure, tailored scope."
              description="No public dollar amounts are shown while final service scope and pricing are being approved. Every proposal should state what is included, what is optional, the billing rhythm, and any one-time work before you decide."
              align="center"
            />
            <div className={styles.planGrid}>
              {plans.map((plan) => (
                <article
                  className={`${styles.planCard} ${plan.recommended ? styles.planCardRecommended : ""}`}
                  key={plan.name}
                >
                  {plan.recommended ? <span className={styles.recommended}>Recommended starting point</span> : null}
                  <p className={styles.planFit}>{plan.fit}</p>
                  <h2>{plan.name}</h2>
                  <p>{plan.description}</p>
                  <ul className={styles.planList}>
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <a className={styles.textLink} href="/contact">
                    Talk through {plan.name}
                  </a>
                </article>
              ))}
            </div>

            <div className={styles.pricingNote} id="advertising">
              <div>
                <p className={styles.eyebrow}>Optional paid advertising</p>
                <h2>Ad spend stays separate.</h2>
              </div>
              <div>
                <p>
                  Paid advertising is not automatically included in a monthly plan. If advertising makes sense, the proposal will separate campaign management from the budget paid to the advertising platform.
                </p>
                <p>
                  That keeps the actual media budget visible and lets the plan change without hiding spend inside a bundled fee. Recommended spend depends on the market, service, geography, season, and available capacity.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionTint} id="plan-details">
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="What changes by plan"
              title="More support, not more clutter."
              description="The plans build on the same foundation. The difference is the breadth of the market, the pace of improvement, and the depth of ongoing support."
              align="center"
            />
            <div className={styles.compareList}>
              <div className={styles.compareItem}>
                <strong>Foundation</strong>
                <span>Focuses on credibility, core visibility, clean customer paths, and dependable upkeep.</span>
              </div>
              <div className={styles.compareItem}>
                <strong>Growth</strong>
                <span>Adds consistent local SEO, profile, reputation, content, and optimization work.</span>
              </div>
              <div className={styles.compareItem}>
                <strong>Market Leader</strong>
                <span>Expands the plan across more services, locations, content needs, or competitive markets.</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="pricing-faq">
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
          title="Get a plan shaped around your actual starting point."
          body="We’ll review the gaps, goals, service area, and capacity before recommending a level of support. You’ll see the scope before you decide."
          primaryLabel="Get My Free Game Plan"
          secondaryLabel="View Our Services"
          secondaryHref="/services"
        />
      </main>
      <SiteFooter />
    </div>
  );
}
