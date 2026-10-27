/**
 * Client-Side SVG to PNG Vector Rasterizer.
 * Converts vector SVG files or raw markup into high-resolution PNG or WebP images.
 */

/**
 * Parses SVG string to extract inherent width and height or viewBox.
 * @param {string} svgText
 * @returns {{ width: number, height: number }}
 */
export function getSvgDimensions(svgText = "") {
  let width = 500;
  let height = 500;

  if (typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(svgText, "image/svg+xml");
      const svgEl = xmlDoc.querySelector("svg");

      if (svgEl) {
        const wAttr = svgEl.getAttribute("width");
        const hAttr = svgEl.getAttribute("height");
        const viewBox = svgEl.getAttribute("viewBox");

        if (wAttr && !wAttr.includes("%")) {
          width = parseFloat(wAttr) || width;
        }
        if (hAttr && !hAttr.includes("%")) {
          height = parseFloat(hAttr) || height;
        }

        if ((!wAttr || !hAttr || wAttr.includes("%") || hAttr.includes("%")) && viewBox) {
          const parts = viewBox.trim().split(/[\s,]+/).map(Number);
          if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            width = parts[2];
            height = parts[3];
          }
        }
      }
      return { width: Math.round(width), height: Math.round(height) };
    } catch {
      // Fallback to regex if parsing fails
    }
  }

  // Regex fallback for non-DOM / Node.js environments
  const widthMatch = svgText.match(/width=["']([\d.]+)(?:px)?["']/i);
  const heightMatch = svgText.match(/height=["']([\d.]+)(?:px)?["']/i);
  const viewBoxMatch = svgText.match(/viewBox=["']([-\d.,\s]+)["']/i);

  if (widthMatch) width = parseFloat(widthMatch[1]) || width;
  if (heightMatch) height = parseFloat(heightMatch[1]) || height;

  if ((!widthMatch || !heightMatch) && viewBoxMatch) {
    const parts = viewBoxMatch[1].trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      width = parts[2];
      height = parts[3];
    }
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Converts an SVG string or File into a raster PNG/WebP Blob and DataURL.
 * 
 * @param {string | File} svgSource
 * @param {object} [options]
 * @param {number} [options.scale=2] - Scale multiplier (1, 2, 4, 8)
 * @param {number} [options.customWidth]
 * @param {number} [options.customHeight]
 * @param {string} [options.format='image/png']
 * @param {string} [options.backgroundColor='transparent']
 * @returns {Promise<{ blob: Blob, dataUrl: string, width: number, height: number, size: number }>}
 */
export async function rasterizeSvg(svgSource, options = {}) {
  let svgText = "";
  if (typeof svgSource === "string") {
    svgText = svgSource;
  } else if (svgSource instanceof Blob) {
    svgText = await svgSource.text();
  }

  if (!svgText.trim()) {
    throw new Error("SVG source text or file is empty.");
  }

  const { width: origW, height: origH } = getSvgDimensions(svgText);
  const {
    scale = 2,
    customWidth,
    customHeight,
    format = "image/png",
    backgroundColor = "transparent",
  } = options;

  let targetW = customWidth || Math.round(origW * scale);
  let targetH = customHeight || Math.round(origH * scale);

  targetW = Math.max(1, targetW);
  targetH = Math.max(1, targetH);

  // Convert SVG string to base64 Data URL or Blob URL
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to render SVG image. Please check SVG syntax validity."));
    img.src = url;
  });

  URL.revokeObjectURL(url);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d", { alpha: true });

  if (!ctx) {
    throw new Error("Failed to initialize canvas 2D rendering context.");
  }

  if (backgroundColor && backgroundColor !== "transparent") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, targetW, targetH);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return reject(new Error("Failed to encode raster canvas into PNG blob."));
        }
        const dataUrl = canvas.toDataURL(format);
        resolve({
          blob,
          dataUrl,
          width: targetW,
          height: targetH,
          size: blob.size,
        });
      },
      format,
      1.0
    );
  });
}
