import { siteConfig } from "../../config/site.js";
import {
  getFreshSitemapEntries,
  getArchiveSitemapEntries,
  buildSitemapIndexXml,
} from "../../lib/seo/sitemaps.js";

export const dynamic = "force-dynamic";

/**
 * Dynamic Sitemap Index Handler (/sitemap-index.xml)
 * Connects sitemap-fresh.xml and sitemap-archive.xml into a unified index hierarchy
 */
export async function GET() {
  const baseUrl = (siteConfig.url || "https://www.bitsandtools.com").replace(/\/$/, "");

  const fresh = getFreshSitemapEntries(baseUrl, 48);
  const archive = getArchiveSitemapEntries(baseUrl, 48);

  const freshLastMod = fresh.reduce((latest, item) => {
    if (!item.lastModified) return latest;
    const time = item.lastModified.getTime();
    return time > latest ? time : latest;
  }, Date.now());

  const archiveLastMod = archive.reduce((latest, item) => {
    if (!item.lastModified) return latest;
    const time = item.lastModified.getTime();
    return time > latest ? time : latest;
  }, Date.now() - 48 * 3600 * 1000);

  const sitemaps = [
    {
      url: `${baseUrl}/sitemap-fresh.xml`,
      lastModified: new Date(freshLastMod),
    },
    {
      url: `${baseUrl}/sitemap-archive.xml`,
      lastModified: new Date(archiveLastMod),
    },
  ];

  const xml = buildSitemapIndexXml(sitemaps);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}
