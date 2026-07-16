import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { label: "Services", href: "/services" },
  { label: "Results", href: "/results" },
  { label: "Pricing", href: "/pricing" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
];

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Hometown Boost home">
      <span className="brand-mark" aria-hidden="true">
        <span />
      </span>
      <span className="brand-name">
        Hometown <strong>Boost</strong>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="header-shell">
          <Brand />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link className="button button-small header-cta" href="/contact">
            Get My Free Game Plan <span aria-hidden="true">→</span>
          </Link>
          <details className="mobile-menu">
            <summary aria-label="Open navigation">
              <span />
              <span />
              <span />
            </summary>
            <nav aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <Link className="button" href="/contact">
                Get My Free Game Plan
              </Link>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}

type SectionTitleProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionTitleProps) {
  return (
    <div className={`section-title section-title-${align}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
  className?: string;
  hideDefaultArt?: boolean;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className = "",
  hideDefaultArt = false,
  primaryLabel = "Get My Free Game Plan",
  primaryHref = "/contact",
  secondaryLabel = "Explore Our Services",
  secondaryHref = "/services",
}: PageHeroProps) {
  return (
    <section
      className={`page-hero ${hideDefaultArt ? "page-hero-has-scene" : ""} ${className}`.trim()}
    >
      <div className="page-hero-glow" aria-hidden="true" />
      <div className="container page-hero-grid">
        <div className="page-hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero-description">{description}</p>
          <div className="hero-actions">
            <Link className="button" href={primaryHref}>
              {primaryLabel} <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-ghost" href={secondaryHref}>
              {secondaryLabel}
            </Link>
          </div>
        </div>
        <div className="page-hero-art" aria-hidden="true">
          <span className="page-hero-orbit" />
          <span className="page-hero-window">
            <i />
            <b />
            <em />
          </span>
          <span className="map-pin page-hero-pin"><i /></span>
          <span className="page-hero-feedback">
            <i>✓</i><b>Clear local signal</b>
          </span>
          <span className="page-hero-signal">
            <i />
            <i />
            <i />
          </span>
        </div>
        {children}
      </div>
    </section>
  );
}

type FinalCTAProps = {
  title?: ReactNode;
  body?: ReactNode;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryHref?: string;
  secondaryHref?: string;
};

export function FinalCTA({
  title = "Ready to grow your business?",
  body = "Get a straightforward game plan for improving your website, Google visibility, reviews, and local customer growth.",
  primaryLabel = "Get My Free Game Plan",
  secondaryLabel = "Book a Free Strategy Call",
  primaryHref = "/contact",
  secondaryHref = "/contact",
}: FinalCTAProps) {
  return (
    <section className="final-cta-wrap" aria-labelledby="final-cta-title">
      <div className="container">
        <div className="final-cta">
          <div className="final-cta-copy">
            <p className="eyebrow eyebrow-light">A clearer way forward</p>
            <h2 id="final-cta-title">{title}</h2>
            <p>{body}</p>
            <div className="hero-actions">
              <Link className="button button-light" href={primaryHref}>
                {primaryLabel} <span aria-hidden="true">→</span>
              </Link>
              <Link className="text-link text-link-light" href={secondaryHref}>
                {secondaryLabel} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className="cta-scene" aria-hidden="true">
            <span className="cta-road" />
            <span className="cta-shop">
              <i className="cta-awning" />
              <i className="cta-door" />
              <i className="cta-window" />
            </span>
            <span className="map-pin cta-pin"><i /></span>
            <span className="cta-review"><i>✓</i><b> Feedback workflow</b></span>
            <span className="cta-cloud cta-cloud-one" />
            <span className="cta-cloud cta-cloud-two" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>
            Practical marketing for local businesses that want to get found,
            get chosen, and keep growing.
          </p>
          <Link className="text-link" href="/contact">
            Start with a free game plan <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/services">Services</Link>
          <Link href="/results">Results</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/industries">Industries</Link>
          <Link href="/resources">Resources</Link>
        </div>
        <div>
          <h2>Company</h2>
          <Link href="/about">About</Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <div className="footer-note">
          <p className="eyebrow">Hometown-first growth</p>
          <strong>Big-market thinking.<br />Small-business clarity.</strong>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Hometown Boost.</span>
        <span>Built for the businesses that keep towns moving.</span>
      </div>
    </footer>
  );
}
