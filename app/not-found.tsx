import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components";
import styles from "./seo-pages.module.css";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "That page is off the map. Return to Hometown Boost or explore practical local marketing services.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className={`${styles.notFoundPage} route-island-page`}>
        <div className={`container ${styles.notFoundGrid}`}>
          <div className={styles.notFoundCopy}>
            <p className={styles.miniEyebrow}>404 · Off the map</p>
            <h1>This road doesn&apos;t lead to a page.</h1>
            <p>
              The link may be outdated, or the page may have moved. Let&apos;s get you back to useful ground.
            </p>
            <div className={styles.notFoundActions}>
              <Link className="button" href="/">
                Back to Home <span aria-hidden="true">→</span>
              </Link>
              <Link className="button button-ghost" href="/services">
                Explore Services
              </Link>
            </div>
            <Link className={styles.notFoundContact} href="/contact">
              Or tell us what you were looking for <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className={styles.lostScene} aria-hidden="true">
            <span className={styles.lostRoute} />
            <span className={styles.lostPin}><i /></span>
            <span className={styles.lostShop}>
              <i />
              <b />
              <em />
            </span>
            <span className={styles.lostSign}>PAGE<br />AHEAD?</span>
            <span className={styles.lostCloud} />
            <strong>404</strong>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
