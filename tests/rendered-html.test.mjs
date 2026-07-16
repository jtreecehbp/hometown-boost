import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

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
  assert.match(components, /export function SiteHeader/);
  assert.match(components, /export function SiteFooter/);
  assert.match(components, /export function PageHero/);
  assert.match(components, /export function FinalCTA/);
  assert.match(components, /export function SectionTitle/);
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

test("serves every launch route with route-specific metadata", async () => {
  const routes = [
    "/services",
    "/industries",
    "/results",
    "/pricing",
    "/about",
    "/reviews",
    "/contact",
    "/resources",
    "/privacy",
    "/terms",
  ];

  for (const pathname of routes) {
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
  }
});

test("publishes complete host-aware discovery files", async () => {
  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /http:\/\/localhost\/services/);
  assert.match(sitemap, /http:\/\/localhost\/privacy/);
  assert.match(sitemap, /http:\/\/localhost\/terms/);

  const robotsResponse = await render("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: http:\/\/localhost\/sitemap\.xml/);
});
