import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
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
  "/industries/retail-businesses",
  "/industries/professional-services",
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
  const [page, servicesPage, layout, components, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/services/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /hometown-hero\.webp/);
  assert.match(servicesPage, /hometown-services-system\.webp/);
  assert.match(page, /hometown-route-upper-v1\.webp/);
  assert.match(page, /hometown-route-lower-v1\.webp/);
  assert.match(css, /hometown-route-mobile-spine-v3\.webp/);
  assert.match(page, /journey-chapter-upper/);
  assert.match(page, /journey-chapter-lower/);
  assert.match(page, /Clear signals/);
  assert.match(page, /No long-term contracts/);
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
  await assert.rejects(access(new URL("../public/file.svg", import.meta.url)));
  await assert.rejects(access(new URL("../public/globe.svg", import.meta.url)));
  await assert.rejects(access(new URL("../public/window.svg", import.meta.url)));
  await access(new URL("../public/hometown-hero.webp", import.meta.url));
  const servicesAsset = await stat(
    new URL("../public/hometown-services-system.webp", import.meta.url),
  );
  assert.ok(servicesAsset.size < 150_000, "services hero asset should stay lightweight");
  const journeyAssets = await Promise.all([
    stat(new URL("../public/hometown-route-upper-v1.webp", import.meta.url)),
    stat(new URL("../public/hometown-route-lower-v1.webp", import.meta.url)),
    stat(new URL("../public/hometown-route-mobile-spine-v3.webp", import.meta.url)),
    stat(
      new URL(
        "../public/hometown-route-hero-bridge-desktop-v2.webp",
        import.meta.url,
      ),
    ),
    stat(
      new URL(
        "../public/hometown-route-hero-bridge-mobile-v1.webp",
        import.meta.url,
      ),
    ),
  ]);
  assert.ok(
    journeyAssets.every((asset) => asset.size < 180_000),
    "each homepage journey asset should stay lightweight",
  );
  assert.ok(
    journeyAssets.reduce((total, asset) => total + asset.size, 0) < 400_000,
    "the homepage journey asset set should stay within its total budget",
  );
  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../.openai/hosting.json", import.meta.url));
});

test("keeps the homepage highway continuous, bounded, and non-interactive", async () => {
  const [page, css, html] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    render("/").then((response) => response.text()),
  ]);

  assert.match(
    page,
    /hometown-route-upper-v1\.webp[\s\S]{0,220}loading="lazy"[\s\S]{0,80}decoding="async"/,
  );
  assert.match(
    page,
    /hometown-route-lower-v1\.webp[\s\S]{0,220}loading="lazy"[\s\S]{0,80}decoding="async"/,
  );
  assert.equal((page.match(/className="journey-art/g) ?? []).length, 2);
  assert.match(css, /\.home-page main#main-content::before\s*\{\s*display:\s*none;/);
  assert.match(
    css,
    /\.home-hero-scene\s*\{[\s\S]*?right:\s*auto;[\s\S]*?left:\s*50%;[\s\S]*?width:\s*min\(1230px, calc\(100% - 36px\)\);/,
  );
  const journeyRule = css.match(/\.journey-art\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  assert.match(journeyRule, /pointer-events:\s*none/);
  assert.doesNotMatch(journeyRule, /position:\s*fixed/);
  assert.match(css, /background-image:\s*url\("\/hometown-route-mobile-spine-v3\.webp"\)/);
  assert.match(css, /background-size:\s*100% 25%/);
  const heroSceneRules = [...css.matchAll(/\.home-hero-scene\s*\{([\s\S]*?)\}/g)];
  assert.ok(heroSceneRules.length >= 3);
  for (const [, rule] of heroSceneRules) {
    assert.doesNotMatch(rule, /right:\s*-\d/);
  }
  const heroImageRules = [...css.matchAll(/\.hero-town-image\s*\{([\s\S]*?)\}/g)];
  for (const [, rule] of heroImageRules) {
    assert.doesNotMatch(rule, /width:\s*(?:1[1-9]\d|[2-9]\d\d)%/);
  }
  const journeyWrappers = [
    ...html.matchAll(
      /<div class="journey-art[^"]*" aria-hidden="true">([\s\S]*?)<\/div>/gi,
    ),
  ];
  assert.equal(journeyWrappers.length, 2);
  for (const [, wrapper] of journeyWrappers) {
    assert.match(wrapper, /<img[^>]*alt=""/i);
    assert.doesNotMatch(wrapper, /<(?:a|button)\b/i);
  }
  assert.match(html, /src="\/hometown-route-upper-v1\.webp"[^>]*loading="lazy"/i);
  assert.match(html, /src="\/hometown-route-lower-v1\.webp"[^>]*loading="lazy"/i);
});

test("uses one continuous road authority across hero and interior page families", async () => {
  const [page, components, articleTemplate, css, home, about, service, article, services, industry] =
    await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/components.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/resources/article-template.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
      render("/").then((response) => response.text()),
      render("/about").then((response) => response.text()),
      render("/services/local-seo").then((response) => response.text()),
      render("/resources/rank-higher-google-maps").then((response) => response.text()),
      render("/services").then((response) => response.text()),
      render("/industries/hvac").then((response) => response.text()),
    ]);

  assert.match(page, /className="home-hero-bridge"/);
  assert.match(home, /<span class="home-hero-bridge"><\/span>/i);
  assert.ok(
    (css.match(/hometown-route-hero-bridge-desktop-v2\.webp/g) ?? []).length >= 2,
    "the desktop bridge should join both the hero and middle journey chapters",
  );
  assert.match(css, /hometown-route-hero-bridge-mobile-v1\.webp/);

  const spineRules = [
    css.match(/^main#main-content::before\s*\{([\s\S]*?)\n\}/m)?.[1],
    css.match(/^\.interior-route-canvas\s*\{([\s\S]*?)\n\}/m)?.[1],
  ];
  for (const rule of spineRules) {
    assert.ok(rule, "missing a shared interior route rule");
    assert.match(rule, /hometown-route-mobile-spine-v3\.webp/);
    assert.match(rule, /background-position:\s*center top/);
    assert.match(rule, /background-repeat:\s*repeat-y/);
    assert.match(rule, /background-size:\s*100% auto/);
    assert.match(rule, /pointer-events:\s*none/);
  }

  assert.match(
    css,
    /\.contained-route-page \.interior-route-canvas\s*\{\s*display:\s*none;/,
  );
  const containedBodyHandoff =
    css.match(
      /\.contained-route-page main#main-content::before,\s*main#main-content\.contained-route-page::before\s*\{([\s\S]*?)\n\}/,
    )?.[1] ?? "";
  assert.match(containedBodyHandoff, /top:\s*650px/);
  assert.doesNotMatch(containedBodyHandoff, /display:\s*none/);
  assert.match(services, /class="[^"]*\bcontained-route-page\b[^"]*"/i);
  assert.match(industry, /class="[^"]*\bcontained-route-page\b[^"]*"/i);

  const duplicateRoadRule =
    css.match(
      /\.route-integrated-hero \.page-hero-orbit,[\s\S]*?\{\s*display:\s*none !important;\s*\}/,
    )?.[0] ?? "";
  for (const selector of [
    ".route-integrated-hero .page-hero-orbit",
    ".route-integrated-hero .page-hero-art::before",
    '.route-integrated-hero [class*="sceneRing"]',
    '.route-integrated-hero [class*="systemRoute"]',
    '.route-integrated-hero [class*="routeLine"]',
    '.route-integrated-hero [class*="sceneOrbit"]',
  ]) {
    assert.ok(duplicateRoadRule.includes(selector), `missing duplicate-road suppression: ${selector}`);
  }
  assert.match(
    css,
    /\.route-integrated-hero\.page-hero-has-scene \.page-hero-grid::before,\s*\.contained-route-page main#main-content > section:first-child::after,\s*\.contained-route-page \[class\*="routeRibbon"\]\s*\{\s*display:\s*none;/,
  );

  const desktopMiddleBridge =
    css.match(/\.journey-chapter-lower::before\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  assert.match(desktopMiddleBridge, /hometown-route-hero-bridge-desktop-v2\.webp/);
  const mobileRules =
    css.match(/@media \(max-width: 900px\)\s*\{([\s\S]*?)(?=\n@media \(max-width: 680px\))/)?.[1] ?? "";
  assert.match(
    mobileRules,
    /\.journey-chapter-lower::before\s*\{\s*display:\s*none;/,
    "the desktop middle bridge should yield to the seamless mobile spine",
  );
  assert.match(
    mobileRules,
    /\.contained-route-page main#main-content::before,\s*main#main-content\.contained-route-page::before\s*\{\s*top:\s*1100px;/,
    "contained pages should hand their raster hero road to the shared mobile spine",
  );
  assert.match(mobileRules, /hometown-route-hero-bridge-mobile-v1\.webp/);

  assert.match(components, /page-hero route-integrated-hero/);
  assert.match(components, /className="interior-route-canvas" aria-hidden="true"/);
  assert.match(articleTemplate, /route-integrated-hero/);
  assert.match(articleTemplate, /className="interior-route-canvas" aria-hidden="true"/);
  for (const [pathname, html] of [
    ["/about", about],
    ["/services/local-seo", service],
    ["/resources/rank-higher-google-maps", article],
  ]) {
    assert.match(html, /class="[^"]*\broute-integrated-hero\b[^"]*"/i, pathname);
    assert.match(
      html,
      /<div class="interior-route-canvas" aria-hidden="true"><\/div>/i,
      pathname,
    );
  }
});

test("serves the complete expansion with route-specific metadata", async () => {
  const titles = [];
  const descriptions = [];

  for (const pathname of [...indexableRoutes, ...previewOnlyRoutes]) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);

    const html = await response.text();
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
    const description = html.match(
      /<meta name="description" content="([^"]+)"/i,
    )?.[1];

    assert.ok(title, `missing title: ${pathname}`);
    assert.ok(description, `missing description: ${pathname}`);
    assert.ok(description.length >= 50, `short description: ${pathname}`);
    titles.push(title);
    descriptions.push(description);
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

  assert.equal(new Set(titles).size, titles.length, "page titles must be unique");
  assert.equal(
    new Set(descriptions).size,
    descriptions.length,
    "meta descriptions must be unique",
  );
});

test("publishes the retail and professional-services industry expansion", async () => {
  const [retail, professional, home, industries] = await Promise.all([
    render("/industries/retail-businesses").then((response) => response.text()),
    render("/industries/professional-services").then((response) => response.text()),
    render("/").then((response) => response.text()),
    render("/industries").then((response) => response.text()),
  ]);

  assert.match(retail, /Turn local discovery into more useful store visits/i);
  assert.match(
    retail,
    /<title>Local Marketing for Retail Businesses \| Hometown Boost<\/title>/i,
  );
  assert.match(
    retail,
    /<meta name="description" content="Local retail marketing that connects nearby discovery/i,
  );
  assert.match(retail, /"@type":"BreadcrumbList"/);
  assert.match(retail, /"@type":"FAQPage"/);
  assert.match(
    professional,
    /Turn expertise into a clear local reason to reach out/i,
  );
  assert.match(
    professional,
    /<title>Local Marketing for Professional Services \| Hometown Boost<\/title>/i,
  );
  assert.match(
    professional,
    /<meta name="description" content="Local marketing for professional service businesses/i,
  );
  assert.match(professional, /"@type":"BreadcrumbList"/);
  assert.match(professional, /"@type":"FAQPage"/);
  assert.match(home, /href="\/industries\/retail-businesses"/i);
  assert.match(home, /href="\/industries\/professional-services"/i);
  assert.match(industries, /electricians, roofers/i);
  assert.match(industries, /barbers, salons/i);
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
