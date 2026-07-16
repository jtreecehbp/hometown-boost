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
  title: "Results & Measurement",
  description:
    "See the practical local-business outcomes Hometown Boost measures and the transparent framework used to connect marketing activity with calls, leads, reviews, and visibility.",
  path: "/results",
});

const outcomes = [
  {
    number: "01",
    id: "calls",
    title: "Phone calls",
    description: "Track call volume, source, timing, and—when the business can qualify it—whether the caller was a useful opportunity.",
  },
  {
    number: "02",
    id: "leads",
    title: "Qualified leads",
    description: "Separate inquiries from prospects who match the service, area, timing, and job criteria that matter to the business.",
  },
  {
    number: "03",
    id: "traffic",
    title: "Website engagement",
    description: "Look beyond visits to the pages, actions, and paths that show whether people are finding useful information.",
  },
  {
    number: "04",
    id: "visibility",
    title: "Search and map visibility",
    description: "Review where the business appears for relevant services and locations, then connect that visibility to customer actions.",
  },
  {
    number: "05",
    id: "reviews",
    title: "Review growth",
    description: "Monitor review volume, recency, response consistency, and sentiment without treating a five-star average as a guarantee.",
  },
  {
    number: "06",
    id: "directions",
    title: "Visits and direction requests",
    description: "For storefronts and dealerships, use available direction and visit signals to understand local intent—not to claim exact foot traffic.",
  },
] as const;

const framework = [
  ["Calls", "Tracked calls from selected marketing sources", "Useful call rate and missed-call patterns when call outcomes are available"],
  ["Leads", "Forms, messages, and recorded inquiries", "Service fit, location fit, urgency, and sales disposition"],
  ["Website", "Visits, landing pages, and meaningful actions", "Paths that lead toward calls, forms, directions, or product interest"],
  ["Google presence", "Profile views, searches, website actions, and direction requests", "Movement in the services and areas tied to the growth plan"],
  ["Reviews", "New reviews, recency, rating distribution, and responses", "Consistency, customer themes, and the health of the request process"],
] as const;

function ResultsScene() {
  return (
    <div className={`${styles.heroScene} ${styles.resultsScene}`} aria-hidden="true">
      <div className={styles.sceneStage} />
      <div className={styles.resultBars}><i /><i /><i /><i /></div>
      <span className={`${styles.resultLabel} ${styles.resultBaseline}`}>Baseline</span>
      <span className={`${styles.resultLabel} ${styles.resultMeasured}`}>Measured</span>
      <div className={styles.scenePanel}>Measured → explained → improved</div>
      <div className={styles.sceneRing} />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content" className={styles.main}>
        <PageHero
          hideDefaultArt
          eyebrow="Evidence over agency talk"
          title="Real growth for local businesses."
          description="We define the actions that matter, make sure the tracking can support the claim, and report what the numbers do—and do not—tell us."
        >
          <ResultsScene />
        </PageHero>

        <nav className={styles.anchorNav} aria-label="Result categories on this page">
          {outcomes.map((outcome) => (
            <a key={outcome.id} href={`#${outcome.id}`}>
              {outcome.title}
            </a>
          ))}
          <a href="#measurement-framework">Measurement framework</a>
        </nav>

        <section className={styles.sectionCompact}>
          <div className={styles.shell}>
            <div className={styles.exampleBanner} role="note" aria-label="Results page launch note">
              <span className={styles.exampleIcon} aria-hidden="true">i</span>
              <div>
                <strong>Launch-stage measurement framework</strong>
                <p>
                  The categories and framework below show how Hometown Boost approaches measurement. They are not client results, testimonials, or performance promises. Approved case studies will be added only when the underlying data and client permission are available.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionTint}>
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="What we look for"
              title="Signals tied to real customer behavior."
              description="No single metric tells the whole story. We choose a small set that fits the business model, document the source, and review the numbers in context."
              align="center"
            />
            <div className={styles.metricGrid}>
              {outcomes.map((outcome) => (
                <article className={styles.metricCard} id={outcome.id} key={outcome.id}>
                  <span className={styles.metricNumber} aria-hidden="true">{outcome.number}</span>
                  <h3>{outcome.title}</h3>
                  <p>{outcome.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} id="measurement-framework">
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="Example measurement framework"
              title="From activity to a useful business question."
              description="This example shows the structure of a clear report. The actual sources, definitions, and review cadence are agreed with each business."
            />
            <div className={styles.framework} role="table" aria-label="Example local marketing measurement framework">
              <div className={styles.frameworkRow} role="row">
                <span role="columnheader">Outcome area</span>
                <span role="columnheader">What may be recorded</span>
                <span role="columnheader">What we ask next</span>
              </div>
              {framework.map(([area, recorded, question]) => (
                <div className={styles.frameworkRow} role="row" key={area}>
                  <strong role="cell">{area}</strong>
                  <span role="cell">{recorded}</span>
                  <span role="cell">{question}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionTint}>
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="How evidence becomes action"
              title="A repeatable measurement process."
              description="Good reporting should lead to a decision. Our process keeps the definitions visible and the next step practical."
              align="center"
            />
            <div className={styles.grid4}>
              <article className={styles.processCard}>
                <span className={styles.metricNumber} aria-hidden="true">1</span>
                <h3>Define</h3>
                <p>Agree on the business goal, useful lead, service area, and customer action before work begins.</p>
              </article>
              <article className={styles.processCard}>
                <span className={styles.metricNumber} aria-hidden="true">2</span>
                <h3>Connect</h3>
                <p>Set up available website, profile, call, and inquiry sources with their limits documented.</p>
              </article>
              <article className={styles.processCard}>
                <span className={styles.metricNumber} aria-hidden="true">3</span>
                <h3>Review</h3>
                <p>Look for direction, data gaps, lead quality, seasonality, and operational factors around the numbers.</p>
              </article>
              <article className={styles.processCard}>
                <span className={styles.metricNumber} aria-hidden="true">4</span>
                <h3>Improve</h3>
                <p>Choose the next focused change, note the reasoning, and compare the result over an appropriate period.</p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.shell}>
            <div className={styles.storyGrid}>
              <div className={styles.storyCopy}>
                <p className={styles.eyebrow}>Future case studies</p>
                <h2>Proof should be specific enough to check.</h2>
                <p>
                  A Hometown Boost case study will name the business context, original problem, work completed, reporting period, data source, measurable outcome, and any important limits on attribution.
                </p>
                <p>
                  Revenue will appear only when the client approves it and the available records support the connection. Testimonials will appear only with client permission.
                </p>
                <a className={styles.textLink} href="/contact">Discuss what your business should measure</a>
              </div>
              <div className={styles.card}>
                <p className={styles.miniLabel}>Case study record</p>
                <h3>What a complete story includes</h3>
                <ul className={styles.checkList}>
                  <li>Client and industry context</li>
                  <li>Starting challenge</li>
                  <li>Strategy and work completed</li>
                  <li>Reporting period</li>
                  <li>Source and metric definition</li>
                  <li>Approved measurable outcomes</li>
                  <li>Attribution limits</li>
                  <li>Client-approved perspective</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <FinalCTA
          title="Measure what helps you make a better decision."
          body="We’ll help define the right customer actions, uncover tracking gaps, and build a report your team can actually use."
          primaryLabel="Get My Free Game Plan"
          secondaryLabel="View Our Services"
          secondaryHref="/services"
        />
      </main>
      <SiteFooter />
    </div>
  );
}
