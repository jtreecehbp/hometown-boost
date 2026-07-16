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
  title: "Industries We Help",
  description:
    "See how Hometown Boost helps equipment dealers, contractors, home-service teams, repair shops, retailers, and other local businesses get found and chosen.",
  path: "/industries",
});

const industries = [
  {
    id: "equipment-dealers",
    mark: "ED",
    title: "Equipment dealers",
    challenge: "Complex inventory, wide service areas, and shoppers who research long before they visit.",
    search: "Customers compare brands, models, parts, service, financing information, and nearby availability.",
    focus: "Inventory-friendly website paths, local SEO, dealer-profile care, calls, and lead-source clarity.",
    help: "We make the path from product research to dealership conversation easier to understand and measure.",
  },
  {
    id: "contractors",
    mark: "CT",
    title: "Contractors",
    challenge: "Seasonal demand, crowded search results, and prospects who need proof before inviting anyone onsite.",
    search: "Customers search by project, problem, location, availability, and signs of reliable workmanship.",
    focus: "Service pages, project proof, review growth, Google visibility, and qualified inquiry tracking.",
    help: "We connect the work you do with the specific local searches that can turn into the right projects.",
  },
  {
    id: "home-services",
    mark: "HS",
    title: "Home services",
    challenge: "Urgent needs, short decision windows, and a market where responsiveness matters as much as visibility.",
    search: "Homeowners look for a nearby provider, the exact problem they have, trustworthy reviews, and a clear way to call.",
    focus: "Mobile conversion, map visibility, review systems, call tracking, and service-area content.",
    help: "We reduce friction between an urgent search and a useful conversation with your team.",
  },
  {
    id: "lawn-landscaping",
    mark: "LL",
    title: "Lawn care and landscaping",
    challenge: "Visual work, changing seasons, route density, and a mix of recurring and project-based customers.",
    search: "Customers compare services, project photos, coverage areas, timing, and reviews from nearby homeowners.",
    focus: "Service-area reach, photo-led proof, seasonal campaigns, reviews, and lead-quality reporting.",
    help: "We help fill the right routes and project calendar without treating every click as an equal lead.",
  },
  {
    id: "repair-automotive",
    mark: "RA",
    title: "Repair shops and automotive",
    challenge: "High-trust decisions, varied services, local competition, and customers who often search under pressure.",
    search: "Drivers look for a specific repair, nearby availability, strong recent reviews, and signs of honest service.",
    focus: "Service visibility, Google profile care, review growth, mobile calls, and repeat-customer touchpoints.",
    help: "We make expertise and trust easier to see before a customer ever reaches the counter.",
  },
  {
    id: "hvac-plumbing-septic",
    mark: "HP",
    title: "HVAC, plumbing, and septic",
    challenge: "Emergency calls, maintenance work, large service areas, and expensive leads in competitive categories.",
    search: "Customers search by immediate problem, system type, town, response time, and credible local proof.",
    focus: "High-intent service pages, map visibility, call attribution, reviews, and careful paid search when useful.",
    help: "We organize urgent and planned services so the right customer can quickly find the right next step.",
  },
  {
    id: "retail",
    mark: "RT",
    title: "Local retail",
    challenge: "Balancing online discovery with visits, events, promotions, changing hours, and product interest.",
    search: "Shoppers look for nearby options, hours, products, photos, directions, and reasons to choose local.",
    focus: "Storefront visibility, profile accuracy, direction requests, seasonal content, and website engagement.",
    help: "We help translate local attention into store visits and useful customer actions.",
  },
  {
    id: "professional-services",
    mark: "PS",
    title: "Professional services",
    challenge: "Longer consideration, trust-sensitive decisions, and services that can be difficult to explain quickly.",
    search: "Prospects compare expertise, fit, location, reviews, approach, and the ease of starting a conversation.",
    focus: "Clear service positioning, authority content, local search, reputation, and inquiry qualification.",
    help: "We turn expertise into plainspoken pages that help the right prospects feel confident taking the next step.",
  },
] as const;

function TownScene() {
  return (
    <div className={styles.heroScene} aria-hidden="true">
      <div className={styles.sceneStage} />
      <div className={styles.sceneBlock} />
      <div className={styles.sceneBlockSmall} />
      <div className={styles.scenePin} />
      <div className={styles.scenePanel}>Many local journeys. One clear growth plan.</div>
      <div className={styles.sceneRing} />
      <div className={styles.sceneTruck} />
    </div>
  );
}

export default function IndustriesPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content" className={styles.main}>
        <PageHero
          eyebrow="Built for local businesses"
          title="Built for businesses that depend on local customers."
          description="From equipment lots to service trucks and neighborhood storefronts, we shape the plan around how your customers actually search, compare, and choose."
        >
          <TownScene />
        </PageHero>

        <nav className={styles.anchorNav} aria-label="Industries on this page">
          {industries.map((industry) => (
            <a key={industry.id} href={`#${industry.id}`}>
              {industry.title}
            </a>
          ))}
        </nav>

        <section className={styles.sectionCompact}>
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="The local customer journey"
              title="The details change. The decision path stays familiar."
              description="People need to find you, understand what you offer, trust what they see, and know what to do next. Our work strengthens each step without forcing your business into a generic playbook."
            />
            <div className={styles.journeyLine} id="customer-journey">
              <div className={styles.journeyStep}>
                <strong>1. Get found</strong>
                <span>Appear for the right service, product, problem, and place.</span>
              </div>
              <div className={styles.journeyStep}>
                <strong>2. Get understood</strong>
                <span>Make the offer, coverage area, and next step immediately clear.</span>
              </div>
              <div className={styles.journeyStep}>
                <strong>3. Earn trust</strong>
                <span>Show current proof, useful details, and a consistent local presence.</span>
              </div>
              <div className={styles.journeyStep}>
                <strong>4. Start a conversation</strong>
                <span>Turn attention into a call, visit, form, or qualified inquiry.</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionTint}>
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="Industry-aware, business-specific"
              title="Your customers should recognize themselves in the plan."
              description="These are common patterns, not rigid packages. We use your market, service area, capacity, and growth priorities to decide what deserves attention first."
              align="center"
            />
            <div className={styles.industryGrid}>
              {industries.map((industry) => (
                <article className={styles.industryCard} id={industry.id} key={industry.id}>
                  <div className={styles.industryTop}>
                    <div>
                      <p className={styles.eyebrow}>Local growth focus</p>
                      <h2>{industry.title}</h2>
                      <p>{industry.challenge}</p>
                    </div>
                    <span className={styles.industryObject} aria-hidden="true">
                      {industry.mark}
                    </span>
                  </div>
                  <div className={styles.industryDetails}>
                    <div>
                      <h3>How customers search</h3>
                      <p>{industry.search}</p>
                    </div>
                    <div>
                      <h3>Services that matter</h3>
                      <p>{industry.focus}</p>
                    </div>
                    <div>
                      <h3>How we help</h3>
                      <p>{industry.help}</p>
                    </div>
                    <div>
                      <h3>Proof that fits</h3>
                      <p>We define useful calls, leads, visits, reviews, or direction requests before reporting progress.</p>
                    </div>
                  </div>
                  <p className={styles.industryCta}>
                    <a className={styles.textLink} href="/contact">
                      Build a plan for {industry.title.toLowerCase()}
                    </a>
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="not-listed">
          <div className={styles.shell}>
            <div className={styles.pricingNote}>
              <div>
                <p className={styles.eyebrow}>Do not see your industry?</p>
                <h2 id="not-listed">Local dependence matters more than the label.</h2>
              </div>
              <div>
                <p>
                  If your business grows through a defined service area, local reputation, phone calls, appointments, visits, or quote requests, the same core system may fit.
                </p>
                <p>
                  We will tell you plainly if your market needs a different kind of specialist.
                </p>
                <a className={styles.textLink} href="/contact">
                  Tell us about your business
                </a>
              </div>
            </div>
          </div>
        </section>

        <FinalCTA
          title="Make your local market easier to win."
          body="We’ll look at how customers in your area search, compare, and contact businesses like yours—then map the clearest opportunities."
          primaryLabel="Get My Free Game Plan"
          secondaryLabel="View Our Services"
        />
      </main>
      <SiteFooter />
    </div>
  );
}
