import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * Inserts formatted page numbers into each page of a PDF document.
 * 
 * @param {ArrayBuffer | Uint8Array} pdfBytes
 * @param {object} [options]
 * @param {string} [options.position='bottom-center'] - 'bottom-center'|'bottom-right'|'bottom-left'|'top-center'|'top-right'|'top-left'
 * @param {string} [options.format='page-x-of-y'] - 'page-x-of-y'|'x-of-y'|'page-x'|'x'|'-x-'
 * @param {number} [options.fontSize=10]
 * @param {number} [options.margin=30] - Distance in points from page edges
 * @param {number} [options.startPageNumber=1] - Number to display for first numbered page
 * @param {boolean} [options.skipFirstPage=false] - Skip cover page
 * @param {object} [options.color] - { r: 0.2, g: 0.2, b: 0.2 }
 * @returns {Promise<{ pdfBytes: Uint8Array, pageCount: number, modifiedPages: number }>}
 */
export async function addPageNumbersToPdf(pdfBytes, options = {}) {
  const {
    position = "bottom-center",
    format = "page-x-of-y",
    fontSize = 10,
    margin = 30,
    startPageNumber = 1,
    skipFirstPage = false,
    color = { r: 0.25, g: 0.25, b: 0.25 },
  } = options;

  if (!pdfBytes || pdfBytes.byteLength === 0) {
    throw new Error("Invalid PDF buffer: buffer is empty.");
  }

  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: false });
  if (doc.isEncrypted) {
    throw new Error("This PDF document is password-protected. Please unlock it before adding page numbers.");
  }

  const pageCount = doc.getPageCount();
  if (pageCount === 0) {
    throw new Error("This PDF document contains 0 pages.");
  }

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const textColor = rgb(color.r ?? 0.25, color.g ?? 0.25, color.b ?? 0.25);
  let modifiedCount = 0;

  const totalNumberedPages = skipFirstPage ? Math.max(1, pageCount - 1) : pageCount;

  for (let i = 0; i < pageCount; i++) {
    if (i === 0 && skipFirstPage) {
      continue;
    }

    const page = doc.getPage(i);
    const { width, height } = page.getSize();

    // Determine sequence number
    const currentNum = (i - (skipFirstPage ? 1 : 0)) + startPageNumber;

    // Format text
    let label = "";
    switch (format) {
      case "page-x-of-y":
        label = `Page ${currentNum} of ${totalNumberedPages}`;
        break;
      case "x-of-y":
        label = `${currentNum} of ${totalNumberedPages}`;
        break;
      case "page-x":
        label = `Page ${currentNum}`;
        break;
      case "x":
        label = `${currentNum}`;
        break;
      case "-x-":
        label = `- ${currentNum} -`;
        break;
      default:
        label = `Page ${currentNum} of ${totalNumberedPages}`;
    }

    const textWidth = font.widthOfTextAtSize(label, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    // Calculate coordinates
    let x = margin;
    let y = margin;

    if (position.includes("center")) {
      x = (width - textWidth) / 2;
    } else if (position.includes("right")) {
      x = width - margin - textWidth;
    } else {
      // left
      x = margin;
    }

    if (position.startsWith("top")) {
      y = height - margin - textHeight;
    } else {
      // bottom
      y = margin;
    }

    page.drawText(label, {
      x,
      y,
      size: fontSize,
      font,
      color: textColor,
    });

    modifiedCount++;
  }

  const outputBytes = await doc.save();
  return {
    pdfBytes: outputBytes,
    pageCount,
    modifiedPages: modifiedCount,
  };
}
