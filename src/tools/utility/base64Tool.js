/**
 * Unicode-Safe Base64 Encoding & Decoding Utilities.
 * Handles UTF-8 / Multi-byte characters without Latin1 exceptions.
 * Zero external dependencies.
 */

/**
 * Encodes a Unicode string to Base64.
 * @param {string} str
 * @param {object} [options]
 * @param {boolean} [options.urlSafe=false]
 * @returns {string}
 */
export function encodeBase64(str = "", options = {}) {
  const { urlSafe = false } = options;
  if (!str) return "";

  // Unicode safe: convert string to UTF-8 bytes
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  const len = bytes.byteLength;
  const chunkSize = 8192;

  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, chunk);
  }

  let base64 = btoa(binary);

  if (urlSafe) {
    base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  return base64;
}

/**
 * Decodes a Base64 string back to a Unicode string.
 * @param {string} base64Str
 * @returns {{ success: boolean, output: string, error?: string }}
 */
export function decodeBase64(base64Str = "") {
  if (!base64Str || !base64Str.trim()) {
    return { success: true, output: "" };
  }

  try {
    let clean = base64Str.trim();
    // Convert URL-safe characters back to standard Base64
    clean = clean.replace(/-/g, "+").replace(/_/g, "/");

    // Pad with '=' if missing
    while (clean.length % 4 !== 0) {
      clean += "=";
    }

    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    return { success: true, output: decoded };
  } catch (err) {
    return {
      success: false,
      output: "",
      error: "Invalid Base64 string: contains illegal characters or corrupted padding.",
    };
  }
}

/**
 * Reads an uploaded File or Blob and returns Data URL and pure Base64.
 * @param {File|Blob} file
 * @returns {Promise<{ dataUrl: string, base64: string, mimeType: string, filename: string, size: number }>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const commaIdx = dataUrl.indexOf(",");
      const base64 = commaIdx !== -1 ? dataUrl.slice(commaIdx + 1) : dataUrl;
      resolve({
        dataUrl,
        base64,
        mimeType: file.type || "application/octet-stream",
        filename: file.name || "file",
        size: file.size,
      });
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
