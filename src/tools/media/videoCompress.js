/**
 * Client-Side Video Compressor & Resizer Engine.
 * Calculates video dimension scaling, target bitrates, and compression savings.
 * 100% private in browser memory.
 */

export const VIDEO_RESOLUTION_PRESETS = [
  { id: "original", label: "Original Resolution", maxDimension: null },
  { id: "1080p", label: "1080p Full HD (1920×1080)", maxDimension: 1080 },
  { id: "720p", label: "720p HD (1280×720)", maxDimension: 720 },
  { id: "480p", label: "480p SD (854×480)", maxDimension: 480 },
  { id: "360p", label: "360p Compact (640×360)", maxDimension: 360 },
];

export const BITRATE_PRESETS = {
  high: { label: "High Quality (Moderate Size)", multiplier: 1.0, videoBits: 2_500_000 },
  medium: { label: "Balanced (Recommended)", multiplier: 0.6, videoBits: 1_500_000 },
  low: { label: "Maximum Compression", multiplier: 0.35, videoBits: 800_000 },
};

/**
 * Calculates scaled video dimensions maintaining original aspect ratio.
 * @param {number} width
 * @param {number} height
 * @param {number|null} maxDimension - e.g. 720 for 720p
 * @returns {{ width: number, height: number, scale: number }}
 */
export function calculateScaledVideoDimensions(width, height, maxDimension = null) {
  if (!width || !height) return { width: 640, height: 360, scale: 1 };
  if (!maxDimension) {
    // Ensure even dimensions (required by most video encoders)
    return {
      width: width % 2 === 0 ? width : width - 1,
      height: height % 2 === 0 ? height : height - 1,
      scale: 1,
    };
  }

  const isLandscape = width >= height;
  let targetW, targetH;

  if (isLandscape) {
    if (height <= maxDimension) {
      targetW = width;
      targetH = height;
    } else {
      const scale = maxDimension / height;
      targetH = maxDimension;
      targetW = Math.round(width * scale);
    }
  } else {
    if (width <= maxDimension) {
      targetW = width;
      targetH = height;
    } else {
      const scale = maxDimension / width;
      targetW = maxDimension;
      targetH = Math.round(height * scale);
    }
  }

  // Ensure width & height are even numbers (multiples of 2)
  targetW = targetW % 2 === 0 ? targetW : targetW - 1;
  targetH = targetH % 2 === 0 ? targetH : targetH - 1;

  const scale = targetW / width;
  return { width: targetW, height: targetH, scale };
}

/**
 * Estimates resulting file size based on bitrate and duration.
 * @param {number} duration - seconds
 * @param {number} videoBitsPerSecond
 * @param {number} [audioBitsPerSecond=128000]
 * @returns {number} estimated bytes
 */
export function estimateCompressedFileSize(duration, videoBitsPerSecond, audioBitsPerSecond = 128_000) {
  const totalBitsPerSec = videoBitsPerSecond + audioBitsPerSecond;
  const totalBytes = (totalBitsPerSec / 8) * duration;
  return Math.round(totalBytes);
}
