import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { hasValidPdfHeader } from "./validatePdf.js";

/**
 * Parses and validates user page range input against document page count.
 * Example inputs: "1, 3, 5", "1-4", "1-3, 7, 9-11".
 *
 * @param {string} rangeStr
 * @param {number} totalPages
 * @returns {number[]} 0-based page indices in requested order
 */
export function parsePageRange(rangeStr, totalPages) {
  if (!rangeStr || typeof rangeStr !== "string") {
    throw new Error("Please specify at least one page number or range to extract.");
  }

  const trimmed = rangeStr.trim();
  if (!trimmed) {
    throw new Error("Page selection cannot be empty.");
  }

  const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) {
    throw new Error("Invalid page format. Use numbers or ranges separated by commas (e.g. 1-3, 5).");
  }

  const selectedIndices = [];
  const seenIndices = new Set();

  for (const part of parts) {
    if (part.includes("-")) {
      const rangeParts = part.split("-").map((p) => p.trim());
      if (rangeParts.length !== 2) {
        throw new Error(`Malformed range "${part}". Use format: "start-end" (e.g. 1-5).`);
      }

      const start = parseInt(rangeParts[0], 10);
      const end = parseInt(rangeParts[1], 10);

      if (isNaN(start) || isNaN(end)) {
        throw new Error(`Invalid range numbers in "${part}". Both start and end must be integers.`);
      }

      if (start < 1) {
        throw new Error(`Page numbers must be 1 or greater. Received "${start}".`);
      }

      if (end > totalPages) {
        throw new Error(
          `Page ${end} exceeds total document pages (${totalPages}).`
        );
      }

      if (start > end) {
        throw new Error(
          `Invalid range "${part}": start page (${start}) must be less than or equal to end page (${end}).`
        );
      }

      for (let p = start; p <= end; p++) {
        const index = p - 1;
        if (!seenIndices.has(index)) {
          seenIndices.add(index);
          selectedIndices.push(index);
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (isNaN(pageNum)) {
        throw new Error(`"${part}" is not a valid page number.`);
      }

      if (pageNum < 1) {
        throw new Error(`Page numbers must be 1 or greater. Received "${pageNum}".`);
      }

      if (pageNum > totalPages) {
        throw new Error(
          `Page ${pageNum} exceeds total document pages (${totalPages}).`
        );
      }

      const index = pageNum - 1;
      if (!seenIndices.has(index)) {
        seenIndices.add(index);
        selectedIndices.push(index);
      }
    }
  }

  if (selectedIndices.length === 0) {
    throw new Error("No valid pages were selected for extraction.");
  }

  return selectedIndices;
}

/**
 * Split a PDF document either by extracting selected ranges or splitting into individual files.
 *
 * @param {ArrayBuffer | Uint8Array | Buffer | File} fileData
 * @param {object} options
 * @param {'extract' | 'split-all'} options.mode - 'extract' or 'split-all'
 * @param {string} [options.ranges] - Range string for 'extract' mode (e.g. '1-3, 5')
 * @param {string} [options.baseName] - Original file name for output naming
 * @param {Function} [onProgress] - Callback ({ percent, message })
 * @returns {Promise<{
 *   type: 'pdf' | 'zip',
 *   bytes: Uint8Array,
 *   filename: string,
 *   pageCount: number,
 *   fileCount: number,
 *   totalPages: number,
 *   selectedPages?: number[]
 * }>}
 */
export async function splitPdfDocument(fileData, options = {}, onProgress = null) {
  const { mode = "extract", ranges = "", baseName = "document" } = options;

  if (onProgress) {
    onProgress({ percent: 10, message: "Reading and validating PDF document..." });
  }

  // 1. Resolve buffer
  let rawBuffer;
  if (fileData instanceof Uint8Array || fileData instanceof ArrayBuffer) {
    rawBuffer = fileData;
  } else if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(fileData)) {
    rawBuffer = fileData;
  } else if (fileData && typeof fileData.arrayBuffer === "function") {
    rawBuffer = await fileData.arrayBuffer();
  } else {
    throw new Error("Invalid input data format.");
  }

  // 2. Validate PDF signature
  if (!hasValidPdfHeader(rawBuffer)) {
    throw new Error("The file is corrupted or is not a valid PDF document (missing %PDF- header).");
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
      throw new Error("This PDF is password-protected or encrypted. Please unlock it before splitting.");
    }
    throw new Error("Failed to parse the PDF document. The file may be damaged or corrupted.");
  }

  if (srcDoc.isEncrypted) {
    throw new Error("This PDF is password-protected. Bits & Tools cannot split encrypted documents.");
  }

  const totalPages = srcDoc.getPageCount();
  if (totalPages === 0) {
    throw new Error("This PDF has 0 pages and cannot be split.");
  }

  const cleanBaseName = baseName.replace(/\.pdf$/i, "");

  // MODE A: Extract selected pages
  if (mode === "extract") {
    const pageIndices = parsePageRange(ranges, totalPages);

    if (onProgress) {
      onProgress({
        percent: 40,
        message: `Extracting ${pageIndices.length} selected page${pageIndices.length > 1 ? "s" : ""}...`,
      });
    }

    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);

    for (const page of copiedPages) {
      newDoc.addPage(page);
    }

    if (onProgress) {
      onProgress({ percent: 85, message: "Finalizing extracted document..." });
    }

    const outputBytes = await newDoc.save({ useObjectStreams: true });

    if (onProgress) {
      onProgress({ percent: 100, message: "Extraction complete!" });
    }

    return {
      type: "pdf",
      bytes: outputBytes,
      filename: `${cleanBaseName}-extracted.pdf`,
      pageCount: pageIndices.length,
      fileCount: 1,
      totalPages,
      selectedPages: pageIndices.map((i) => i + 1),
    };
  }

  // MODE B: Split into individual pages packaged in a ZIP
  if (mode === "split-all") {
    const zip = new JSZip();

    for (let i = 0; i < totalPages; i++) {
      const pageNum = i + 1;
      const percent = Math.round(20 + ((i + 1) / totalPages) * 60);

      if (onProgress) {
        onProgress({
          percent,
          message: `Splitting page ${pageNum} of ${totalPages}...`,
        });
      }

      const singlePageDoc = await PDFDocument.create();
      const [copiedPage] = await singlePageDoc.copyPages(srcDoc, [i]);
      singlePageDoc.addPage(copiedPage);

      const singlePageBytes = await singlePageDoc.save({ useObjectStreams: true });
      const paddedNum = String(pageNum).padStart(totalPages >= 100 ? 3 : 2, "0");
      zip.file(`${cleanBaseName}-page-${paddedNum}.pdf`, singlePageBytes);
    }

    if (onProgress) {
      onProgress({ percent: 90, message: "Compressing individual pages into ZIP archive..." });
    }

    const zipBytes = await zip.generateAsync({
      type: "uint8array",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    if (onProgress) {
      onProgress({ percent: 100, message: "Split complete!" });
    }

    return {
      type: "zip",
      bytes: zipBytes,
      filename: `${cleanBaseName}-pages.zip`,
      pageCount: totalPages,
      fileCount: totalPages,
      totalPages,
    };
  }

  throw new Error(`Unsupported split mode "${mode}".`);
}
