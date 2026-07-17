import { createPageMetadata } from "../page-metadata";
import {
  FinalCTA,
  PageHero,
  SectionTitle,
  SiteFooter,
  SiteHeader,
} from "../components";
import styles from "../core-pages.module.css";
import { getSiteUrl } from "../site-url";

export const metadata = createPageMetadata({
  title: "Local Marketing Services",
  description:
    "Explore practical website, local SEO, Google Business Profile, review, lead tracking, advertising, and optimization support for local businesses.",
  path: "/services",
});

const services = [
  {
    id: "website-design",
    href: "/services/website-design",
    number: "01",
    title: "Website design",
    problem:
      "A dated or confusing website makes good businesses look harder to trust and makes it harder for visitors to take the next step.",
    solution:
      "We shape a clear, mobile-friendly website around the questions local customers ask before they call, visit, or request a quote.",
    included: [
      "Conversion-focused page structure",
      "Mobile-first design",
      "Clear service and location paths",
      "Ongoing content updates",
    ],
    benefit:
      "A stronger first impression and a shorter path from a local search to a real conversation.",
    proof:
      "We watch the actions that matter—calls, form starts, direction requests, and qualified inquiries—not just page views.",
  },
  {
    id: "local-seo",
    href: "/services/local-seo",
    number: "02",
    title: "Local SEO",
    problem:
      "Customers may be searching nearby, but unclear pages, thin location signals, or inconsistent information can keep a business out of consideration.",
    solution:
      "We strengthen the pages, local signals, and site structure that help search engines understand what you do and where you do it.",
    included: [
      "Search and competitor review",
      "Service-page improvements",
      "Location relevance work",
      "Technical and content upkeep",
    ],
    benefit:
      "More chances to appear for the services and areas that can actually turn into customers.",
    proof:
      "Visibility is reviewed alongside calls and leads so ranking movement never becomes the whole story.",
  },
  {
    id: "google-business-profile",
    href: "/services/google-business-profile",
    number: "03",
    title: "Google Business Profile management",
    problem:
      "Incomplete details, stale photos, missed questions, and neglected updates can cost attention at the exact moment a customer is comparing options.",
    solution:
      "We keep your profile accurate, active, and aligned with the services and service areas your business wants to grow.",
    included: [
      "Profile cleanup and accuracy checks",
      "Category and service refinement",
      "Posts, photos, and updates",
      "Performance review",
    ],
    benefit:
      "A more useful presence in Maps and local search when people are ready to make a decision.",
    proof:
      "We connect profile activity to calls, website visits, and direction requests wherever reporting allows.",
  },
  {
    id: "reputation-management",
    href: "/services/reputation-management",
    number: "04",
    title: "Reputation and review growth",
    problem:
      "Happy customers often stay quiet, while old or unanswered reviews can shape a first impression for years.",
    solution:
      "We help create a straightforward, repeatable way to ask for feedback and keep responses thoughtful and timely.",
    included: [
      "Review-request workflow",
      "Response guidance",
      "Review monitoring",
      "Trust placement on the website",
    ],
    benefit:
      "Stronger proof at the moment prospects are deciding who feels credible and dependable.",
    proof:
      "Review volume, recency, response consistency, and customer sentiment are tracked without promising a perfect rating.",
  },
  {
    id: "lead-tracking",
    href: "/services/call-tracking",
    number: "05",
    title: "Call and lead tracking",
    problem:
      "When every inquiry lands in a different inbox or phone log, it is difficult to know which marketing is producing useful opportunities.",
    solution:
      "We organize practical tracking around the customer actions your team already handles.",
    included: [
      "Call and form source tracking",
      "Lead-quality definitions",
      "Simple reporting views",
      "Follow-up gap review",
    ],
    benefit:
      "A clearer view of where leads come from and where promising opportunities may be slipping away.",
    proof:
      "Reports separate activity from qualified opportunities whenever the available data supports that distinction.",
  },
  {
    id: "paid-advertising",
    href: "/services/paid-advertising",
    number: "06",
    title: "Paid advertising",
    problem:
      "Paid campaigns can burn through budget when targeting, landing pages, and lead quality are managed as separate problems.",
    solution:
      "When advertising fits the plan, we connect audience targeting, offer clarity, landing-page experience, and lead measurement.",
    included: [
      "Campaign planning",
      "Search and audience targeting",
      "Landing-page alignment",
      "Budget and lead-quality review",
    ],
    benefit:
      "A faster way to reach high-intent prospects while the broader local marketing foundation keeps improving.",
    proof:
      "Advertising is optional, ad spend is separate, and decisions are tied to useful lead signals—not clicks alone.",
  },
  {
    id: "optimization",
    href: "/contact",
    number: "07",
    title: "Reporting and ongoing optimization",
    problem:
      "A launch is only a starting point. Customer behavior, competitors, seasons, and business priorities keep changing.",
    solution:
      "We review what is happening, explain it in plain language, and make focused improvements instead of handing over a dashboard and disappearing.",
    included: [
      "Clear recurring reporting",
      "Conversion-path review",
      "Content and profile updates",
      "Priority recommendations",
    ],
    benefit:
      "A marketing system that becomes more useful as your team learns what brings in the right customers.",
    proof:
      "Every review starts with business goals, checks data quality, and documents the next action to test or improve.",
  },
] as const;

function createServiceStructuredData(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": services.map((service) => ({
      "@type": "Service",
      "@id": `${siteUrl}/services#${service.id}`,
      url: service.href.startsWith("/services/")
        ? `${siteUrl}${service.href}`
        : `${siteUrl}/services#${service.id}`,
      name: service.title,
      serviceType: service.title,
      description: service.solution,
      provider: {
        "@id": `${siteUrl}/#organization`,
      },
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Local businesses",
      },
    })),
  };
}

function ServiceScene() {
  return (
    <div className={`${styles.heroScene} ${styles.servicesSystemScene}`} aria-hidden="true">
      <picture className={styles.systemRendered}>
        <img
          src="/hometown-services-system.webp"
          alt=""
          width="1672"
          height="941"
          fetchPriority="high"
        />
      </picture>
      <div className={styles.systemRoute} />
      <div className={styles.systemBrowser}><i /><i /><span /><span /></div>
      <div className={styles.systemPin} />
      <div className={`${styles.systemCard} ${styles.systemCall}`}><b>Example path</b><span>Source context</span></div>
      <div className={`${styles.systemCard} ${styles.systemFeedback}`}><i>✓</i><b>Feedback flow</b></div>
      <div className={styles.systemBars}><i /><i /><i /></div>
    </div>
  );
}

export default async function ServicesPage() {
  const siteUrl = await getSiteUrl();
  const serviceStructuredData = createServiceStructuredData(siteUrl);

  return (
    <div className={`${styles.page} contained-route-page`}>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main-content" className={styles.main}>
        <PageHero
          hideDefaultArt
          eyebrow="Done-for-you local marketing"
          title="Everything your business needs to get found and chosen."
          description="Hometown Boost brings your website, Google visibility, reviews, lead tracking, and ongoing improvements into one practical plan."
          secondaryLabel="Explore Industries"
          secondaryHref="/industries"
        >
          <ServiceScene />
        </PageHero>

        <nav className={styles.anchorNav} aria-label="Services on this page">
          {services.map((service) => (
            <a key={service.id} href={`#${service.id}`}>
              {service.title}
            </a>
          ))}
        </nav>

        <section className={styles.section}>
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="One team, one clear plan"
              title="The pieces work better together."
              description="A good website cannot make up for an ignored Google profile. More traffic does not help if nobody can see which inquiries are worthwhile. We connect the work so each improvement supports the next."
            />

            <div className={styles.serviceStack}>
              {services.map((service) => (
                <article className={styles.servicePanel} id={service.id} key={service.id}>
                  <div className={styles.serviceArt} aria-hidden="true">
                    <span className={styles.artGlyph}>{service.number}</span>
                    <span className={styles.artOrb} />
                  </div>
                  <div className={styles.serviceCopy}>
                    <p className={styles.eyebrow}>Service {service.number}</p>
                    <h2>{service.title}</h2>
                    <div className={styles.detailGrid}>
                      <div>
                        <h3>The problem</h3>
                        <p>{service.problem}</p>
                      </div>
                      <div>
                        <h3>Our approach</h3>
                        <p>{service.solution}</p>
                      </div>
                    </div>
                    <ul className={styles.checkList} aria-label={`${service.title} may include`}>
                      {service.included.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className={styles.detailGrid}>
                      <div>
                        <h3>Business benefit</h3>
                        <p>{service.benefit}</p>
                      </div>
                      <div>
                        <h3>How we measure it</h3>
                        <p>{service.proof}</p>
                      </div>
                    </div>
                    <a className={styles.textLink} href={service.href}>
                      {service.href === "/contact"
                        ? "Talk through this service"
                        : `Explore ${service.title.toLowerCase()}`}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionTint}>
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="Start where it matters most"
              title="You do not need every service on day one."
              description="The right starting point depends on your market, current website, lead flow, and capacity. We identify the largest useful gap first, then build a plan that can grow with the business."
              align="center"
            />
            <div className={styles.grid3}>
              <article className={styles.card}>
                <p className={styles.miniLabel}>Need a stronger foundation?</p>
                <h3>Begin with the customer journey</h3>
                <p>Clarify your offer, website path, and local presence before adding more traffic.</p>
              </article>
              <article className={styles.card}>
                <p className={styles.miniLabel}>Already getting found?</p>
                <h3>Improve trust and conversion</h3>
                <p>Make reviews, page content, and calls to action work harder for the attention you already earn.</p>
              </article>
              <article className={styles.card}>
                <p className={styles.miniLabel}>Ready to expand?</p>
                <h3>Measure before you scale</h3>
                <p>Connect campaigns and lead tracking so growth decisions are based on useful signals.</p>
              </article>
            </div>
          </div>
        </section>

        <FinalCTA
          title="Let’s find the clearest next move."
          body="Tell us what is working, what feels stuck, and where you want the business to go. We’ll help turn that into a straightforward game plan."
          primaryLabel="Get My Free Game Plan"
          secondaryLabel="Explore Industries"
          secondaryHref="/industries"
        />
      </main>
      <SiteFooter />
    </div>
  );
}
