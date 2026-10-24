import { siteConfig } from "../../config/site.js";

const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-

/**
 * Validates whether binary data starts with or contains the %PDF- header
 * in the first 1024 bytes as defined by PDF specifications.
 * @param {ArrayBuffer | Uint8Array | Buffer} buffer
 * @returns {boolean}
 */
export function hasValidPdfHeader(buffer) {
  if (!buffer || buffer.byteLength < 5) {
    return false;
  }

  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const searchLimit = Math.min(bytes.length - 4, 1024);

  for (let i = 0; i < searchLimit; i++) {
    if (
      bytes[i] === PDF_MAGIC_BYTES[0] &&
      bytes[i + 1] === PDF_MAGIC_BYTES[1] &&
      bytes[i + 2] === PDF_MAGIC_BYTES[2] &&
      bytes[i + 3] === PDF_MAGIC_BYTES[3] &&
      bytes[i + 4] === PDF_MAGIC_BYTES[4]
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Validates a single PDF File candidate against size, type, and limits.
 * @param {File | { name: string, size: number, type?: string }} file
 * @param {ArrayBuffer} [headerBuffer] - Optional initial bytes to check signature
 * @param {object} [customLimits]
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validatePdfFileMetadata(file, headerBuffer = null, customLimits = {}) {
  const limits = {
    ...siteConfig.limits.mergePdf,
    ...customLimits,
  };

  if (!file) {
    return { valid: false, error: "No file provided." };
  }

  // 1. Check filename
  const fileName = file.name || "Unknown file";
  if (!fileName.toLowerCase().endsWith(".pdf")) {
    return {
      valid: false,
      error: `"${fileName}" does not appear to be a PDF file (expected .pdf extension).`,
    };
  }

  // 2. Check empty file
  if (!file.size || file.size === 0) {
    return {
      valid: false,
      error: `"${fileName}" is empty (0 bytes). Please upload a valid document.`,
    };
  }

  // 3. Check individual file size limit
  if (file.size > limits.maxFileSizeBytes) {
    return {
      valid: false,
      error: `"${fileName}" (${formatBytes(file.size)}) exceeds the maximum allowed file size of ${limits.maxFileSizeFormatted}.`,
    };
  }

  // 4. Check magic bytes if buffer is provided
  if (headerBuffer && !hasValidPdfHeader(headerBuffer)) {
    return {
      valid: false,
      error: `"${fileName}" is corrupted or is not a genuine PDF document (missing %PDF- header).`,
    };
  }

  return { valid: true, error: null };
}

/**
 * Formats byte values into human-readable strings (KB, MB, GB).
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
