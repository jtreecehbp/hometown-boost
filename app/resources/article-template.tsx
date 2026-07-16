import type { Metadata } from "next";
import Link from "next/link";
import {
  FinalCTA,
  SiteFooter,
  SiteHeader,
} from "../components";
import { createPageMetadata } from "../page-metadata";
import { getSiteUrl } from "../site-url";
import type { ResourceArticle } from "./article-data";
import styles from "./resource-article.module.css";

export function createResourceArticleMetadata(
  article: ResourceArticle,
): Metadata {
  return createPageMetadata({
    title: article.shortTitle,
    description: article.description,
    path: `/resources/${article.slug}`,
  });
}

export async function ResourceArticlePage({
  article,
}: {
  article: ResourceArticle;
}) {
  const siteUrl = await getSiteUrl();
  const articleUrl = `${siteUrl}/resources/${article.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${articleUrl}#article`,
        headline: article.title,
        description: article.description,
        datePublished: article.published,
        dateModified: article.published,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
        author: {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: "Hometown Boost",
          url: siteUrl,
        },
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        isPartOf: {
          "@type": "CollectionPage",
          "@id": `${siteUrl}/resources`,
          name: "Hometown Boost Resources",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${articleUrl}#breadcrumb`,
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
            name: "Resources",
            item: `${siteUrl}/resources`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: articleUrl,
          },
        ],
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
      <main id="main-content">
        <article>
          <header className={styles.hero}>
            <div className={`container ${styles.heroGrid}`}>
              <div className={styles.heroCopy}>
                <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                  <ol>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/resources">Resources</Link></li>
                    <li aria-current="page">{article.shortTitle}</li>
                  </ol>
                </nav>
                <p className={styles.category}>{article.category}</p>
                <h1>{article.title}</h1>
                <p className={styles.description}>{article.description}</p>
                <div className={styles.articleMeta}>
                  <span>By Hometown Boost</span>
                  <span>{article.readTime}</span>
                  <time dateTime={article.published}>{article.updatedLabel}</time>
                </div>
              </div>
              <div className={styles.heroScene} aria-hidden="true">
                <span className={styles.sceneOrbit} />
                <span className={styles.sceneGuide}>
                  <i />
                  <i />
                  <i />
                  <b>FIELD<br />GUIDE</b>
                </span>
                <span className={styles.scenePin}><i /></span>
                <span className={styles.sceneCard}>Clear steps.<br /><strong>Useful next move.</strong></span>
                <span className={styles.sceneSpark}>✦</span>
              </div>
            </div>
          </header>

          <div className={`container ${styles.articleLayout}`}>
            <aside className={styles.contents} aria-label="Article contents">
              <p>In this guide</p>
              <nav>
                {article.sections.map((section, index) => (
                  <a href={`#${section.id}`} key={section.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {section.heading}
                  </a>
                ))}
                <a href="#action-checklist">
                  <span>{String(article.sections.length + 1).padStart(2, "0")}</span>
                  Action checklist
                </a>
              </nav>
            </aside>

            <div className={styles.articleBody}>
              <div className={styles.introduction}>
                {article.introduction.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className={styles.truthNote} role="note">
                <span aria-hidden="true">i</span>
                <p>
                  <strong>A practical guide, not a guarantee.</strong> Search visibility,
                  customer response, and business outcomes vary with competition,
                  demand, location, operations, and many other factors.
                </p>
              </div>

              {article.sections.map((section, index) => (
                <section
                  className={styles.articleSection}
                  id={section.id}
                  key={section.id}
                >
                  <div className={styles.sectionNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets ? (
                    <ul className={styles.bulletList}>
                      {section.bullets.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  ) : null}
                  {section.callout ? (
                    <blockquote className={styles.callout}>{section.callout}</blockquote>
                  ) : null}
                </section>
              ))}

              <section className={styles.checklist} id="action-checklist">
                <p className={styles.checklistEyebrow}>Put it into practice</p>
                <h2>{article.checklistTitle}</h2>
                <ul>
                  {article.checklist.map((item) => (
                    <li key={item}><span aria-hidden="true">✓</span>{item}</li>
                  ))}
                </ul>
              </section>

              <section className={styles.closing} aria-labelledby="guide-next-step">
                <p className={styles.closingEyebrow}>The useful next step</p>
                <h2 id="guide-next-step">Start with the clearest gap.</h2>
                <p>{article.closing}</p>
              </section>

              {article.officialReferences.length ? (
                <section className={styles.references} aria-labelledby="official-references">
                  <h2 id="official-references">Official references</h2>
                  <p>
                    Google product details in this guide were checked against the
                    following official documentation. Features and policies can change.
                  </p>
                  <ul>
                    {article.officialReferences.map((reference) => (
                      <li key={reference.href}>
                        <a href={reference.href}>
                          {reference.label} <span aria-hidden="true">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </div>

          <section className={styles.related} aria-labelledby="related-resources-title">
            <div className="container">
              <div className={styles.relatedHeading}>
                <p>Keep exploring</p>
                <h2 id="related-resources-title">Related services and resources</h2>
              </div>
              <div className={styles.relatedGrid}>
                {article.related.map((item) => (
                  <Link className={styles.relatedCard} href={item.href} key={item.href}>
                    <span>{item.label}</span>
                    <p>{item.description}</p>
                    <i aria-hidden="true">→</i>
                  </Link>
                ))}
              </div>
              <Link className={styles.backLink} href="/resources">
                ← Browse all Hometown Boost resources
              </Link>
            </div>
          </section>

          <FinalCTA
            title="Want help turning the guide into a practical plan?"
            body="We’ll look at the business, the current customer path, and the clearest useful opportunity—then explain the next move in plain language."
            primaryLabel="Get My Free Game Plan"
            secondaryLabel="Talk Through This Topic"
          />
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
