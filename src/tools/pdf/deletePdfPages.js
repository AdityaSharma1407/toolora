import { PDFDocument } from "pdf-lib";

/**
 * Deletes selected pages from a PDF document and compiles a clean document with remaining pages.
 * Preserves vector graphics, annotations, and page dimensions of retained pages.
 * Strictly guarantees that at least one page is retained.
 *
 * @param {ArrayBuffer | Uint8Array} pdfBuffer - Input PDF bytes
 * @param {number[] | Set<number>} pagesToDelete - 0-based page indices to remove
 * @param {Object} [options]
 * @param {string} [options.baseName] - Original file name for output naming
 * @param {Function} [onProgress] - Optional progress callback ({ percent, message })
 * @returns {Promise<{ bytes: Uint8Array, originalPageCount: number, retainedPageCount: number, deletedCount: number, filename: string }>}
 */
export async function deletePdfPages(pdfBuffer, pagesToDelete, options = {}, onProgress = null) {
  if (!pdfBuffer || pdfBuffer.byteLength === 0) {
    throw new Error("Invalid PDF: The provided document is empty.");
  }

  if (onProgress) onProgress({ percent: 15, message: "Inspecting PDF document structure..." });

  const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: false });
  if (srcDoc.isEncrypted) {
    throw new Error("This PDF document is password-protected. Please unlock it before deleting pages.");
  }

  const totalPages = srcDoc.getPageCount();
  if (totalPages === 0) {
    throw new Error("The provided PDF contains 0 pages.");
  }

  const deleteSet = new Set(
    Array.isArray(pagesToDelete) ? pagesToDelete : Array.from(pagesToDelete || [])
  );

  const retainedIndices = [];
  for (let i = 0; i < totalPages; i++) {
    if (!deleteSet.has(i)) {
      retainedIndices.push(i);
    }
  }

  if (retainedIndices.length === 0) {
    throw new Error("A PDF document must retain at least one page. You cannot delete every page.");
  }

  if (deleteSet.size === 0) {
    throw new Error("No pages were selected for deletion.");
  }

  if (onProgress) onProgress({ percent: 40, message: `Extracting ${retainedIndices.length} retained pages...` });

  const outputDoc = await PDFDocument.create();
  const copiedPages = await outputDoc.copyPages(srcDoc, retainedIndices);

  for (let idx = 0; idx < copiedPages.length; idx++) {
    outputDoc.addPage(copiedPages[idx]);
    if (onProgress && copiedPages.length > 5) {
      const pct = 40 + Math.round(((idx + 1) / copiedPages.length) * 45);
      onProgress({ percent: pct, message: `Copying page ${idx + 1} of ${copiedPages.length}...` });
    }
  }

  if (onProgress) onProgress({ percent: 90, message: "Compiling updated PDF document..." });

  const bytes = await outputDoc.save({ useObjectStreams: true });

  const baseName = options.baseName ? options.baseName.replace(/\.pdf$/i, "") : "document";
  const filename = `${baseName}-pages-removed.pdf`;

  if (onProgress) onProgress({ percent: 100, message: "Modified document ready for download!" });

  return {
    bytes,
    originalPageCount: totalPages,
    retainedPageCount: retainedIndices.length,
    deletedCount: totalPages - retainedIndices.length,
    filename,
  };
}
