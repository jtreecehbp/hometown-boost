import { planLabelsById } from "../data/pricingPlans";
export function initContactForm() {
  const form = document.querySelector<HTMLFormElement>(".lead-form");
  if (!form) return;
  const params = new URLSearchParams(location.search);
  const planId = params.get("plan")?.toLowerCase() || "";
  const plan = Object.hasOwn(planLabelsById, planId)
    ? planLabelsById[planId as keyof typeof planLabelsById]
    : undefined;
  const ads =
    params.get("service")?.toLowerCase() === "google-ads" ||
    ["yes", "true"].includes(params.get("ads")?.toLowerCase() || "");
  const industry = (params.get("industry") || "").slice(0, 150);
  const planSelect = form.querySelector<HTMLSelectElement>(
    "[name=planInterest]",
  )!;
  if (plan) planSelect.value = plan;
  if (ads)
    form.querySelector<HTMLSelectElement>("[name=googleAdsInterest]")!.value =
      "Yes";
  if (industry)
    form.querySelector<HTMLInputElement>("[name=industry]")!.value = industry;
  if (ads || industry)
    form.querySelector<HTMLDetailsElement>("[data-optional-details]")!.open =
      true;
  const context = form.querySelector<HTMLElement>("[data-source-message]")!;
  if (plan || ads || industry) {
    context.hidden = false;
    context.textContent = ads
      ? "Let’s see whether Google Ads fits your business."
      : plan
        ? "You’re asking about Hometown " + plan + "."
        : "Let’s talk about a website for " + industry + ".";
  }
  let attribution: Record<string, unknown> = {};
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem("hb-attribution") || "{}");
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      attribution = saved as Record<string, unknown>;
    }
  } catch {
    /* Direct visits still capture current context. */
  }
  for (const key of [
    "landing_page",
    "source_url",
    "referrer",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ]) {
    const input = form.querySelector<HTMLInputElement>('[name="' + key + '"]')!;
    const firstTouch = typeof attribution[key] === 'string' ? attribution[key] as string : '';
    const value =
      key === "source_url"
        ? location.origin + location.pathname
        : key === "landing_page"
          ? firstTouch || location.pathname
          : key === "referrer"
            ? firstTouch || document.referrer.split("?")[0]
            : firstTouch || params.get(key) || "";
    input.value = value.slice(0, key.startsWith('utm_') ? 200 : 1000);
  }
  const button = form.querySelector<HTMLButtonElement>("button[type=submit]")!;
  const status = form.querySelector<HTMLElement>("[data-form-status]")!;
  const receipt = form.querySelector<HTMLElement>("[data-form-receipt]")!;
  let submitting = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;
    status.hidden = true;
    if (form.dataset.formEnabled !== "true") {
      status.textContent =
        "This preview does not send inquiries. You can reach us at hello@hometownboost.com.";
      status.hidden = false;
      status.focus();
      return;
    }
    submitting = true;
    button.disabled = true;
    form.setAttribute("aria-busy", "true");
    const originalText = button.innerHTML;
    button.textContent = "Sending your request…";
    try {
      const payload = new URLSearchParams();
      new FormData(form).forEach((value, key) => {
        if (typeof value === "string") payload.append(key, value);
      });
      const endpoint = form.dataset.formEndpoint || "/";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: payload.toString(),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok)
        throw new Error("The form service did not accept the request.");
      if (endpoint === "/api/contact" && (await response.json()).ok !== true)
        throw new Error("The form service did not confirm the request.");
    } catch {
      status.textContent =
        "Your request could not be confirmed. Your details are still here. Please try again, or email hello@hometownboost.com.";
      status.hidden = false;
      status.focus();
      button.disabled = false;
      button.innerHTML = originalText;
      submitting = false;
      form.removeAttribute("aria-busy");
      return;
    }
    // Commit the accepted state before navigation so Back never restores “Sending”.
    button.textContent = "Request sent";
    form.removeAttribute("aria-busy");
    receipt.hidden = false;
    const detail = {
      event: "lead_submit_success",
      page_path: location.pathname,
      plan: planSelect.value,
    };
    // Neither optional analytics nor navigation can turn acceptance into a retry.
    try {
      const dataLayer = (window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer;
      if (Array.isArray(dataLayer)) dataLayer.push(detail);
    } catch { /* Delivery is already confirmed. */ }
    try {
      window.dispatchEvent(new CustomEvent("hometown:conversion", { detail }));
    } catch { /* Confirmation does not depend on event listeners. */ }
    try { location.assign("/thank-you/"); }
    catch { receipt.focus(); }
  });
}
