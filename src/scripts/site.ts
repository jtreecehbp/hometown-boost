type TrackingWindow = Window & { dataLayer?: Record<string, unknown>[] };
const trackingWindow = window as TrackingWindow;
document.addEventListener("click", (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
  if (!link || !link.getAttribute("href")?.startsWith("/contact/")) return;
  const params = new URL(link.href).searchParams;
  const detail = {
    event: "cta_click",
    cta_text: link.textContent?.trim(),
    page_path: location.pathname,
    plan: params.get("plan") || "unsure",
    placement: link.closest("header")
      ? "header"
      : link.closest("footer")
        ? "footer"
        : "content",
  };
  trackingWindow.dataLayer?.push(detail);
  window.dispatchEvent(new CustomEvent("hometown:conversion", { detail }));
});
// Preserve campaign context in this tab; never store form fields or personal data.
try {
  if (!sessionStorage.getItem("hb-attribution")) {
    const params = new URLSearchParams(location.search);
    const attribution: Record<string, string> = {
      landing_page: location.pathname,
      referrer: document.referrer.split("?")[0],
    };
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ].forEach((key) => {
      attribution[key] = (params.get(key) || "").slice(0, 200);
    });
    sessionStorage.setItem("hb-attribution", JSON.stringify(attribution));
  }
} catch {
  /* Storage may be unavailable in privacy modes. */
}
