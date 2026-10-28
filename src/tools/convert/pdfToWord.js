/**
 * Client-Side PDF to Word (.docx) & Text Conversion Engine.
 * Extracts text, typography, and page layout from PDF documents using pdfjs-dist
 * and packages them into clean, editable Microsoft Word (.docx) OpenXML archives via JSZip.
 * 100% private in browser memory.
 */

import JSZip from "jszip";

/**
 * Universal loader for PDF.js supporting both browser and Node.js environments.
 * @param {Uint8Array} data
 * @returns {Promise<any>}
 */
export async function loadPdfDoc(data) {
  let pdfjs;
  if (typeof window !== "undefined") {
    const mod = await import("pdfjs-dist/build/pdf.js");
    pdfjs = mod.default || mod;
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
    }
  } else {
    const mod = await import("pdfjs-dist/legacy/build/pdf.js");
    pdfjs = mod.default || mod;
  }
  return pdfjs.getDocument({ data }).promise;
}

/**
 * Escapes characters for XML insertion.
 * @param {string} str
 * @returns {string}
 */
export function escapeXml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Extracts structured text paragraphs and headings from a PDF document.
 * @param {ArrayBuffer | Uint8Array | Blob} pdfInput
 * @returns {Promise<{ pages: Array<{ pageNum: number, paragraphs: Array<{ text: string, isHeading: boolean }> }>, fullText: string, pageCount: number }>}
 */
export async function extractPdfContent(pdfInput) {
  let uint8Array;
  if (pdfInput instanceof Blob) {
    const buf = await pdfInput.arrayBuffer();
    uint8Array = new Uint8Array(buf);
  } else if (pdfInput instanceof ArrayBuffer) {
    uint8Array = new Uint8Array(pdfInput);
  } else if (pdfInput instanceof Uint8Array) {
    uint8Array = pdfInput;
  } else {
    throw new Error("Invalid PDF input provided.");
  }

  const pdfDoc = await loadPdfDoc(uint8Array);
  const numPages = pdfDoc.numPages;
  const pages = [];
  const fullTextPieces = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items || [];

    if (items.length === 0) {
      pages.push({ pageNum, paragraphs: [] });
      continue;
    }

    // Group items into lines based on Y coordinate
    // Note: PDF coordinates origin is at bottom-left; transform[5] is the Y position
    const lines = [];
    let currentLine = [];
    let lastY = null;

    // Sort items top-to-bottom (descending Y), then left-to-right (ascending X)
    const sortedItems = [...items].sort((a, b) => {
      const yA = a.transform ? a.transform[5] : 0;
      const yB = b.transform ? b.transform[5] : 0;
      if (Math.abs(yA - yB) > 4) {
        return yB - yA; // top to bottom
      }
      const xA = a.transform ? a.transform[4] : 0;
      const xB = b.transform ? b.transform[4] : 0;
      return xA - xB; // left to right
    });

    for (const item of sortedItems) {
      const text = item.str || "";
      if (!text.trim()) continue;

      const y = item.transform ? Math.round(item.transform[5]) : 0;
      const fontSize = Math.abs(item.transform ? item.transform[0] : 10);

      if (lastY === null || Math.abs(y - lastY) <= 4) {
        currentLine.push({ text, fontSize });
      } else {
        if (currentLine.length > 0) lines.push(currentLine);
        currentLine = [{ text, fontSize }];
      }
      lastY = y;
    }
    if (currentLine.length > 0) lines.push(currentLine);

    // Group lines into paragraphs
    const paragraphs = [];
    let currentParagraphText = "";
    let isHeading = false;

    for (let i = 0; i < lines.length; i++) {
      const lineItems = lines[i];
      const lineStr = lineItems.map((it) => it.text).join(" ").trim();
      const avgFontSize = lineItems.reduce((acc, it) => acc + it.fontSize, 0) / lineItems.length;

      const lineIsHeading = avgFontSize > 13 || (lineStr.length < 60 && i < 2);

      if (lineIsHeading) {
        if (currentParagraphText) {
          paragraphs.push({ text: currentParagraphText, isHeading: false });
          fullTextPieces.push(currentParagraphText);
          currentParagraphText = "";
        }
        paragraphs.push({ text: lineStr, isHeading: true });
        fullTextPieces.push(lineStr);
      } else {
        if (!currentParagraphText) {
          currentParagraphText = lineStr;
        } else {
          // Check if previous line ended with hyphen or sentence end
          currentParagraphText += " " + lineStr;
        }
      }
    }

    if (currentParagraphText) {
      paragraphs.push({ text: currentParagraphText, isHeading: false });
      fullTextPieces.push(currentParagraphText);
    }

    pages.push({ pageNum, paragraphs });
  }

  return {
    pages,
    fullText: fullTextPieces.join("\n\n"),
    pageCount: numPages,
  };
}

/**
 * Generates an editable Microsoft Word (.docx) archive from structured PDF paragraphs.
 * @param {Array<{ pageNum: number, paragraphs: Array<{ text: string, isHeading: boolean }> }>} pages
 * @returns {Promise<Uint8Array>}
 */
export async function createDocxFromParagraphs(pages) {
  const zip = new JSZip();

  // 1. [Content_Types].xml
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`
  );

  // 2. _rels/.rels
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  // 3. word/_rels/document.xml.rels
  zip.file(
    "word/_rels/document.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
  );

  // 4. word/styles.xml
  zip.file(
    "word/styles.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:sz w:val="22"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr>
      <w:b/>
      <w:color w:val="1E40AF"/>
      <w:sz w:val="32"/>
    </w:rPr>
  </w:style>
</w:styles>`
  );

  // 5. Build word/document.xml paragraphs
  let bodyXml = "";

  for (let pIndex = 0; pIndex < pages.length; pIndex++) {
    const page = pages[pIndex];

    for (const p of page.paragraphs) {
      const clean = escapeXml(p.text);
      if (p.isHeading) {
        bodyXml += `
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Heading1"/>
        <w:spacing w:before="240" w:after="120"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:b/></w:rPr>
        <w:t xml:space="preserve">${clean}</w:t>
      </w:r>
    </w:p>`;
      } else {
        bodyXml += `
    <w:p>
      <w:pPr>
        <w:spacing w:after="140" w:line="276" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:t xml:space="preserve">${clean}</w:t>
      </w:r>
    </w:p>`;
      }
    }

    // Page break between PDF pages (except after the last page)
    if (pIndex < pages.length - 1) {
      bodyXml += `
    <w:p>
      <w:r>
        <w:br w:type="page"/>
      </w:r>
    </w:p>`;
    }
  }

  // A4 Standard Page Setup
  bodyXml += `
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${bodyXml}
  </w:body>
</w:document>`;

  zip.file("word/document.xml", documentXml);

  return zip.generateAsync({ type: "uint8array" });
}

/**
 * Converts a PDF file into an editable Microsoft Word (.docx) document and raw text.
 *
 * @param {ArrayBuffer | Uint8Array | Blob} pdfInput
 * @returns {Promise<{ docxBytes: Uint8Array, fullText: string, pageCount: number, wordCount: number, size: number }>}
 */
export async function convertPdfToWord(pdfInput) {
  const { pages, fullText, pageCount } = await extractPdfContent(pdfInput);

  if (!fullText.trim()) {
    throw new Error("No readable text found in this PDF. It may contain scanned images without OCR.");
  }

  const docxBytes = await createDocxFromParagraphs(pages);
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;

  return {
    docxBytes,
    fullText,
    pageCount,
    wordCount,
    size: docxBytes.length,
  };
}
