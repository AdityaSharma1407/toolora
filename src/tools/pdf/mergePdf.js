import { PDFDocument } from "pdf-lib";
import { hasValidPdfHeader } from "./validatePdf.js";

/**
 * Merge multiple PDF documents into a single document.
 * Works both in modern browsers and Node.js environments.
 *
 * @param {Array<{ name: string, data: ArrayBuffer | Uint8Array | Buffer | File }>} files
 * @param {Function} [onProgress] - Optional callback ({ current, total, message, percent })
 * @returns {Promise<{
 *   bytes: Uint8Array,
 *   pageCount: number,
 *   byteLength: number,
 *   sourceCount: number,
 *   pageBreakdown: Array<{ name: string, pages: number }>
 * }>}
 */
export async function mergePdfDocuments(files, onProgress = null) {
  if (!Array.isArray(files) || files.length < 2) {
    throw new Error("At least two PDF files are required to perform a merge.");
  }

  const mergedPdf = await PDFDocument.create();
  const pageBreakdown = [];
  const total = files.length;

  for (let index = 0; index < files.length; index++) {
    const item = files[index];
    const fileName = item.name || `Document ${index + 1}`;

    if (onProgress) {
      onProgress({
        current: index + 1,
        total,
        percent: Math.round(((index + 0.2) / total) * 100),
        message: `Reading and validating "${fileName}" (${index + 1} of ${total})...`,
      });
    }

    // 1. Resolve buffer
    let rawBuffer;
    if (item.data instanceof Uint8Array || item.data instanceof ArrayBuffer) {
      rawBuffer = item.data;
    } else if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(item.data)) {
      rawBuffer = item.data;
    } else if (item.data && typeof item.data.arrayBuffer === "function") {
      // Browser File or Blob
      rawBuffer = await item.data.arrayBuffer();
    } else if (item.file && typeof item.file.arrayBuffer === "function") {
      rawBuffer = await item.file.arrayBuffer();
    } else {
      throw new Error(`Invalid data format for file "${fileName}".`);
    }

    // 2. Validate header signature
    if (!hasValidPdfHeader(rawBuffer)) {
      throw new Error(
        `"${fileName}" is corrupted or is not a genuine PDF document (missing %PDF- header).`
      );
    }

    // 3. Load PDF with pdf-lib
    let srcDoc;
    try {
      srcDoc = await PDFDocument.load(rawBuffer, {
        ignoreEncryption: false,
        updateMetadata: false,
      });
    } catch (err) {
      const errMsg = err?.message || "";
      if (
        errMsg.toLowerCase().includes("password") ||
        errMsg.toLowerCase().includes("encrypt") ||
        errMsg.toLowerCase().includes("key")
      ) {
        throw new Error(
          `"${fileName}" is password-protected or encrypted. Please unlock the file before merging.`
        );
      }
      throw new Error(
        `Failed to parse "${fileName}". The file may be damaged or use an unsupported PDF feature.`
      );
    }

    // 4. Verify encryption state
    if (srcDoc.isEncrypted) {
      throw new Error(
        `"${fileName}" is password-protected. Toolora cannot merge encrypted documents.`
      );
    }

    // 5. Check page count
    const pageCount = srcDoc.getPageCount();
    if (pageCount === 0) {
      throw new Error(
        `"${fileName}" has 0 pages and cannot be included in the merged document.`
      );
    }

    if (onProgress) {
      onProgress({
        current: index + 1,
        total,
        percent: Math.round(((index + 0.7) / total) * 100),
        message: `Appending ${pageCount} page${pageCount > 1 ? "s" : ""} from "${fileName}"...`,
      });
    }

    // 6. Copy pages in order
    const pageIndices = srcDoc.getPageIndices();
    const copiedPages = await mergedPdf.copyPages(srcDoc, pageIndices);
    for (const page of copiedPages) {
      mergedPdf.addPage(page);
    }

    pageBreakdown.push({
      name: fileName,
      pages: pageCount,
    });
  }

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percent: 98,
      message: "Finalizing combined PDF document...",
    });
  }

  // 7. Save output bytes
  const mergedPdfBytes = await mergedPdf.save({
    useObjectStreams: true,
  });

  const finalPageCount = mergedPdf.getPageCount();

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percent: 100,
      message: "Merge complete! Preparing your download...",
    });
  }

  return {
    bytes: mergedPdfBytes,
    pageCount: finalPageCount,
    byteLength: mergedPdfBytes.byteLength,
    sourceCount: files.length,
    pageBreakdown,
  };
}
