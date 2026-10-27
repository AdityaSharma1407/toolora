/**
 * SEO-Friendly URL Slug Generator.
 * Handles diacritics, unicode transliteration, and stop-word filtering.
 * Zero external dependencies.
 */

const STOP_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "if", "in", "into",
  "is", "it", "no", "not", "of", "on", "or", "such", "that", "the", "their",
  "then", "there", "these", "they", "this", "to", "was", "will", "with"
]);

/**
 * Generates clean URL slug from string.
 * @param {string} str
 * @param {object} [options]
 * @param {'-'|'_'|'.'|''} [options.separator='-']
 * @param {boolean} [options.lowercase=true]
 * @param {boolean} [options.removeStopWords=false]
 * @param {boolean} [options.stripNumbers=false]
 * @returns {string}
 */
export function generateSlug(str = "", options = {}) {
  const {
    separator = "-",
    lowercase = true,
    removeStopWords = false,
    stripNumbers = false,
  } = options;

  if (!str) return "";

  // 1. Normalize unicode diacritics (e.g., é -> e + accent, then remove combining marks)
  let result = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (lowercase) {
    result = result.toLowerCase();
  }

  // 2. Strip numbers if requested
  if (stripNumbers) {
    result = result.replace(/\d+/g, " ");
  }

  // 3. Remove non-alphanumeric characters (except whitespace)
  result = result.replace(/[^\p{L}\p{N}\s]+/gu, " ");

  // 4. Split into words
  let words = result.trim().split(/\s+/).filter(Boolean);

  // 5. Filter stop words if requested
  if (removeStopWords) {
    words = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
    if (words.length === 0) {
      // If all words were stop words, fall back to original words
      words = result.trim().split(/\s+/).filter(Boolean);
    }
  }

  const sep = typeof separator === "string" ? separator : "-";
  return words.join(sep);
}
