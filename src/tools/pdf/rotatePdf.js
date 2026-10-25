import { PDFDocument, degrees } from "pdf-lib";

/**
 * Normalizes an angle into one of [0, 90, 180, 270].
 * @param {number} angle
 * @returns {number}
 */
export function normalizeAngle(angle) {
  const mod = angle % 360;
  const normalized = mod < 0 ? mod + 360 : mod;
  return normalized === 0 ? 0 : normalized;
}

/**
 * Rotates specific or all pages in a PDF document.
 * Operates purely on vector level using native PDF page rotation dictionary.
 * Does NOT rasterize pages, preserving 100% of text, fonts, and vector quality.
 *
 * @param {ArrayBuffer | Uint8Array} pdfBuffer - Input PDF bytes
 * @param {Object|number} rotations - Either a single number to rotate all pages,
 *                                    or a map of { [0-based pageIndex]: degreesDelta }
 * @param {Object} [options]
 * @param {string} [options.baseName] - Original file name for output naming
 * @param {Function} [onProgress] - Optional progress callback ({ percent, message })
 * @returns {Promise<{ bytes: Uint8Array, pageCount: number, filename: string }>}
 */
export async function rotatePdfDocument(pdfBuffer, rotations, options = {}, onProgress = null) {
  if (!pdfBuffer || pdfBuffer.byteLength === 0) {
    throw new Error("Invalid PDF: The provided document is empty.");
  }

  if (onProgress) onProgress({ percent: 15, message: "Reading PDF document structure..." });

  const doc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: false });
  if (doc.isEncrypted) {
    throw new Error("This PDF document is password-protected. Please unlock it before rotating.");
  }

  const pageCount = doc.getPageCount();
  if (pageCount === 0) {
    throw new Error("The provided PDF contains 0 pages.");
  }

  const isGlobalRotation = typeof rotations === "number";

  if (onProgress) onProgress({ percent: 45, message: "Applying orientation transformations..." });

  const pages = doc.getPages();
  for (let i = 0; i < pageCount; i++) {
    let delta = 0;
    if (isGlobalRotation) {
      delta = rotations;
    } else if (rotations && typeof rotations === "object") {
      delta = Number(rotations[i]) || 0;
    }

    if (delta !== 0) {
      const page = pages[i];
      const currentAngle = page.getRotation().angle || 0;
      const newAngle = normalizeAngle(currentAngle + delta);
      page.setRotation(degrees(newAngle));
    }

    if (onProgress && pageCount > 5) {
      const pct = 45 + Math.round(((i + 1) / pageCount) * 40);
      onProgress({ percent: pct, message: `Processing page ${i + 1} of ${pageCount}...` });
    }
  }

  if (onProgress) onProgress({ percent: 90, message: "Compiling rotated document..." });

  const bytes = await doc.save({ useObjectStreams: true });

  const baseName = options.baseName ? options.baseName.replace(/\.pdf$/i, "") : "document";
  const filename = `${baseName}-rotated.pdf`;

  if (onProgress) onProgress({ percent: 100, message: "Document ready for download!" });

  return {
    bytes,
    pageCount,
    filename,
  };
}
