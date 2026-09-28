/**
 * First-party GA4/GTM adapter. No dependency, top-level network or auto-install.
 * Never infer a lead from form submission, a URL flag or thank-you page.
 */
const OWNER = Symbol.for("hometownboost.monitoring.v1");
const LAYER = "hbMonitoringLayer";
const TOKEN = /^[a-z][a-z0-9_]{0,39}$/;
const RECEIPT = /^hb1_[A-Za-z0-9_-]{32,128}$/;
const SAFE_PATH = /^\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]*$/;
const PRIVATE_SEGMENT = /(?:^|\/)(?:admin|api|auth|account|accounts|login|logout|signin|signout|sign-in|sign-out|staff|employee|employees|preview|staging)(?:\/|$)/i;
const RETENTION_MS = 24 * 60 * 60 * 1000;
const CAMPAIGN_RETENTION_MS = 30 * 60 * 1000;
const RECEIPT_LIMIT = 1000;

function isProductionHost(value) {
  if (typeof value !== "string" || value !== value.toLowerCase()) return false;
  if (!/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/.test(value)) return false;
  if (/(?:^|[.-])(?:localhost|local|test|preview|staging|dev)(?:[.-]|$)/.test(value)) return false;
  return !/\.(?:sslip\.io|nip\.io|netlify\.app|vercel\.app|localhost|local|test)$/.test(value);
}

function normalizeConfig(input = {}) {
  const mode = input.mode ?? "ga4";
  if (!["ga4", "gtm"].includes(mode)) return null;
  if (!TOKEN.test(input.siteId ?? "")) return null;
  if (!/^G-[A-Z0-9]{6,20}$/.test(input.measurementId ?? "")) return null;
  if (mode === "gtm" && !/^GTM-[A-Z0-9]{4,20}$/.test(input.containerId ?? "")) return null;
  // This is a release assertion, not an automatic check of the Google property.
  if (input.automaticMeasurementDisabled !== true) return null;
  if (!Array.isArray(input.productionHosts) || !input.productionHosts.length || !input.productionHosts.every(isProductionHost)) return null;
  if (!Array.isArray(input.routes) || !input.routes.length) return null;
  const routes = [];
  for (const rule of input.routes) {
    if (!rule || typeof rule.match !== "string") return null;
    const prefix = rule.match.endsWith("/*");
    const match = prefix ? rule.match.slice(0, -1) : rule.match;
    // Wildcards are below a named public section, never a whole-site catch-all.
    if (!SAFE_PATH.test(match) || (prefix && match === "/") || PRIVATE_SEGMENT.test(match)) return null;
    if (!SAFE_PATH.test(rule.pagePath ?? "") || PRIVATE_SEGMENT.test(rule.pagePath)) return null;
    if (typeof rule.pageTitle !== "string" || !/^[A-Za-z0-9 '&().,:/-]{1,90}$/.test(rule.pageTitle)) return null;
    routes.push({ match, prefix, pagePath: rule.pagePath, pageTitle: rule.pageTitle });
  }
  const ctas = input.primaryCtas ?? [];
  const forms = input.formTypes ?? [];
  const campaigns = input.campaigns ?? [];
  if (!Array.isArray(ctas) || !ctas.every((v) => typeof v === "string" && TOKEN.test(v))) return null;
  if (!Array.isArray(forms) || !forms.every((v) => typeof v === "string" && TOKEN.test(v))) return null;
  if (!Array.isArray(campaigns) || !campaigns.every((v) => v && [v.source, v.medium, v.name].every((field) => typeof field === "string" && TOKEN.test(field)))) return null;
  return Object.freeze({
    mode, siteId: input.siteId, measurementId: input.measurementId,
    containerId: mode === "gtm" ? input.containerId : null,
    productionHosts: [...new Set(input.productionHosts)], routes,
    primaryCtas: new Set(ctas), formTypes: new Set(forms),
    campaigns: campaigns.map(({ source, medium, name }) => ({ source, medium, name })),
  });
}

function publicPage(config, win) {
  if (!config || !win?.location) return null;
  const { protocol, hostname, port, pathname } = win.location;
  if (protocol !== "https:" || (port && port !== "443") || !config.productionHosts.includes(hostname)) return null;
  let path = pathname;
  try {
    // Reject encoded private paths too; never transmit the decoded visitor path.
    for (let i = 0; i < 3 && path.includes("%"); i++) path = decodeURIComponent(path);
  } catch { return null; }
  if (typeof path !== "string" || path.includes("\\") || PRIVATE_SEGMENT.test(path)) return null;
  const rule = config.routes.find((r) => r.prefix ? path.startsWith(r.match) && path.length > r.match.length : path === r.match);
  if (!rule) return null;
  return {
    routeIdentity: pathname,
    page_location: `https://${hostname}${rule.pagePath}`,
    page_title: rule.pageTitle,
  };
}

function referrerOrigin(value) {
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || !isProductionHost(url.hostname)) return "";
    // Retain source origin only. Never retain incoming referrer path/query/hash.
    return `${url.protocol}//${url.hostname}/`;
  } catch { return ""; }
}

function inactive(reason) {
  return Object.freeze({
    setConsent: () => ({ active: false, reloadRequired: false, reason }),
    pageView: () => false,
    primaryCta: () => false,
    confirmLead: async () => false,
    getStatus: () => ({ active: false, consent: "denied", initialized: false, reason }),
  });
}

/**
 * Create once at the public application boundary. Consent starts denied.
 * The optional environment is only for first-party local tests / SSR safety.
 */
export function createMonitor(input, environment = globalThis.window) {
  const win = environment;
  const doc = win?.document;
  const config = normalizeConfig(input);
  if (!config) return inactive("configuration_pending_or_invalid");
  if (!doc || !win.location) return inactive("browser_unavailable");

  const signature = JSON.stringify({ ...config, primaryCtas: [...config.primaryCtas], formTypes: [...config.formTypes] });
  if (win[OWNER]) {
    return win[OWNER].signature === signature ? win[OWNER].api : inactive("another_monitor_owns_this_page");
  }
  // The kit owns its private layer. Legacy or separately installed Google tags
  // must be reconciled before adding it, rather than silently doubling events.
  if (win[LAYER] || typeof win.gtag === "function" || doc.querySelector?.('script[src*="googletagmanager.com"],script[src*="google-analytics.com"]')) {
    return inactive("existing_google_installation_requires_review");
  }

  let consent = "denied";
  let initialized = false;
  let loadingFailed = false;
  let withdrawn = false;
  let lastPage = null;
  let script = null;
  let campaign;
  const inFlight = new Set();
  const optOut = `ga-disable-${config.measurementId}`;
  const storageKey = `hb:measurement-receipts:v1:${config.siteId}:${config.measurementId}`;
  const cookiePrefix = `hb_${config.siteId}`;
  const campaignKey = `hb:measurement-campaign:v1:${config.siteId}:${config.measurementId}`;

  // Before initialization this changes only local memory, never a Google queue.
  win[optOut] = true;

  function allowedPage() {
    const page = publicPage(config, win);
    const allowed = consent === "granted" && Boolean(page) && !loadingFailed && !withdrawn;
    win[optOut] = !allowed;
    return allowed ? page : null;
  }

  function command() {
    win[LAYER].push(arguments);
  }

  function parameters(page) {
    if (campaign === undefined) {
      campaign = null;
      const query = new URLSearchParams(win.location.search);
      const keys = ["utm_source", "utm_medium", "utm_campaign"];
      const hasTags = keys.some((key) => query.has(key));
      const exact = keys.every((key) => query.getAll(key).length === 1);
      if (hasTags && exact) {
        // Return configured constants, never arbitrary incoming parameter text.
        campaign = config.campaigns.find((c) => c.source === query.get("utm_source") && c.medium === query.get("utm_medium") && c.name === query.get("utm_campaign")) ?? null;
      }
      try {
        const now = Date.now();
        if (campaign) win.sessionStorage.setItem(campaignKey, JSON.stringify({ ...campaign, at: now }));
        else if (hasTags) win.sessionStorage.removeItem(campaignKey);
        else {
          const stored = JSON.parse(win.sessionStorage.getItem(campaignKey) ?? "null");
          if (stored && Number.isFinite(stored.at) && stored.at <= now && stored.at > now - CAMPAIGN_RETENTION_MS) {
            campaign = config.campaigns.find((c) => c.source === stored.source && c.medium === stored.medium && c.name === stored.name) ?? null;
          }
        }
      } catch { /* Approved current-page campaign still works without storage. */ }
    }
    return {
      page_location: page.page_location,
      page_title: page.page_title,
      page_referrer: referrerOrigin(doc.referrer),
      site_id: config.siteId,
      campaign_source: campaign?.source ?? "",
      campaign_medium: campaign?.medium ?? "",
      campaign_name: campaign?.name ?? "",
      // Override optional campaign fields so arbitrary URL inputs are not used.
      campaign_id: "", campaign_content: "", campaign_term: "",
    };
  }

  function initialize(page) {
    if (initialized) return true;
    if (!doc.head?.appendChild || !doc.createElement) return false;
    win[LAYER] = [];
    script = doc.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.setAttribute("data-hb-monitoring", config.siteId);
    script.onerror = () => { loadingFailed = true; win[optOut] = true; };
    const privacy = {
      ad_storage: "denied", ad_user_data: "denied",
      ad_personalization: "denied", analytics_storage: "denied",
    };
    if (config.mode === "ga4") {
      command("consent", "default", privacy);
      command("consent", "update", { ...privacy, analytics_storage: "granted" });
      command("set", { ads_data_redaction: true, url_passthrough: false });
      command("js", new Date());
      command("config", config.measurementId, {
        ...parameters(page), send_page_view: false,
        allow_google_signals: false, allow_ad_personalization_signals: false,
        cookie_flags: "SameSite=Lax;Secure", cookie_prefix: cookiePrefix,
        cookie_domain: win.location.hostname, cookie_path: "/",
      });
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}&l=${LAYER}`;
    } else {
      win[LAYER].push({ hb_analytics_consent: "granted", hb_measurement_id: config.measurementId });
      win[LAYER].push({ "gtm.start": Date.now(), event: "gtm.js" });
      script.src = `https://www.googletagmanager.com/gtm.js?id=${config.containerId}&l=${LAYER}`;
    }
    initialized = true;
    try { doc.head.appendChild(script); }
    catch { loadingFailed = true; win[optOut] = true; return false; }
    return true;
  }

  function emit(name, detail = {}) {
    const page = allowedPage();
    if (!page || !initialize(page)) return false;
    const safe = { ...parameters(page), ...detail };
    if (config.mode === "ga4") command("event", name, { ...safe, send_to: config.measurementId });
    else win[LAYER].push({
      event: "hb_measurement", hb_event_name: name, hb_analytics_consent: "granted",
      hb_measurement_id: config.measurementId,
      // Null resets prevent a previous event's CTA/form value persisting in GTM.
      hb_parameters: { ...safe, cta_name: null, form_type: null, ...detail },
    });
    return true;
  }

  function pageView() {
    const page = allowedPage();
    if (!page) { lastPage = null; return false; }
    if (lastPage === page.routeIdentity) return false;
    if (!emit("page_view")) return false;
    lastPage = page.routeIdentity;
    return true;
  }

  function primaryCta(name) {
    return config.primaryCtas.has(name) ? emit("primary_cta_click", { cta_name: name }) : false;
  }

  async function confirmLead({ receipt, formType } = {}) {
    // Only a caller at the confirmed-success boundary may provide this signal.
    // Tokens are per submission, random, opaque, and never GA/customer IDs.
    if (!allowedPage() || !config.formTypes.has(formType) || typeof receipt !== "string" || !RECEIPT.test(receipt) || !win.crypto?.subtle) return false;
    const initialPage = publicPage(config, win)?.routeIdentity;
    let digest;
    try { digest = await win.crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${config.siteId}:${receipt}`)); }
    catch { return false; }
    const hash = Array.from(new Uint8Array(digest), (v) => v.toString(16).padStart(2, "0")).join("");
    // Consent may have been withdrawn or the route changed during hashing.
    if (!allowedPage() || publicPage(config, win)?.routeIdentity !== initialPage || inFlight.has(hash)) return false;
    inFlight.add(hash);
    try {
      const now = Date.now();
      let stored;
      try {
        const raw = win.sessionStorage.getItem(storageKey);
        stored = raw ? JSON.parse(raw) : [];
        // Corrupted state fails closed rather than potentially recounting leads.
        if (!Array.isArray(stored) || stored.some((r) => !Array.isArray(r) || r.length !== 2 || !/^[a-f0-9]{64}$/.test(r[0]) || !Number.isFinite(r[1]))) return false;
        stored = stored.filter((r) => r[1] > now - RETENTION_MS && r[1] <= now);
        if (stored.some((r) => r[0] === hash) || stored.length >= RECEIPT_LIMIT) return false;
        // Record before dispatch: at-most-once queuing, not guaranteed delivery.
        win.sessionStorage.setItem(storageKey, JSON.stringify([...stored, [hash, now]]));
      } catch { return false; }
      return emit("generate_lead", { form_type: formType });
    } finally { inFlight.delete(hash); }
  }

  function setConsent(choice) {
    const wasGranted = consent === "granted";
    consent = choice === "granted" ? "granted" : "denied";
    if (consent === "denied") {
      win[optOut] = true;
      lastPage = null;
      withdrawn = withdrawn || (wasGranted && initialized);
      if (withdrawn) script?.remove?.();
      try { win.sessionStorage.removeItem(storageKey); } catch { /* No analytics storage needed to deny. */ }
      try { win.sessionStorage.removeItem(campaignKey); } catch { /* Same rule for approved campaign constants. */ }
      campaign = undefined;
      try {
        const names = (doc.cookie ?? "").split(";").map((part) => part.trim().split("=", 1)[0]);
        for (const name of names) {
          if (name !== `${cookiePrefix}_ga` && !name.startsWith(`${cookiePrefix}_ga_`)) continue;
          // Only this kit's names and configured host scope, never app/auth cookies.
          doc.cookie = `${name}=;Max-Age=0;Path=/;Secure;SameSite=Lax`;
          doc.cookie = `${name}=;Max-Age=0;Path=/;Domain=${win.location.hostname};Secure;SameSite=Lax`;
        }
      } catch { /* Revocation still blocks events if cookies cannot be accessed. */ }
      if (initialized && config.mode === "gtm") win[LAYER].push({ event: "hb_consent_revoked", hb_analytics_consent: "denied" });
      return { active: false, reloadRequired: withdrawn, reason: "consent_denied" };
    }
    if (withdrawn) return { active: false, reloadRequired: true, reason: "reload_after_withdrawal" };
    const page = allowedPage();
    if (!page || !initialize(page)) return { active: false, reloadRequired: false, reason: "host_path_or_loader_blocked" };
    pageView();
    return { active: true, reloadRequired: false, reason: "enabled_pending_network_verification" };
  }

  function click(event) {
    if (event.isTrusted === false || !allowedPage()) return;
    const element = event.target?.closest?.("a[href],button[data-hb-cta]");
    if (!element) return;
    const href = element.getAttribute("href") ?? "";
    // The address/number, anchor text and full target URL never enter the event.
    if (/^tel:/i.test(href)) { emit("phone_click"); return; }
    if (/^mailto:/i.test(href)) { emit("email_click"); return; }
    primaryCta(element.getAttribute("data-hb-cta"));
  }

  const api = Object.freeze({
    setConsent, pageView, primaryCta, confirmLead,
    getStatus: () => ({
      active: initialized && Boolean(allowedPage()), consent, initialized,
      reason: withdrawn ? "reload_after_withdrawal" : loadingFailed ? "google_script_failed" : consent !== "granted" ? "consent_denied" : !publicPage(config, win) ? "host_or_path_blocked" : "enabled_pending_network_verification",
    }),
  });
  win[OWNER] = { signature, api };
  doc.addEventListener("click", click, { capture: true });
  win.addEventListener?.("popstate", pageView);
  return api;
}
