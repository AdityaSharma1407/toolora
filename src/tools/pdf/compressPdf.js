import { PDFDocument, PDFName } from "pdf-lib";
import { hasValidPdfHeader } from "./validatePdf.js";

/**
 * Genuine client-side PDF structural compression and stream optimization.
 *
 * @param {ArrayBuffer | Uint8Array | Buffer | File} fileData
 * @param {object} options
 * @param {'basic' | 'recommended' | 'maximum'} options.level - Compression intensity
 * @param {string} [options.baseName] - Original file name
 * @param {Function} [onProgress] - Callback ({ percent, message })
 * @returns {Promise<{
 *   bytes: Uint8Array,
 *   originalSize: number,
 *   compressedSize: number,
 *   savedBytes: number,
 *   percentSaved: number,
 *   isSmaller: boolean,
 *   pageCount: number,
 *   filename: string,
 *   level: string
 * }>}
 */
export async function compressPdfDocument(fileData, options = {}, onProgress = null) {
  const { level = "recommended", baseName = "document" } = options;

  if (onProgress) {
    onProgress({ percent: 15, message: "Analyzing PDF structure and streams..." });
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
    throw new Error("Invalid file format.");
  }

  const originalSize = rawBuffer.byteLength;

  // 2. Validate header
  if (!hasValidPdfHeader(rawBuffer)) {
    throw new Error("The file is corrupted or is not a genuine PDF document (missing %PDF- header).");
  }

  // 3. Load PDF
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
      throw new Error("This PDF is password-protected or encrypted. Please unlock it before compressing.");
    }
    throw new Error("Failed to parse the PDF document. The file may be damaged or use unsupported features.");
  }

  if (srcDoc.isEncrypted) {
    throw new Error("This PDF is password-protected. Toolora cannot compress encrypted files.");
  }

  const pageCount = srcDoc.getPageCount();
  if (pageCount === 0) {
    throw new Error("This PDF contains 0 pages and cannot be processed.");
  }

  let finalDoc;

  if (level === "basic") {
    // Mode 1: Basic Structural Optimization
    // Clears standard metadata fields and packs objects into streams
    if (onProgress) {
      onProgress({ percent: 45, message: "Cleaning document metadata and unneeded objects..." });
    }
    finalDoc = srcDoc;
    finalDoc.setTitle("");
    finalDoc.setAuthor("");
    finalDoc.setSubject("");
    finalDoc.setKeywords([]);
    finalDoc.setProducer("Toolora Browser Optimizer");
    finalDoc.setCreator("Toolora");
  } else if (level === "recommended") {
    // Mode 2: Recommended Optimization
    // Strips document info dictionary and XML metadata packages
    if (onProgress) {
      onProgress({ percent: 50, message: "Compacting object streams and removing XML metadata..." });
    }
    finalDoc = srcDoc;
    finalDoc.setTitle("");
    finalDoc.setAuthor("");
    finalDoc.setSubject("");
    finalDoc.setKeywords([]);
    finalDoc.setProducer("");
    finalDoc.setCreator("");

    // Remove catalog /Metadata entry if present
    try {
      const catalog = finalDoc.catalog;
      if (catalog && catalog.delete) {
        catalog.delete(PDFName.of("Metadata"));
      }
    } catch {}
  } else {
    // Mode 3: Maximum Reduction
    // Recreates a fresh document and copies all pages over.
    // This purges orphaned objects, old undo revisions, and unreferenced binary streams.
    if (onProgress) {
      onProgress({ percent: 50, message: "Repackaging pages into fresh document to drop orphaned objects..." });
    }

    finalDoc = await PDFDocument.create();
    const pageIndices = srcDoc.getPageIndices();
    const copiedPages = await finalDoc.copyPages(srcDoc, pageIndices);

    for (const page of copiedPages) {
      finalDoc.addPage(page);
    }

    try {
      const catalog = finalDoc.catalog;
      if (catalog && catalog.delete) {
        catalog.delete(PDFName.of("Metadata"));
      }
    } catch {}
  }

  if (onProgress) {
    onProgress({ percent: 80, message: "Writing optimized cross-reference object streams..." });
  }

  // Save using compressed object streams
  const outputBytes = await finalDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const compressedSize = outputBytes.byteLength;
  const savedBytes = originalSize - compressedSize;
  const percentSaved = Number((((originalSize - compressedSize) / originalSize) * 100).toFixed(1));
  const isSmaller = compressedSize < originalSize;

  const cleanBaseName = baseName.replace(/\.pdf$/i, "");

  if (onProgress) {
    onProgress({ percent: 100, message: "Compression complete!" });
  }

  return {
    bytes: outputBytes,
    originalSize,
    compressedSize,
    savedBytes: isSmaller ? savedBytes : 0,
    percentSaved: isSmaller ? percentSaved : 0,
    isSmaller,
    pageCount,
    filename: `${cleanBaseName}-compressed.pdf`,
    level,
  };
}
