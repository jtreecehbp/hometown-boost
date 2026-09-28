export interface MonitoringConfig {
  siteId: string;
  mode?: "ga4" | "gtm";
  measurementId: string | null;
  containerId?: string | null;
  automaticMeasurementDisabled: boolean;
  productionHosts: string[];
  routes: { match: string; pagePath: string; pageTitle: string }[];
  primaryCtas?: string[];
  formTypes?: string[];
  campaigns?: { source: string; medium: string; name: string }[];
}
export interface Monitor {
  setConsent(choice: "granted" | "denied"): { active: boolean; reloadRequired: boolean; reason: string };
  pageView(): boolean;
  primaryCta(name: string): boolean;
  confirmLead(signal: { receipt: string; formType: string }): Promise<boolean>;
  getStatus(): { active: boolean; consent: "granted" | "denied"; initialized: boolean; reason: string };
}
export function createMonitor(config: MonitoringConfig, environment?: Window): Monitor;
