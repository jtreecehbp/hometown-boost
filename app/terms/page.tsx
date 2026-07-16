import { createPageMetadata } from "../page-metadata";
import {
  PageHero,
  SiteFooter,
  SiteHeader,
} from "../components";
import styles from "../core-pages.module.css";

export const metadata = createPageMetadata({
  title: "Website Terms of Use",
  description:
    "Read the draft terms governing use of the Hometown Boost website, including informational content, acceptable use, third-party links, and service disclaimers.",
  path: "/terms",
  robots: { index: false, follow: true },
});

function LegalScene() {
  return (
    <div className={`${styles.heroScene} ${styles.legalScene}`} aria-hidden="true">
      <div className={styles.sceneStage} />
      <div className={styles.sceneBlock} />
      <div className={styles.sceneBlockSmall} />
      <div className={styles.scenePanel}>Clear expectations make better partnerships.</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main id="main-content" className={styles.main}>
        <PageHero
          hideDefaultArt
          eyebrow="Draft terms · July 16, 2026"
          title="Website Terms of Use"
          description="These draft terms cover use of the Hometown Boost website. They do not replace a signed services agreement and should receive final legal and business review before launch."
        >
          <LegalScene />
        </PageHero>

        <nav className={styles.anchorNav} aria-label="Terms of use sections">
          <a href="#acceptance">Acceptance</a>
          <a href="#website">Website information</a>
          <a href="#services">Services</a>
          <a href="#acceptable-use">Acceptable use</a>
          <a href="#disclaimers">Disclaimers</a>
          <a href="#liability">Liability</a>
          <a href="#contact">Contact</a>
        </nav>

        <section className={styles.section}>
          <div className={`${styles.shell} ${styles.legalWrap}`}>
            <p className={styles.legalNotice}>
              <strong>Pre-launch draft:</strong> These terms intentionally do not invent a legal entity name, physical address, governing state, court venue, or dispute process. Those details—and any provisions required for the final website tools and business structure—should be completed with qualified legal review before publication.
            </p>

            <article className={styles.legalCard}>
              <section id="acceptance">
                <h2>1. Acceptance of these terms</h2>
                <p>
                  These Website Terms of Use govern access to and use of the Hometown Boost website. By using the website, a visitor agrees to these terms and the posted Privacy Policy. A person who does not agree should not use the website.
                </p>
                <p>
                  A person using the website on behalf of a business represents that they have authority to act for that business in connection with the website use at issue.
                </p>
              </section>

              <section id="website">
                <h2>2. Website information</h2>
                <p>
                  Website content is provided for general business and educational information. It may discuss websites, local search, Google Business Profiles, reviews, lead tracking, advertising, and related marketing topics. The content is not legal, tax, accounting, financial, or other regulated professional advice.
                </p>
                <p>
                  Reasonable efforts may be made to keep content useful and current, but the website may contain errors, omissions, or information that becomes outdated. Visitors should evaluate information in light of their own business, market, platform rules, and professional advice.
                </p>
              </section>

              <section id="services">
                <h2>3. Strategy conversations and services</h2>
                <p>
                  A website inquiry, strategy conversation, estimate, or proposal does not by itself create a client relationship or require either party to proceed. Marketing services begin only under a separate written agreement accepted by the relevant parties.
                </p>
                <p>
                  The written services agreement should control the scope, responsibilities, fees, payment timing, term, cancellation, ownership, approvals, confidentiality, data handling, third-party costs, and other service-specific terms. If these website terms conflict with a signed services agreement, the signed agreement should control for the covered services.
                </p>
              </section>

              <section id="results">
                <h2>4. No guaranteed marketing outcomes</h2>
                <p>
                  Marketing results depend on many factors outside any one provider’s control, including competition, market demand, platform changes, customer behavior, pricing, reputation, sales follow-up, business capacity, seasonality, and the accuracy of information supplied by the client.
                </p>
                <p>
                  Unless a signed agreement expressly says otherwise, Hometown Boost does not guarantee search rankings, map placement, traffic, review volume or rating, calls, leads, customer volume, revenue, advertising performance, or any specific business result. Examples, process illustrations, and measurement frameworks are not promises of future performance.
                </p>
              </section>

              <section id="acceptable-use">
                <h2>5. Acceptable use</h2>
                <p>Visitors may not use the website to:</p>
                <ul className={styles.legalList}>
                  <li>Break applicable law or violate another person’s rights.</li>
                  <li>Submit false, misleading, unlawful, abusive, infringing, or malicious content.</li>
                  <li>Introduce malware, interfere with security, probe for vulnerabilities, or disrupt website operation.</li>
                  <li>Use automated means to scrape, copy, overload, or extract website content or data except as permitted by law and any applicable technical instructions.</li>
                  <li>Impersonate another person or misrepresent an affiliation.</li>
                  <li>Attempt to access nonpublic systems, accounts, or information without authorization.</li>
                </ul>
                <p>Access may be limited or blocked when reasonably necessary to protect the website, users, or other parties.</p>
              </section>

              <section id="intellectual-property">
                <h2>6. Website content and intellectual property</h2>
                <p>
                  The website’s text, layout, branding, graphics, visual compositions, and other original content are protected by applicable intellectual property laws. Subject to these terms, visitors may view the website and may print or save a reasonable copy for personal or internal business evaluation.
                </p>
                <p>
                  No other license is granted. Website content may not be republished, sold, misrepresented as another party’s work, or used to create a competing resource without permission or another lawful basis. Third-party names, marks, and content remain the property of their respective owners.
                </p>
              </section>

              <section id="submissions">
                <h2>7. Information visitors submit</h2>
                <p>
                  A visitor remains responsible for the accuracy and lawfulness of information submitted through a website channel. The visitor should have the right to share that information and should not submit sensitive personal information, passwords, payment card data, confidential client records, or materials that violate another party’s rights through a general inquiry.
                </p>
                <p>
                  Information submitted through the site may be used to respond, evaluate service fit, prepare requested materials, protect the website, and for other purposes described in the Privacy Policy.
                </p>
              </section>

              <section id="third-party">
                <h2>8. Third-party platforms and links</h2>
                <p>
                  The website may reference or link to third-party websites, maps, scheduling tools, advertising platforms, analytics services, social networks, or other resources. Those services are controlled by third parties and are subject to their own terms, privacy practices, availability, and changes.
                </p>
                <p>
                  A reference or link does not imply endorsement, control, or responsibility. Visitors use third-party services at their own discretion.
                </p>
              </section>

              <section id="disclaimers">
                <h2>9. Website disclaimers</h2>
                <p>
                  To the extent permitted by law, the website is provided on an “as is” and “as available” basis. No representation is made that the website will always be uninterrupted, error-free, completely secure, or suitable for every purpose.
                </p>
                <p>
                  To the extent permitted by law, implied warranties relating to the website—including merchantability, fitness for a particular purpose, title, and non-infringement—are disclaimed. Some jurisdictions do not allow certain disclaimers, so these limitations may not apply in full to every visitor.
                </p>
              </section>

              <section id="liability">
                <h2>10. Limitation of liability</h2>
                <p>
                  To the extent permitted by law, Hometown Boost will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from use of or inability to use the website, including lost profits, lost revenue, lost data, lost opportunities, or business interruption.
                </p>
                <p>
                  Any monetary cap, exceptions, allocation of risk, indemnity, governing law, venue, or dispute-resolution process should be finalized with legal review and, for client work, addressed in the applicable signed services agreement. Nothing in these terms limits liability that cannot lawfully be limited.
                </p>
              </section>

              <section id="changes">
                <h2>11. Changes and website availability</h2>
                <p>
                  Website content, features, and these terms may be changed from time to time. The effective date should be updated when revised terms are posted. Continued use after revised terms become effective indicates acceptance to the extent permitted by law.
                </p>
                <p>
                  The website or any feature may be changed, suspended, or discontinued when reasonably necessary, without a promise that any particular content will remain available.
                </p>
              </section>

              <section id="contact">
                <h2>12. Contact</h2>
                <p>
                  Questions about these terms may be submitted through the official contact method published on the <a href="/contact">Contact page</a>. Before launch, this section and the terms should be updated with any business identity, notice address, governing-law, and dispute provisions required for the final operating structure.
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
