import * as pdfLib from "pdf-lib";
import { configure, unlockInPlace } from "pdf-lib-encrypt";

// Initialize pdf-lib integration
configure(pdfLib);

/**
 * Checks whether a given PDF buffer is encrypted / password-protected.
 * @param {ArrayBuffer | Uint8Array} pdfBytes
 * @returns {Promise<boolean>}
 */
export async function isPdfEncrypted(pdfBytes) {
  if (!pdfBytes || pdfBytes.byteLength === 0) return false;
  try {
    const doc = await pdfLib.PDFDocument.load(pdfBytes, { ignoreEncryption: false });
    return Boolean(doc.isEncrypted);
  } catch (err) {
    if (err.name === "EncryptedPDFError" || err.message?.toLowerCase().includes("encrypted")) {
      return true;
    }
    return false;
  }
}

/**
 * Decrypts and permanently unlocks a password-protected or restricted PDF document.
 * 
 * @param {ArrayBuffer | Uint8Array} pdfBytes
 * @param {string} [password=''] - The document password
 * @returns {Promise<{ pdfBytes: Uint8Array, pageCount: number }>}
 */
export async function unlockPdfDocument(pdfBytes, password = "") {
  if (!pdfBytes || pdfBytes.byteLength === 0) {
    throw new Error("Invalid PDF buffer: buffer is empty.");
  }

  // Load with ignoreEncryption so streams can be accessed for decryption
  let doc;
  try {
    doc = await pdfLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  } catch (err) {
    throw new Error("Failed to load PDF document: " + err.message);
  }

  // Attempt to remove encryption
  try {
    const unlocked = await unlockInPlace(doc, password ? password.trim() : "");
    // If unlocked is false, document had no encryption dictionary to remove
  } catch (err) {
    if (err.message?.toLowerCase().includes("wrong password")) {
      throw new Error("Incorrect password. Please verify the password and try again.");
    }
    throw new Error(err.message || "Failed to unlock PDF document.");
  }

  const pageCount = doc.getPageCount();
  const outputBytes = await doc.save();

  return {
    pdfBytes: outputBytes,
    pageCount,
  };
}
