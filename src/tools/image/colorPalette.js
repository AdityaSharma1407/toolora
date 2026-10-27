import { loadImageFromFile } from "./imageResize.js";

/**
 * Client-Side Color Palette Extraction & Color Converter.
 * Analyzes image pixel data via HTML5 Canvas using modified median-cut quantization.
 */

function rgbToHex(r, g, b) {
  const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    css: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
  };
}

function colorDistance(c1, c2) {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Extracts a dominant color palette from an image File or Blob.
 * 
 * @param {Blob | File} file
 * @param {number} [paletteSize=6] - Number of colors to return (e.g. 5 to 10)
 * @returns {Promise<Array<{ hex: string, rgb: { r: number, g: number, b: number }, hsl: { h: number, s: number, l: number, css: string }, isDark: boolean, population: number }>>}
 */
export async function extractPalette(file, paletteSize = 6) {
  const img = await loadImageFromFile(file);

  // Downsample image onto small canvas for fast pixel clustering
  const sampleSize = 120;
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, sampleSize / Math.max(img.width, img.height));
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Failed to get 2D canvas context for color analysis.");
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  // Bucket pixels into a 3D color histogram (quantized to 5 bits per channel for 32k buckets)
  const buckets = new Map();

  for (let i = 0; i < imageData.length; i += 4) {
    const a = imageData[i + 3];
    if (a < 128) continue; // Skip semi-transparent pixels

    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    // Quantize 8-bit to 5-bit
    const qr = (r >> 3) << 3;
    const qg = (g >> 3) << 3;
    const qb = (b >> 3) << 3;
    const key = (qr << 16) | (qg << 8) | qb;

    const count = buckets.get(key) || 0;
    buckets.set(key, count + 1);
  }

  // Sort buckets by popularity
  const sorted = Array.from(buckets.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => {
      const r = (key >> 16) & 0xff;
      const g = (key >> 8) & 0xff;
      const b = key & 0xff;
      return { r, g, b, count };
    });

  // Pick diverse colors with minimum perceptual Euclidean distance
  const selected = [];
  const minDistance = 45; // Minimum color difference threshold

  for (const item of sorted) {
    const candidate = { r: item.r, g: item.g, b: item.b };
    const isDistinct = selected.every((s) => colorDistance(candidate, s.rgb) >= minDistance);

    if (isDistinct || selected.length < 2) {
      const hex = rgbToHex(candidate.r, candidate.g, candidate.b);
      const hsl = rgbToHsl(candidate.r, candidate.g, candidate.b);
      // Perceived luminance (YIQ)
      const yiq = (candidate.r * 299 + candidate.g * 587 + candidate.b * 114) / 1000;
      const isDark = yiq < 140;

      selected.push({
        hex,
        rgb: candidate,
        hsl,
        isDark,
        population: item.count,
      });

      if (selected.length >= paletteSize) break;
    }
  }

  return selected;
}

/**
 * Formats a palette array as CSS variables string.
 */
export function formatCssVariables(palette = []) {
  const lines = [":root {"];
  palette.forEach((c, idx) => {
    lines.push(`  --color-${idx + 1}: ${c.hex};`);
  });
  lines.push("}");
  return lines.join("\n");
}

/**
 * Formats a palette array as Tailwind CSS color object.
 */
export function formatTailwindConfig(palette = []) {
  const obj = {};
  palette.forEach((c, idx) => {
    obj[`brand-${(idx + 1) * 100}`] = c.hex;
  });
  return JSON.stringify(obj, null, 2);
}
