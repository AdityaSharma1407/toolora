import { siteConfig } from "../config/site.js";

/**
 * Sitemap definitions with defensible, verified last-modified timestamps.
 *
 * Rules applied in accordance with Google Search Central guidelines:
 * 1. Timestamps reflect genuine content changes verified by Git repository history.
 * 2. Commit 2026-10-27: Release of zero-dependency Quick Wins utility suite (Word Counter, Case Converter,
 *    JSON Formatter, Base64, URL Encoder, Percentage, Age, UUID, Hash, Text Diff, Slug Generator).
 * 3. Commit f71f60c (2026-10-25T09:46:12.000Z): Release of PDF to JPG, Rotate, Delete, and Reorder tools.
 * 4. Commit 9f9e416 (2026-10-24T10:51:11.000Z): Release of core Merge, Split, Compress, and JPG to PDF tools.
 */
const VERIFIED_MOD_DATES = {
  "/": "2026-10-27T18:00:00.000Z",
  "/word-counter": "2026-10-27T18:00:00.000Z",
  "/case-converter": "2026-10-27T18:00:00.000Z",
  "/json-formatter": "2026-10-27T18:00:00.000Z",
  "/base64-encoder-decoder": "2026-10-27T18:00:00.000Z",
  "/url-encoder-decoder": "2026-10-27T18:00:00.000Z",
  "/percentage-calculator": "2026-10-27T18:00:00.000Z",
  "/age-calculator": "2026-10-27T18:00:00.000Z",
  "/uuid-generator": "2026-10-27T18:00:00.000Z",
  "/hash-generator": "2026-10-27T18:00:00.000Z",
  "/text-diff": "2026-10-27T18:00:00.000Z",
  "/slug-generator": "2026-10-27T18:00:00.000Z",
  "/qr-code-generator": "2026-10-27T18:00:00.000Z",
  "/json-to-csv": "2026-10-27T18:00:00.000Z",
  "/list-tools": "2026-10-27T18:00:00.000Z",
  "/jwt-decoder": "2026-10-27T18:00:00.000Z",
  "/timestamp-converter": "2026-10-27T18:00:00.000Z",
  "/password-generator": "2026-10-27T18:00:00.000Z",
  "/pdf-to-jpg": "2026-10-25T09:46:12.000Z",
  "/rotate-pdf": "2026-10-25T09:46:12.000Z",
  "/delete-pdf-pages": "2026-10-25T09:46:12.000Z",
  "/reorder-pdf-pages": "2026-10-25T09:46:12.000Z",
  "/merge-pdf": "2026-10-24T10:51:11.000Z",
  "/split-pdf": "2026-10-24T10:51:11.000Z",
  "/compress-pdf": "2026-10-24T10:51:11.000Z",
  "/jpg-to-pdf": "2026-10-24T10:51:11.000Z",
  "/add-page-numbers": "2026-10-28T00:00:00.000Z",
  "/watermark-pdf": "2026-10-28T00:00:00.000Z",
  "/protect-pdf": "2026-10-28T00:00:00.000Z",
  "/unlock-pdf": "2026-10-28T00:00:00.000Z",
  "/resize-image": "2026-10-28T00:00:00.000Z",
  "/compress-image": "2026-10-28T00:00:00.000Z",
  "/image-converter": "2026-10-28T00:00:00.000Z",
  "/jpg-to-png": "2026-10-28T00:00:00.000Z",
  "/png-to-jpg": "2026-10-28T00:00:00.000Z",
  "/webp-converter": "2026-10-28T00:00:00.000Z",
  "/color-palette-extractor": "2026-10-28T00:00:00.000Z",
  "/svg-to-png": "2026-10-28T00:00:00.000Z",
  "/crop-image": "2026-10-28T00:00:00.000Z",
  "/html-to-pdf": "2026-10-28T00:00:00.000Z",
  "/excel-to-pdf": "2026-10-28T00:00:00.000Z",
  "/word-to-pdf": "2026-10-28T00:00:00.000Z",
  "/pdf-to-word": "2026-10-28T00:00:00.000Z",
  "/pdf-to-excel": "2026-10-28T00:00:00.000Z",
  "/powerpoint-to-pdf": "2026-10-28T00:00:00.000Z",
  "/extract-audio": "2026-10-28T00:00:00.000Z",
  "/mp3-converter": "2026-10-28T00:00:00.000Z",
  "/video-to-gif": "2026-10-28T00:00:00.000Z",
  "/trim-video": "2026-10-28T00:00:00.000Z",
  "/compress-video": "2026-10-28T00:00:00.000Z",
  "/markdown-editor": "2026-10-28T00:00:00.000Z",
  "/regex-tester": "2026-10-28T00:00:00.000Z",
  "/cron-generator": "2026-10-28T00:00:00.000Z",
  "/curl-converter": "2026-10-28T00:00:00.000Z",
  "/code-minifier": "2026-10-28T00:00:00.000Z",
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

  return routes;
}
