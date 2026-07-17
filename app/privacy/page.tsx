import { createPageMetadata } from "../page-metadata";
import {
  PageHero,
  SiteFooter,
  SiteHeader,
} from "../components";
import styles from "../core-pages.module.css";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Read the draft Hometown Boost website privacy policy covering information collection, use, sharing, retention, choices, and contact options.",
  path: "/privacy",
  robots: { index: false, follow: true },
});

function LegalScene() {
  return (
    <div className={`${styles.heroScene} ${styles.legalScene}`} aria-hidden="true">
      <div className={styles.sceneStage} />
      <div className={styles.sceneBlock} />
      <div className={styles.sceneBlockSmall} />
      <div className={styles.scenePin} />
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content" className={styles.main}>
        <PageHero
          hideDefaultArt
          eyebrow="Draft policy · July 16, 2026"
          title="Privacy Policy"
          description="This draft explains the intended handling of information on the Hometown Boost website. It should be reviewed against the final forms, analytics, advertising tools, vendors, and applicable law before launch."
        >
          <LegalScene />
        </PageHero>

        <nav className={styles.anchorNav} aria-label="Privacy policy sections">
          <a href="#scope">Scope</a>
          <a href="#information">Information</a>
          <a href="#use">How information is used</a>
          <a href="#sharing">Sharing</a>
          <a href="#cookies">Cookies</a>
          <a href="#choices">Your choices</a>
          <a href="#contact">Contact</a>
        </nav>

        <section className={styles.section}>
          <div className={`${styles.shell} ${styles.legalWrap}`}>
            <p className={styles.legalNotice}>
              <strong>Pre-launch draft:</strong> The contact form on this site is currently a non-submitting preview. This policy does not claim that a specific form provider, analytics service, advertising platform, mailing system, or data-storage vendor has been connected. Update this draft when the final website tools and operating details are confirmed.
            </p>

            <article className={styles.legalCard}>
              <section id="scope">
                <h2>1. Scope</h2>
                <p>
                  This Privacy Policy describes how information may be collected, used, disclosed, and protected when someone visits the Hometown Boost website, requests information, or otherwise communicates with Hometown Boost through a channel identified on the website.
                </p>
                <p>
                  It applies to this website and related website communications. It does not automatically apply to third-party websites, services, or platforms linked from the site, or to information processed for clients under a separate services agreement.
                </p>
              </section>

              <section id="information">
                <h2>2. Information we may collect</h2>
                <p>The information collected will depend on the final tools enabled. It may include:</p>
                <ul className={styles.legalList}>
                  <li><strong>Information you provide:</strong> name, business name, email, phone number, website, industry, service area, services of interest, business challenge, marketing budget range, contact preference, and message content.</li>
                  <li><strong>Business and inquiry details:</strong> information shared during a strategy conversation, such as goals, current marketing activity, customer types, and service priorities.</li>
                  <li><strong>Technical information:</strong> IP address, browser and device type, general location derived from IP, pages viewed, referring page, approximate visit time, and site interactions if analytics or server logging is enabled.</li>
                  <li><strong>Communication records:</strong> messages, scheduling details, and notes necessary to respond to or follow up on an inquiry.</li>
                </ul>
                <p>Please do not submit sensitive personal information, payment card details, account passwords, protected health information, or confidential client records through a general website inquiry.</p>
              </section>

              <section id="use">
                <h2>3. How information may be used</h2>
                <p>Information may be used to:</p>
                <ul className={styles.legalList}>
                  <li>Respond to questions and strategy requests.</li>
                  <li>Understand the business, service area, goals, and possible service fit.</li>
                  <li>Prepare and deliver requested information or proposals.</li>
                  <li>Operate, secure, troubleshoot, and improve the website.</li>
                  <li>Measure website performance and understand which content is useful, if analytics is enabled.</li>
                  <li>Maintain records, enforce agreements, and comply with applicable legal obligations.</li>
                  <li>Send marketing communications only where permitted, with a way to opt out.</li>
                </ul>
                <p>Information should not be used for a materially unrelated purpose without appropriate notice or permission.</p>
              </section>

              <section id="sharing">
                <h2>4. When information may be shared</h2>
                <p>Personal information is not intended to be sold for money. It may be shared in limited circumstances, including:</p>
                <ul className={styles.legalList}>
                  <li><strong>Service providers:</strong> vendors that support hosting, website forms, email, scheduling, analytics, security, customer management, or professional services, subject to appropriate terms.</li>
                  <li><strong>Business operations:</strong> parties involved in a financing, reorganization, sale, merger, or transfer, subject to reasonable confidentiality protections.</li>
                  <li><strong>Legal and safety reasons:</strong> when reasonably necessary to comply with law, respond to valid legal process, protect rights or safety, investigate misuse, or prevent fraud and security incidents.</li>
                  <li><strong>With direction or consent:</strong> when the person asks for or authorizes the disclosure.</li>
                </ul>
                <p>The final policy should identify any disclosure treated as “sale,” “sharing,” or targeted advertising under an applicable state privacy law.</p>
              </section>

              <section id="cookies">
                <h2>5. Cookies and similar technologies</h2>
                <p>
                  The website may use cookies, pixels, local storage, or similar technologies for essential operation, preferences, security, analytics, or advertising. The actual categories will depend on the tools selected before launch.
                </p>
                <p>
                  Where required, visitors should be given notice and a meaningful way to manage nonessential technologies. Browser settings may also allow users to block or remove cookies, although some site features may not work as intended.
                </p>
              </section>

              <section id="retention">
                <h2>6. Retention and security</h2>
                <p>
                  Information should be retained only as long as reasonably needed for the purpose it was collected, the relationship with the person or business, recordkeeping needs, dispute resolution, security, and applicable legal obligations. Retention periods may vary by record type.
                </p>
                <p>
                  Reasonable administrative, technical, and physical safeguards should be used. No online transmission or storage method can be guaranteed completely secure, so the website should not represent that risk can be eliminated.
                </p>
              </section>

              <section id="choices">
                <h2>7. Your choices and privacy requests</h2>
                <p>
                  Depending on location and applicable law, a person may have rights to request access, correction, deletion, or a copy of certain personal information, and to opt out of certain uses or disclosures. Some requests may be limited by identity verification, exceptions, and recordkeeping obligations.
                </p>
                <p>
                  Marketing emails should include an unsubscribe method. A request to stop marketing does not prevent necessary service or transaction communications.
                </p>
                <p>
                  Privacy requests may be submitted through the contact method published on this website. The request should describe the right being exercised and provide enough information to allow reasonable verification. Hometown Boost should not discriminate against someone for making a valid privacy request.
                </p>
              </section>

              <section id="children">
                <h2>8. Children’s privacy</h2>
                <p>
                  The website and services are intended for business owners and professionals, not children. Hometown Boost does not intend to knowingly collect personal information from children under 13 through this general business website. If such information is discovered, a parent or guardian may request its deletion through the website contact channel.
                </p>
              </section>

              <section id="third-party">
                <h2>9. Third-party links</h2>
                <p>
                  The website may link to third-party services. Their privacy practices are controlled by their own policies, and a link does not make Hometown Boost responsible for those practices. Visitors should review the policy of any service they choose to use.
                </p>
              </section>

              <section id="changes">
                <h2>10. Changes to this policy</h2>
                <p>
                  This policy may be updated as the website, services, vendors, or legal requirements change. The effective date should be revised when an updated policy is published. If a change materially affects how previously collected information is used, additional notice or consent should be provided where required.
                </p>
              </section>

              <section id="contact">
                <h2>11. Contact</h2>
                <p>
                  Questions or privacy requests may be submitted through the official contact method published on the <a href="/contact">Contact page</a>. Before launch, this section should be updated with a monitored privacy contact and any business identity or mailing information required by applicable law.
                </p>
              </section>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
