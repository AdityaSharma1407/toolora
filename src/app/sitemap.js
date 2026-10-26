import { siteConfig } from "../config/site.js";

/**
 * Sitemap definitions with defensible, verified last-modified timestamps.
 *
 * Rules applied in accordance with Google Search Central guidelines:
 * 1. Timestamps reflect genuine content changes verified by Git repository history.
 * 2. Commit f71f60c (2026-10-25T09:46:12.000Z): Release of PDF to JPG, Rotate, Delete, and Reorder tools, plus Homepage suite integration.
 * 3. Commit 9f9e416 (2026-10-24T10:51:11.000Z): Release of core Merge, Split, Compress, and JPG to PDF tools.
 * 4. Pages without independent, verifiable content modification events (category hubs and static legal/about pages)
 *    omit lastModified rather than inventing arbitrary or blanket dates.
 */
const VERIFIED_MOD_DATES = {
  "/": "2026-10-25T09:46:12.000Z",
  "/pdf-to-jpg": "2026-10-25T09:46:12.000Z",
  "/rotate-pdf": "2026-10-25T09:46:12.000Z",
  "/delete-pdf-pages": "2026-10-25T09:46:12.000Z",
  "/reorder-pdf-pages": "2026-10-25T09:46:12.000Z",
  "/merge-pdf": "2026-10-24T10:51:11.000Z",
  "/split-pdf": "2026-10-24T10:51:11.000Z",
  "/compress-pdf": "2026-10-24T10:51:11.000Z",
  "/jpg-to-pdf": "2026-10-24T10:51:11.000Z",
};

export default function sitemap() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(VERIFIED_MOD_DATES["/"]),
      changeFrequency: "weekly",
      priority: 1.0,
    },
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

  return routes;
}
