import type { CSSProperties } from "react";
import Link from "next/link";
import {
  FinalCTA,
  SectionTitle,
  SiteFooter,
  SiteHeader,
} from "./components";
import type { IndustryDetail } from "./industry-detail-data";
import { getSiteUrl } from "./site-url";
import styles from "./industry-detail.module.css";

type IndustryDetailPageProps = {
  industry: IndustryDetail;
};

function DetailScene({ industry }: IndustryDetailPageProps) {
  const sceneStyle = {
    "--scene-accent": industry.scene.accent,
    "--scene-accent-soft": industry.scene.accentSoft,
    "--scene-tilt": industry.scene.tilt,
  } as CSSProperties;

  return (
    <div className={styles.scene} style={sceneStyle} aria-hidden="true">
      <div className={styles.sceneImage}>
        <picture>
          <source srcSet="/hometown-hero.webp" type="image/webp" />
          <img
            src="/hometown-hero.png"
            alt=""
            width="1672"
            height="941"
            style={{ objectPosition: industry.scene.imagePosition }}
          />
        </picture>
      </div>
      <span className={styles.routeRibbon} />
      <span className={styles.routePin}><i /></span>

      <div className={styles.searchCard}>
        <span>LOCAL SEARCH</span>
        <strong>{industry.scene.searchLabel}</strong>
        <i />
      </div>

      <div className={styles.signalCard}>
        <span>USEFUL SIGNALS</span>
        <strong>{industry.scene.signalLabel}</strong>
      </div>

      <div
        className={`${styles.tradeObject} ${styles[industry.scene.type]}`}
      >
        <span className={styles.objectMain} />
        <span className={styles.objectDetail} />
        <span className={styles.objectAccent} />
        <b>{industry.scene.objectLabel}</b>
      </div>
      <span className={styles.sceneSpark}>✦</span>
    </div>
  );
}

export async function IndustryDetailPage({
  industry,
}: IndustryDetailPageProps) {
  const siteUrl = await getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Industries",
            item: `${siteUrl}/industries`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: industry.name,
            item: `${siteUrl}${industry.path}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: industry.faqs.map((faq) => ({
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
    <div className={styles.page}>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main-content" className={styles.main}>
        <section className={styles.hero} aria-labelledby="industry-hero-title">
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span aria-hidden="true">/</span>
                <Link href="/industries">Industries</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{industry.shortName}</span>
              </nav>
              <p className={styles.eyebrow}>{industry.eyebrow}</p>
              <h1 id="industry-hero-title">{industry.h1}</h1>
              <p className={styles.heroDescription}>
                {industry.heroDescription}
              </p>
              <div className={styles.heroActions}>
                <Link className="button" href="/contact">
                  {industry.ctaLabel} <span aria-hidden="true">→</span>
                </Link>
                <a className="button button-ghost" href="#how-we-help">
                  See how we help
                </a>
              </div>
            </div>
            <DetailScene industry={industry} />
          </div>
        </section>

        <nav className={styles.anchorNav} aria-label={`${industry.shortName} page sections`}>
          <a href="#challenges">Common challenges</a>
          <a href="#customer-search">How customers search</a>
          <a href="#services-that-matter">Services that matter</a>
          <a href="#measurement">Measurement</a>
          <a href="#questions">Questions</a>
        </nav>

        <section className={styles.section} id="challenges">
          <div className="container">
            <SectionTitle
              eyebrow="Common challenges"
              title={<>Local demand is valuable. <em>Fit still matters.</em></>}
              description={industry.challengeIntro}
            />
            <div className={styles.challengeGrid}>
              {industry.challenges.map((challenge, index) => (
                <article className={styles.challengeCard} key={challenge.title}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h2>{challenge.title}</h2>
                  <p>{challenge.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.searchSection} id="customer-search">
          <div className={`container ${styles.searchGrid}`}>
            <div className={styles.searchCopy}>
              <p className={styles.eyebrow}>How customers search</p>
              <h2>Start with the language customers already use.</h2>
              <p>{industry.searchIntro}</p>
              <ul>
                {industry.searches.map((search) => (
                  <li key={search}>{search}</li>
                ))}
              </ul>
            </div>
            <div className={styles.searchJourney} aria-label="Customer search journey">
              <span className={styles.journeyRoute} aria-hidden="true" />
              <article>
                <span>01</span>
                <strong>Describe the need</strong>
                <p>Problem, service, product, project, or goal.</p>
              </article>
              <article>
                <span>02</span>
                <strong>Add local context</strong>
                <p>Town, county, service area, hours, or availability.</p>
              </article>
              <article>
                <span>03</span>
                <strong>Compare confidence</strong>
                <p>Useful details, real feedback, process, and fit.</p>
              </article>
              <article>
                <span>04</span>
                <strong>Take the next step</strong>
                <p>Call, request, visit, directions, or an estimate.</p>
              </article>
              <aside>{industry.searchMoment}</aside>
            </div>
          </div>
        </section>

        <section className={styles.section} id="services-that-matter">
          <div className="container">
            <SectionTitle
              eyebrow="Services that matter"
              title={<>The right pieces should work as <em>one local system.</em></>}
              description={`The mix for ${industry.shortName.toLowerCase()} depends on the current foundation, service area, capacity, and customer journey. These are the most common places to look first.`}
              align="center"
            />
            <div className={styles.serviceGrid}>
              {industry.services.map((service, index) => (
                <article className={styles.serviceCard} key={service.title}>
                  <span className={styles.serviceNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.serviceGlyph} aria-hidden="true" />
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  <Link href={service.href}>Explore this service <span aria-hidden="true">→</span></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.helpSection} id="how-we-help">
          <div className="container">
            <div className={styles.helpHeading}>
              <SectionTitle
                eyebrow="How Hometown Boost helps"
                title={<>Build clarity first. <em>Then build momentum.</em></>}
                description={industry.helpIntro}
              />
              <div className={styles.helpBadge}>
                <span aria-hidden="true">✓</span>
                No invented proof<br />No mystery metrics
              </div>
            </div>
            <ol className={styles.helpGrid}>
              {industry.helpSteps.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h2>{step.title}</h2>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.measureSection} id="measurement">
          <div className={`container ${styles.measurePanel}`}>
            <div className={styles.measureIntro}>
              <p className={styles.eyebrow}>Proof-safe measurement</p>
              <h2>Measure useful customer signals—not a made-up success story.</h2>
              <p>
                Hometown Boost defines a baseline, documents the source, and reports only what the available data can support.
              </p>
              <div className={styles.measureSculpture} aria-hidden="true">
                <span /><span /><span /><span />
                <i>↗</i>
              </div>
            </div>
            <div className={styles.measurements}>
              {industry.measurements.map((measurement, index) => (
                <article key={measurement.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{measurement.title}</h3>
                  <p>{measurement.description}</p>
                </article>
              ))}
              <aside>
                <strong>Context belongs in the report.</strong>
                <p>{industry.measurementNote}</p>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.faqSection} id="questions">
          <div className={`container ${styles.faqGrid}`}>
            <div className={styles.faqIntro}>
              <p className={styles.eyebrow}>Useful questions</p>
              <h2>What {industry.shortName.toLowerCase()} owners often ask.</h2>
              <p>
                The exact plan is shaped around your market and operation. These answers explain the standards we use before recommending work.
              </p>
              <Link className="button button-ghost" href="/contact">
                Ask about your business
              </Link>
            </div>
            <div className={styles.faqList}>
              {industry.faqs.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.relatedSection} aria-labelledby="related-title">
          <div className="container">
            <div className={styles.relatedHeading}>
              <div>
                <p className={styles.eyebrow}>Keep exploring</p>
                <h2 id="related-title">Related industries and services</h2>
              </div>
              <Link href="/industries">View every industry <span aria-hidden="true">→</span></Link>
            </div>
            <div className={styles.relatedGrid}>
              {industry.related.map((item) => (
                <Link href={item.href} key={`${item.href}-${item.label}`}>
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                  <i aria-hidden="true">↗</i>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <FinalCTA
          title={industry.ctaTitle}
          body={industry.ctaBody}
          primaryLabel={industry.ctaLabel}
          secondaryLabel="Talk Through the Opportunity"
        />
      </main>
      <SiteFooter />
    </div>
  );
}
