import { createMonitor } from "./monitoring.mjs";
import { isPublicLocation } from "./config.mjs";

export const CONSENT_KEY = "hb:hometown_boost:analytics-consent:v1";
export const EMPTY_SNAPSHOT = Object.freeze({ available: false, open: false, choice: null, message: "" });
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const DENIAL_FRAGMENT = "#analytics-disabled";

export function createConsentController(config, win) {
  const monitor = createMonitor(config, win);
  let snapshot = EMPTY_SNAPSHOT;
  const listeners = new Set();
  let manualOpen = false;

  function notify(patch) {
    snapshot = Object.freeze({ ...snapshot, ...patch });
    for (const listener of listeners) listener();
  }

  function readChoice() {
    try {
      const saved = JSON.parse(win.localStorage.getItem(CONSENT_KEY) ?? "null");
      if (!saved || !["granted", "denied"].includes(saved.choice)
        || saved.measurementId !== config.measurementId || !Number.isFinite(saved.at)
        || saved.at > Date.now() || saved.at <= Date.now() - MAX_AGE) return null;
      return saved.choice;
    } catch { return null; }
  }

  function saveChoice(choice) {
    try {
      win.localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, measurementId: config.measurementId, at: Date.now() }));
      return readChoice() === choice;
    } catch { return false; }
  }

  function denyAndReload() {
    const result = monitor.setConsent("denied");
    if (result.reloadRequired) {
      // If browser storage stopped accepting writes, the reload must not restore
      // an old grant. This fragment is a denial guard, never an analytics input.
      if (readChoice() === "granted") {
        const target = new URL(win.location.href);
        target.hash = DENIAL_FRAGMENT;
        win.history.replaceState(win.history.state, "", target.href);
        win.location.reload();
      } else win.location.reload();
    }
  }

  function refresh() {
    const publicRoute = isPublicLocation(config, win.location);
    const status = monitor.getStatus();
    const available = publicRoute && Boolean(config.measurementId)
      && config.automaticMeasurementDisabled === true
      && !["configuration_pending_or_invalid", "existing_google_installation_requires_review", "another_monitor_owns_this_page", "google_script_failed"].includes(status.reason);
    if (!available) {
      denyAndReload();
      notify({ available: false, open: manualOpen && config.routes.some((route) => route.match === win.location.pathname), choice: null });
      return;
    }
    const guarded = win.location.hash === DENIAL_FRAGMENT;
    const choice = guarded ? "denied" : readChoice();
    if (guarded) saveChoice("denied");
    if (choice === "granted") monitor.setConsent("granted");
    else denyAndReload();
    monitor.pageView();
    notify({ available: true, choice, open: manualOpen || choice === null });
  }

  function choose(choice) {
    if (!["granted", "denied"].includes(choice)) return;
    if (choice === "granted" && !snapshot.available) return;
    const saved = saveChoice(choice);
    manualOpen = false;
    if (choice === "denied") {
      if (!saved) { try { win.localStorage.removeItem(CONSENT_KEY); } catch { /* denial guard handles stale grants */ } }
      notify({ choice: "denied", open: false, message: "" });
      denyAndReload();
      return;
    }
    if (!saved) {
      monitor.setConsent("denied");
      notify({ choice: null, open: true, message: "Your browser could not save this choice. Analytics remains off." });
      return;
    }
    if (win.location.hash === DENIAL_FRAGMENT) {
      const target = new URL(win.location.href);
      target.hash = "";
      win.history.replaceState(win.history.state, "", target.href);
    }
    const result = monitor.setConsent("granted");
    if (result.reloadRequired) win.location.reload();
    notify({ choice: "granted", open: false, message: "" });
  }

  function onStorage(event) {
    if (event.key === CONSENT_KEY || event.key === null) refresh();
  }
  win.addEventListener?.("storage", onStorage);

  return {
    refresh,
    choose,
    openSettings() { manualOpen = true; refresh(); },
    closeSettings() { manualOpen = false; notify({ open: false }); },
    getSnapshot: () => snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  };
}
