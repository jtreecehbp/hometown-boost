import type { MetadataRoute } from "next";
import { getSiteUrl } from "./site-url";

const coreRoutes = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/industries", changeFrequency: "monthly", priority: 0.9 },
  { path: "/results", changeFrequency: "monthly", priority: 0.85 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.85 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.9 },
  { path: "/resources", changeFrequency: "monthly", priority: 0.8 },
] as const;

const serviceRoutes = [
  "/services/website-design",
  "/services/local-seo",
  "/services/google-business-profile",
  "/services/reputation-management",
  "/services/paid-advertising",
  "/services/call-tracking",
] as const;

const industryRoutes = [
  "/industries/equipment-dealers",
  "/industries/contractors",
  "/industries/home-services",
  "/industries/hvac",
  "/industries/plumbing",
  "/industries/septic-services",
  "/industries/lawn-care",
  "/industries/repair-shops",
  "/industries/automotive",
  "/industries/retail-businesses",
  "/industries/professional-services",
] as const;

const resourceRoutes = [
  "/resources/rank-higher-google-maps",
  "/resources/website-not-generating-calls",
  "/resources/get-more-google-reviews",
  "/resources/google-business-profile-mistakes",
  "/resources/marketing-metrics-to-track",
  "/resources/equipment-dealer-website",
  "/resources/contractor-local-search",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getSiteUrl();

  return [
    ...coreRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...serviceRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.76,
    })),
    ...industryRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.74,
    })),
    ...resourceRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.62,
    })),
  ];
}
