import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { getMonitoringConfig } from "../src/monitoring/config.mjs";
import { createConsentController, CONSENT_KEY } from "../src/monitoring/consent.mjs";
import { createMonitor } from "../src/monitoring/monitoring.mjs";

// Offline only. Script insertion is captured below; no network request is made.
const env = { WEBSITE_ANALYTICS_ENABLED: "true", GA4_AUTOMATIC_MEASUREMENT_DISABLED: "true", GA4_MEASUREMENT_ID: "G-TEST123456" };
const enabled = getMonitoringConfig(env);
function storage() {
  const values = new Map();
  return { values, getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
}
function browser(url = "https://hometownboost.com/", localStorage = storage()) {
  const scripts = [], listeners = new Map(), windowListeners = new Map();
  let reloads = 0;
  const location = new URL(url);
  location.reload = () => { reloads++; };
  const win = {
    location, localStorage, sessionStorage: storage(), crypto: webcrypto,
    history: { state: null, replaceState(_state, _title, value) { location.href = value; } },
    addEventListener(name, listener) { windowListeners.set(name, listener); },
    document: {
      title: "Private customer title", referrer: "https://example.com/private?email=secret", cookie: "",
      head: { appendChild(script) { scripts.push(script); } },
      createElement() { return { setAttribute() {}, remove() { this.removed = true; } }; },
      querySelector() { return null; },
      addEventListener(name, listener) { listeners.set(name, listener); },
    },
  };
  return { win, scripts, windowListeners, get reloads() { return reloads; },
    click(attrs) { listeners.get("click")?.({ isTrusted: true, target: { closest: () => ({ getAttribute: (key) => attrs[key] ?? null }) } }); },
  };
}
function events(b) { return (b.win.hbMonitoringLayer ?? []).filter((row) => row[0] === "event").map((row) => Array.from(row)); }
function preference(b, choice, extra = {}) {
  b.win.localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, at: Date.now(), measurementId: enabled.measurementId, ...extra }));
}

test("default, missing ID, missing release assertion and disabled switch remain inert", () => {
  for (const values of [{}, { ...env, WEBSITE_ANALYTICS_ENABLED: "false" }, { ...env, GA4_MEASUREMENT_ID: "" }, { ...env, GA4_AUTOMATIC_MEASUREMENT_DISABLED: "false" }]) {
    const config = getMonitoringConfig(values), b = browser();
    preference(b, "granted");
    const controller = createConsentController(config, b.win);
    controller.refresh(); controller.choose("granted"); controller.openSettings();
    assert.equal(config.measurementId, null);
    assert.equal(controller.getSnapshot().available, false);
    assert.equal(b.scripts.length, 0);
  }
});

test("HTTPS production host and exact public-route gates prevent preview or private collection", () => {
  for (const url of ["http://hometownboost.com/", "https://hometownboost.com:4173/", "https://hometown-boost-preview.40.160.2.98.sslip.io/", "http://localhost/", "https://hometownboost.com/admin", "https://hometownboost.com/signin-with-chatgpt", "https://hometownboost.com/resources/private", "https://hometownboost.com/api/test"]) {
    const b = browser(url); preference(b, "granted");
    const controller = createConsentController(enabled, b.win); controller.refresh(); controller.choose("granted");
    assert.equal(b.scripts.length, 0, url);
  }
});

test("unknown preference requests a choice without Google; decline persists without loading", () => {
  const b = browser(), c = createConsentController(enabled, b.win);
  c.refresh(); assert.equal(c.getSnapshot().open, true); assert.equal(b.scripts.length, 0);
  c.choose("denied"); c.refresh();
  assert.equal(c.getSnapshot().choice, "denied"); assert.equal(c.getSnapshot().open, false);
  assert.equal(b.win.hbMonitoringLayer, undefined); assert.equal(b.scripts.length, 0);
  c.openSettings(); assert.equal(c.getSnapshot().open, true);
});

test("explicit grant loads one tag, sanitizes URLs and deduplicates navigation effects", () => {
  const b = browser("https://hometownboost.com/contact?email=secret#private"), c = createConsentController(enabled, b.win);
  c.refresh(); c.choose("granted"); c.refresh(); c.refresh();
  assert.equal(b.scripts.length, 1); assert.equal(events(b).length, 1);
  assert.equal(events(b)[0][2].page_location, "https://hometownboost.com/contact");
  assert.equal(events(b)[0][2].page_referrer, "https://example.com/");
  assert.doesNotMatch(JSON.stringify(events(b)), /secret|private|Private customer/);
  b.win.location.pathname = "/services"; c.refresh(); c.refresh();
  assert.equal(events(b).length, 2); assert.equal(b.scripts.length, 1);
});

test("allowlisted CTAs and contact clicks never become a lead or expose destinations", async () => {
  const b = browser(), c = createConsentController(enabled, b.win); c.refresh(); c.choose("granted");
  b.click({ href: "/contact", "data-hb-cta": "request_recommendation" });
  b.click({ href: "mailto:private@example.com?subject=secret" });
  b.click({ href: "/order?name=secret", "data-hb-cta": "unreviewed" });
  const monitor = createMonitor(enabled, b.win);
  assert.equal(await monitor.confirmLead({ receipt: `hb1_${"a".repeat(32)}`, formType: "general" }), false);
  assert.deepEqual(events(b).map((row) => row[1]), ["page_view", "primary_cta_click", "email_click"]);
  assert.doesNotMatch(JSON.stringify(events(b)), /private@example|secret|generate_lead/);
});

test("withdrawal stores denial before reload, opts out and removes loaded script", () => {
  const b = browser(), c = createConsentController(enabled, b.win); c.refresh(); c.choose("granted");
  c.openSettings(); c.choose("denied");
  assert.equal(JSON.parse(b.win.localStorage.getItem(CONSENT_KEY)).choice, "denied");
  assert.equal(b.win[`ga-disable-${enabled.measurementId}`], true);
  assert.equal(b.scripts[0].removed, true); assert.equal(b.reloads, 1);
  const next = browser("https://hometownboost.com/", b.win.localStorage);
  createConsentController(enabled, next.win).refresh(); assert.equal(next.scripts.length, 0);
});

test("fresh stored grant restores once; expired, malformed and different-property records do not", () => {
  const b = browser(); preference(b, "granted");
  const c = createConsentController(enabled, b.win); c.refresh(); c.refresh();
  assert.equal(b.scripts.length, 1); assert.equal(events(b).length, 1);
  for (const extra of [{ at: 0 }, { at: Date.now() + 86400000 }, { measurementId: "G-OTHER1234" }]) {
    const other = browser(); preference(other, "granted", extra);
    createConsentController(enabled, other.win).refresh(); assert.equal(other.scripts.length, 0);
  }
  const malformed = browser(); malformed.win.localStorage.setItem(CONSENT_KEY, "{broken");
  createConsentController(enabled, malformed.win).refresh(); assert.equal(malformed.scripts.length, 0);
});

test("blocked preference storage fails closed; stale unwriteable grant gets reload denial guard", () => {
  const b = browser(); b.win.localStorage.setItem = () => { throw Error("blocked"); };
  const c = createConsentController(enabled, b.win); c.refresh(); c.choose("granted");
  assert.equal(b.scripts.length, 0); assert.match(c.getSnapshot().message, /remains off/);
  const stuck = browser(); preference(stuck, "granted");
  const controller = createConsentController(enabled, stuck.win); controller.refresh();
  stuck.win.localStorage.setItem = stuck.win.localStorage.removeItem = () => { throw Error("blocked"); };
  controller.choose("denied");
  assert.equal(stuck.reloads, 1); assert.equal(stuck.win.location.hash, "#analytics-disabled");
  const after = browser(stuck.win.location.href, stuck.win.localStorage);
  createConsentController(enabled, after.win).refresh(); assert.equal(after.scripts.length, 0);
});

test("cross-tab withdrawal reloads; navigation away from public routes unloads the runtime", () => {
  const b = browser(), c = createConsentController(enabled, b.win); c.refresh(); c.choose("granted");
  preference(b, "denied"); b.windowListeners.get("storage")({ key: CONSENT_KEY });
  assert.equal(b.reloads, 1);
  const next = browser(), another = createConsentController(enabled, next.win); another.refresh(); another.choose("granted");
  next.win.location.pathname = "/account"; another.refresh();
  assert.equal(next.reloads, 1); assert.equal(events(next).length, 1);
});

test("preexisting Google globals prevent a second installation", () => {
  const b = browser(); b.win.gtag = () => {}; preference(b, "granted");
  const c = createConsentController(enabled, b.win); c.refresh(); c.choose("granted");
  assert.equal(c.getSnapshot().available, false); assert.equal(b.scripts.length, 0);
});

test('confirmed inquiry receipts count at most once only after consent and never expose receipt data', async () => {
 const b=browser('https://hometownboost.com/start?utm_source=google&utm_medium=cpc&utm_campaign=foundation_launch');
 const c=createConsentController(enabled,b.win);c.refresh();
 const monitor=createMonitor(enabled,b.win), receipt='hb1_'+'x'.repeat(32);
 assert.equal(await monitor.confirmLead({receipt,formType:'recommendation'}),false);
 c.choose('granted');
 assert.equal(await monitor.confirmLead({receipt,formType:'recommendation'}),true);
 assert.equal(await monitor.confirmLead({receipt,formType:'recommendation'}),false);
 assert.equal(events(b).filter(row=>row[1]==='generate_lead').length,1);
 assert.doesNotMatch(JSON.stringify(events(b)),new RegExp(receipt));
 assert.equal(events(b).find(row=>row[1]==='generate_lead')[2].campaign_name,'foundation_launch');
});
