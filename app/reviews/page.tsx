import { createPageMetadata } from "../page-metadata";
import {
  FinalCTA,
  PageHero,
  SectionTitle,
  SiteFooter,
  SiteHeader,
} from "../components";
import styles from "../seo-pages.module.css";

export const metadata = createPageMetadata({
  title: "Reviews & Client Stories",
  description:
    "Learn how Hometown Boost helps local businesses build an honest review-growth system, and where verified, client-approved stories will be shared.",
  path: "/reviews",
  robots: { index: false, follow: true },
});

const reviewSteps = [
  {
    number: "01",
    title: "Deliver an experience worth sharing",
    body: "Strong reviews start with real service. We help make the customer journey clear, consistent, and easy to remember.",
  },
  {
    number: "02",
    title: "Ask at the right moment",
    body: "Create a simple, repeatable request process so satisfied customers know where and how to leave honest feedback.",
  },
  {
    number: "03",
    title: "Make responding simple",
    body: "Keep requests direct and accessible without scripting what customers should say or turning feedback into a chore.",
  },
  {
    number: "04",
    title: "Respond, learn, and improve",
    body: "A thoughtful response shows people you listen. Review themes can also reveal useful ways to improve the business.",
  },
];

const storyCategories = [
  {
    title: "Communication & support",
    body: "How clearly the plan was explained and how easy it was to get help along the way.",
  },
  {
    title: "Website experience",
    body: "What changed in the way a business presents itself and guides local visitors toward action.",
  },
  {
    title: "Google visibility",
    body: "How the business approached local search, Maps visibility, and its Google Business Profile.",
  },
  {
    title: "Review momentum",
    body: "How a steady, customer-friendly request process became part of everyday operations.",
  },
  {
    title: "Calls & lead clarity",
    body: "How better tracking helped the business understand which marketing activity created real inquiries.",
  },
  {
    title: "Ongoing improvement",
    body: "How clear reporting and practical next steps helped the marketing system keep getting better.",
  },
];

export default function ReviewsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className={styles.page}>
        <PageHero
          className={styles.reviewsHero}
          eyebrow="Reviews & client stories"
          title={
            <>
              Real feedback. <span className={styles.accentText}>Shared with permission.</span>
            </>
          }
          description="Verified customer stories will appear here as clients approve them. Until then, we are keeping this page useful and honest—without invented quotes, ratings, or anonymous claims."
        >
          <div className={styles.heroTrustStack} aria-hidden="true">
            <span>Verified source</span>
            <span>Client approved</span>
            <span>Real business context</span>
          </div>
        </PageHero>

        <section className={styles.integritySection} aria-labelledby="reviews-integrity-title">
          <div className={`container ${styles.integrityCard}`}>
            <div className={styles.integrityMark} aria-hidden="true">
              <span />
            </div>
            <div>
              <p className={styles.miniEyebrow}>Proof, not placeholders</p>
              <h2 id="reviews-integrity-title">Trust is too important to manufacture.</h2>
            </div>
            <p>
              There are no placeholder testimonials on this page. When stories are added, they will be tied to real client experiences, shared with approval, and presented with enough context to be useful.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <SectionTitle
              eyebrow="A healthier review system"
              title="Earn trust, then make it easy to share."
              description="Review growth should reflect real customer experiences. The goal is a steady process your team can follow—not a one-time push or a wall of polished claims."
            />
            <ol className={styles.processGrid}>
              {reviewSteps.map((step) => (
                <li className={styles.processCard} key={step.number}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <span className={styles.stepDot} aria-hidden="true" />
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={`${styles.section} ${styles.storySection}`}>
          <div className="container">
            <div className={styles.storyHeading}>
              <SectionTitle
                eyebrow="What verified stories will cover"
                title="The details business owners actually want to know."
                description="These are story categories—not customer claims. As approved client stories become available, this is the context we will use to make them useful."
              />
              <div className={styles.contextTag}>
                <span aria-hidden="true">+</span>
                Context before claims
              </div>
            </div>
            <div className={styles.categoryGrid}>
              {storyCategories.map((category, index) => (
                <article className={styles.categoryCard} key={category.title}>
                  <span className={styles.categoryIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{category.title}</h3>
                  <p>{category.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.principlesSection} aria-labelledby="review-principles-title">
          <div className={`container ${styles.principlesGrid}`}>
            <div>
              <p className={styles.miniEyebrow}>Our publishing standard</p>
              <h2 id="review-principles-title">Every future story should be clear, specific, and earned.</h2>
            </div>
            <ul className={styles.principlesList}>
              <li><span aria-hidden="true">01</span> Shared only with the client&apos;s knowledge and approval</li>
              <li><span aria-hidden="true">02</span> Connected to a real business and relevant service context</li>
              <li><span aria-hidden="true">03</span> Free of invented numbers, guaranteed outcomes, or polished-up claims</li>
            </ul>
          </div>
        </section>

        <FinalCTA
          title="Want a review system built around real customer experiences?"
          body="We’ll help you create a straightforward way to request feedback, respond thoughtfully, and turn customer trust into lasting local momentum."
          primaryLabel="Get My Free Game Plan"
          secondaryLabel="Talk Through Review Growth"
          secondaryHref="/services/reputation-management"
        />
      </main>
      <SiteFooter />
    </>
  );
}
