import type { Metadata } from "next";
import Link from "next/link";
import {
  FinalCTA,
  SectionTitle,
  SiteFooter,
  SiteHeader,
} from "./components";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const values = [
  {
    icon: "◎",
    title: "More Visibility",
    text: "Show up where local customers search and browse.",
  },
  {
    icon: "✦",
    title: "More Engagement",
    text: "Build attention, trust, and recognition.",
  },
  {
    icon: "⌁",
    title: "More Customers",
    text: "Turn searches, clicks, and calls into business.",
  },
  {
    icon: "↗",
    title: "More Growth",
    text: "Measure results and keep improving.",
  },
];

const services = [
  {
    icon: "▤",
    title: "Website Design",
    text: "Give customers a fast, clear path from first visit to first conversation.",
    href: "/services/website-design",
    object: "browser",
  },
  {
    icon: "⌕",
    title: "Local SEO",
    text: "Help nearby customers find your business when they are ready to choose.",
    href: "/services/local-seo",
    object: "search",
  },
  {
    icon: "⌖",
    title: "Google Business Profile",
    text: "Keep your local presence accurate, active, and easier to discover.",
    href: "/services/google-business-profile",
    object: "pin",
  },
  {
    icon: "✓",
    title: "Reputation Management",
    text: "Make it easier to earn feedback and build confidence before the call.",
    href: "/services/reputation-management",
    object: "feedback",
  },
  {
    icon: "☏",
    title: "Call & Lead Tracking",
    text: "See which marketing creates real conversations and follow-up opportunities.",
    href: "/services/call-tracking",
    object: "phone",
  },
  {
    icon: "↗",
    title: "Paid Advertising",
    text: "Reach the right local audience with focused campaigns and clear reporting.",
    href: "/services/paid-advertising",
    object: "chart",
  },
];

const measureItems = [
  {
    key: "01",
    title: "Phone calls",
    text: "Track call activity and the source that prompted it.",
  },
  {
    key: "02",
    title: "Qualified leads",
    text: "Follow forms and inquiries that can become real work.",
  },
  {
    key: "03",
    title: "Search visibility",
    text: "Watch how your business appears across priority local searches.",
  },
  {
    key: "04",
    title: "Website traffic",
    text: "Understand where visitors come from and what they do next.",
  },
  {
    key: "05",
    title: "Reviews",
    text: "See reputation progress without reducing trust to a vanity score.",
  },
  {
    key: "06",
    title: "Direction requests",
    text: "Measure high-intent actions from your local business presence.",
  },
];

const process = [
  {
    number: "01",
    icon: "⌕",
    title: "Discover & Plan",
    text: "We learn your business, your market, your goals, and the customers you want more of.",
  },
  {
    number: "02",
    icon: "↗",
    title: "Implement & Grow",
    text: "We build, launch, manage, and improve the right local marketing system.",
  },
  {
    number: "03",
    icon: "▥",
    title: "Measure & Scale",
    text: "We report clearly, learn what is working, and focus the next move.",
  },
];

const industries = [
  { name: "Equipment Dealers", short: "ED", href: "/industries/equipment-dealers" },
  { name: "Contractors", short: "CT", href: "/industries/contractors" },
  { name: "Home Services", short: "HS", href: "/industries/home-services" },
  { name: "HVAC", short: "HV", href: "/industries/hvac" },
  { name: "Plumbing", short: "PL", href: "/industries/plumbing" },
  { name: "Septic Services", short: "SS", href: "/industries/septic-services" },
  { name: "Lawn & Landscape", short: "LL", href: "/industries/lawn-care" },
  { name: "Repair Shops", short: "RS", href: "/industries/repair-shops" },
  { name: "Automotive", short: "AU", href: "/industries/automotive" },
  { name: "Retail", short: "RT", href: "/industries#retail" },
  { name: "Professional Services", short: "PS", href: "/industries#professional-services" },
];

export default function Home() {
  return (
    <div className="site-shell home-page">
      <SiteHeader />
      <main id="main-content">
        <section className="home-hero" aria-labelledby="home-hero-title">
          <div className="hero-haze hero-haze-one" aria-hidden="true" />
          <div className="hero-haze hero-haze-two" aria-hidden="true" />
          <div className="home-hero-scene" aria-hidden="true">
            <picture>
              <source srcSet="/hometown-hero.webp" type="image/webp" />
              <img
                className="hero-town-image"
                src="/hometown-hero.png"
                alt=""
                width="1672"
                height="941"
                fetchPriority="high"
              />
            </picture>

            <span className="map-pin hero-map-pin"><i /></span>

            <span className="floating-card website-card">
              <i className="browser-dots">•••</i>
              <b>Your website</b>
              <span className="website-preview">
                <i />
                <em />
              </span>
              <span className="website-lines"><i /><i /><i /></span>
            </span>

            <span className="floating-card call-card">
              <i className="mini-icon">☎</i>
              <span><small>New call</small><b>Tracked lead</b></span>
            </span>

            <span className="floating-card review-card">
              <i className="review-signal">✓</i>
              <b>Feedback follow-up</b>
              <small>Trust customers can see</small>
            </span>

            <span className="floating-card analytics-card">
              <small>Clear reporting</small>
              <b>Month by month</b>
              <i className="sparkline"><em /><em /><em /><em /><em /></i>
            </span>

            <span className="message-bubble">
              <i /> <i /> <i />
            </span>
            <span className="scene-glint glint-one">✦</span>
            <span className="scene-glint glint-two">✦</span>
          </div>

          <div className="container home-hero-inner">
            <div className="home-hero-copy">
              <p className="eyebrow eyebrow-pill">Local marketing that drives real growth</p>
              <h1 id="home-hero-title">
                More calls.<br />
                More customers.<br />
                More <em>hometown momentum.</em>
              </h1>
              <p className="home-hero-description">
                We help local businesses show up, stand out, and get chosen with
                better websites, stronger Google visibility, more reviews, and
                practical marketing built to drive growth.
              </p>
              <div className="hero-actions">
                <Link className="button" href="/contact">
                  Get My Free Game Plan <span aria-hidden="true">→</span>
                </Link>
                <Link className="button button-ghost" href="#process">
                  <span className="play-icon" aria-hidden="true">▶</span>
                  See How It Works
                </Link>
              </div>
              <ul className="trust-list" aria-label="What to expect">
                <li><span>✓</span>Straightforward plans</li>
                <li><span>✓</span>Done-for-you support</li>
                <li><span>✓</span>Results you can measure</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="value-strip-wrap" aria-label="How Hometown Boost helps">
          <div className="container">
            <div className="value-strip">
              {values.map((value) => (
                <article key={value.title}>
                  <span className="value-icon" aria-hidden="true">{value.icon}</span>
                  <div>
                    <h2>{value.title}</h2>
                    <p>{value.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section services-section" id="services">
          <span className="section-orbit services-orbit" aria-hidden="true" />
          <div className="container">
            <SectionTitle
              eyebrow="Done-for-you local marketing"
              title={<>Everything you need to grow—<em>handled for you.</em></>}
              description="One connected team for the parts of your marketing that should work together."
            />
            <div className="services-grid">
              {services.map((service, index) => (
                <article className="service-card" key={service.title}>
                  <span className={`service-object service-object-${service.object}`} aria-hidden="true">
                    {service.object === "feedback" ? "✓" : null}
                  </span>
                  <span className="service-number">0{index + 1}</span>
                  <span className="service-icon" aria-hidden="true">{service.icon}</span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <Link className="text-link" href={service.href}>
                    Learn more <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section measure-section" id="results">
          <div className="container measure-panel">
            <div className="measure-intro">
              <SectionTitle
                eyebrow="What we measure"
                title={<>Clear signals.<br /><em>No mystery math.</em></>}
                description="We build reporting around the actions that matter to a local business. Your starting point becomes the baseline, and approved client outcomes become case studies—not guesses dressed up as proof."
              />
              <Link className="button button-dark" href="/results">
                See Our Approach <span aria-hidden="true">→</span>
              </Link>
              <div className="growth-sculpture" aria-hidden="true">
                <span /><span /><span /><span />
                <i>↗</i>
              </div>
            </div>
            <div className="measure-grid" aria-label="Measurement categories">
              {measureItems.map((item) => (
                <article key={item.title}>
                  <span>{item.key}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <i aria-hidden="true">→</i>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="container">
            <SectionTitle
              eyebrow="Our simple process"
              title={<>Three steps to <em>sustainable growth.</em></>}
              description="Clear priorities, practical execution, and reporting a business owner can actually use."
              align="center"
            />
            <div className="process-line" aria-hidden="true">
              <span /><span /><span />
            </div>
            <div className="process-grid">
              {process.map((step) => (
                <article key={step.number}>
                  <span className="process-number">{step.number}</span>
                  <span className="process-icon" aria-hidden="true">{step.icon}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section industries-section">
          <div className="container industries-panel">
            <div className="industries-copy">
              <SectionTitle
                eyebrow="Built for local businesses"
                title={<>We understand businesses <em>like yours.</em></>}
                description="If your growth depends on being known and trusted nearby, Hometown Boost is built for your world."
              />
              <Link className="text-link" href="/industries">
                Explore all industries <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="industry-grid">
              {industries.map((industry) => (
                <Link href={industry.href} key={industry.name}>
                  <span aria-hidden="true">{industry.short}</span>
                  <strong>{industry.name}</strong>
                  <i aria-hidden="true">↗</i>
                </Link>
              ))}
            </div>
            <div className="industry-tool" aria-hidden="true">
              <span className="tool-handle" />
              <span className="tool-head" />
            </div>
          </div>
        </section>

        <section className="section pricing-teaser-section">
          <div className="container pricing-teaser">
            <div className="pricing-copy">
              <SectionTitle
                eyebrow="Straightforward plans"
                title={<>Marketing that grows <em>with your business.</em></>}
                description="Choose support that fits where your business is today, with room to expand as your goals change."
              />
              <ul className="check-list">
                <li><span>✓</span> Simple monthly plans</li>
                <li><span>✓</span> Optional advertising management</li>
                <li><span>✓</span> Options for multi-location businesses</li>
              </ul>
              <Link className="button" href="/pricing">
                See Plans & Pricing <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="plan-scene" aria-hidden="true">
              <span className="plan-card plan-card-back"><i /> <i /> <i /></span>
              <span className="plan-card plan-card-front">
                <b>Built to fit</b><i /> <i /> <i />
                <em>✓</em>
              </span>
              <span className="plan-token token-one">HB</span>
              <span className="plan-token token-two">✦</span>
              <span className="plan-spark">✦</span>
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
