/**
 * Client-Side Regular Expression Testing & Match Analysis Engine.
 * Provides real-time regex matching, capture group inspection, and highlighted text rendering.
 * 100% pure JavaScript.
 */

import { escapeHtml } from "./markdownParser.js";

export const COMMON_REGEX_PATTERNS = [
  { name: "Email Address", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { name: "HTTP / HTTPS URL", pattern: "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)", flags: "g" },
  { name: "IPv4 Address", pattern: "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b", flags: "g" },
  { name: "Hex Color Code", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", flags: "g" },
  { name: "UUID v4", pattern: "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}", flags: "g" },
  { name: "ISO 8601 Date (YYYY-MM-DD)", pattern: "\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b", flags: "g" },
  { name: "US Phone Number", pattern: "\\(?\\b[0-9]{3}\\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}\\b", flags: "g" },
  { name: "Slug / Kebab-case", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", flags: "g" },
];

/**
 * Executes a regex against test text with capture group inspection.
 *
 * @param {string} pattern
 * @param {string} flags
 * @param {string} text
 * @returns {{ valid: boolean, matches: Array<object>, highlightedHtml: string, error?: string }}
 */
export function executeRegex(pattern, flags, text) {
  if (!pattern) {
    return { valid: true, matches: [], highlightedHtml: escapeHtml(text) };
  }

  let regex;
  try {
    regex = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
  } catch (err) {
    return {
      valid: false,
      matches: [],
      highlightedHtml: escapeHtml(text),
      error: err.message,
    };
  }

  const matches = [];
  let match;
  let lastIndex = 0;
  const parts = [];

  // Limit max matches to prevent browser freeze on runaway patterns
  const MAX_MATCHES = 500;

  while ((match = regex.exec(text)) !== null && matches.length < MAX_MATCHES) {
    const startIndex = match.index;
    const matchText = match[0];
    const endIndex = startIndex + matchText.length;

    // Push text before match
    parts.push(escapeHtml(text.slice(lastIndex, startIndex)));

    // Push highlighted match
    parts.push(
      `<mark class="bg-amber-200 dark:bg-amber-900/60 text-gray-900 dark:text-amber-200 rounded px-1 font-semibold">${escapeHtml(matchText)}</mark>`
    );

    const groups = [];
    if (match.length > 1) {
      for (let g = 1; g < match.length; g++) {
        groups.push({
          index: g,
          text: match[g] !== undefined ? match[g] : "",
        });
      }
    }

    matches.push({
      index: startIndex,
      length: matchText.length,
      text: matchText,
      groups,
    });

    lastIndex = endIndex;

    // Guard against zero-length match infinite loops
    if (matchText.length === 0) {
      regex.lastIndex++;
    }
  }

  // Push remainder
  parts.push(escapeHtml(text.slice(lastIndex)));

  return {
    valid: true,
    matches,
    highlightedHtml: parts.join(""),
  };
}
