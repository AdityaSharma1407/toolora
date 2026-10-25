import JSZip from "jszip";

let pdfjsLibPromise = null;

/**
 * Initializes and returns the PDF.js library instance in the browser.
 * Configures the local web worker to avoid external CDN requests.
 */
export async function getPdfJs() {
  if (typeof window === "undefined") {
    throw new Error("PDF.js rendering can only be executed in a browser environment.");
  }

  if (!pdfjsLibPromise) {
    pdfjsLibPromise = (async () => {
      const pdfjs = await import("pdfjs-dist/build/pdf.js");
      const lib = pdfjs.default || pdfjs;
      if (!lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      }
      return lib;
    })();
  }

  return pdfjsLibPromise;
}

/**
 * Quality and scale resolution mapping.
 */
export const JPG_QUALITY_PRESETS = {
  standard: {
    label: "Standard Quality (150 DPI)",
    scale: 1.5,
    quality: 0.85,
    description: "Ideal for web sharing, emails, and compact file sizes.",
  },
  high: {
    label: "High Quality (225 DPI)",
    scale: 2.25,
    quality: 0.92,
    description: "Balanced crispness, ideal for presentations and archiving.",
  },
  "very-high": {
    label: "Maximum Quality (300 DPI)",
    scale: 3.0,
    quality: 0.96,
    description: "Ultra-sharp rendering, ideal for high-resolution printing.",
  },
};

/**
 * Clones binary data into a fresh, un-detached ArrayBuffer copy.
 * This prevents PDF.js Web Worker postMessage transferable object transfer
 * from detaching the caller's ArrayBuffer.
 *
 * @param {ArrayBuffer | Uint8Array | ArrayBufferView} input
 * @returns {Uint8Array}
 */
export function cloneBinaryData(input) {
  if (!input) {
    throw new Error("No PDF binary data provided.");
  }

  // If input is an ArrayBuffer
  if (input instanceof ArrayBuffer) {
    if (input.byteLength === 0) {
      throw new Error("ArrayBuffer is detached or empty (byteLength is 0).");
    }
    return new Uint8Array(input.slice(0));
  }

  // If input is a Uint8Array or other TypedArray/DataView
  if (ArrayBuffer.isView(input)) {
    if (input.byteLength === 0 || input.buffer.byteLength === 0) {
      throw new Error("ArrayBufferView is detached or empty (byteLength is 0).");
    }
    const copy = new Uint8Array(input.byteLength);
    copy.set(new Uint8Array(input.buffer, input.byteOffset, input.byteLength));
    return copy;
  }

  return new Uint8Array(input);
}

/**
 * Loads a PDF document instance from an ArrayBuffer using PDF.js.
 * @param {ArrayBuffer | Uint8Array} arrayBuffer
 * @returns {Promise<any>}
 */
export async function loadPdfJsDoc(arrayBuffer) {
  const lib = await getPdfJs();
  const safeData = cloneBinaryData(arrayBuffer);
  const loadingTask = lib.getDocument({
    data: safeData,
    cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/",
    cMapPacked: true,
  });
  return await loadingTask.promise;
}

/**
 * Renders a thumbnail preview for a single PDF page.
 *
 * @param {any} pdfDoc - Loaded PDF.js document instance
 * @param {number} pageNumber - 1-based page number
 * @param {number} [maxDimension=240] - Maximum thumbnail width or height in pixels
 * @param {number} [rotationOffset=0] - Additional rotation angle (0, 90, 180, 270)
 * @returns {Promise<{ dataUrl: string, width: number, height: number, aspectRatio: number }>}
 */
export async function renderPageThumbnail(pdfDoc, pageNumber, maxDimension = 240, rotationOffset = 0) {
  const page = await pdfDoc.getPage(pageNumber);
  const unscaledViewport = page.getViewport({ scale: 1.0, rotation: (page.rotate + rotationOffset) % 360 });

  const maxSide = Math.max(unscaledViewport.width, unscaledViewport.height);
  const scale = maxDimension / maxSide;
  const viewport = page.getViewport({ scale, rotation: (page.rotate + rotationOffset) % 360 });

  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  const ctx = canvas.getContext("2d", { alpha: false });
  // Fill white canvas background in case page has transparent background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: ctx,
    viewport,
  }).promise;

  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);

  // Clean up canvas memory immediately
  canvas.width = 0;
  canvas.height = 0;
  page.cleanup();

  return {
    dataUrl,
    width: Math.floor(viewport.width),
    height: Math.floor(viewport.height),
    aspectRatio: unscaledViewport.width / unscaledViewport.height,
  };
}

/**
 * Converts selected or all pages of a PDF into high-quality JPG image blobs.
 *
 * @param {ArrayBuffer} arrayBuffer - Input PDF buffer
 * @param {Object} options
 * @param {number[]|string} [options.pages='all'] - 1-based page numbers array or 'all'
 * @param {'standard'|'high'|'very-high'} [options.quality='high'] - Resolution preset
 * @param {string} [options.baseName='document'] - Base filename for generated images
 * @param {Function} [onProgress] - Progress callback ({ current, total, percent, message })
 * @returns {Promise<Array<{ pageNumber: number, blob: Blob, url: string, filename: string, width: number, height: number, sizeBytes: number }>>}
 */
export async function convertPdfToJpg(arrayBuffer, options = {}, onProgress = null) {
  if (typeof window === "undefined") {
    throw new Error("PDF to JPG conversion runs purely client-side in the browser.");
  }

  if (onProgress) onProgress({ current: 0, total: 1, percent: 5, message: "Initializing document renderer..." });

  const pdfDoc = await loadPdfJsDoc(arrayBuffer);
  try {
    const totalPages = pdfDoc.numPages;

    if (totalPages === 0) {
      throw new Error("The selected PDF document contains 0 pages.");
    }

    // Determine pages to render
    let targetPages = [];
    if (options.pages === "all" || !options.pages) {
      targetPages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (Array.isArray(options.pages)) {
      targetPages = options.pages.filter((p) => typeof p === "number" && p >= 1 && p <= totalPages);
    }

    if (targetPages.length === 0) {
      throw new Error("No valid pages were selected for conversion.");
    }

    const qualityPreset = JPG_QUALITY_PRESETS[options.quality] || JPG_QUALITY_PRESETS.high;
    const baseName = (options.baseName || "document").replace(/\.pdf$/i, "");

    const results = [];
    const totalToRender = targetPages.length;

    for (let i = 0; i < totalToRender; i++) {
      const pageNum = targetPages[i];
      const pct = 10 + Math.round(((i + 1) / totalToRender) * 85);

      if (onProgress) {
        onProgress({
          current: i + 1,
          total: totalToRender,
          percent: pct,
          message: `Rendering page ${pageNum} (${i + 1} of ${totalToRender})...`,
        });
      }

      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: qualityPreset.scale, rotation: page.rotate });

      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      const ctx = canvas.getContext("2d", { alpha: false });
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      const blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/jpeg", qualityPreset.quality);
      });

      const url = URL.createObjectURL(blob);
      const filename = `${baseName}-page-${String(pageNum).padStart(2, "0")}.jpg`;

      results.push({
        pageNumber: pageNum,
        blob,
        url,
        filename,
        width: Math.floor(viewport.width),
        height: Math.floor(viewport.height),
        sizeBytes: blob.size,
      });

      // Cleanup resources for this page
      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();

      // Yield to browser event loop to keep the UI completely smooth
      await new Promise((resolve) => setTimeout(resolve, 15));
    }

    if (onProgress) {
      onProgress({
        current: totalToRender,
        total: totalToRender,
        percent: 100,
        message: `Successfully converted ${totalToRender} pages to JPG!`,
      });
    }

    return results;
  } finally {
    try {
      pdfDoc.destroy();
    } catch (_) {}
  }
}

/**
 * Packages an array of converted JPG files into a single ZIP archive using JSZip.
 *
 * @param {Array<{ filename: string, blob: Blob }>} jpgList
 * @param {string} baseName
 * @param {Function} [onProgress]
 * @returns {Promise<{ blob: Blob, url: string, filename: string, sizeBytes: number }>}
 */
export async function packageJpgsToZip(jpgList, baseName = "converted-pages", onProgress = null) {
  if (!jpgList || jpgList.length === 0) {
    throw new Error("No images available to package into ZIP.");
  }

  const zip = new JSZip();
  const cleanName = baseName.replace(/\.pdf$/i, "");

  for (const item of jpgList) {
    zip.file(item.filename, item.blob);
  }

  const zipBlob = await zip.generateAsync(
    {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress({
          percent: Math.round(metadata.percent),
          message: `Packaging ZIP archive (${Math.round(metadata.percent)}%)...`,
        });
      }
    }
  );

  const url = URL.createObjectURL(zipBlob);
  const filename = `${cleanName}-jpg-images.zip`;

  return {
    blob: zipBlob,
    url,
    filename,
    sizeBytes: zipBlob.size,
  };
}
