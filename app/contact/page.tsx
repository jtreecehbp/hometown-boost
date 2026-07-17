import { createPageMetadata } from "../page-metadata";
import {
  PageHero,
  SectionTitle,
  SiteFooter,
  SiteHeader,
} from "../components";
import styles from "../core-pages.module.css";

export const metadata = createPageMetadata({
  title: "Get Your Free Growth Game Plan",
  description:
    "Tell Hometown Boost about your local business, goals, service area, and marketing challenges to prepare for a practical strategy conversation.",
  path: "/contact",
});

function ContactScene() {
  return (
    <div className={`${styles.heroScene} ${styles.contactScene}`} aria-hidden="true">
      <div className={styles.sceneStage} />
      <div className={styles.sceneBlock} />
      <div className={styles.scenePin} />
      <div className={styles.scenePanel}>A clear conversation starts here.</div>
      <div className={styles.sceneRing} />
    </div>
  );
}

function getSecureDestination(value: string | undefined) {
  if (!value) return undefined;

  try {
    const destination = new URL(value.trim());
    return destination.protocol === "https:" ? destination.toString() : undefined;
  } catch {
    return undefined;
  }
}

export default function ContactPage() {
  const formAction = getSecureDestination(process.env.CONTACT_FORM_URL);
  const bookingUrl = getSecureDestination(process.env.BOOKING_URL);
  const formReady = Boolean(formAction);

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content" className={styles.main}>
        <PageHero
          hideDefaultArt
          eyebrow="Free growth game plan"
          title="Let’s build your growth game plan."
          description="Tell us where the business stands, what feels stuck, and what a better next chapter looks like. The first conversation is about clarity—not pressure."
          secondaryLabel={bookingUrl ? "Book a Free Strategy Call" : "Explore Our Services"}
          secondaryHref={bookingUrl ?? "/services"}
        >
          <ContactScene />
        </PageHero>

        <section className={styles.sectionCompact}>
          <div className={styles.shell}>
            <SectionTitle
              eyebrow="Start with a little context"
              title="Help us make the first conversation useful."
              description="Share what you know now. Estimates are fine, and you do not need to have a polished marketing plan before reaching out."
            />
            <div className={styles.contactLayout}>
              <div className={styles.formPanel}>
                <h2>Strategy request</h2>
                <p>Fields marked with an asterisk are the most useful starting points.</p>
                <form
                  action={formAction}
                  method="post"
                  className={styles.formGrid}
                  aria-describedby="form-delivery-note"
                >
                  <div className={styles.field}>
                    <label htmlFor="name">Your name *</label>
                    <input id="name" name="name" type="text" autoComplete="name" required />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="business">Business name *</label>
                    <input id="business" name="business" type="text" autoComplete="organization" required />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="email">Email *</label>
                    <input id="email" name="email" type="email" autoComplete="email" required />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="url" inputMode="url" placeholder="https://" />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="industry">Industry *</label>
                    <select id="industry" name="industry" required defaultValue="">
                      <option value="" disabled>Select an industry</option>
                      <option>Equipment dealer</option>
                      <option>Contractor</option>
                      <option>HVAC</option>
                      <option>Plumbing</option>
                      <option>Septic services</option>
                      <option>Lawn care or landscaping</option>
                      <option>Repair shop or automotive</option>
                      <option>Home services</option>
                      <option>Retail</option>
                      <option>Professional services</option>
                      <option>Another local business</option>
                    </select>
                  </div>
                  <div className={styles.fieldFull}>
                    <label htmlFor="service-area">Primary service area *</label>
                    <input
                      id="service-area"
                      name="serviceArea"
                      type="text"
                      placeholder="Cities, counties, or approximate radius"
                      required
                    />
                  </div>
                  <fieldset className={styles.fieldset}>
                    <legend>Services you may need</legend>
                    <div className={styles.checkOptions}>
                      {[
                        "Website design",
                        "Local SEO",
                        "Google Business Profile",
                        "Review growth",
                        "Call or lead tracking",
                        "Paid advertising",
                        "Not sure yet",
                      ].map((service) => (
                        <label key={service}>
                          <input type="checkbox" name="services" value={service} />
                          {service}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div className={styles.fieldFull}>
                    <label htmlFor="challenge">Main business challenge *</label>
                    <textarea
                      id="challenge"
                      name="challenge"
                      placeholder="What is not working, or what would you like to improve?"
                      required
                    />
                  </div>
                  <div className={styles.fieldFull}>
                    <label htmlFor="budget">Current monthly marketing budget</label>
                    <select id="budget" name="budget" defaultValue="">
                      <option value="" disabled>Select the closest range</option>
                      <option>Not currently spending</option>
                      <option>Under $1,000</option>
                      <option>$1,000–$2,499</option>
                      <option>$2,500–$4,999</option>
                      <option>$5,000–$9,999</option>
                      <option>$10,000 or more</option>
                      <option>Not sure or prefer to discuss</option>
                    </select>
                  </div>
                  <fieldset className={styles.fieldset}>
                    <legend>Preferred contact method</legend>
                    <div className={styles.radioOptions}>
                      <label><input type="radio" name="contactPreference" value="email" /> Email</label>
                      <label><input type="radio" name="contactPreference" value="phone" /> Phone</label>
                      <label><input type="radio" name="contactPreference" value="either" /> Either is fine</label>
                    </div>
                  </fieldset>
                  <p className={styles.demoNote} id="form-delivery-note">
                    {formReady ? (
                      <><strong>Ready to send:</strong> Your details will be delivered through the secure form destination configured for Hometown Boost.</>
                    ) : (
                      <><strong>Preview form:</strong> This form is displayed for planning and accessibility review, but it does not transmit or store information yet. Secure form delivery and the official contact destination must be connected before launch.</>
                    )}
                  </p>
                  <button
                    className={styles.demoButton}
                    type="submit"
                    disabled={!formReady}
                    aria-describedby="form-delivery-note"
                  >
                    {formReady ? "Send My Strategy Request" : "Sending will be available at launch"}
                  </button>
                </form>
              </div>

              <aside className={styles.contactAside} aria-label="What to expect">
                <div className={styles.card}>
                  <p className={styles.miniLabel}>What happens next</p>
                  <h3>A simple, useful conversation</h3>
                  <ol className={styles.nextList}>
                    <li>We review the business and local presence.</li>
                    <li>We discuss goals, capacity, and what feels stuck.</li>
                    <li>We identify the clearest opportunities.</li>
                    <li>We recommend the best next step.</li>
                  </ol>
                </div>
                <div className={styles.card}>
                  <p className={styles.miniLabel}>What you can expect</p>
                  <ul className={styles.planList}>
                    <li>No-pressure conversation</li>
                    <li>No obligation to buy</li>
                    <li>Plainspoken recommendations</li>
                    <li>A plan built around your business</li>
                  </ul>
                </div>
                <div className={styles.noteCard}>
                  <h3>Not sure what you need?</h3>
                  <p>That is a perfectly good place to start. Describe the business problem and we can work backward to the right marketing priority.</p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
