import { siteConfig } from "../../config/site.js";
import { getArchiveSitemapEntries, buildSitemapXml } from "../../lib/seo/sitemaps.js";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const archiveEntries = getArchiveSitemapEntries(baseUrl, 48);
  const xml = buildSitemapXml(archiveEntries);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}
