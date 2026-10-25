import { PDFDocument } from "pdf-lib";

/**
 * Reorders pages within a PDF document according to a specified sequence of indices.
 * Preserves 100% of page vectors, text, form fields, and rotations.
 *
 * @param {ArrayBuffer | Uint8Array} pdfBuffer - Input PDF bytes
 * @param {number[]} newOrderIndices - Array of 0-based page indices representing the new arrangement
 * @param {Object} [options]
 * @param {string} [options.baseName] - Original file name for output naming
 * @param {Function} [onProgress] - Optional progress callback ({ percent, message })
 * @returns {Promise<{ bytes: Uint8Array, pageCount: number, filename: string }>}
 */
export async function reorderPdfPages(pdfBuffer, newOrderIndices, options = {}, onProgress = null) {
  if (!pdfBuffer || pdfBuffer.byteLength === 0) {
    throw new Error("Invalid PDF: The provided document is empty.");
  }

  if (!Array.isArray(newOrderIndices) || newOrderIndices.length === 0) {
    throw new Error("Invalid page order: No page order sequence provided.");
  }

  if (onProgress) onProgress({ percent: 15, message: "Inspecting PDF document structure..." });

  const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: false });
  if (srcDoc.isEncrypted) {
    throw new Error("This PDF document is password-protected. Please unlock it before reordering pages.");
  }

  const totalPages = srcDoc.getPageCount();
  if (totalPages === 0) {
    throw new Error("The provided PDF contains 0 pages.");
  }

  if (newOrderIndices.length !== totalPages) {
    throw new Error(
      `Invalid sequence length: Expected ${totalPages} pages, but received ${newOrderIndices.length}.`
    );
  }

  // Validate that every index is in bounds and unique
  const seen = new Set();
  for (const idx of newOrderIndices) {
    if (typeof idx !== "number" || isNaN(idx) || idx < 0 || idx >= totalPages) {
      throw new Error(`Invalid page index (${idx}): Must be between 0 and ${totalPages - 1}.`);
    }
    if (seen.has(idx)) {
      throw new Error(`Duplicate page index detected (${idx + 1}). Each page must appear exactly once.`);
    }
    seen.add(idx);
  }

  if (onProgress) onProgress({ percent: 40, message: `Reordering ${totalPages} pages into custom arrangement...` });

  const outputDoc = await PDFDocument.create();
  const copiedPages = await outputDoc.copyPages(srcDoc, newOrderIndices);

  for (let idx = 0; idx < copiedPages.length; idx++) {
    outputDoc.addPage(copiedPages[idx]);
    if (onProgress && copiedPages.length > 5) {
      const pct = 40 + Math.round(((idx + 1) / copiedPages.length) * 45);
      onProgress({ percent: pct, message: `Positioning page ${idx + 1} of ${copiedPages.length}...` });
    }
  }

  if (onProgress) onProgress({ percent: 90, message: "Compiling reordered PDF document..." });

  const bytes = await outputDoc.save({ useObjectStreams: true });

  const baseName = options.baseName ? options.baseName.replace(/\.pdf$/i, "") : "document";
  const filename = `${baseName}-reordered.pdf`;

  if (onProgress) onProgress({ percent: 100, message: "Reordered document ready for download!" });

  return {
    bytes,
    pageCount: totalPages,
    filename,
  };
}
