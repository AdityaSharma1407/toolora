import { siteConfig } from "../config/site.js";
import { getAllSitemapEntries } from "../lib/seo/sitemaps.js";

/**
 * Standard Next.js Metadata Route for /sitemap.xml
 */
export default function sitemap() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  return getAllSitemapEntries(baseUrl);
}
