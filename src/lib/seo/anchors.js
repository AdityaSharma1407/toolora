/**
 * Deterministic Anchor Graphing Utility
 * Automatically generates slugified, semantic HTML `id` attributes and deep-link
 * anchor targets for H2, H3, and Definition Lists (<dl>) to support fragment
 * scroll-to-text behaviors and algorithmic citation extraction.
 */

/**
 * Converts heading or title text into a deterministic, URL-safe slug
 * @param {string} text - Raw heading string
 * @returns {string} URL-safe slug
 */
export function slugifyHeading(text = "") {
  return String(text)
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .toLowerCase()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-_]/g, "") // Remove non-alphanumeric chars except space, hyphen, underscore
    .trim()
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/-+/g, "-") // Remove redundant consecutive hyphens
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
}

/**
 * Injects deterministic `id` attributes and accessible anchor links into HTML markup
 * Targets H2, H3, and Definition Lists (<dl>)
 * 
 * @param {string} html - HTML string
 * @returns {string} Transformed HTML with anchor graph targets
 */
export function injectHeadingAnchors(html = "") {
  if (!html || typeof html !== "string") return "";

  // 1. Process H2 and H3 elements
  let processed = html.replace(/<h([23])(\s+[^>]*)?>(.*?)<\/h\1>/gis, (match, level, attrs = "", content) => {
    // If id already exists, extract it; otherwise, slugify content
    const existingIdMatch = attrs.match(/id=["']([^"']+)["']/i);
    const slug = existingIdMatch ? existingIdMatch[1] : slugifyHeading(content);

    // Clean existing id from attrs if any to re-inject deterministically
    const cleanAttrs = attrs ? attrs.replace(/\s*id=["'][^"']*["']/i, "").trim() : "";
    const attrString = cleanAttrs ? ` ${cleanAttrs}` : "";

    // Copy-link fragment anchor
    const anchorBtn = `<a href="#${slug}" class="heading-anchor-link ml-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-slate-400 hover:text-brand-600 focus:outline-none" aria-label="Direct link to ${slugifyHeading(content)}">#</a>`;

    return `<h${level} id="${slug}"${attrString}>${content}${anchorBtn}</h${level}>`;
  });

  // 2. Process Definition Lists (<dl>)
  processed = processed.replace(/<dl(\s+[^>]*)?>/gis, (match, attrs = "") => {
    if (/id=["'][^"']+["']/i.test(attrs)) return match;
    const slug = "definition-list";
    const cleanAttrs = attrs ? attrs.trim() : "";
    return `<dl id="${slug}"${cleanAttrs ? ` ${cleanAttrs}` : ""}>`;
  });

  return processed;
}
