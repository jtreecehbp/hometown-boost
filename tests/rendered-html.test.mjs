import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const serviceRoutes = [
  "/services/website-design",
  "/services/local-seo",
  "/services/google-business-profile",
  "/services/reputation-management",
  "/services/paid-advertising",
  "/services/call-tracking",
];

const industryRoutes = [
  "/industries/equipment-dealers",
  "/industries/contractors",
  "/industries/home-services",
  "/industries/hvac",
  "/industries/plumbing",
  "/industries/septic-services",
  "/industries/lawn-care",
  "/industries/repair-shops",
  "/industries/automotive",
];

const resourceRoutes = [
  "/resources/rank-higher-google-maps",
  "/resources/website-not-generating-calls",
  "/resources/get-more-google-reviews",
  "/resources/google-business-profile-mistakes",
  "/resources/marketing-metrics-to-track",
  "/resources/equipment-dealer-website",
  "/resources/contractor-local-search",
];

const indexableRoutes = [
  "/",
  "/services",
  "/industries",
  "/results",
  "/pricing",
  "/about",
  "/contact",
  "/resources",
  ...serviceRoutes,
  ...industryRoutes,
  ...resourceRoutes,
];

const previewOnlyRoutes = ["/reviews", "/privacy", "/terms"];

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: {
        accept: "text/html",
        host: "localhost",
        "x-forwarded-proto": "http",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished Hometown Boost homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Hometown Boost \| Local Marketing That Drives Growth<\/title>/i);
  assert.match(html, /More calls\./i);
  assert.match(html, /More customers\./i);
  assert.match(html, /hometown momentum/i);
  assert.match(html, /Everything you need to grow/i);
  assert.match(html, /What we measure/i);
  assert.match(html, /Three steps to/i);
  assert.match(html, /Ready to grow your business\?/i);
  assert.match(html, /href="\/services"/i);
  assert.match(html, /href="\/contact"/i);
  assert.match(html, /property="og:image" content="http:\/\/localhost\/og\.png"/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("keeps the finished shell accessible and free of starter remnants", async () => {
  const [page, layout, components, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /hometown-hero\.webp/);
  assert.match(page, /Clear signals/);
  assert.match(page, /approved client outcomes become case studies/);
  assert.doesNotMatch(page, /\b(?:[1-9]\d*\.?\d*)%|\$\d+/);
  assert.doesNotMatch(page, /★★★★★/);
  assert.match(components, /export function SiteHeader/);
  assert.match(components, /export function SiteFooter/);
  assert.match(components, /export function PageHero/);
  assert.match(components, /export function FinalCTA/);
  assert.match(components, /export function SectionTitle/);
  assert.match(components, /secondaryHref/);
  assert.doesNotMatch(components, /★★★★★/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(layout, /next\/font|codex-preview|Starter Project/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /overflow-x:\s*clip/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton|WRANGLER_LOG_PATH=/);

  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  await access(new URL("../public/hometown-hero.webp", import.meta.url));
  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../.openai/hosting.json", import.meta.url));
});

test("serves the complete expansion with route-specific metadata", async () => {
  for (const pathname of [...indexableRoutes, ...previewOnlyRoutes]) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);

    const html = await response.text();
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, pathname);
    assert.match(
      html,
      new RegExp(
        `<link rel="canonical" href="http://localhost${pathname.replaceAll("/", "\\/")}"`,
        "i",
      ),
      pathname,
    );
    assert.doesNotMatch(
      html,
      /\| Hometown Boost \| Hometown Boost/i,
      pathname,
    );

    if (previewOnlyRoutes.includes(pathname)) {
      assert.match(html, /name="robots" content="noindex, follow"/i, pathname);
    } else {
      assert.doesNotMatch(html, /name="robots" content="noindex/i, pathname);
    }
  }
});

test("keeps CTA labels aligned with their destinations", async () => {
  const [services, industries, results, pricing, about] = await Promise.all([
    render("/services").then((response) => response.text()),
    render("/industries").then((response) => response.text()),
    render("/results").then((response) => response.text()),
    render("/pricing").then((response) => response.text()),
    render("/about").then((response) => response.text()),
  ]);

  assert.match(services, /href="\/industries"[^>]*>\s*Explore Industries/i);
  assert.match(industries, /href="\/services"[^>]*>\s*View Our Services/i);
  assert.match(results, /href="\/services"[^>]*>\s*View Our Services/i);
  assert.match(pricing, /href="\/services"[^>]*>\s*View Our Services/i);
  assert.match(about, /href="\/results"[^>]*>\s*See How We Measure/i);
});

test("keeps every internal route and fragment link valid", async () => {
  const knownRoutes = new Set([...indexableRoutes, ...previewOnlyRoutes]);
  const htmlByRoute = new Map();

  for (const pathname of knownRoutes) {
    const response = await render(pathname);
    htmlByRoute.set(pathname, await response.text());
  }

  for (const [pathname, html] of htmlByRoute) {
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

    for (const href of hrefs) {
      if (!href.startsWith("/") && !href.startsWith("#")) continue;
      if (href.startsWith("/assets/") || href.startsWith("/og.png") || href.startsWith("/favicon.svg")) continue;

      const target = new URL(href, `http://localhost${pathname}`);
      assert.ok(knownRoutes.has(target.pathname), `${pathname} links to missing route ${href}`);

      if (target.hash) {
        const targetHtml = htmlByRoute.get(target.pathname);
        const id = target.hash.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        assert.match(targetHtml, new RegExp(`id="${id}"`, "i"), `${pathname} links to missing fragment ${href}`);
      }
    }
  }
});

test("keeps lead capture disabled until a real destination is configured", async () => {
  const response = await render("/contact");
  const html = await response.text();
  const source = await readFile(new URL("../app/contact/page.tsx", import.meta.url), "utf8");

  assert.match(html, /Preview form:/i);
  assert.match(html, /disabled=""[^>]*>\s*Sending will be available at launch/i);
  assert.match(source, /CONTACT_FORM_URL/);
  assert.match(source, /BOOKING_URL/);
  assert.match(source, /type="submit"/);
});

test("activates form delivery and booking when destinations are configured", async () => {
  const previousFormUrl = process.env.CONTACT_FORM_URL;
  const previousBookingUrl = process.env.BOOKING_URL;
  process.env.CONTACT_FORM_URL = "https://forms.example.test/hometown-boost";
  process.env.BOOKING_URL = "https://calendar.example.test/hometown-boost";

  try {
    const response = await render("/contact");
    const html = await response.text();
    assert.match(html, /action="https:\/\/forms\.example\.test\/hometown-boost"/i);
    assert.match(html, />\s*Send My Strategy Request\s*</i);
    assert.doesNotMatch(html, /disabled=""[^>]*>\s*Send My Strategy Request/i);
    assert.match(html, /href="https:\/\/calendar\.example\.test\/hometown-boost"/i);
  } finally {
    if (previousFormUrl === undefined) delete process.env.CONTACT_FORM_URL;
    else process.env.CONTACT_FORM_URL = previousFormUrl;
    if (previousBookingUrl === undefined) delete process.env.BOOKING_URL;
    else process.env.BOOKING_URL = previousBookingUrl;
  }
});

test("rejects malformed or insecure lead destinations", async () => {
  const previousFormUrl = process.env.CONTACT_FORM_URL;
  const previousBookingUrl = process.env.BOOKING_URL;
  process.env.CONTACT_FORM_URL = "not-a-url";
  process.env.BOOKING_URL = "http://calendar.example.test/hometown-boost";

  try {
    const response = await render("/contact");
    const html = await response.text();
    assert.match(html, /Preview form:/i);
    assert.match(html, /disabled=""[^>]*>\s*Sending will be available at launch/i);
    assert.doesNotMatch(html, /href="http:\/\/calendar\.example\.test/i);
  } finally {
    if (previousFormUrl === undefined) delete process.env.CONTACT_FORM_URL;
    else process.env.CONTACT_FORM_URL = previousFormUrl;
    if (previousBookingUrl === undefined) delete process.env.BOOKING_URL;
    else process.env.BOOKING_URL = previousBookingUrl;
  }
});

test("publishes structured data that matches visible detail content", async () => {
  const [pricing, service, industry, resource] = await Promise.all([
    render("/pricing").then((response) => response.text()),
    render("/services/local-seo").then((response) => response.text()),
    render("/industries/equipment-dealers").then((response) => response.text()),
    render("/resources/rank-higher-google-maps").then((response) => response.text()),
  ]);

  assert.match(pricing, /"@type":"FAQPage"/);
  assert.match(service, /"@type":"Service"/);
  assert.match(service, /"@type":"BreadcrumbList"/);
  assert.match(service, /"@type":"FAQPage"/);
  assert.match(industry, /"@type":"BreadcrumbList"/);
  assert.match(industry, /"@type":"FAQPage"/);
  assert.match(resource, /"@type":"Article"/);
  assert.match(resource, /"@type":"BreadcrumbList"/);
});

test("publishes complete host-aware discovery files", async () => {
  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  for (const pathname of indexableRoutes) {
    assert.match(sitemap, new RegExp(`http:\\/\\/localhost${pathname.replaceAll("/", "\\/")}`), pathname);
  }
  assert.doesNotMatch(sitemap, /http:\/\/localhost\/reviews/);
  assert.doesNotMatch(sitemap, /http:\/\/localhost\/privacy/);
  assert.doesNotMatch(sitemap, /http:\/\/localhost\/terms/);

  const robotsResponse = await render("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: http:\/\/localhost\/sitemap\.xml/);
});

test("returns a real 404 for unknown routes", async () => {
  const response = await render("/definitely-not-a-hometown-boost-page");
  assert.equal(response.status, 404);
  assert.match(await response.text(), /Off the map/i);
});
