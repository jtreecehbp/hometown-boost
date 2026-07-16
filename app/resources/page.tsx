import Link from "next/link";
import { createPageMetadata } from "../page-metadata";
import {
  FinalCTA,
  PageHero,
  SectionTitle,
  SiteFooter,
  SiteHeader,
} from "../components";
import styles from "../seo-pages.module.css";
import { plannedResources, starterArticles } from "./article-data";

export const metadata = createPageMetadata({
  title: "Local Marketing Resources",
  description:
    "Read practical, plain-language guides about local SEO, Google Business Profile, websites, review growth, lead tracking, and local-business marketing.",
  path: "/resources",
});

const categories = [
  { label: "Local SEO", href: "/resources/rank-higher-google-maps" },
  { label: "Google Business Profile", href: "/resources/google-business-profile-mistakes" },
  { label: "Website Strategy", href: "/resources/website-not-generating-calls" },
  { label: "Review Growth", href: "/resources/get-more-google-reviews" },
  { label: "Advertising", href: "#local-ads-ready-to-scale" },
  { label: "Lead Tracking", href: "/resources/marketing-metrics-to-track" },
  { label: "Equipment Dealer Marketing", href: "/resources/equipment-dealer-website" },
  { label: "Contractor Marketing", href: "/resources/contractor-local-search" },
  { label: "Small-Business Growth", href: "#monthly-marketing-scorecard" },
];

const resources = [
  ...starterArticles.map((resource) => ({
    slug: resource.slug,
    category: resource.category,
    title: resource.title,
    summary: resource.summary,
    takeaway: resource.takeaway,
    featured: Boolean(resource.featured),
    status: "published" as const,
    href: `/resources/${resource.slug}`,
  })),
  ...plannedResources.map((resource) => ({
    ...resource,
    featured: false,
    status: "planned" as const,
    href: null,
  })),
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
          description="Use these practical guides to make smarter decisions about your website, Google visibility, reviews, lead tracking, and local customer growth."
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
                Complete topics open a full guide. The two ideas still in development stay clearly labeled as planned, with no made-up dates or unfinished pages hiding behind the cards.
              </p>
            </div>
            <nav className={styles.chipNav} aria-label="Resource categories">
              {categories.map((category) => (
                <Link href={category.href} key={category.label}>
                  {category.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section className={`${styles.section} ${styles.librarySection}`}>
          <div className="container">
            <div className={styles.libraryHeading}>
              <SectionTitle
                eyebrow="Starter library"
                title="Practical field guides for the decisions in front of you."
                description="Seven complete guides turn common local-marketing questions into clear steps, checklists, and useful next moves."
              />
              <div className={styles.libraryNote}>
                <span aria-hidden="true" />
                7 complete guides · 2 topics in development
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
                    <span className={resource.status === "published" ? styles.resourceReady : styles.comingSoon}>
                      {resource.status === "published" ? "Read now" : "Planned"}
                    </span>
                  </div>
                  <div className={styles.articleShape} aria-hidden="true">
                    <span />
                    <i />
                    <i />
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.summary}</p>
                  <div className={styles.takeaway}>
                    <strong>{resource.status === "published" ? "Useful takeaway" : "Planned takeaway"}</strong>
                    <span>{resource.takeaway}</span>
                  </div>
                  {resource.href ? (
                    <Link className={styles.resourceLink} href={resource.href}>
                      Read the guide <span aria-hidden="true">→</span>
                    </Link>
                  ) : null}
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
                Our guides favor practical examples, plain definitions, and a short next-step checklist over technical filler.
              </p>
            </div>
          </div>
        </section>

        <FinalCTA
          title="Have a local-marketing question we have not covered yet?"
          body="Bring us your website, visibility, review, or lead-tracking question. We’ll help you sort the useful next step from the noise."
          primaryLabel="Get My Free Game Plan"
          secondaryLabel="Ask a Marketing Question"
        />
      </main>
      <SiteFooter />
    </>
  );
}
