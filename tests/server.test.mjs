import { test } from "node:test";
import assert from "node:assert/strict";
import { createAppServer } from "../server.mjs";

const valid = {
  "form-name": "contact",
  "bot-field": "",
  name: "Test Owner",
  businessName: "Test Business",
  email: "owner@example.test",
  serviceArea: "Test Town",
  message: "Test inquiry",
  planInterest: "Connect",
};
async function fixture(
  t,
  { status = 200, fail = false, configured = true, indexing = false } = {},
) {
  const requests = [];
  const server = createAppServer({
    indexing,
    formServiceUrl: configured ? "https://forms-fixture.netlify.app/" : "",
    fetchImpl: async (url, options) => {
      requests.push({ url, ...options });
      if (fail) throw new Error("offline");
      return new Response("accepted", { status });
    },
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const url = "http://127.0.0.1:" + server.address().port;
  const submit = (fields = valid, headers = {}) =>
    fetch(url + "/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        ...headers,
      },
      body: new URLSearchParams(fields),
      redirect: "manual",
    });
  return { url, requests, submit };
}

test("Coolify serves the built site, compressed 3D code, health checks, and no-index headers", async (t) => {
  const f = await fixture(t);
  const home = await fetch(f.url);
  assert.equal(home.status, 200);
  assert.equal(home.headers.get("x-robots-tag"), "noindex, nofollow");
  const html = await home.text();
  assert.match(html, /Big things/);
  assert.equal(home.headers.get("content-encoding"), "gzip");
  assert.equal((await fetch(f.url + "/healthz")).status, 200);
  assert.deepEqual(await (await fetch(f.url + "/api/contact")).json(), {
    available: true,
  });
  assert.match(
    await (await fetch(f.url + "/robots.txt")).text(),
    /Disallow: \//,
  );
  assert.equal((await fetch(f.url + "/%2e%2e%2fserver.mjs")).status, 404);
  assert.equal((await fetch(f.url + "/%E0%A4%A")).status, 400);
});

test("production pages are indexable while preview indexing stays disabled", async (t) => {
  const f = await fixture(t, { indexing: true });
  const home = await fetch(f.url);
  assert.equal(home.headers.get("x-robots-tag"), null);
  const robots = await (await fetch(f.url + "/robots.txt")).text();
  assert.match(robots, /Allow: \//);
  assert.doesNotMatch(robots, /Disallow: \//);
  assert.match(robots, /Sitemap: https:\/\/hometownboost\.com\/sitemap\.xml/);
});

test("published links redirect permanently to relevant pages and retain campaign tags", async (t) => {
  const f = await fixture(t, { indexing: true });
  for (const [oldPath, target] of [
    ["/services/website-design", "/services/#websites"],
    ["/services/google-business-profile", "/services/#visibility"],
    ["/services/call-tracking", "/services/#integrations"],
    ["/services/paid-advertising", "/google-ads/"],
    ["/industries/contractors", "/industries/"],
    ["/resources/website-not-generating-calls", "/resources/old-website-costing-calls/"],
    ["/results", "/how-it-works/"],
  ]) {
    for (const suffix of ["", "/"]) {
      const response = await fetch(f.url + oldPath + suffix + "?utm_campaign=launch", { redirect: "manual" });
      assert.equal(response.status, 301, oldPath);
      const expected = new URL(target, f.url);
      expected.search = "?utm_campaign=launch";
      assert.equal(response.headers.get("location"), expected.pathname + expected.search + expected.hash);
      const destination = await fetch(expected);
      assert.equal(destination.status, 200, target);
      if (expected.hash) assert.ok((await destination.text()).includes('id="' + expected.hash.slice(1) + '"'));
    }
  }
  const head = await fetch(f.url + "/reviews", { method: "HEAD", redirect: "manual" });
  assert.equal(head.status, 301);
  assert.equal(await head.text(), "");
  assert.equal(f.requests.length, 0);
});

test("valid inquiries forward only registered fields and confirm after the provider accepts", async (t) => {
  const f = await fixture(t);
  const response = await f.submit({
    ...valid,
    unknownSecret: "do-not-forward",
  });
  assert.equal(response.status, 200);
  const accepted = await response.json();
  assert.equal(accepted.ok, true);
  assert.match(accepted.receipt, /^hb1_[A-Za-z0-9_-]{32,128}$/);
  assert.equal(f.requests.length, 1);
  const forwarded = new URLSearchParams(f.requests[0].body);
  assert.equal(forwarded.get("email"), valid.email);
  assert.equal(forwarded.get("planInterest"), "Connect");
  assert.equal(forwarded.has("unknownSecret"), false);
  const native = await f.submit(valid, { Accept: "text/html" });
  assert.equal(native.status, 303);
  assert.equal(native.headers.get("location"), "/thank-you/");
});

test("missing pages offer navigation while retaining 404 status and missing assets remain errors", async (t) => {
  const f = await fixture(t);
  for (const route of ['/an-old-page/', '/an-old-page', '/an-old-page.html', '/404.html']) {
    const response = await fetch(f.url + route);
    assert.equal(response.status, 404, route);
    assert.match(response.headers.get('content-type'), /^text\/html/);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
    const html = await response.text();
    assert.match(html, /Let’s get you back home/);
    assert.match(html, /data-page-scene="notfound"/);
    assert.match(html, /href="\/contact\/"/);
  }
  const head = await fetch(f.url + '/an-old-page/', { method: 'HEAD' });
  assert.equal(head.status, 404);
  assert.equal(await head.text(), '');
  const script = await fetch(f.url + '/_astro/absent.js');
  assert.equal(script.status, 404);
  assert.match(script.headers.get('content-type'), /^text\/plain/);
  assert.equal(await script.text(), 'Not found.');
});

test("invalid, oversized, cross-origin, and honeypot submissions never reach the form provider", async (t) => {
  const f = await fixture(t);
  assert.equal((await f.submit({ ...valid, email: "invalid" })).status, 400);
  assert.equal((await f.submit({ ...valid, businessName: "" })).status, 400);
  assert.equal(
    (await f.submit({ ...valid, "bot-field": "filled" })).status,
    400,
  );
  assert.equal(
    (await f.submit(valid, { Origin: "https://other.example" })).status,
    403,
  );
  assert.equal(
    (await f.submit({ ...valid, message: "x".repeat(40000) })).status,
    413,
  );
  assert.equal(
    (await f.submit(valid, { "Content-Type": "application/json" })).status,
    415,
  );
  assert.equal(f.requests.length, 0);
});

test("unconfigured, rejected, and offline delivery never return a success response", async (t) => {
  for (const config of [
    { configured: false },
    { status: 422 },
    { fail: true },
  ]) {
    const f = await fixture(t, config);
    const response = await f.submit();
    assert.equal(response.status, config.configured === false ? 503 : 502);
    assert.equal((await response.json()).ok, false);
  }
});

test("native form failures offer a readable recovery page without exposing submitted details", async (t) => {
  const cases = [
    { config: { configured: false }, status: 503 },
    { config: { status: 422 }, status: 502 },
    { config: { fail: true }, status: 502 },
    { fields: { email: "invalid" }, status: 400 },
    { fields: { "bot-field": "filled" }, status: 400 },
    { fields: { message: "x".repeat(40000) }, status: 413 },
    { headers: { Origin: "https://other.example" }, status: 403 },
    { headers: { "Content-Type": "application/json" }, status: 415 },
  ];
  for (const item of cases) {
    const f = await fixture(t, { indexing: true, ...item.config });
    const response = await f.submit({
      ...valid,
      name: "Private form answer <script>alert(1)</script>",
      ...item.fields,
    }, { Accept: "text/html,application/xhtml+xml", ...item.headers });
    assert.equal(response.status, item.status);
    assert.match(response.headers.get("content-type"), /^text\/html/);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
    const html = await response.text();
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<h1>We couldn’t confirm your request\.<\/h1>/);
    assert.match(html, /href="\/contact\/"/);
    assert.match(html, /href="mailto:hello@hometownboost\.com"/);
    assert.match(html, /Back button/);
    assert.doesNotMatch(html, /Private form answer|owner@example\.test|<script/);
  }
});
