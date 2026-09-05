import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const compiled = ts.transpileModule(
  readFileSync(new URL("../src/scripts/contact.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
function fixture({
  enabled = true,
  query = "",
  stored = "{}",
  result = { ok: true },
  endpoint = "/",
} = {}) {
  const fields = new Map(
    [
      "form-name",
      "name",
      "businessName",
      "email",
      "serviceArea",
      "phone",
      "websiteUrl",
      "industry",
      "message",
      "planInterest",
      "googleAdsInterest",
      "landing_page",
      "source_url",
      "referrer",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ].map((name) => [name, { value: "" }]),
  );
  fields.get("form-name").value = "contact";
  fields.get("name").value = "Test Owner";
  fields.get("email").value = "owner@example.test";
  fields.get("planInterest").value = "Not sure yet";
  const status = {
      hidden: true,
      textContent: "",
      focus() {
        this.focused = true;
      },
    },
    context = { hidden: true, textContent: "" },
    optional = { open: false },
    button = { disabled: false, innerHTML: "Send", textContent: "Send" };
  const attributes = {};
  let submit;
  const requests = [],
    redirects = [],
    events = [];
  const form = {
    dataset: { formEnabled: String(enabled), formEndpoint: endpoint },
    querySelector(selector) {
      if (selector === "button[type=submit]") return button;
      if (selector === "[data-form-status]") return status;
      if (selector === "[data-source-message]") return context;
      if (selector === "[data-optional-details]") return optional;
      return fields.get(selector.match(/name=["']?([^\]"']+)/)?.[1]);
    },
    setAttribute(k, v) {
      attributes[k] = v;
    },
    removeAttribute(k) {
      delete attributes[k];
    },
    addEventListener(type, listener) {
      if (type === "submit") submit = listener;
    },
  };
  const sandbox = {
    exports: {},
    require() {
      return {
        planLabelsById: {
          lite: "Lite",
          starter: "Starter",
          growth: "Growth",
          leader: "Leader",
        },
      };
    },
    document: {
      querySelector: () => form,
      referrer: "https://referrer.test/page?private=value",
    },
    location: {
      search: query,
      origin: "https://example.test",
      pathname: "/contact/",
      assign: (url) => redirects.push(url),
    },
    sessionStorage: { getItem: () => stored },
    URLSearchParams,
    AbortSignal,
    FormData: class {
      forEach(fn) {
        for (const [key, input] of fields) fn(input.value, key);
      }
    },
    fetch: async (url, options) => {
      requests.push({ url, ...options });
      if (result instanceof Error) throw result;
      return result;
    },
    window: { dataLayer: [], dispatchEvent: (event) => events.push(event) },
    CustomEvent: class {
      constructor(type, options) {
        this.type = type;
        this.detail = options.detail;
      }
    },
  };
  vm.runInNewContext(compiled, sandbox);
  sandbox.exports.initContactForm();
  return {
    fields,
    status,
    context,
    optional,
    button,
    attributes,
    requests,
    redirects,
    events,
    submit: () => submit({ preventDefault() {} }),
  };
}
test("plan and campaign links populate the inquiry with first-touch context", () => {
  const f = fixture({
    query: "?plan=GROWTH&utm_source=later",
    stored: JSON.stringify({
      landing_page: "/services/",
      utm_source: "first",
      utm_campaign: "summer",
    }),
  });
  assert.equal(f.fields.get("planInterest").value, "Growth");
  assert.equal(f.fields.get("landing_page").value, "/services/");
  assert.equal(f.fields.get("utm_source").value, "first");
  assert.equal(f.context.hidden, false);
  assert.equal(
    f.fields.get("source_url").value,
    "https://example.test/contact/",
  );
});
test("ads and industry links reveal and populate optional fields", () => {
  const f = fixture({ query: "?service=GOOGLE-ADS&industry=Tree%20Services" });
  assert.equal(f.fields.get("googleAdsInterest").value, "Yes");
  assert.equal(f.fields.get("industry").value, "Tree Services");
  assert.equal(f.optional.open, true);
});
test("unknown and prototype plan names keep the default recommendation", () => {
  for (const plan of ["invalid", "__proto__", "constructor"]) {
    const f = fixture({ query: "?plan=" + plan });
    assert.equal(f.fields.get("planInterest").value, "Not sure yet");
    assert.equal(f.context.hidden, true);
  }
});
test("unavailable session storage data falls back to current campaign details", () => {
  const f = fixture({ stored: "not-json", query: "?utm_campaign=local" });
  assert.equal(f.fields.get("utm_campaign").value, "local");
  assert.equal(f.fields.get("referrer").value, "https://referrer.test/page");
});
test("preview mode never sends or pretends to receive an inquiry", async () => {
  const f = fixture({ enabled: false });
  await f.submit();
  assert.equal(f.requests.length, 0);
  assert.equal(f.redirects.length, 0);
  assert.equal(f.status.hidden, false);
  assert.match(f.status.textContent, /preview/);
});
test("a rejected or failed submission keeps the details and offers retry", async () => {
  for (const result of [{ ok: false }, new Error("offline")]) {
    const f = fixture({ result });
    await f.submit();
    assert.equal(f.redirects.length, 0);
    assert.equal(f.status.hidden, false);
    assert.equal(f.button.disabled, false);
    assert.equal(f.fields.get("email").value, "owner@example.test");
    assert.equal(f.attributes["aria-busy"], undefined);
  }
});
test("accepted submissions encode all fields and then show confirmation", async () => {
  const f = fixture({ query: "?plan=growth" });
  await f.submit();
  assert.equal(f.requests.length, 1);
  assert.equal(f.requests[0].method, "POST");
  assert.equal(
    f.requests[0].headers["Content-Type"],
    "application/x-www-form-urlencoded",
  );
  const body = new URLSearchParams(f.requests[0].body);
  assert.equal(body.get("form-name"), "contact");
  assert.equal(body.get("email"), "owner@example.test");
  assert.equal(body.get("planInterest"), "Growth");
  assert.deepEqual(f.redirects, ["/thank-you/"]);
  assert.equal(f.events[0].detail.event, "lead_submit_success");
  assert.equal("email" in f.events[0].detail, false);
});
test("a second click during a submission cannot duplicate the request", async () => {
  const f = fixture();
  await Promise.all([f.submit(), f.submit()]);
  assert.equal(f.requests.length, 1);
});

test("Coolify inquiries use the local endpoint and require explicit acceptance", async () => {
  for (const confirmed of [true, false]) {
    const f = fixture({
      endpoint: "/api/contact",
      result: { ok: true, json: async () => ({ ok: confirmed }) },
    });
    await f.submit();
    assert.equal(f.requests[0].url, "/api/contact");
    assert.equal(f.redirects.length, confirmed ? 1 : 0);
    assert.equal(f.status.hidden, confirmed);
  }
});
