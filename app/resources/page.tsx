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
  title: "Local Marketing Resources",
  description:
    "Explore practical, plain-language resources about local SEO, Google Business Profile, websites, reviews, advertising, and lead tracking.",
  path: "/resources",
  robots: { index: false, follow: true },
});

const categories = [
  { label: "Local SEO", target: "rank-higher-google-maps" },
  { label: "Google Business Profile", target: "google-business-profile-mistakes" },
  { label: "Website Strategy", target: "website-not-generating-calls" },
  { label: "Review Growth", target: "get-more-google-reviews" },
  { label: "Advertising", target: "local-ads-ready-to-scale" },
  { label: "Lead Tracking", target: "marketing-metrics-to-track" },
  { label: "Equipment Dealer Marketing", target: "equipment-dealer-website" },
  { label: "Contractor Marketing", target: "contractor-local-search" },
  { label: "Small-Business Growth", target: "monthly-marketing-scorecard" },
];

const resources = [
  {
    slug: "rank-higher-google-maps",
    category: "Local SEO",
    title: "How to rank higher in Google Maps",
    summary:
      "A practical look at relevance, distance, prominence, consistent business information, and the on-site signals that support stronger local visibility.",
    takeaway: "Know which local ranking inputs you can improve—and which shortcuts to ignore.",
    featured: true,
  },
  {
    slug: "website-not-generating-calls",
    category: "Website Strategy",
    title: "Why a local business website is not generating calls",
    summary:
      "Learn how unclear offers, weak mobile experiences, buried contact options, and mismatched search intent can quietly cost a business good leads.",
    takeaway: "Use a simple page-by-page checklist to find conversion friction.",
    featured: true,
  },
  {
    slug: "get-more-google-reviews",
    category: "Review Growth",
    title: "How to get more Google reviews",
    summary:
      "Build an honest request routine around the moments customers are most likely to respond, without making the process awkward for your team or customers.",
    takeaway: "Turn review requests into a repeatable part of customer follow-up.",
  },
  {
    slug: "google-business-profile-mistakes",
    category: "Google Business Profile",
    title: "Google Business Profile mistakes to avoid",
    summary:
      "Spot common issues with categories, service areas, hours, photos, duplicate information, and neglected customer questions before they create confusion.",
    takeaway: "Keep the profile accurate, active, and useful to real searchers.",
  },
  {
    slug: "marketing-metrics-to-track",
    category: "Lead Tracking",
    title: "What local businesses should track from their marketing",
    summary:
      "Focus reporting on calls, qualified leads, form submissions, direction requests, and other signals that connect marketing work to actual customer activity.",
    takeaway: "Build a short scorecard your team can understand at a glance.",
  },
  {
    slug: "equipment-dealer-website",
    category: "Equipment Dealer Marketing",
    title: "What equipment dealers need from a modern website",
    summary:
      "Explore inventory discovery, brand and category pathways, financing clarity, service visibility, location content, and easy ways for buyers to start a conversation.",
    takeaway: "Make the path from product research to dealer contact feel effortless.",
  },
  {
    slug: "contractor-local-search",
    category: "Contractor Marketing",
    title: "How contractors can improve local search visibility",
    summary:
      "Connect service pages, project proof, service-area content, reviews, and a strong Google presence so nearby homeowners can find the right help faster.",
    takeaway: "Create a search footprint that matches how customers describe the work.",
  },
  {
    slug: "local-ads-ready-to-scale",
    category: "Advertising",
    title: "How to know when local ads are ready to scale",
    summary:
      "Before increasing spend, check the offer, landing experience, follow-up process, lead quality, and tracking needed to make paid traffic accountable.",
    takeaway: "Strengthen the system behind the ad before paying for more clicks.",
  },
  {
    slug: "monthly-marketing-scorecard",
    category: "Small-Business Growth",
    title: "A simple monthly local-marketing scorecard",
    summary:
      "Bring visibility, engagement, leads, reviews, and follow-up into one plain-language monthly check-in that keeps decisions focused on progress.",
    takeaway: "Leave each review with one clear priority for the next month.",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className={styles.page}>
        <PageHero
          className={styles.resourcesHero}
          eyebrow="Resources for local business owners"
          title={
            <>
              Useful answers. <span className={styles.accentText}>No agency jargon.</span>
            </>
          }
          description="We’re building a practical library to help you make smarter decisions about your website, Google visibility, reviews, advertising, and lead follow-up."
        >
          <div className={styles.heroGuideStack} aria-hidden="true">
            <span>FIELD GUIDE</span>
            <i />
            <i />
            <strong>LOCAL</strong>
          </div>
        </PageHero>

        <section className={styles.resourceIntro} aria-labelledby="resource-topics-title">
          <div className="container">
            <div className={styles.resourceIntroGrid}>
              <div>
                <p className={styles.miniEyebrow}>Explore by topic</p>
                <h2 id="resource-topics-title">Start with the problem in front of you.</h2>
              </div>
              <p>
                These category chips jump to the first matching guide preview. Each article below is clearly marked as coming soon—there are no made-up dates, bylines, or finished resources hiding behind the cards.
              </p>
            </div>
            <nav className={styles.chipNav} aria-label="Resource categories">
              {categories.map((category) => (
                <a href={`#${category.target}`} key={category.label}>
                  {category.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section className={`${styles.section} ${styles.librarySection}`}>
          <div className="container">
            <div className={styles.libraryHeading}>
              <SectionTitle
                eyebrow="Starter library"
                title="Practical field guides are on the way."
                description="For now, each preview explains the question the guide will answer and the useful takeaway it is being built to deliver."
              />
              <div className={styles.libraryNote}>
                <span aria-hidden="true" />
                9 educational topics in development
              </div>
            </div>

            <div className={styles.resourceGrid}>
              {resources.map((resource) => (
                <article
                  className={`${styles.resourceCard} ${resource.featured ? styles.resourceFeatured : ""}`}
                  id={resource.slug}
                  key={resource.slug}
                >
                  <div className={styles.cardTopline}>
                    <span className={styles.resourceCategory}>{resource.category}</span>
                    <span className={styles.comingSoon}>Coming soon</span>
                  </div>
                  <div className={styles.articleShape} aria-hidden="true">
                    <span />
                    <i />
                    <i />
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.summary}</p>
                  <div className={styles.takeaway}>
                    <strong>Planned takeaway</strong>
                    <span>{resource.takeaway}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.resourcePromise} aria-labelledby="resource-promise-title">
          <div className={`container ${styles.resourcePromiseGrid}`}>
            <div className={styles.promiseShape} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div>
              <p className={styles.miniEyebrow}>Built for busy owners</p>
              <h2 id="resource-promise-title">Clear enough to use before your next cup of coffee gets cold.</h2>
              <p>
                Every guide will favor practical examples, plain definitions, and a short next-step checklist over technical filler.
              </p>
            </div>
          </div>
        </section>

        <FinalCTA
          title="Need answers before the library is ready?"
          body="Bring us your website, visibility, review, or lead-tracking question. We’ll help you sort the useful next step from the noise."
          primaryLabel="Get My Free Game Plan"
          secondaryLabel="Ask a Marketing Question"
        />
      </main>
      <SiteFooter />
    </>
  );
}
