import { siteConfig } from "../../config/site.js";
import { getAllVerifiedModDates } from "./temporal-engine.js";

/**
 * Verified last-modified timestamps for Bits & Tools routes.
 * Synchronized with the Centralized Temporal Engine.
 */
export const VERIFIED_MOD_DATES = getAllVerifiedModDates();

/**
 * Returns all sitemap entries formatted for Next.js and custom XML route handlers.
 */
export function getAllSitemapEntries(customBaseUrl) {
  const baseUrl = (customBaseUrl || siteConfig.url || "https://www.bitsandtools.com").replace(/\/$/, "");

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(VERIFIED_MOD_DATES["/"]),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // PDF Tools
    {
      url: `${baseUrl}/merge-pdf`,
      lastModified: new Date(VERIFIED_MOD_DATES["/merge-pdf"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/split-pdf`,
      lastModified: new Date(VERIFIED_MOD_DATES["/split-pdf"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compress-pdf`,
      lastModified: new Date(VERIFIED_MOD_DATES["/compress-pdf"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jpg-to-pdf`,
      lastModified: new Date(VERIFIED_MOD_DATES["/jpg-to-pdf"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf-to-jpg`,
      lastModified: new Date(VERIFIED_MOD_DATES["/pdf-to-jpg"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rotate-pdf`,
      lastModified: new Date(VERIFIED_MOD_DATES["/rotate-pdf"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/delete-pdf-pages`,
      lastModified: new Date(VERIFIED_MOD_DATES["/delete-pdf-pages"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reorder-pdf-pages`,
      lastModified: new Date(VERIFIED_MOD_DATES["/reorder-pdf-pages"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/add-page-numbers`,
      lastModified: new Date(VERIFIED_MOD_DATES["/add-page-numbers"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/watermark-pdf`,
      lastModified: new Date(VERIFIED_MOD_DATES["/watermark-pdf"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/protect-pdf`,
      lastModified: new Date(VERIFIED_MOD_DATES["/protect-pdf"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/unlock-pdf`,
      lastModified: new Date(VERIFIED_MOD_DATES["/unlock-pdf"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Utility & Developer Tools
    {
      url: `${baseUrl}/word-counter`,
      lastModified: new Date(VERIFIED_MOD_DATES["/word-counter"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-converter`,
      lastModified: new Date(VERIFIED_MOD_DATES["/case-converter"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/json-formatter`,
      lastModified: new Date(VERIFIED_MOD_DATES["/json-formatter"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/base64-encoder-decoder`,
      lastModified: new Date(VERIFIED_MOD_DATES["/base64-encoder-decoder"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/url-encoder-decoder`,
      lastModified: new Date(VERIFIED_MOD_DATES["/url-encoder-decoder"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/percentage-calculator`,
      lastModified: new Date(VERIFIED_MOD_DATES["/percentage-calculator"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/age-calculator`,
      lastModified: new Date(VERIFIED_MOD_DATES["/age-calculator"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/uuid-generator`,
      lastModified: new Date(VERIFIED_MOD_DATES["/uuid-generator"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hash-generator`,
      lastModified: new Date(VERIFIED_MOD_DATES["/hash-generator"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/text-diff`,
      lastModified: new Date(VERIFIED_MOD_DATES["/text-diff"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/slug-generator`,
      lastModified: new Date(VERIFIED_MOD_DATES["/slug-generator"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qr-code-generator`,
      lastModified: new Date(VERIFIED_MOD_DATES["/qr-code-generator"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/json-to-csv`,
      lastModified: new Date(VERIFIED_MOD_DATES["/json-to-csv"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/list-tools`,
      lastModified: new Date(VERIFIED_MOD_DATES["/list-tools"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jwt-decoder`,
      lastModified: new Date(VERIFIED_MOD_DATES["/jwt-decoder"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/timestamp-converter`,
      lastModified: new Date(VERIFIED_MOD_DATES["/timestamp-converter"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/password-generator`,
      lastModified: new Date(VERIFIED_MOD_DATES["/password-generator"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Image Tools
    {
      url: `${baseUrl}/resize-image`,
      lastModified: new Date(VERIFIED_MOD_DATES["/resize-image"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compress-image`,
      lastModified: new Date(VERIFIED_MOD_DATES["/compress-image"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/image-converter`,
      lastModified: new Date(VERIFIED_MOD_DATES["/image-converter"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jpg-to-png`,
      lastModified: new Date(VERIFIED_MOD_DATES["/jpg-to-png"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/png-to-jpg`,
      lastModified: new Date(VERIFIED_MOD_DATES["/png-to-jpg"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/webp-converter`,
      lastModified: new Date(VERIFIED_MOD_DATES["/webp-converter"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/color-palette-extractor`,
      lastModified: new Date(VERIFIED_MOD_DATES["/color-palette-extractor"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/svg-to-png`,
      lastModified: new Date(VERIFIED_MOD_DATES["/svg-to-png"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/crop-image`,
      lastModified: new Date(VERIFIED_MOD_DATES["/crop-image"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    // File Conversion Tools
    {
      url: `${baseUrl}/html-to-pdf`,
      lastModified: new Date(VERIFIED_MOD_DATES["/html-to-pdf"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/excel-to-pdf`,
      lastModified: new Date(VERIFIED_MOD_DATES["/excel-to-pdf"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/word-to-pdf`,
      lastModified: new Date(VERIFIED_MOD_DATES["/word-to-pdf"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf-to-word`,
      lastModified: new Date(VERIFIED_MOD_DATES["/pdf-to-word"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf-to-excel`,
      lastModified: new Date(VERIFIED_MOD_DATES["/pdf-to-excel"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/powerpoint-to-pdf`,
      lastModified: new Date(VERIFIED_MOD_DATES["/powerpoint-to-pdf"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Video & Audio Tools
    {
      url: `${baseUrl}/extract-audio`,
      lastModified: new Date(VERIFIED_MOD_DATES["/extract-audio"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mp3-converter`,
      lastModified: new Date(VERIFIED_MOD_DATES["/mp3-converter"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/video-to-gif`,
      lastModified: new Date(VERIFIED_MOD_DATES["/video-to-gif"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trim-video`,
      lastModified: new Date(VERIFIED_MOD_DATES["/trim-video"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compress-video`,
      lastModified: new Date(VERIFIED_MOD_DATES["/compress-video"]),
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Developer Staples
    {
      url: `${baseUrl}/markdown-editor`,
      lastModified: new Date(VERIFIED_MOD_DATES["/markdown-editor"]),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/regex-tester`,
      lastModified: new Date(VERIFIED_MOD_DATES["/regex-tester"]),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cron-generator`,
      lastModified: new Date(VERIFIED_MOD_DATES["/cron-generator"]),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/curl-converter`,
      lastModified: new Date(VERIFIED_MOD_DATES["/curl-converter"]),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/code-minifier`,
      lastModified: new Date(VERIFIED_MOD_DATES["/code-minifier"]),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // Directory Category Hubs
    {
      url: `${baseUrl}/media-tools`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/convert-tools`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pdf-tools`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/image-tools`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/utility-tools`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Static Information Pages
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}

/**
 * Filter for URLs published or modified in the last 48 hours.
 */
export function getFreshSitemapEntries(customBaseUrl, cutoffHours = 48) {
  const all = getAllSitemapEntries(customBaseUrl);
  const now = Date.now();
  const maxAgeMs = cutoffHours * 60 * 60 * 1000;

  const fresh = all.filter((entry) => {
    if (!entry.lastModified) return false;
    const time = entry.lastModified.getTime();
    return (now - time) <= maxAgeMs && time <= (now + 60000);
  });

  if (fresh.length === 0) {
    const withDates = all.filter((e) => e.lastModified);
    withDates.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
    return withDates.slice(0, 20);
  }

  return fresh;
}

/**
 * Filter for historical, archive, or evergreen static pages.
 */
export function getArchiveSitemapEntries(customBaseUrl, cutoffHours = 48) {
  const all = getAllSitemapEntries(customBaseUrl);
  const freshUrls = new Set(getFreshSitemapEntries(customBaseUrl, cutoffHours).map((e) => e.url));
  return all.filter((entry) => !freshUrls.has(entry.url));
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Builds valid XML string for a standard sitemap.
 */
export function buildSitemapXml(entries) {
  const urlsXml = entries
    .map((e) => {
      const loc = `    <loc>${escapeXml(e.url)}</loc>`;
      const lastmod = e.lastModified
        ? `    <lastmod>${e.lastModified instanceof Date ? e.lastModified.toISOString() : new Date(e.lastModified).toISOString()}</lastmod>`
        : "";
      const changefreq = e.changeFrequency
        ? `    <changefreq>${e.changeFrequency}</changefreq>`
        : "";
      const priority =
        typeof e.priority === "number"
          ? `    <priority>${e.priority.toFixed(1)}</priority>`
          : "";
      const inner = [loc, lastmod, changefreq, priority].filter(Boolean).join("\n");
      return `  <url>\n${inner}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>`;
}

/**
 * Builds valid XML string for a sitemap index.
 */
export function buildSitemapIndexXml(sitemaps) {
  const sitemapsXml = sitemaps
    .map((s) => {
      const loc = typeof s === "string" ? s : s.url;
      const lastmod = s.lastModified
        ? (s.lastModified instanceof Date ? s.lastModified.toISOString() : new Date(s.lastModified).toISOString())
        : new Date().toISOString();
      return `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapsXml}\n</sitemapindex>`;
}
