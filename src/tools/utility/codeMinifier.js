/**
 * Client-Side Code Minifier & Beautifier.
 * Supports HTML, CSS, JavaScript, and JSON formatting and minification.
 * 100% pure JavaScript with zero external dependencies.
 */

/**
 * Calculates byte size of a UTF-8 string.
 * @param {string} str
 * @returns {number}
 */
export function getByteSize(str = "") {
  return new Blob([str]).size;
}

/**
 * Calculates comparison metrics between original and result code.
 * @param {string} original
 * @param {string} result
 */
export function calculateSavings(original = "", result = "") {
  const origBytes = getByteSize(original);
  const resBytes = getByteSize(result);
  const diff = origBytes - resBytes;
  const percent = origBytes > 0 ? ((diff / origBytes) * 100).toFixed(1) : "0.0";

  return {
    originalBytes: origBytes,
    resultBytes: resBytes,
    savingsBytes: diff,
    savingsPercent: parseFloat(percent),
  };
}

// ----------------------------------------------------
// JSON Minify & Beautify
// ----------------------------------------------------
export function minifyJson(code = "") {
  const parsed = JSON.parse(code);
  return JSON.stringify(parsed);
}

export function beautifyJson(code = "") {
  const parsed = JSON.parse(code);
  return JSON.stringify(parsed, null, 2);
}

// ----------------------------------------------------
// CSS Minify & Beautify
// ----------------------------------------------------
export function minifyCss(css = "") {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // Remove newlines and tabs
    .replace(/[\r\n\t]+/g, " ")
    // Remove spaces around symbols
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    // Remove unnecessary semicolon before closing brace
    .replace(/;}/g, "}")
    // Collapse spaces
    .replace(/\s+/g, " ")
    .trim();
}

export function beautifyCss(css = "") {
  let minified = minifyCss(css);
  let formatted = "";
  let indentLevel = 0;
  const indent = "  ";

  for (let i = 0; i < minified.length; i++) {
    const char = minified[i];

    if (char === "{") {
      formatted = formatted.trimEnd() + " {\n" + indent.repeat(++indentLevel);
    } else if (char === "}") {
      indentLevel = Math.max(0, indentLevel - 1);
      formatted = formatted.trimEnd() + "\n" + indent.repeat(indentLevel) + "}\n" + indent.repeat(indentLevel);
    } else if (char === ";") {
      formatted += ";\n" + indent.repeat(indentLevel);
    } else if (char === ":") {
      formatted += ": ";
    } else {
      formatted += char;
    }
  }

  return formatted.trim();
}

// ----------------------------------------------------
// HTML Minify & Beautify
// ----------------------------------------------------
export function minifyHtml(html = "") {
  return html
    // Remove comments (excluding conditional IE comments)
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, "")
    // Remove spaces between tags
    .replace(/>\s+</g, "><")
    // Collapse multi-spaces
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function beautifyHtml(html = "") {
  const tab = "  ";
  let result = "";
  let indent = 0;

  // Split tokens by HTML tags
  const tokens = html
    .replace(/>\s*</g, "><")
    .replace(/</g, "~#~<")
    .replace(/>/g, ">~#~")
    .split("~#~")
    .filter((token) => token.trim().length > 0);

  const voidTags = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr", "!doctype"
  ]);

  for (const token of tokens) {
    const trimmed = token.trim();

    if (trimmed.startsWith("</")) {
      // Closing tag
      indent = Math.max(0, indent - 1);
      result += tab.repeat(indent) + trimmed + "\n";
    } else if (trimmed.startsWith("<") && !trimmed.endsWith("/>")) {
      // Opening tag
      const match = trimmed.match(/^<([a-zA-Z0-9!]+)/);
      const tagName = match ? match[1].toLowerCase() : "";

      result += tab.repeat(indent) + trimmed + "\n";

      if (!voidTags.has(tagName) && !trimmed.startsWith("<!")) {
        indent++;
      }
    } else if (trimmed.startsWith("<") && trimmed.endsWith("/>")) {
      // Self closing tag
      result += tab.repeat(indent) + trimmed + "\n";
    } else {
      // Text content
      result += tab.repeat(indent) + trimmed + "\n";
    }
  }

  return result.trim();
}

// ----------------------------------------------------
// JavaScript Minify & Beautify
// ----------------------------------------------------
export function minifyJs(js = "") {
  return js
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // Remove single-line comments (preserving URLs like http://)
    .replace(/(^|[^:])\/\/[^\r\n]*/g, "$1")
    // Trim lines
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
    // Collapse multiple whitespace
    .replace(/[ \t]{2,}/g, " ")
    // Remove space around operators and braces where safe
    .replace(/\s*([=+\-*/%&|!<>?:,;{}()[\]])\s*/g, "$1")
    // Ensure space after var, let, const, return, function, if, else, typeof
    .replace(/\b(var|let|const|return|function|if|else|typeof|new|delete|in|instanceof|throw|case|catch)\b(?=[a-zA-Z0-9_$])/g, "$1 ");
}

export function beautifyJs(js = "") {
  let indent = 0;
  const tab = "  ";
  const lines = js.split("\n");
  const formatted = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (line.startsWith("}") || line.startsWith("]")) {
      indent = Math.max(0, indent - 1);
    }

    formatted.push(tab.repeat(indent) + line);

    if (line.endsWith("{") || line.endsWith("[")) {
      indent++;
    }
  }

  return formatted.join("\n");
}

/**
 * Master processor for all supported formats.
 * @param {string} code
 * @param {"html"|"css"|"javascript"|"json"} language
 * @param {"minify"|"beautify"} mode
 * @returns {{ success: boolean, result: string, metrics?: object, error?: string }}
 */
export function processCode(code = "", language = "json", mode = "minify") {
  if (!code.trim()) {
    return { success: true, result: "", metrics: calculateSavings("", "") };
  }

  try {
    let result = "";

    switch (language) {
      case "json":
        result = mode === "minify" ? minifyJson(code) : beautifyJson(code);
        break;
      case "css":
        result = mode === "minify" ? minifyCss(code) : beautifyCss(code);
        break;
      case "html":
        result = mode === "minify" ? minifyHtml(code) : beautifyHtml(code);
        break;
      case "javascript":
        result = mode === "minify" ? minifyJs(code) : beautifyJs(code);
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }

    const metrics = calculateSavings(code, result);
    return { success: true, result, metrics };
  } catch (err) {
    return { success: false, result: code, error: err.message };
  }
}
