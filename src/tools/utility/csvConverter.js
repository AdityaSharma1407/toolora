/**
 * RFC 4180 Compliant JSON <-> CSV Bi-Directional Converter.
 * Zero external dependencies.
 */

/**
 * Escapes a single CSV field value according to RFC 4180.
 * Wraps in quotes if it contains delimiter, quotes, or newlines.
 */
function escapeCsvValue(val, delimiter = ",") {
  if (val === null || val === undefined) return "";
  let str = typeof val === "object" ? JSON.stringify(val) : String(val);

  if (
    str.includes(delimiter) ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Flattens a nested object into a single-level object with dot-notation keys.
 */
export function flattenObject(obj, prefix = "") {
  const result = {};
  for (const [key, val] of Object.entries(obj || {})) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(result, flattenObject(val, fullKey));
    } else {
      result[fullKey] = val;
    }
  }
  return result;
}

/**
 * Converts a JSON string or array of objects into a CSV string.
 * @param {string|Array<object>} jsonInput
 * @param {object} [options]
 * @param {string} [options.delimiter=',']
 * @param {boolean} [options.flatten=true]
 * @returns {{ success: boolean, output: string, error?: string, rowCount?: number, columnCount?: number }}
 */
export function jsonToCsv(jsonInput, options = {}) {
  const { delimiter = ",", flatten = true } = options;

  let data;
  try {
    data = typeof jsonInput === "string" ? JSON.parse(jsonInput) : jsonInput;
  } catch (err) {
    return { success: false, output: "", error: "Invalid JSON input: " + err.message };
  }

  if (!Array.isArray(data)) {
    if (typeof data === "object" && data !== null) {
      data = [data];
    } else {
      return { success: false, output: "", error: "JSON must be an array of objects or a single object." };
    }
  }

  if (data.length === 0) {
    return { success: true, output: "", rowCount: 0, columnCount: 0 };
  }

  // Flatten rows if requested
  const processedRows = flatten ? data.map((item) => flattenObject(item)) : data;

  // Extract all unique headers across all objects
  const headerSet = new Set();
  for (const row of processedRows) {
    if (typeof row === "object" && row !== null) {
      Object.keys(row).forEach((k) => headerSet.add(k));
    }
  }

  const headers = Array.from(headerSet);
  if (headers.length === 0) {
    return { success: false, output: "", error: "No tabular columns found in JSON." };
  }

  const csvLines = [];
  // Header line
  csvLines.push(headers.map((h) => escapeCsvValue(h, delimiter)).join(delimiter));

  // Data lines
  for (const row of processedRows) {
    const line = headers.map((header) => {
      const val = row ? row[header] : "";
      return escapeCsvValue(val, delimiter);
    });
    csvLines.push(line.join(delimiter));
  }

  const output = csvLines.join("\n");
  return {
    success: true,
    output,
    rowCount: data.length,
    columnCount: headers.length,
  };
}

/**
 * Parses a CSV string into an array of objects per RFC 4180.
 * @param {string} csvText
 * @param {object} [options]
 * @param {string} [options.delimiter=',']
 * @param {boolean} [options.autoType=true]
 * @returns {{ success: boolean, output: string, data?: Array<object>, error?: string, rowCount?: number }}
 */
export function csvToJson(csvText = "", options = {}) {
  const { delimiter = ",", autoType = true } = options;

  if (!csvText || !csvText.trim()) {
    return { success: true, output: "[]", data: [], rowCount: 0 };
  }

  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;

  const text = csvText.trim();
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentField);
        currentField = "";
      } else if (char === "\n" || (char === "\r" && nextChar === "\n")) {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
        if (char === "\r") i++; // skip \n in CRLF
      } else {
        currentField += char;
      }
    }
  }

  // Push last field & row
  currentRow.push(currentField);
  if (currentRow.length > 0 && !(currentRow.length === 1 && currentRow[0] === "")) {
    rows.push(currentRow);
  }

  if (rows.length < 2) {
    return { success: false, output: "", error: "CSV requires at least 1 header line and 1 data line." };
  }

  const headers = rows[0].map((h) => h.trim());
  const jsonResult = [];

  for (let r = 1; r < rows.length; r++) {
    const values = rows[r];
    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c];
      const rawVal = values[c] !== undefined ? values[c] : "";
      let val = rawVal;

      if (autoType && typeof rawVal === "string") {
        const trimmed = rawVal.trim();
        if (trimmed === "true") val = true;
        else if (trimmed === "false") val = false;
        else if (trimmed === "null") val = null;
        else if (/^-?\d+(\.\d+)?$/.test(trimmed) && !isNaN(Number(trimmed))) {
          val = Number(trimmed);
        }
      }
      obj[key] = val;
    }
    jsonResult.push(obj);
  }

  return {
    success: true,
    output: JSON.stringify(jsonResult, null, 2),
    data: jsonResult,
    rowCount: jsonResult.length,
    columnCount: headers.length,
  };
}

/**
 * Parses raw CSV text into a 2D array of string cells.
 * @param {string} csvText
 * @param {string} [delimiter=',']
 * @returns {string[][]}
 */
export function parseCsvRows(csvText = "", delimiter = ",") {
  if (!csvText || !csvText.trim()) return [];

  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;

  const text = csvText.trim();
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentField);
        currentField = "";
      } else if (char === "\n" || (char === "\r" && nextChar === "\n")) {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
        if (char === "\r") i++;
      } else {
        currentField += char;
      }
    }
  }

  currentRow.push(currentField);
  if (currentRow.length > 0 && !(currentRow.length === 1 && currentRow[0] === "")) {
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Formats an array of cell values into an RFC 4180 CSV line.
 * @param {Array<any>} row
 * @param {string} [delimiter=',']
 * @returns {string}
 */
export function formatCsvRow(row = [], delimiter = ",") {
  return row.map((val) => escapeCsvValue(val, delimiter)).join(delimiter);
}
