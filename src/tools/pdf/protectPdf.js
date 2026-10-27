import * as pdfLib from "pdf-lib";
import { configure, lock } from "pdf-lib-encrypt";

// Initialize pdf-lib integration
configure(pdfLib);

/**
 * Encrypts and password-protects a PDF document with standard AES-256 encryption.
 * 
 * @param {ArrayBuffer | Uint8Array} pdfBytes
 * @param {string} password - The password required to open/view the PDF
 * @returns {Promise<{ pdfBytes: Uint8Array, pageCount: number }>}
 */
export async function protectPdfDocument(pdfBytes, password) {
  if (!pdfBytes || pdfBytes.byteLength === 0) {
    throw new Error("Invalid PDF buffer: buffer is empty.");
  }

  if (!password || !password.trim()) {
    throw new Error("Please provide a password to protect the PDF.");
  }

  // Check if PDF can be parsed or is already encrypted
  let doc;
  try {
    doc = await pdfLib.PDFDocument.load(pdfBytes, { ignoreEncryption: false });
  } catch (err) {
    if (err.name === "EncryptedPDFError" || err.message?.includes("encrypted")) {
      throw new Error("This PDF document is already password-protected. Please unlock it first.");
    }
    throw new Error("Failed to load PDF document: " + err.message);
  }

  const pageCount = doc.getPageCount();
  if (pageCount === 0) {
    throw new Error("This PDF document contains 0 pages.");
  }

  // Save clean bytes to ensure standardized stream structure
  const savedBytes = await doc.save();

  // Apply AES-256 encryption via pdf-lib-encrypt
  const lockedBytes = await lock(savedBytes, password.trim());

  return {
    pdfBytes: lockedBytes,
    pageCount,
  };
}
