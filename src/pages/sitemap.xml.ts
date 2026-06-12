import { getCollection } from "astro:content";
import { siteConfig } from "../data/siteConfig";

const staticPages = [
  "/",
  "/pricing/",
  "/services/",
  "/how-it-works/",
  "/industries/",
  "/google-ads/",
  "/about/",
  "/faq/",
  "/resources/",
  "/contact/",
  "/privacy/",
  "/terms/",
];

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const resources = await getCollection("resources", ({ data }) => data.draft !== true);
  const resourcePages = resources.map((entry) => `/resources/${entry.id}/`);
  const urls = [...staticPages, ...resourcePages];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((path) => `  <url>\n    <loc>${xmlEscape(new URL(path, siteConfig.url).toString())}</loc>\n  </url>`)
    .join("\n")}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
