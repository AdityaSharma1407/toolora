import { getToolById, getToolsByCategory } from "../../data/toolsRegistry.js";

/**
 * DOM-Weighted Anchor Graph Engine
 * 
 * Implements anchor-text diversification and early-content link placement.
 * Rotates child URLs across varied semantic anchor patterns (canonical title,
 * direct query, conversational context, and action verbs) to eliminate
 * over-optimization algorithmic penalties and maximize anchor relevance.
 */

export const ANCHOR_CORPUS = {
  "/merge-pdf": {
    canonical: "Merge PDF Online",
    direct_query: "combine multiple PDF files into one",
    conversational: "join your PDF documents into a single binder",
    action: "merge PDF pages client-side",
  },
  "/split-pdf": {
    canonical: "Split PDF Files Online",
    direct_query: "extract specific pages from PDF",
    conversational: "separate PDF pages into independent files",
    action: "split PDF pages in-browser",
  },
  "/compress-pdf": {
    canonical: "Compress PDF Files",
    direct_query: "reduce PDF document file size",
    conversational: "shrink your PDF file size without losing clarity",
    action: "compress PDF files locally",
  },
  "/jpg-to-pdf": {
    canonical: "JPG to PDF Converter",
    direct_query: "convert JPG and PNG pictures to PDF",
    conversational: "compile images into a clean PDF document",
    action: "turn pictures into formatted PDF",
  },
  "/pdf-to-jpg": {
    canonical: "PDF to JPG Converter",
    direct_query: "convert PDF pages into high-resolution images",
    conversational: "extract document pages as JPG photos",
    action: "convert PDF to image files",
  },
  "/rotate-pdf": {
    canonical: "Rotate PDF Pages",
    direct_query: "rotate sideways or upside-down PDF pages",
    conversational: "fix document orientation permanently",
    action: "rotate PDF documents free",
  },
  "/delete-pdf-pages": {
    canonical: "Delete PDF Pages",
    direct_query: "remove unwanted or blank pages from PDF",
    conversational: "delete extra pages from your document",
    action: "remove PDF pages in memory",
  },
  "/reorder-pdf-pages": {
    canonical: "Reorder PDF Pages",
    direct_query: "reorganize and resequence PDF page order",
    conversational: "arrange pages in the exact sequence you need",
    action: "reorder document pages visually",
  },
  "/protect-pdf": {
    canonical: "Protect PDF with Password",
    direct_query: "encrypt PDF with AES password protection",
    conversational: "secure confidential PDF files before sharing",
    action: "password protect your PDF",
  },
  "/unlock-pdf": {
    canonical: "Unlock Password Protected PDF",
    direct_query: "remove password security from PDF",
    conversational: "unlock your restricted PDF documents",
    action: "remove PDF password permissions",
  },
  "/add-page-numbers": {
    canonical: "Add Page Numbers to PDF",
    direct_query: "paginate PDF documents with custom numbering",
    conversational: "insert header and footer page counts",
    action: "number PDF pages automatically",
  },
  "/watermark-pdf": {
    canonical: "Watermark PDF Online",
    direct_query: "stamp text or image watermarks onto PDF",
    conversational: "brand your documents with copyright watermarks",
    action: "apply PDF watermark stamps",
  },
  "/resize-image": {
    canonical: "Resize Image Online",
    direct_query: "change image pixel dimensions and aspect ratio",
    conversational: "scale photos for web and social media",
    action: "resize photos in-browser",
  },
  "/compress-image": {
    canonical: "Compress Image Free",
    direct_query: "reduce image file size without quality loss",
    conversational: "compress pictures for faster website loading",
    action: "shrink image file sizes",
  },
  "/image-converter": {
    canonical: "Image Format Converter",
    direct_query: "convert between JPG, PNG, and WebP formats",
    conversational: "transcode images to modern web formats",
    action: "convert image formats client-side",
  },
};

const STYLES = ["canonical", "direct_query", "conversational", "action"];

/**
 * Deterministic string hash to select varied anchor style based on source route
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns diversified anchor text for a target route given a source context
 * 
 * @param {string} targetRoute - Destination route (e.g. "/compress-pdf")
 * @param {string} [sourceContext=""] - Current page route or seed
 * @param {string} [preferredStyle=null] - Optional forced style
 * @returns {{ route: string, text: string, style: string }}
 */
export function getDiversifiedAnchor(targetRoute, sourceContext = "", preferredStyle = null) {
  const corpus = ANCHOR_CORPUS[targetRoute];
  if (!corpus) {
    const tool = getToolById(targetRoute.replace(/^\//, ""));
    return {
      route: targetRoute,
      text: tool?.name || targetRoute.replace(/^\//, "").replace(/-/g, " "),
      style: "fallback",
    };
  }

  let selectedStyle = preferredStyle;
  if (!selectedStyle || !corpus[selectedStyle]) {
    const index = hashString(sourceContext + targetRoute) % STYLES.length;
    selectedStyle = STYLES[index];
  }

  return {
    route: targetRoute,
    text: corpus[selectedStyle] || corpus.canonical,
    style: selectedStyle,
  };
}

/**
 * Returns top early-content links strictly within the same semantic cluster
 * for placement within the initial 200 words of the primary content flow.
 * 
 * @param {string} currentRoute - e.g. "/merge-pdf"
 * @param {number} [limit=2] - Number of high-priority links
 * @returns {Array<{ route: string, text: string, style: string, category: string }>}
 */
export function getEarlyContentLinks(currentRoute, limit = 2) {
  const currentSlug = currentRoute.replace(/^\//, "");
  const currentTool = getToolById(currentSlug);

  if (!currentTool) return [];

  const categoryTools = getToolsByCategory(currentTool.category).filter(
    (t) => t.status === "available" && t.route !== currentRoute
  );

  return categoryTools.slice(0, limit).map((t) => {
    const anchor = getDiversifiedAnchor(t.route, currentRoute);
    return {
      route: t.route,
      text: anchor.text,
      style: anchor.style,
      name: t.name,
      category: t.category,
    };
  });
}
