import { siteConfig } from "../../config/site.js";
import { getFreshSitemapEntries, buildSitemapXml } from "../../lib/seo/sitemaps.js";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const freshEntries = getFreshSitemapEntries(baseUrl, 48);
  const xml = buildSitemapXml(freshEntries);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex, follow", // standard for sitemap endpoints so XML files themselves aren't indexed as content
    },
  });
}
