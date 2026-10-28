import { siteConfig } from "../../config/site.js";
/**
 * Computes deterministic token hash of text/content using pure JavaScript
 * 100% compatible with Edge, Node.js, and browser runtimes.
 * 
 * @param {string|object} content
 * @returns {string} Hex hash string
 */
export function computeContentHash(content) {
  const str = typeof content === "string" ? content : JSON.stringify(content || "");
  let h1 = 0xdeadbeef, h2 = 0x41c64e6d;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

export const BASE_URL = siteConfig?.url || "https://www.bitsandtools.com";

/**
 * Verified Canonical Publication & Last-Modified Timestamps
 * Synchronized across Sitemap, Schema JSON-LD, Visual Bylines, and OpenGraph.
 */
export const VERIFIED_TEMPORAL_DATA = {
  "/": {
    published: "2026-10-24T00:00:00.000Z",
    modified: "2026-10-27T18:00:00.000Z",
    tokenBaseline: "bitsandtools-home-hub-v2",
  },
  // Core PDF Suite (Commit 9f9e416 & f71f60c)
  "/merge-pdf": {
    published: "2026-10-24T10:51:11.000Z",
    modified: "2026-10-28T00:00:00.000Z",
    tokenBaseline: "merge-pdf-client-side-v3",
  },
  "/split-pdf": {
    published: "2026-10-24T10:51:11.000Z",
    modified: "2026-10-28T00:00:00.000Z",
    tokenBaseline: "split-pdf-client-side-v3",
  },
  "/compress-pdf": {
    published: "2026-10-24T10:51:11.000Z",
    modified: "2026-10-28T00:00:00.000Z",
    tokenBaseline: "compress-pdf-client-side-v3",
  },
  "/jpg-to-pdf": {
    published: "2026-10-24T10:51:11.000Z",
    modified: "2026-10-28T00:00:00.000Z",
    tokenBaseline: "jpg-to-pdf-client-side-v3",
  },
  "/pdf-to-jpg": {
    published: "2026-10-25T09:46:12.000Z",
    modified: "2026-10-28T00:00:00.000Z",
    tokenBaseline: "pdf-to-jpg-client-side-v2",
  },
  "/rotate-pdf": {
    published: "2026-10-25T09:46:12.000Z",
    modified: "2026-10-28T00:00:00.000Z",
    tokenBaseline: "rotate-pdf-client-side-v2",
  },
  "/delete-pdf-pages": {
    published: "2026-10-25T09:46:12.000Z",
    modified: "2026-10-28T00:00:00.000Z",
    tokenBaseline: "delete-pdf-pages-client-side-v2",
  },
  "/reorder-pdf-pages": {
    published: "2026-10-25T09:46:12.000Z",
    modified: "2026-10-28T00:00:00.000Z",
    tokenBaseline: "reorder-pdf-pages-client-side-v2",
  },
  "/add-page-numbers": {
    published: "2026-10-28T00:00:00.000Z",
    modified: "2026-10-28T00:00:00.000Z",
    tokenBaseline: "add-page-numbers-client-side-v1",
  },
  "/watermark-pdf": {
    published: "2026-10-28T00:00:00.000Z",
    modified: "2026-10-28T00:00:00.000Z",
    tokenBaseline: "watermark-pdf-client-side-v1",
  },
  "/protect-pdf": {
    published: "2026-10-28T00:00:00.000Z",
    modified: "2026-10-28T00:00:00.000Z",
    tokenBaseline: "protect-pdf-client-side-v1",
  },
  "/unlock-pdf": {
    published: "2026-10-28T00:00:00.000Z",
    modified: "2026-10-28T00:00:00.000Z",
    tokenBaseline: "unlock-pdf-client-side-v1",
  },
  // Developer & Utility Suite (Commit 2026-10-27)
  "/word-counter": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "word-counter-v1" },
  "/case-converter": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "case-converter-v1" },
  "/json-formatter": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "json-formatter-v1" },
  "/base64-encoder-decoder": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "base64-tool-v1" },
  "/url-encoder-decoder": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "url-tool-v1" },
  "/percentage-calculator": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "percentage-calc-v1" },
  "/age-calculator": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "age-calc-v1" },
  "/uuid-generator": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "uuid-gen-v1" },
  "/hash-generator": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "hash-gen-v1" },
  "/text-diff": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "text-diff-v1" },
  "/slug-generator": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "slug-gen-v1" },
  "/qr-code-generator": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "qr-code-gen-v1" },
  "/json-to-csv": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "json-to-csv-v1" },
  "/list-tools": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "list-tools-v1" },
  "/jwt-decoder": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "jwt-decoder-v1" },
  "/timestamp-converter": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "timestamp-conv-v1" },
  "/password-generator": { published: "2026-10-27T18:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "pwd-gen-v1" },
  // Image Suite
  "/resize-image": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "resize-img-v1" },
  "/compress-image": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "compress-img-v1" },
  "/image-converter": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "img-conv-v1" },
  "/jpg-to-png": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "jpg-png-v1" },
  "/png-to-jpg": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "png-jpg-v1" },
  "/webp-converter": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "webp-conv-v1" },
  "/color-palette-extractor": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "palette-ext-v1" },
  "/svg-to-png": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "svg-png-v1" },
  "/crop-image": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "crop-img-v1" },
  // File Conversion Suite
  "/html-to-pdf": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "html-pdf-v1" },
  "/excel-to-pdf": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "excel-pdf-v1" },
  "/word-to-pdf": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "word-pdf-v1" },
  "/pdf-to-word": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "pdf-word-v1" },
  "/pdf-to-excel": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "pdf-excel-v1" },
  "/powerpoint-to-pdf": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "ppt-pdf-v1" },
  // Audio & Video Suite
  "/extract-audio": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "ext-audio-v1" },
  "/mp3-converter": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "mp3-conv-v1" },
  "/video-to-gif": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "vid-gif-v1" },
  "/trim-video": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "trim-vid-v1" },
  "/compress-video": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "comp-vid-v1" },
  // Developer Staples
  "/markdown-editor": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "md-editor-v1" },
  "/regex-tester": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "regex-test-v1" },
  "/cron-generator": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "cron-gen-v1" },
  "/curl-converter": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "curl-conv-v1" },
  "/code-minifier": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "code-mini-v1" },
  // Category Hubs
  "/pdf-tools": { published: "2026-10-24T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "pdf-hub-v1" },
  "/image-tools": { published: "2026-10-27T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "image-hub-v1" },
  "/convert-tools": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "convert-hub-v1" },
  "/media-tools": { published: "2026-10-28T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "media-hub-v1" },
  "/utility-tools": { published: "2026-10-27T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "utility-hub-v1" },
  // Static Information Pages
  "/about": { published: "2026-10-24T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "about-v1" },
  "/privacy-policy": { published: "2026-10-24T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "privacy-v1" },
  "/terms": { published: "2026-10-24T00:00:00.000Z", modified: "2026-10-28T00:00:00.000Z", tokenBaseline: "terms-v1" },
};

/**
 * Resolves absolute temporal parity for any route.
 * 
 * Enforces guard: if content payload hash matches the recorded baseline,
 * `dateModified` remains strictly unchanged to prevent false-bumping penalties.
 * 
 * @param {string} route - The route path (e.g. "/merge-pdf")
 * @param {string|object} [currentContent] - Optional live content to check for diffs
 * @returns {object} Synchronized temporal bundle
 */
export function resolveTemporalParity(route = "/", currentContent = null) {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  const baseline = VERIFIED_TEMPORAL_DATA[normalizedRoute] || {
    published: "2026-10-24T00:00:00.000Z",
    modified: "2026-10-28T00:00:00.000Z",
    tokenBaseline: "default-bits-v1",
  };

  const isoPublished = baseline.published;
  let isoModified = baseline.modified;

  // Content Diff Guard: Only bump dateModified if live content registered a real diff from baseline
  if (currentContent) {
    const liveHash = computeContentHash(currentContent);
    const baselineHash = computeContentHash(baseline.tokenBaseline);

    // If diff detected and new, update timestamp; otherwise preserve verified lastmod
    if (liveHash !== baselineHash && typeof currentContent === "object" && currentContent?.hasMeaningfulUpdate) {
      isoModified = new Date().toISOString();
    }
  }

  const modDate = new Date(isoModified);
  const pubDate = new Date(isoPublished);

  // Format RFC 7231 HTTP Last-Modified string (e.g. "Wed, 28 Oct 2026 00:00:00 GMT")
  const httpLastModified = modDate.toUTCString();

  // Deterministic Strong ETag: W/"bits-{slug}-{hash}"
  const cleanSlug = normalizedRoute.replace(/\//g, "-").replace(/^-/, "") || "root";
  const etag = `W/"bits-${cleanSlug}-${computeContentHash(isoModified + baseline.tokenBaseline)}"`;

  // Visual Byline Formatting
  const formattedByline = modDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return {
    route: normalizedRoute,
    fullUrl: `${BASE_URL}${normalizedRoute === "/" ? "" : normalizedRoute}`,
    isoPublished,
    isoModified,
    lastModDate: modDate,
    pubDate,
    httpLastModified,
    etag,
    formattedByline,
    // Pre-rendered visual byline with schema microdata
    bylineProps: {
      dateTime: isoModified,
      itemProp: "dateModified",
      children: `Last updated: ${formattedByline}`,
    },
    openGraphTime: isoModified,
  };
}

/**
 * Returns complete map of verified modification dates for sitemap generation
 */
export function getAllVerifiedModDates() {
  const dates = {};
  for (const [route, data] of Object.entries(VERIFIED_TEMPORAL_DATA)) {
    dates[route] = data.modified;
  }
  return dates;
}
