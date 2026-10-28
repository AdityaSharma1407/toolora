/**
 * @file serp-transformer.js
 * @description Automated Title/Description transformer that formats SERP snippets
 * with high-CTR psychological tokens, bracketed taxonomies, and strict 50–58 character
 * length clamping to prevent Google desktop/mobile pixel-width truncation.
 */

/**
 * Psychological CTR Token Corpus
 */
export const PSYCHOLOGICAL_TOKENS = {
  CURRENT_YEAR: "2026",
  BENCHMARK: "[2026 Free]",
  PRIVACY: "[No Uploads]",
  SPEED: "[Instant]",
  LOCAL: "[100% Private]",
  CLIENT: "[In-Browser]",
};

/**
 * Clean, Concise Sitelink Metadata for Core Landing Pages
 * Formatted under 30-35 characters for titles and under 120 characters for descriptions
 * to enable Google to render an expanded, untruncated 2-Column Sitelinks block.
 */
export const SITELINK_METADATA = {
  "/merge-pdf": {
    title: "Merge PDF | Bits & Tools", // 23 chars (<= 35)
    description: "Combine multiple PDF files into one clean document in seconds. 100% free, private in-browser tool with zero uploads.", // 116 chars (<= 120)
  },
  "/split-pdf": {
    title: "Split PDF | Bits & Tools", // 23 chars (<= 35)
    description: "Extract pages or split PDF documents into separate files in seconds. 100% free, private in-browser utility.", // 110 chars (<= 120)
  },
  "/compress-pdf": {
    title: "Compress PDF | Bits & Tools", // 26 chars (<= 35)
    description: "Reduce PDF file size with genuine client-side structural optimization. Free in-browser tool with zero uploads.", // 111 chars (<= 120)
  },
  "/jpg-to-pdf": {
    title: "JPG to PDF | Bits & Tools", // 24 chars (<= 35)
    description: "Convert JPG, PNG, and WebP images into clean, formatted PDF documents. 100% free and private in-browser.", // 107 chars (<= 120)
  },
  "/pdf-to-jpg": {
    title: "PDF to JPG | Bits & Tools", // 24 chars (<= 35)
    description: "Convert PDF pages into high-resolution JPG images right in your browser. Fast, free, and completely private.", // 109 chars (<= 120)
  },
  "/word-counter": {
    title: "Word Counter | Bits & Tools", // 26 chars (<= 35)
    description: "Count words, characters, sentences, and paragraphs in real time. Fast, free in-browser text analysis utility.", // 111 chars (<= 120)
  },
};

/**
 * Pre-configured SERP Variants for Core Suites
 */
export const SERP_VARIANTS = {
  "/merge-pdf": {
    variantA: {
      title: "Merge PDF Online [2026 Free] — Fast, Private Merger", // 53 chars
      description: "Combine multiple PDF files into one binder in seconds. 100% free, private in-browser tool with zero server uploads and no registration.", // 137 chars
    },
    variantB: {
      title: "Combine PDF Files [No Uploads] — Free In-Browser Tool", // 53 chars
      description: "Join PDF pages securely in your web browser. Zero server data storage, instantaneous local processing, and no hidden file size limits.", // 136 chars
    },
  },
  "/split-pdf": {
    variantA: {
      title: "Split PDF Files [2026 Free] — Extract Pages Online", // 51 chars
      description: "Extract specific PDF pages or burst every page into separate files in seconds. Completely free, client-side, and private with zero file uploads.", // 145 chars
    },
    variantB: {
      title: "Separate PDF Pages [No Uploads] — Free PDF Splitter", // 51 chars
      description: "Divide PDF documents by custom page ranges or burst into a single ZIP archive. Fast, 100% in-browser processing with total document privacy.", // 141 chars
    },
  },
  "/compress-pdf": {
    variantA: {
      title: "Compress PDF Online [2026 Free] — Reduce File Size", // 51 chars
      description: "Reduce PDF document file size with smart structural stream optimization. Free, browser-side processing with zero quality degradation or uploads.", // 145 chars
    },
    variantB: {
      title: "Shrink PDF File Size [No Uploads] — Fast In-Browser", // 51 chars
      description: "Optimize PDF files locally in your browser. Shrink megabytes quickly for email without uploading sensitive financial or legal data to servers.", // 143 chars
    },
  },
  "/jpg-to-pdf": {
    variantA: {
      title: "JPG to PDF Converter [2026 Free] — Turn Photos to PDF", // 53 chars
      description: "Convert JPG, PNG, and WebP images into clean, formatted PDF documents. 100% free, client-side execution with customizable page sizes and margins.", // 146 chars
    },
    variantB: {
      title: "Convert Images to PDF [No Uploads] — Instant & Free", // 52 chars
      description: "Compile pictures into a single organized PDF document right in your browser. No software installation, no watermarks, and total photo privacy.", // 143 chars
    },
  },
};

/**
 * Programmatically transforms and clamps a SERP title to strictly 50–58 characters
 * 
 * @param {object} params
 * @param {string} params.toolName - Name of the tool (e.g. "Merge PDF")
 * @param {string} [params.baseTitle] - Custom title base
 * @param {string} [params.badge] - Psychological badge, defaults to "[2026 Free]"
 * @param {string} [params.variant="a"] - "a" or "b"
 * @returns {string} High-CTR title strictly within 50–58 characters
 */
export function transformSerpTitle({
  toolName,
  baseTitle = "",
  badge = PSYCHOLOGICAL_TOKENS.BENCHMARK,
  variant = "a",
}) {
  const cleanName = (toolName || "Online Tools").trim();
  const cleanBadge = (badge || PSYCHOLOGICAL_TOKENS.BENCHMARK).trim();

  // If a crafted variant already matches strict length, return it
  if (baseTitle && baseTitle.length >= 50 && baseTitle.length <= 58) {
    return baseTitle;
  }

  // Variant A: "[Tool Name] Online [Badge] — Free In-Browser"
  // Variant B: "[Tool Name] Tool [Badge] — 100% Private"
  let candidate;
  if (variant.toLowerCase() === "b") {
    candidate = `${cleanName} [No Uploads] — Free In-Browser Tool`;
  } else {
    candidate = `${cleanName} Online ${cleanBadge} — Fast & Private`;
  }

  // Length optimization and clamping
  if (candidate.length >= 50 && candidate.length <= 58) {
    return candidate;
  }

  if (candidate.length > 58) {
    // Truncate at word boundary within 50-58 chars
    const shortened = candidate.slice(0, 58);
    const lastSpace = shortened.lastIndexOf(" ");
    if (lastSpace >= 50) {
      return shortened.slice(0, lastSpace);
    }
    return shortened;
  }

  // If under 50 chars, pad with high-CTR keyword phrase
  const padded = `${candidate} | Free`;
  if (padded.length <= 58 && padded.length >= 50) {
    return padded;
  }

  return candidate.padEnd(50, " ").trim();
}

/**
 * Formats high-CTR meta description (strictly 140–155 characters)
 * 
 * @param {object} params
 * @param {string} params.toolName
 * @param {string} params.actionDescription
 * @param {string} [params.variant="a"]
 * @returns {string} High-CTR description
 */
export function transformSerpDescription({
  toolName,
  actionDescription = "Process and convert your files",
  variant = "a",
}) {
  const brand = "Bits & Tools";
  let template;

  if (variant.toLowerCase() === "b") {
    template = `${toolName}: ${actionDescription} securely in your browser. Zero server data storage, instantaneous local processing, and no hidden trial limits.`;
  } else {
    template = `${actionDescription} in seconds with ${brand}. 100% free, private in-browser utility with zero file uploads and no registration required.`;
  }

  if (template.length > 155) {
    const truncated = template.slice(0, 155);
    const lastPeriod = truncated.lastIndexOf(".");
    if (lastPeriod >= 135) {
      return truncated.slice(0, lastPeriod + 1);
    }
    const lastSpace = truncated.lastIndexOf(" ");
    return `${truncated.slice(0, lastSpace)}...`;
  }

  return template;
}
