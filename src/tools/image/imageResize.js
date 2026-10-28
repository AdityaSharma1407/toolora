/**
 * Client-Side Image Resizer & Dimensions Engine.
 * Runs 100% in browser RAM using HTML5 Canvas.
 * Zero external dependencies.
 */

/**
 * Loads a File or Blob into an HTMLImageElement.
 * @param {Blob | File} file
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No image file provided."));
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image. The file may be corrupt or an unsupported format."));
    };
    img.src = url;
  });
}

/**
 * Retrieves natural dimensions and metadata from an image File or Blob.
 * @param {Blob | File} file
 * @returns {Promise<{ width: number, height: number, aspectRatio: number, size: number, type: string, name: string }>}
 */
export async function getImageMetadata(file) {
  const img = await loadImageFromFile(file);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  const aspectRatio = height > 0 ? width / height : 1;
  return {
    width,
    height,
    aspectRatio,
    size: file.size,
    type: file.type || "image/png",
    name: file.name || "image",
  };
}

/**
 * Resizes an image file to specified pixel dimensions or scale percentage.
 * 
 * @param {Blob | File | HTMLImageElement} source
 * @param {object} options
 * @param {number} [options.width] - Target width in pixels
 * @param {number} [options.height] - Target height in pixels
 * @param {number} [options.scalePercent] - Scale factor (e.g. 50 for 50%)
 * @param {boolean} [options.maintainAspectRatio=true]
 * @param {string} [options.format='image/png'] - 'image/png' | 'image/jpeg' | 'image/webp'
 * @param {number} [options.quality=0.92] - Quality (0.01 to 1.0) for jpeg/webp
 * @param {string} [options.backgroundColor='transparent'] - Background fill for transparent images
 * @returns {Promise<{ blob: Blob, dataUrl: string, width: number, height: number, originalWidth: number, originalHeight: number, size: number }>}
 */
export async function resizeImage(source, options = {}) {
  let img;
  let originalSize = 0;

  if (source instanceof Blob) {
    originalSize = source.size;
    img = await loadImageFromFile(source);
  } else {
    img = source;
  }

  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  if (origW === 0 || origH === 0) {
    throw new Error("Invalid image: width or height is 0.");
  }

  const {
    scalePercent,
    maintainAspectRatio = true,
    format = "image/png",
    quality = 0.92,
    backgroundColor = "transparent",
  } = options;

  let targetW = options.width;
  let targetH = options.height;

  if (scalePercent && scalePercent > 0) {
    targetW = Math.round(origW * (scalePercent / 100));
    targetH = Math.round(origH * (scalePercent / 100));
  } else if (targetW && !targetH) {
    targetH = maintainAspectRatio ? Math.round(targetW * (origH / origW)) : origH;
  } else if (!targetW && targetH) {
    targetW = maintainAspectRatio ? Math.round(targetH * (origW / origH)) : origW;
  } else if (!targetW && !targetH) {
    targetW = origW;
    targetH = origH;
  } else if (maintainAspectRatio) {
    // If both specified and maintainAspectRatio is true, fit inside bounding box
    const ratio = Math.min(targetW / origW, targetH / origH);
    targetW = Math.round(origW * ratio);
    targetH = Math.round(origH * ratio);
  }

  targetW = Math.max(1, Math.round(targetW));
  targetH = Math.max(1, Math.round(targetH));

  // Safeguard against browser tab crash from extreme dimensions
  const MAX_CANVAS_DIMENSION = 16384;
  const MAX_CANVAS_PIXELS = 33554432; // 32 Megapixels
  if (
    targetW > MAX_CANVAS_DIMENSION ||
    targetH > MAX_CANVAS_DIMENSION ||
    targetW * targetH > MAX_CANVAS_PIXELS
  ) {
    throw new Error(
      `Target dimensions (${targetW}x${targetH}) exceed browser memory limits (max 16,384px or 32 MP). Please enter smaller dimensions.`
    );
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d", { alpha: true });

  if (!ctx) {
    throw new Error("Unable to create canvas 2D rendering context.");
  }

  // Handle background color for non-transparent formats (e.g. JPEG)
  if (format === "image/jpeg" || (backgroundColor && backgroundColor !== "transparent")) {
    ctx.fillStyle = backgroundColor === "transparent" ? "#ffffff" : backgroundColor;
    ctx.fillRect(0, 0, targetW, targetH);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return reject(new Error("Canvas toBlob serialization failed."));
        }
        const dataUrl = canvas.toDataURL(format, quality);
        resolve({
          blob,
          dataUrl,
          width: targetW,
          height: targetH,
          originalWidth: origW,
          originalHeight: origH,
          size: blob.size,
          originalSize,
        });
      },
      format,
      quality
    );
  });
}
