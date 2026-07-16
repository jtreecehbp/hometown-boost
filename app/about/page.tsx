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
  title: "Practical Local Growth for Hometown Businesses",
  description:
    "Learn why Hometown Boost exists, how we approach local marketing, and the values behind our practical website, visibility, review, and measurement work.",
  path: "/about",
});

const values = [
  {
    title: "Clarity over confusion",
    description: "Explain the work, the reason, and the result in language a busy business owner can use.",
  },
  {
    title: "Useful over impressive",
    description: "Choose the next move because it helps the business—not because it makes the report look busier.",
  },
  {
    title: "Evidence over promises",
    description: "Measure what the available data can support and say plainly where attribution has limits.",
  },
  {
    title: "Partnership over handoffs",
    description: "Connect the website, Google presence, reviews, leads, and reporting so the owner is not coordinating a pile of vendors.",
  },
  {
    title: "Momentum over perfection",
    description: "Start with the most useful improvement, learn from real customer behavior, and keep making the system better.",
  },
  {
    title: "Local context matters",
    description: "Respect the service area, season, capacity, reputation, and customer journey that make each hometown business different.",
  },
] as const;

function AboutScene() {
  return (
    <div className={`${styles.heroScene} ${styles.aboutHeroScene}`} aria-hidden="true">
      <div className={styles.storyVisual}>
        <span className={styles.storyDesk} />
        <span className={styles.storyScreen} />
        <span className={styles.storyNote}>Plan • build • improve</span>
        <span className={styles.storyPin} />
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content" className={styles.main}>
        <PageHero
          hideDefaultArt
          eyebrow="Why Hometown Boost exists"
          title="Built to help hometown businesses compete and grow."
          description="Local marketing should make the next decision clearer. We bring modern website and visibility work together with practical thinking about calls, customers, reviews, and capacity."
        >
          <AboutScene />
        </PageHero>

        <nav className={styles.anchorNav} aria-label="About sections">
          <a href="#our-story">Our story</a>
          <a href="#mission">Mission</a>
          <a href="#who-we-serve">Who we serve</a>
          <a href="#how-we-work">How we work</a>
          <a href="#values">Values</a>
        </nav>

        <section className={styles.section} id="our-story">
          <div className={styles.shell}>
            <div className={styles.storyGrid}>
              <div className={styles.storyCopy}>
                <p className={styles.eyebrow}>Our story</p>
                <h2>Local businesses deserve marketing they can understand.</h2>
                <p>
                  Too many owners are asked to pay for disconnected tactics, complicated reports, or activity that never gets tied back to the phone, the sales counter, the service calendar, or the customer relationship.
                </p>
                <p>
                  Hometown Boost exists to close that gap. The idea is simple: connect the essentials, explain the choices, measure the actions that matter, and keep improving the system with the business.
                </p>
                <p>
                  That means using modern tools without losing sight of the practical questions: Are the right people finding you? Do they understand why to choose you? Can they take the next step easily? Can your team tell what is working?
                </p>
              </div>
              <div className={styles.storyVisual} aria-label="Abstract workbench scene representing connected local marketing">
                <span className={styles.storyDesk} aria-hidden="true" />
                <span className={styles.storyScreen} aria-hidden="true" />
                <span className={styles.storyNote} aria-hidden="true">Calls. Customers. Clarity.</span>
                <span className={styles.storyPin} aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionTint} id="mission">
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="Our mission"
              title="Make useful local growth feel straightforward."
              description="Hometown Boost helps small and locally focused businesses get found, get chosen, and grow through a connected system of website, Google visibility, reputation, lead insight, and ongoing improvement."
              align="center"
            />
            <div className={styles.grid3}>
              <article className={styles.card}>
                <p className={styles.miniLabel}>Get found</p>
                <h3>Build local visibility</h3>
                <p>Help customers discover the right service, product, location, or answer at the moment they need it.</p>
              </article>
              <article className={styles.card}>
                <p className={styles.miniLabel}>Get chosen</p>
                <h3>Make trust easier</h3>
                <p>Turn expertise, reviews, clarity, and a strong customer path into confidence before the first call.</p>
              </article>
              <article className={styles.card}>
                <p className={styles.miniLabel}>Keep growing</p>
                <h3>Learn from the right signals</h3>
                <p>Connect marketing activity to useful actions, identify gaps, and improve what earns its place.</p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.section} id="who-we-serve">
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="Who we serve"
              title="Businesses rooted in a place and a reputation."
              description="Our best fit is a small or growing business whose customers search within a local or regional market and whose growth depends on calls, visits, appointments, quotes, or qualified leads."
            />
            <div className={styles.grid2}>
              <article className={styles.noteCard}>
                <h3>A practical fit</h3>
                <ul className={styles.checkList}>
                  <li>Equipment dealers</li>
                  <li>Contractors</li>
                  <li>Home-service teams</li>
                  <li>HVAC and plumbing</li>
                  <li>Landscapers</li>
                  <li>Repair shops</li>
                  <li>Local retail</li>
                  <li>Professional services</li>
                </ul>
              </article>
              <article className={styles.noteCard}>
                <h3>Shared priorities</h3>
                <p>They want steady, useful customer demand—not a pile of vanity metrics. They care about local trust, team capacity, clear ownership, and knowing why a marketing decision is being made.</p>
                <a className={styles.textLink} href="/industries">Explore the industries we help</a>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.sectionTint} id="how-we-work">
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="How we work"
              title="A thoughtful system without the agency fog."
              description="We combine strategy and execution, but keep the process visible. You should know what is happening, why it matters, and what comes next."
              align="center"
            />
            <div className={styles.grid4}>
              <article className={styles.processCard}>
                <span className={styles.metricNumber} aria-hidden="true">1</span>
                <h3>Listen first</h3>
                <p>Learn the business, market, services, capacity, current tools, and definition of a worthwhile customer.</p>
              </article>
              <article className={styles.processCard}>
                <span className={styles.metricNumber} aria-hidden="true">2</span>
                <h3>Set priorities</h3>
                <p>Identify the largest useful gaps and arrange the work in an order that supports the business.</p>
              </article>
              <article className={styles.processCard}>
                <span className={styles.metricNumber} aria-hidden="true">3</span>
                <h3>Handle the work</h3>
                <p>Build, update, manage, and connect the agreed parts of the local marketing system.</p>
              </article>
              <article className={styles.processCard}>
                <span className={styles.metricNumber} aria-hidden="true">4</span>
                <h3>Explain and improve</h3>
                <p>Review useful signals, call out limits, and choose the next focused improvement together.</p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.section} id="values">
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="What makes us different"
              title="Values that show up in the work."
              description="These are the standards the Hometown Boost experience is being built around."
            />
            <div className={styles.valuesGrid}>
              {values.map((value) => (
                <article className={styles.valueCard} key={value.title}>
                  <div className={styles.valueMark} aria-hidden="true" />
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <FinalCTA
          title="Bring us the business problem—not a marketing shopping list."
          body="We’ll listen, look for the clearest opportunities, and recommend a practical next step built around the way your business actually works."
          primaryLabel="Get My Free Game Plan"
          secondaryLabel="See How We Measure"
          secondaryHref="/results"
        />
      </main>
      <SiteFooter />
    </div>
  );
}
