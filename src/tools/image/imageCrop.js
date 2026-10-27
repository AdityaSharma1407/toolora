/**
 * Client-Side Image Crop Engine.
 * 100% browser-based canvas manipulation with zero external dependencies.
 */

import { loadImageFromFile } from "./imageResize.js";

export const ASPECT_RATIO_PRESETS = [
  { id: "free", label: "Freeform", ratio: null, description: "Custom dimensions" },
  { id: "1:1", label: "1:1 Square", ratio: 1, description: "Avatars, Instagram post" },
  { id: "16:9", label: "16:9 Landscape", ratio: 16 / 9, description: "YouTube, Widescreen" },
  { id: "4:5", label: "4:5 Portrait", ratio: 4 / 5, description: "Instagram feed portrait" },
  { id: "9:16", label: "9:16 Story", ratio: 9 / 16, description: "Reels, TikTok, Stories" },
  { id: "4:3", label: "4:3 Standard", ratio: 4 / 3, description: "Classic photo" },
  { id: "3:2", label: "3:2 Camera", ratio: 3 / 2, description: "DSLR standard" },
  { id: "2:1", label: "2:1 Banner", ratio: 2 / 1, description: "Twitter, LinkedIn banner" },
];

/**
 * Calculates a centered crop rectangle for a given aspect ratio within image bounds.
 *
 * @param {number} imgWidth - Natural width
 * @param {number} imgHeight - Natural height
 * @param {number|null} targetRatio - width / height ratio, or null for default inset
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function calculateInitialCrop(imgWidth, imgHeight, targetRatio = null) {
  if (!imgWidth || !imgHeight || imgWidth <= 0 || imgHeight <= 0) {
    return { x: 0, y: 0, width: 100, height: 100 };
  }

  if (targetRatio === null) {
    // Default 85% inset centered box
    const w = Math.round(imgWidth * 0.85);
    const h = Math.round(imgHeight * 0.85);
    return {
      x: Math.round((imgWidth - w) / 2),
      y: Math.round((imgHeight - h) / 2),
      width: Math.max(10, w),
      height: Math.max(10, h),
    };
  }

  const imgRatio = imgWidth / imgHeight;
  let cropW, cropH;

  if (imgRatio > targetRatio) {
    // Image is wider than target ratio: match height, scale width
    cropH = Math.round(imgHeight * 0.9);
    cropW = Math.round(cropH * targetRatio);
  } else {
    // Image is taller than target ratio: match width, scale height
    cropW = Math.round(imgWidth * 0.9);
    cropH = Math.round(cropW / targetRatio);
  }

  // Guard against exceeding dimensions
  if (cropW > imgWidth) {
    cropW = imgWidth;
    cropH = Math.round(cropW / targetRatio);
  }
  if (cropH > imgHeight) {
    cropH = imgHeight;
    cropW = Math.round(cropH * targetRatio);
  }

  cropW = Math.max(10, Math.min(imgWidth, Math.round(cropW)));
  cropH = Math.max(10, Math.min(imgHeight, Math.round(cropH)));

  const x = Math.max(0, Math.round((imgWidth - cropW) / 2));
  const y = Math.max(0, Math.round((imgHeight - cropH) / 2));

  return { x, y, width: cropW, height: cropH };
}

/**
 * Clamps a crop rectangle to stay strictly within image boundaries [0, imgWidth] and [0, imgHeight].
 *
 * @param {{ x: number, y: number, width: number, height: number }} rect
 * @param {number} imgWidth
 * @param {number} imgHeight
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function clampCropRect(rect, imgWidth, imgHeight) {
  let { x, y, width, height } = rect;

  width = Math.max(10, Math.min(imgWidth, Math.round(width)));
  height = Math.max(10, Math.min(imgHeight, Math.round(height)));

  x = Math.max(0, Math.min(imgWidth - width, Math.round(x)));
  y = Math.max(0, Math.min(imgHeight - height, Math.round(y)));

  return { x, y, width, height };
}

/**
 * Crops an image according to specified rectangle and transforms.
 *
 * @param {File | Blob | HTMLImageElement} source
 * @param {{ x: number, y: number, width: number, height: number }} cropRect
 * @param {object} [options]
 * @param {string} [options.format='image/png']
 * @param {number} [options.quality=0.92] - 0.1 to 1.0
 * @param {boolean} [options.flipHorizontal=false]
 * @param {boolean} [options.flipVertical=false]
 * @param {number} [options.rotation=0] - 0, 90, 180, 270
 * @returns {Promise<{ blob: Blob, dataUrl: string, width: number, height: number, size: number, originalSize: number }>}
 */
export async function cropImage(source, cropRect, options = {}) {
  const {
    format = "image/png",
    quality = 0.92,
    flipHorizontal = false,
    flipVertical = false,
    rotation = 0,
  } = options;

  let img;
  let originalSize = 0;

  if (source instanceof Blob) {
    originalSize = source.size;
    img = await loadImageFromFile(source);
  } else if (typeof Image !== "undefined" && source instanceof Image) {
    img = source;
    originalSize = 0;
  } else {
    throw new Error("Invalid image source provided for cropping.");
  }

  const naturalW = img.naturalWidth || img.width;
  const naturalH = img.naturalHeight || img.height;

  // Validate and clamp crop bounds
  const clamped = clampCropRect(cropRect, naturalW, naturalH);
  const { x, y, width: cw, height: ch } = clamped;

  if (cw <= 0 || ch <= 0) {
    throw new Error("Crop dimensions must be greater than zero.");
  }

  // Create intermediate canvas for the cropped area
  const cropCanvas = document.createElement("canvas");
  const normRot = ((rotation % 360) + 360) % 360;
  const isRotated90or270 = normRot === 90 || normRot === 270;

  // Canvas dimensions adjust if rotated 90 or 270 degrees
  cropCanvas.width = isRotated90or270 ? ch : cw;
  cropCanvas.height = isRotated90or270 ? cw : ch;

  const ctx = cropCanvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to initialize 2D canvas context.");
  }

  // Smooth quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // If format is JPEG, draw white background
  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
  }

  // Apply transformations
  ctx.save();
  ctx.translate(cropCanvas.width / 2, cropCanvas.height / 2);

  if (normRot !== 0) {
    ctx.rotate((normRot * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);

  // Draw source slice onto canvas
  ctx.drawImage(
    img,
    x,
    y,
    cw,
    ch,
    -cw / 2,
    -ch / 2,
    cw,
    ch
  );
  ctx.restore();

  // Export to Blob
  const blob = await new Promise((resolve, reject) => {
    cropCanvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to export cropped image to blob."));
      },
      format,
      quality
    );
  });

  const dataUrl = cropCanvas.toDataURL(format, quality);

  return {
    blob,
    dataUrl,
    width: cropCanvas.width,
    height: cropCanvas.height,
    size: blob.size,
    originalSize,
  };
}
