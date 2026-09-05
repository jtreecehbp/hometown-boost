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
  planInterest: "Growth",
};
async function fixture(
  t,
  { status = 200, fail = false, configured = true } = {},
) {
  const requests = [];
  const server = createAppServer({
    indexing: false,
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

test("valid inquiries forward only registered fields and confirm after the provider accepts", async (t) => {
  const f = await fixture(t);
  const response = await f.submit({
    ...valid,
    unknownSecret: "do-not-forward",
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(f.requests.length, 1);
  const forwarded = new URLSearchParams(f.requests[0].body);
  assert.equal(forwarded.get("email"), valid.email);
  assert.equal(forwarded.get("planInterest"), "Growth");
  assert.equal(forwarded.has("unknownSecret"), false);
  const native = await f.submit(valid, { Accept: "text/html" });
  assert.equal(native.status, 303);
  assert.equal(native.headers.get("location"), "/thank-you/");
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
