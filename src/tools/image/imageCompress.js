import { loadImageFromFile } from "./imageResize.js";

/**
 * Client-Side Image Compression Engine.
 * Reduces file size using WebP/JPEG quantization and high-quality canvas downsampling.
 * 100% private in browser memory.
 */

/**
 * Compresses an image File or Blob with configurable quality and optional max bounds.
 * 
 * @param {Blob | File} file
 * @param {object} options
 * @param {number} [options.quality=0.75] - Compression quality (0.1 to 1.0)
 * @param {string} [options.format='image/jpeg'] - 'image/jpeg' | 'image/webp' | 'image/png'
 * @param {number} [options.maxWidth=3840] - Optional max width boundary
 * @param {number} [options.maxHeight=3840] - Optional max height boundary
 * @returns {Promise<{ blob: Blob, dataUrl: string, originalSize: number, compressedSize: number, percentSaved: number, width: number, height: number }>}
 */
export async function compressImage(file, options = {}) {
  const {
    quality = 0.75,
    format = "image/jpeg",
    maxWidth = 3840,
    maxHeight = 3840,
  } = options;

  if (!file) {
    throw new Error("No file provided for compression.");
  }

  const originalSize = file.size;
  const img = await loadImageFromFile(file);

  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width === 0 || height === 0) {
    throw new Error("Invalid image: width or height is 0.");
  }

  // Constrain within maxWidth/maxHeight preserving aspect ratio
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: true });

  if (!ctx) {
    throw new Error("Failed to get canvas 2D context.");
  }

  // If compressing to JPEG, fill canvas background white to prevent black background artifacts
  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return reject(new Error("Compression failed during canvas serialization."));
        }
        const compressedSize = blob.size;
        const percentSaved = originalSize > 0
          ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
          : 0;

        const dataUrl = canvas.toDataURL(format, quality);

        resolve({
          blob,
          dataUrl,
          originalSize,
          compressedSize,
          percentSaved,
          width,
          height,
        });
      },
      format,
      quality
    );
  });
}
