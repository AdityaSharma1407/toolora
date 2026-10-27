import { loadImageFromFile } from "./imageResize.js";

/**
 * Universal Client-Side Image Format Conversion Engine.
 * Converts between PNG, JPEG, WebP, and BMP in browser memory.
 */

export const SUPPORTED_FORMATS = [
  { id: "image/png", ext: "png", name: "PNG", hasTransparency: true, isLossless: true },
  { id: "image/jpeg", ext: "jpg", name: "JPEG", hasTransparency: false, isLossless: false },
  { id: "image/webp", ext: "webp", name: "WebP", hasTransparency: true, isLossless: false },
];

/**
 * Converts an image file to another image format.
 * 
 * @param {Blob | File} file
 * @param {string} targetFormat - 'image/png' | 'image/jpeg' | 'image/webp'
 * @param {object} [options]
 * @param {number} [options.quality=0.92] - Quality for JPEG / WebP (0.1 to 1.0)
 * @param {string} [options.backgroundColor='#ffffff'] - Background color for formats without transparency (like JPEG)
 * @returns {Promise<{ blob: Blob, dataUrl: string, fileName: string, originalSize: number, newSize: number, width: number, height: number }>}
 */
export async function convertImageFormat(file, targetFormat, options = {}) {
  const {
    quality = 0.92,
    backgroundColor = "#ffffff",
  } = options;

  if (!file) {
    throw new Error("No file provided for conversion.");
  }

  const img = await loadImageFromFile(file);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: true });

  if (!ctx) {
    throw new Error("Unable to create canvas 2D rendering context.");
  }

  // If converting to a format that doesn't support transparency, fill background
  if (targetFormat === "image/jpeg" || (backgroundColor && backgroundColor !== "transparent")) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  // Derive target extension
  const formatInfo = SUPPORTED_FORMATS.find((f) => f.id === targetFormat) || { ext: "png" };
  const baseName = (file.name || "converted").replace(/\.[^/.]+$/, "");
  const targetFileName = `${baseName}.${formatInfo.ext}`;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return reject(new Error("Image format conversion failed."));
        }
        const dataUrl = canvas.toDataURL(targetFormat, quality);
        resolve({
          blob,
          dataUrl,
          fileName: targetFileName,
          originalSize: file.size,
          newSize: blob.size,
          width,
          height,
        });
      },
      targetFormat,
      quality
    );
  });
}
