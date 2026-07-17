export function isSiteIndexable(): boolean {
  return process.env.SITE_INDEXABLE === "true";
}
