import type { MetadataRoute } from "next";
import { isSiteIndexable } from "./site-indexing";
import { getSiteUrl } from "./site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!isSiteIndexable()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  const siteUrl = await getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
