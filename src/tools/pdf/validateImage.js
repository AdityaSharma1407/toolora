import { siteConfig } from "../../config/site.js";
import { formatBytes } from "./validatePdf.js";

const SUPPORTED_IMAGE_EXTS = [".jpg", ".jpeg", ".png"];

/**
 * Validates an image file candidate before upload and processing.
 *
 * @param {File | { name: string, size: number, type?: string }} file
 * @param {object} [customLimits]
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateImageFile(file, customLimits = {}) {
  const limits = {
    ...siteConfig.limits.jpgToPdf,
    ...customLimits,
  };

  if (!file) {
    return { valid: false, error: "No image file provided." };
  }

  const fileName = file.name || "Unknown image";
  const lowerName = fileName.toLowerCase();
  const isSupported = SUPPORTED_IMAGE_EXTS.some((ext) => lowerName.endsWith(ext));

  if (!isSupported) {
    return {
      valid: false,
      error: `"${fileName}" is not supported. Please upload JPG, JPEG, or PNG files.`,
    };
  }

  if (!file.size || file.size === 0) {
    return {
      valid: false,
      error: `"${fileName}" is empty (0 bytes). Please upload a valid image.`,
    };
  }

  if (file.size > limits.maxImageSizeBytes) {
    return {
      valid: false,
      error: `"${fileName}" (${formatBytes(file.size)}) exceeds the maximum allowed image size of ${limits.maxImageSizeFormatted}.`,
    };
  }

  return { valid: true, error: null };
}
