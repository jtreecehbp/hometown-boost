import { headers } from "next/headers";

const FALLBACK_SITE_URL = "https://hometownboost.com";

function normalizeUrl(value: string | undefined) {
  if (!value?.trim()) return null;

  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export async function getSiteUrl() {
  const configuredUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (configuredUrl) return configuredUrl;

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");

  if (host) {
    const protocol =
      forwardedProtocol ?? (host.startsWith("localhost") ? "http" : "https");
    return `${protocol}://${host}`.replace(/\/$/, "");
  }

  return FALLBACK_SITE_URL;
}
