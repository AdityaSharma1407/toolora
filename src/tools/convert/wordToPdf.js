/**
 * Client-Side Word (.docx) to PDF Conversion Engine.
 * Parses Microsoft Word OpenXML (.docx) archives with JSZip and renders
 * structured, paginated PDF documents using pdf-lib.
 * 100% in-browser processing with zero server dependencies.
 */

import JSZip from "jszip";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { PAGE_SIZES, wrapText } from "./htmlToPdf.js";

/**
 * Parses word/document.xml from a docx archive into structured elements.
 * @param {string} xmlText
 * @returns {Array<{ type: string, text: string, isBold?: boolean, isItalic?: boolean }>}
 */
export function parseDocxXml(xmlText) {
  const elements = [];

  // Match each paragraph <w:p>
  const pRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/gi;
  let pMatch;

  while ((pMatch = pRegex.exec(xmlText)) !== null) {
    const pContent = pMatch[1];

    // Check style (Heading1, Heading2, etc.)
    const styleMatch = pContent.match(/<w:pStyle\b[^>]*w:val="([^"]*)"/i);
    const styleVal = styleMatch ? styleMatch[1].toLowerCase() : "";

    let isHeading1 = styleVal.includes("heading1") || styleVal === "1";
    let isHeading2 = styleVal.includes("heading2") || styleVal === "2";
    let isHeading3 = styleVal.includes("heading3") || styleVal === "3";
    let isList = pContent.includes("<w:numPr>");

    // Extract all text runs <w:r>
    const rRegex = /<w:r\b[^>]*>([\s\S]*?)<\/w:r>/gi;
    let rMatch;
    let paragraphText = "";
    let hasBold = false;
    let hasItalic = false;

    while ((rMatch = rRegex.exec(pContent)) !== null) {
      const rContent = rMatch[1];
      if (rContent.includes("<w:b/>") || rContent.includes('<w:b w:val="true"/>')) hasBold = true;
      if (rContent.includes("<w:i/>") || rContent.includes('<w:i w:val="true"/>')) hasItalic = true;

      const tRegex = /<w:t\b[^>]*>([\s\S]*?)<\/w:t>/gi;
      let tMatch;
      while ((tMatch = tRegex.exec(rContent)) !== null) {
        paragraphText += tMatch[1];
      }
    }

    const cleanText = paragraphText
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    if (cleanText) {
      let type = "p";
      if (isHeading1) type = "h1";
      else if (isHeading2) type = "h2";
      else if (isHeading3) type = "h3";
      else if (isList) type = "li";

      elements.push({
        type,
        text: cleanText,
        isBold: hasBold,
        isItalic: hasItalic,
      });
    }
  }

  return elements;
}

/**
 * Converts a .docx File or ArrayBuffer into a PDF document.
 *
 * @param {ArrayBuffer | Uint8Array | Blob} docxInput
 * @param {object} [options]
 * @param {'a4'|'letter'} [options.pageSize='a4']
 * @param {'portrait'|'landscape'} [options.orientation='portrait']
 * @param {number} [options.margin=40]
 * @returns {Promise<{ pdfBytes: Uint8Array, pageCount: number, wordCount: number, size: number }>}
 */
export async function convertWordToPdf(docxInput, options = {}) {
  let buffer;
  if (docxInput instanceof Blob) {
    buffer = await docxInput.arrayBuffer();
  } else if (docxInput instanceof Uint8Array) {
    buffer = docxInput.buffer;
  } else if (docxInput instanceof ArrayBuffer) {
    buffer = docxInput;
  } else {
    throw new Error("Invalid .docx input provided.");
  }

  const zip = await JSZip.loadAsync(buffer);
  const docFile = zip.file("word/document.xml");

  if (!docFile) {
    throw new Error("Invalid Word file: word/document.xml not found inside document package.");
  }

  const xmlText = await docFile.async("text");
  const elements = parseDocxXml(xmlText);

  if (elements.length === 0) {
    throw new Error("The Word document is empty or does not contain readable text.");
  }

  const {
    pageSize = "a4",
    orientation = "portrait",
    margin = 40,
  } = options;

  const sizeDef = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;
  let pageWidth = sizeDef.width;
  let pageHeight = sizeDef.height;

  if (orientation === "landscape") {
    pageWidth = sizeDef.height;
    pageHeight = sizeDef.width;
  }

  const contentWidth = pageWidth - margin * 2;

  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const textColor = rgb(0.12, 0.14, 0.18);
  const brandColor = rgb(0.14, 0.38, 0.92);
  const mutedColor = rgb(0.45, 0.5, 0.55);
  const borderGray = rgb(0.85, 0.88, 0.92);

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - margin;

  const checkPageBreak = (neededHeight) => {
    if (currentY - neededHeight < margin + 25) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      currentY = pageHeight - margin;
    }
  };

  let totalWords = 0;

  for (const el of elements) {
    const words = el.text.split(/\s+/).filter(Boolean);
    totalWords += words.length;

    if (el.type === "h1") {
      const fontSize = 18;
      const lines = wrapText(el.text, contentWidth, fontBold, fontSize);
      checkPageBreak(lines.length * 24 + 16);

      for (const line of lines) {
        currentPage.drawText(line, {
          x: margin,
          y: currentY - fontSize,
          size: fontSize,
          font: fontBold,
          color: brandColor,
        });
        currentY -= 24;
      }
      currentY -= 10;
    } else if (el.type === "h2") {
      const fontSize = 14;
      const lines = wrapText(el.text, contentWidth, fontBold, fontSize);
      checkPageBreak(lines.length * 19 + 12);

      for (const line of lines) {
        currentPage.drawText(line, {
          x: margin,
          y: currentY - fontSize,
          size: fontSize,
          font: fontBold,
          color: textColor,
        });
        currentY -= 19;
      }
      currentY -= 8;
    } else if (el.type === "h3") {
      const fontSize = 12;
      const lines = wrapText(el.text, contentWidth, fontBold, fontSize);
      checkPageBreak(lines.length * 16 + 8);

      for (const line of lines) {
        currentPage.drawText(line, {
          x: margin,
          y: currentY - fontSize,
          size: fontSize,
          font: fontBold,
          color: textColor,
        });
        currentY -= 16;
      }
      currentY -= 6;
    } else if (el.type === "li") {
      const fontSize = 10;
      const bullet = "\u2022 ";
      const bulletW = fontBold.widthOfTextAtSize(bullet, fontSize) + 4;
      const lines = wrapText(el.text, contentWidth - bulletW, fontRegular, fontSize);
      checkPageBreak(lines.length * 15 + 4);

      currentPage.drawText(bullet, {
        x: margin + 6,
        y: currentY - fontSize,
        size: fontSize,
        font: fontBold,
        color: brandColor,
      });

      for (const line of lines) {
        currentPage.drawText(line, {
          x: margin + 6 + bulletW,
          y: currentY - fontSize,
          size: fontSize,
          font: fontRegular,
          color: textColor,
        });
        currentY -= 15;
      }
      currentY -= 4;
    } else {
      // Normal paragraph
      const fontSize = 10;
      const activeFont = el.isBold ? fontBold : el.isItalic ? fontOblique : fontRegular;
      const lines = wrapText(el.text, contentWidth, activeFont, fontSize);
      checkPageBreak(lines.length * 15 + 6);

      for (const line of lines) {
        currentPage.drawText(line, {
          x: margin,
          y: currentY - fontSize,
          size: fontSize,
          font: activeFont,
          color: textColor,
        });
        currentY -= 15;
      }
      currentY -= 6;
    }
  }

  // Running footer
  const totalPages = pdfDoc.getPageCount();
  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const footerText = `Page ${i + 1} of ${totalPages}`;
    const footerSize = 8;
    const footerW = fontRegular.widthOfTextAtSize(footerText, footerSize);

    page.drawText(footerText, {
      x: pageWidth - margin - footerW,
      y: margin / 2,
      size: footerSize,
      font: fontRegular,
      color: mutedColor,
    });

    page.drawLine({
      start: { x: margin, y: margin / 2 + 12 },
      end: { x: pageWidth - margin, y: margin / 2 + 12 },
      thickness: 0.5,
      color: borderGray,
    });
  }

  const pdfBytes = await pdfDoc.save();

  return {
    pdfBytes,
    pageCount: totalPages,
    wordCount: totalWords,
    size: pdfBytes.length,
  };
}
