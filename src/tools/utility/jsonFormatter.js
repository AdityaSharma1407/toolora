/**
 * JSON Formatter, Minifier, and Syntax Validator.
 * Zero external dependencies.
 */

/**
 * Validates JSON and extracts detailed error position if invalid.
 * @param {string} input
 * @returns {{ valid: boolean, error: string|null, line: number|null, column: number|null, parsed: any }}
 */
export function validateJson(input = "") {
  if (!input || !input.trim()) {
    return { valid: false, error: "Input is empty", line: null, column: null, parsed: null };
  }

  try {
    const parsed = JSON.parse(input);
    return { valid: true, error: null, line: null, column: null, parsed };
  } catch (err) {
    const message = err.message;
    let line = null;
    let column = null;

    // V8 / Chrome / Node error format: "at position X"
    const posMatch = message.match(/at position (\d+)/i);
    if (posMatch) {
      const position = parseInt(posMatch[1], 10);
      const textUpToPos = input.slice(0, position);
      const lines = textUpToPos.split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    } else {
      // Firefox error format: "at line X column Y"
      const lineColMatch = message.match(/line (\d+) column (\d+)/i);
      if (lineColMatch) {
        line = parseInt(lineColMatch[1], 10);
        column = parseInt(lineColMatch[2], 10);
      }
    }

    return {
      valid: false,
      error: message,
      line,
      column,
      parsed: null,
    };
  }
}

/**
 * Recursively sort object keys alphabetically.
 * @param {any} value
 * @returns {any}
 */
export function sortKeysRecursively(value) {
  if (Array.isArray(value)) {
    return value.map(sortKeysRecursively);
  }
  if (value !== null && typeof value === "object") {
    const sorted = {};
    const keys = Object.keys(value).sort((a, b) => a.localeCompare(b));
    for (const key of keys) {
      sorted[key] = sortKeysRecursively(value[key]);
    }
    return sorted;
  }
  return value;
}

/**
 * Formats or minifies a JSON string with options.
 * @param {string} input
 * @param {object} options
 * @param {number|string} [options.indent=2] - 2, 4, or '\t'
 * @param {boolean} [options.sortKeys=false]
 * @param {boolean} [options.minify=false]
 * @returns {{ success: boolean, output: string, error?: string, line?: number, column?: number, stats?: object }}
 */
export function formatJson(input = "", options = {}) {
  const { indent = 2, sortKeys = false, minify = false } = options;

  const validation = validateJson(input);
  if (!validation.valid) {
    return {
      success: false,
      output: "",
      error: validation.error,
      line: validation.line,
      column: validation.column,
    };
  }

  let data = validation.parsed;

  if (sortKeys) {
    data = sortKeysRecursively(data);
  }

  let formatted = "";
  if (minify) {
    formatted = JSON.stringify(data);
  } else {
    const space = indent === "tab" || indent === "\t" ? "\t" : Number(indent);
    formatted = JSON.stringify(data, null, space);
  }

  const rawBytes = new Blob ? new Blob([input]).size : input.length;
  const newBytes = new Blob ? new Blob([formatted]).size : formatted.length;

  return {
    success: true,
    output: formatted,
    stats: {
      originalSize: rawBytes,
      formattedSize: newBytes,
      difference: newBytes - rawBytes,
    },
  };
}

/**
 * Strips backslash escape sequences from raw JSON string (e.g. from log dumps).
 * @param {string} input
 * @returns {string}
 */
export function unescapeJsonString(input = "") {
  try {
    // If the input is wrapped in quotes as a JSON string, parse it once
    if (input.trim().startsWith('"') && input.trim().endsWith('"')) {
      return JSON.parse(input);
    }
    // Replace standard escapes
    return input
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t");
  } catch {
    return input.replace(/\\"/g, '"');
  }
}
