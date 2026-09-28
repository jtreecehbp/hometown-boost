const pages = [
  ["/", "Home"], ["/pricing", "Pricing"], ["/services", "Services"],
  ["/how-it-works", "How It Works"], ["/industries", "Industries"], ["/google-ads", "Google Ads"],
  ["/about", "About"], ["/faq", "FAQ"], ["/resources", "Resources"], ["/contact", "Contact"],
  ["/privacy", "Privacy"], ["/terms", "Terms"], ["/start", "Website and Google Profile"],
  ["/sample-report", "Sample Report"], ["/thank-you", "Thank You"],
  ...["website-vs-google-ads", "old-website-costing-calls", "local-business-website-essentials", "google-business-profile-basics"].map(slug => [`/resources/${slug}`, `Resource: ${slug.replaceAll("-", " ")}`]),
];
export function getMonitoringConfig(environment = {}) {
  const enabled = environment.WEBSITE_ANALYTICS_ENABLED === "true";
  const automaticMeasurementDisabled = environment.GA4_AUTOMATIC_MEASUREMENT_DISABLED === "true";
  const suppliedId = environment.GA4_MEASUREMENT_ID ?? "";
  return {
    siteId: "hometown_boost", mode: "ga4",
    measurementId: enabled && automaticMeasurementDisabled && /^G-[A-Z0-9]{6,20}$/.test(suppliedId) ? suppliedId : null,
    automaticMeasurementDisabled, productionHosts: ["hometownboost.com", "www.hometownboost.com"],
    routes: pages.flatMap(([pagePath, pageTitle]) => [{match:pagePath,pagePath,pageTitle},...(pagePath === "/" ? [] : [{match:`${pagePath}/`,pagePath,pageTitle}])]),
    primaryCtas: ["request_recommendation", "choose_foundation", "choose_connect", "choose_marketing"],
    formTypes: ["recommendation"],
    campaigns: [
      {source:"google",medium:"organic",name:"gbp_profile"},
      {source:"facebook",medium:"social",name:"organic_posts"},
      {source:"google",medium:"cpc",name:"foundation_launch"},
      {source:"facebook",medium:"paid_social",name:"foundation_launch"},
    ],
  };
}
export function isPublicLocation(config, location) {
  return location?.protocol === "https:" && (!location.port || location.port === "443")
    && config.productionHosts.includes(location.hostname) && config.routes.some(route => route.match === location.pathname);
}
