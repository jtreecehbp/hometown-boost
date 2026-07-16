import Link from "next/link";
import {
  FinalCTA,
  PageHero,
  SectionTitle,
  SiteFooter,
  SiteHeader,
} from "./components";
import type { ServiceDetail, ServiceSceneVariant } from "./service-detail-data";
import { getSiteUrl } from "./site-url";
import styles from "./service-detail.module.css";

function ServiceScene({ variant }: { variant: ServiceSceneVariant }) {
  if (variant === "website") {
    return (
      <div className={`${styles.scene} ${styles.websiteScene}`} aria-hidden="true">
        <span className={styles.sceneGlow} />
        <span className={styles.browserShell}>
          <i className={styles.browserBar} />
          <i className={styles.browserHero} />
          <i className={styles.browserCopy} />
          <i className={styles.browserButton} />
        </span>
        <span className={styles.phoneShell}><i /><b /></span>
        <span className={styles.cursorShape} />
        <span className={styles.sceneTag}>Clear path to action</span>
      </div>
    );
  }

  if (variant === "localSeo") {
    return (
      <div className={`${styles.scene} ${styles.seoScene}`} aria-hidden="true">
        <span className={styles.sceneGlow} />
        <span className={styles.mapSheet}><i /><i /><i /></span>
        <span className={styles.searchLens}><i /></span>
        <span className={styles.seoPin}><i /></span>
        <span className={styles.rankPanel}><small>LOCAL SEARCH</small><b>Relevant place</b><i /><i /><i /></span>
        <span className={styles.sceneTag}>Services + places + intent</span>
      </div>
    );
  }

  if (variant === "googleProfile") {
    return (
      <div className={`${styles.scene} ${styles.profileScene}`} aria-hidden="true">
        <span className={styles.sceneGlow} />
        <span className={styles.profileStore}>
          <i className={styles.storeRoof} />
          <i className={styles.storeDoor} />
          <i className={styles.storeWindow} />
        </span>
        <span className={styles.profileCard}>
          <small>BUSINESS PROFILE</small><b>Accurate & active</b><i /><i /><i />
        </span>
        <span className={styles.profilePin}><i /></span>
        <span className={styles.routeLine} />
        <span className={styles.sceneTag}>A useful local doorway</span>
      </div>
    );
  }

  if (variant === "reputation") {
    return (
      <div className={`${styles.scene} ${styles.reputationScene}`} aria-hidden="true">
        <span className={styles.sceneGlow} />
        <span className={`${styles.reviewPanel} ${styles.reviewBack}`}><i>✓</i><b>Real experience</b></span>
        <span className={`${styles.reviewPanel} ${styles.reviewFront}`}><i>✓</i><b>Shared honestly</b><small>Feedback workflow</small></span>
        <span className={styles.starObject}>“</span>
        <span className={styles.quoteBubble}><i /><i /><i /></span>
        <span className={styles.sceneTag}>Trust should be earned</span>
      </div>
    );
  }

  if (variant === "paidAdvertising") {
    return (
      <div className={`${styles.scene} ${styles.adsScene}`} aria-hidden="true">
        <span className={styles.sceneGlow} />
        <span className={styles.megaphone}><i /><b /></span>
        <span className={styles.targetShape}><i /><i /></span>
        <span className={styles.campaignPanel}>
          <small>CAMPAIGN SIGNALS</small><b>Quality over clicks</b>
          <i /><i /><i /><i />
        </span>
        <span className={styles.adSpark}>+</span>
        <span className={styles.sceneTag}>Offer + audience + follow-up</span>
      </div>
    );
  }

  return (
    <div className={`${styles.scene} ${styles.callScene}`} aria-hidden="true">
      <span className={styles.sceneGlow} />
      <span className={styles.callPhone}><i /><b /><em /></span>
      <span className={styles.callWave}><i /><i /><i /></span>
      <span className={styles.callNotice}><small>EXAMPLE INQUIRY PATH</small><b>Source context</b><i /></span>
      <span className={styles.leadPanel}><i /><i /><i /><i /></span>
      <span className={styles.sceneTag}>Activity → useful context</span>
    </div>
  );
}

function StructuredData({ service, siteUrl }: { service: ServiceDetail; siteUrl: string }) {
  const pageUrl = `${siteUrl}/services/${service.slug}`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: service.name,
        serviceType: service.name,
        description: service.metadataDescription,
        url: pageUrl,
        provider: {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: "Hometown Boost",
          url: siteUrl,
        },
        audience: {
          "@type": "BusinessAudience",
          audienceType: "Local businesses",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${siteUrl}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export async function ServiceDetailPage({ service }: { service: ServiceDetail }) {
  const siteUrl = await getSiteUrl();

  return (
    <div className={styles.page}>
      <SiteHeader />
      <StructuredData service={service} siteUrl={siteUrl} />
      <main id="main-content" className={styles.main}>
        <PageHero
          hideDefaultArt
          className={styles.hero}
          eyebrow={service.eyebrow}
          title={service.heroTitle}
          description={service.heroDescription}
        >
          <ServiceScene variant={service.scene} />
        </PageHero>

        <nav className={styles.anchorNav} aria-label={`${service.name} page sections`}>
          <a href="#challenge">The challenge</a>
          <a href="#approach">Our approach</a>
          <a href="#included">What is included</a>
          <a href="#measurement">Measurement</a>
          <a href="#faq">Questions</a>
        </nav>

        <section className={styles.summarySection} aria-label={`${service.name} overview`}>
          <div className={`container ${styles.summaryGrid}`}>
            <div>
              <p className={styles.kicker}>The practical goal</p>
              <strong>{service.benefit.title}</strong>
            </div>
            <p>{service.benefit.body}</p>
            <Link className={styles.summaryLink} href="/contact">
              Talk through your starting point <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className={styles.section} id="challenge">
          <div className={`container ${styles.problemSolutionGrid}`}>
            <article className={styles.problemCard}>
              <p className={styles.kicker}>The problem</p>
              <h2>{service.problem.title}</h2>
              <p>{service.problem.body}</p>
              <ul className={styles.signalList}>
                {service.problem.signals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
              <span className={styles.cardObject} aria-hidden="true">?</span>
            </article>

            <article className={styles.solutionCard} id="approach">
              <p className={styles.kicker}>Our approach</p>
              <h2>{service.solution.title}</h2>
              <p>{service.solution.body}</p>
              <ol className={styles.principleList}>
                {service.solution.principles.map((principle, index) => (
                  <li key={principle}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {principle}
                  </li>
                ))}
              </ol>
              <Link className={styles.textLink} href="/contact">
                Build a practical game plan <span aria-hidden="true">↗</span>
              </Link>
              <span className={styles.solutionOrbit} aria-hidden="true" />
            </article>
          </div>
        </section>

        <section className={`${styles.section} ${styles.includedSection}`} id="included">
          <div className="container">
            <SectionTitle
              eyebrow={`What ${service.shortName.toLowerCase()} may include`}
              title="The right pieces, connected in the right order."
              description="The final scope depends on the current setup, market, customer journey, and business priorities. These are the core areas we evaluate together."
              align="center"
            />
            <div className={styles.inclusionGrid}>
              {service.inclusions.map((item, index) => (
                <article key={item.title}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.benefitSection}>
          <div className={`container ${styles.benefitPanel}`}>
            <div>
              <p className={styles.kicker}>The business benefit</p>
              <h2>{service.benefit.title}</h2>
              <p>{service.benefit.body}</p>
            </div>
            <ul>
              {service.benefit.outcomes.map((outcome) => (
                <li key={outcome}><span aria-hidden="true">✓</span>{outcome}</li>
              ))}
            </ul>
            <span className={styles.benefitShape} aria-hidden="true" />
          </div>
        </section>

        <section className={styles.section} id="measurement">
          <div className={`container ${styles.measurementGrid}`}>
            <div className={styles.measurementCopy}>
              <p className={styles.kicker}>Proof-safe measurement</p>
              <h2>{service.measurement.title}</h2>
              <p>{service.measurement.body}</p>
              <div className={styles.measurementNote} role="note">
                <strong>What the numbers do not promise</strong>
                <p>{service.measurement.note}</p>
              </div>
            </div>
            <div className={styles.measurementSignals} aria-label="Measurement signals">
              {service.measurement.signals.map((signal, index) => (
                <article key={signal}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{signal}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.faqSection}`} id="faq">
          <div className={`container ${styles.faqLayout}`}>
            <div>
              <p className={styles.kicker}>Common questions</p>
              <h2>Clear answers before the work begins.</h2>
              <p>Every recommendation should match the business, the available evidence, and the limits of the platforms involved.</p>
            </div>
            <div className={styles.faqList}>
              {service.faqs.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.relatedSection} aria-labelledby="related-services-title">
          <div className="container">
            <div className={styles.relatedHeading}>
              <div>
                <p className={styles.kicker}>Connected services</p>
                <h2 id="related-services-title">The system works better together.</h2>
              </div>
              <Link className={styles.textLink} href="/services">
                View all services <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {service.related.map((related) => (
                <Link href={related.href} key={related.href}>
                  <span aria-hidden="true">↗</span>
                  <h3>{related.label}</h3>
                  <p>{related.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <FinalCTA
          title={service.finalCta.title}
          body={service.finalCta.body}
          primaryLabel="Get My Free Game Plan"
          secondaryLabel="Book a Free Strategy Call"
        />
      </main>
      <SiteFooter />
    </div>
  );
}
