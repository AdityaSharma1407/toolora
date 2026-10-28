/**
 * Client-Side Excel & CSV to PDF Conversion Engine.
 * Parses .xlsx workbooks (using JSZip) and .csv files, rendering structured,
 * beautifully styled and paginated PDF tables via pdf-lib.
 * 100% private in browser memory.
 */

import JSZip from "jszip";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { parseCsvRows } from "../utility/csvConverter.js";
import { PAGE_SIZES } from "./htmlToPdf.js";

/**
 * Extracts shared strings table from an xlsx archive.
 * @param {JSZip} zip
 * @returns {Promise<string[]>}
 */
async function extractSharedStrings(zip) {
  const file = zip.file("xl/sharedStrings.xml");
  if (!file) return [];

  const xmlText = await file.async("text");
  const strings = [];

  // Match each <si> item
  const siRegex = /<si\b[^>]*>([\s\S]*?)<\/si>/gi;
  let match;

  while ((match = siRegex.exec(xmlText)) !== null) {
    const siContent = match[1];
    // Collect all <t> tags within the <si>
    const tRegex = /<t\b[^>]*>([\s\S]*?)<\/t>/gi;
    let tMatch;
    let fullText = "";
    while ((tMatch = tRegex.exec(siContent)) !== null) {
      fullText += tMatch[1];
    }
    strings.push(
      fullText
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
    );
  }

  return strings;
}

/**
 * Parses cell column letters (e.g. "A", "BC") into 0-indexed column integer.
 * @param {string} colRef
 * @returns {number}
 */
function colRefToIndex(colRef) {
  let index = 0;
  for (let i = 0; i < colRef.length; i++) {
    index = index * 26 + (colRef.charCodeAt(i) - 64);
  }
  return index - 1;
}

/**
 * Parses sheet1.xml from an xlsx archive into a 2D string matrix.
 * @param {JSZip} zip
 * @param {string[]} sharedStrings
 * @returns {Promise<string[][]>}
 */
async function extractSheetData(zip, sharedStrings) {
  // Look for first worksheet
  let sheetFile = zip.file("xl/worksheets/sheet1.xml");
  if (!sheetFile) {
    // Find any sheet in xl/worksheets
    const files = zip.file(/xl\/worksheets\/sheet.*\.xml/i);
    if (files.length > 0) sheetFile = files[0];
  }

  if (!sheetFile) {
    throw new Error("No worksheet found in Excel file.");
  }

  const xmlText = await sheetFile.async("text");
  const rows = [];

  const rowRegex = /<row\b[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(xmlText)) !== null) {
    const rowContent = rowMatch[2];
    const cellRegex = /<c\b[^>]*r="([A-Z]+)\d+"(?:[^>]*t="([^"]*)")?[^>]*>(?:[\s\S]*?<v>([\s\S]*?)<\/v>)?(?:[\s\S]*?<is><t>([\s\S]*?)<\/t><\/is>)?[\s\S]*?<\/c>/gi;
    let cellMatch;
    const rowCells = [];

    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      const colLetter = cellMatch[1];
      const type = cellMatch[2] || "";
      const val = cellMatch[3] !== undefined ? cellMatch[3] : "";
      const inlineVal = cellMatch[4] !== undefined ? cellMatch[4] : "";
      const colIdx = colRefToIndex(colLetter);

      let cellText = "";
      if (type === "s") {
        const strIdx = parseInt(val, 10);
        cellText = sharedStrings[strIdx] || "";
      } else if (type === "inlineStr") {
        cellText = inlineVal;
      } else {
        cellText = val;
      }

      // Fill empty cells up to colIdx
      while (rowCells.length < colIdx) {
        rowCells.push("");
      }
      rowCells[colIdx] = cellText.trim();
    }

    if (rowCells.length > 0) {
      rows.push(rowCells);
    }
  }

  return rows;
}

/**
 * Parses an Excel (.xlsx) or CSV file/buffer into a 2D matrix.
 * @param {ArrayBuffer | Uint8Array | Blob | string} source
 * @param {string} [fileName]
 * @returns {Promise<{ sheetName: string, rows: string[][] }>}
 */
export async function parseSpreadsheet(source, fileName = "Sheet") {
  let buffer;

  if (source instanceof Blob) {
    buffer = await source.arrayBuffer();
  } else if (source instanceof Uint8Array) {
    buffer = source.buffer;
  } else if (source instanceof ArrayBuffer) {
    buffer = source;
  } else if (typeof source === "string") {
    // Treat as raw CSV text
    const rows = parseCsvRows(source);
    return { sheetName: "Sheet1", rows };
  }

  const isZip = buffer.byteLength > 4 &&
    new Uint8Array(buffer, 0, 2)[0] === 0x50 &&
    new Uint8Array(buffer, 0, 2)[1] === 0x4b; // 'PK'

  if (isZip) {
    const zip = await JSZip.loadAsync(buffer);
    const sharedStrings = await extractSharedStrings(zip);
    const rows = await extractSheetData(zip, sharedStrings);
    return { sheetName: fileName.replace(/\.[^/.]+$/, "") || "Sheet1", rows };
  } else {
    // Attempt CSV decode
    const decoder = new TextDecoder("utf-8");
    const text = decoder.decode(buffer);
    const rows = parseCsvRows(text);
    return { sheetName: fileName.replace(/\.[^/.]+$/, "") || "Sheet1", rows };
  }
}

/**
 * Converts spreadsheet rows into a paginated, formatted PDF document.
 *
 * @param {ArrayBuffer | Uint8Array | Blob | string} input
 * @param {object} [options]
 * @param {'a4'|'letter'|'legal'} [options.pageSize='a4']
 * @param {'landscape'|'portrait'} [options.orientation='landscape']
 * @param {number} [options.margin=30]
 * @param {string} [options.fileName='Spreadsheet']
 * @returns {Promise<{ pdfBytes: Uint8Array, pageCount: number, rowCount: number, colCount: number, size: number }>}
 */
export async function convertExcelToPdf(input, options = {}) {
  const {
    pageSize = "a4",
    orientation = "landscape",
    margin = 30,
    fileName = "Spreadsheet",
  } = options;

  const { sheetName, rows } = await parseSpreadsheet(input, fileName);

  if (!rows || rows.length === 0) {
    throw new Error("The spreadsheet is empty or could not be parsed.");
  }

  // Determine uniform column count
  const colCount = Math.max(...rows.map((r) => r.length));
  if (colCount === 0) {
    throw new Error("No table columns found.");
  }

  // Normalize all rows to uniform column count
  const tableData = rows.map((row) => {
    const copy = [...row];
    while (copy.length < colCount) copy.push("");
    return copy;
  });

  const sizeDef = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;
  let pageWidth = sizeDef.width;
  let pageHeight = sizeDef.height;

  if (orientation === "landscape") {
    pageWidth = sizeDef.height;
    pageHeight = sizeDef.width;
  }

  const contentWidth = pageWidth - margin * 2;
  const colWidth = contentWidth / colCount;
  const headerHeight = 26;
  const rowHeight = 20;
  const fontSize = Math.max(7, Math.min(9.5, Math.floor(colWidth / 7)));

  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Theme colors
  const headerBg = rgb(0.12, 0.16, 0.22); // Deep slate
  const headerText = rgb(1, 1, 1); // White
  const zebraBg = rgb(0.97, 0.98, 0.99); // Slate 50
  const borderColor = rgb(0.88, 0.9, 0.94); // Slate 200
  const textColor = rgb(0.15, 0.18, 0.22); // Slate 800
  const mutedColor = rgb(0.45, 0.5, 0.55);

  let currentPage = null;
  let currentY = 0;

  const drawHeaderRow = (page, y) => {
    // Header background
    page.drawRectangle({
      x: margin,
      y: y - headerHeight,
      width: contentWidth,
      height: headerHeight,
      color: headerBg,
    });

    const headers = tableData[0];
    for (let c = 0; c < colCount; c++) {
      const title = headers[c] || `Col ${c + 1}`;
      const trunc = fontBold.widthOfTextAtSize(title, fontSize) > colWidth - 8
        ? title.slice(0, Math.max(3, Math.floor((colWidth - 8) / 6))) + "..."
        : title;

      page.drawText(trunc, {
        x: margin + c * colWidth + 5,
        y: y - headerHeight + 8,
        size: fontSize,
        font: fontBold,
        color: headerText,
      });

      if (c > 0) {
        page.drawLine({
          start: { x: margin + c * colWidth, y: y },
          end: { x: margin + c * colWidth, y: y - headerHeight },
          thickness: 0.5,
          color: rgb(0.2, 0.25, 0.35),
        });
      }
    }
  };

  const startNewPage = () => {
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    currentY = pageHeight - margin - 20;

    // Document & Sheet Title
    currentPage.drawText(sheetName, {
      x: margin,
      y: pageHeight - margin,
      size: 11,
      font: fontBold,
      color: headerBg,
    });

    // Draw repeating table header
    drawHeaderRow(currentPage, currentY);
    currentY -= headerHeight;
  };

  startNewPage();

  // Draw data rows (starting from index 1)
  for (let r = 1; r < tableData.length; r++) {
    // Check if next row fits
    if (currentY - rowHeight < margin + 25) {
      startNewPage();
    }

    const row = tableData[r];
    const isZebra = r % 2 === 0;

    if (isZebra) {
      currentPage.drawRectangle({
        x: margin,
        y: currentY - rowHeight,
        width: contentWidth,
        height: rowHeight,
        color: zebraBg,
      });
    }

    for (let c = 0; c < colCount; c++) {
      const val = String(row[c] || "");
      const trunc = fontRegular.widthOfTextAtSize(val, fontSize) > colWidth - 8
        ? val.slice(0, Math.max(3, Math.floor((colWidth - 8) / 6))) + "..."
        : val;

      currentPage.drawText(trunc, {
        x: margin + c * colWidth + 5,
        y: currentY - rowHeight + 6,
        size: fontSize,
        font: fontRegular,
        color: textColor,
      });
    }

    // Row bottom border
    currentPage.drawLine({
      start: { x: margin, y: currentY - rowHeight },
      end: { x: margin + contentWidth, y: currentY - rowHeight },
      thickness: 0.5,
      color: borderColor,
    });

    currentY -= rowHeight;
  }

  // Running footers on all pages
  const totalPages = pdfDoc.getPageCount();
  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const footerText = `Page ${i + 1} of ${totalPages} • Total Rows: ${tableData.length}`;
    const footerSize = 8;
    const footerW = fontRegular.widthOfTextAtSize(footerText, footerSize);

    page.drawText(footerText, {
      x: pageWidth - margin - footerW,
      y: margin / 2,
      size: footerSize,
      font: fontRegular,
      color: mutedColor,
    });

    page.drawText("Generated with Toolora", {
      x: margin,
      y: margin / 2,
      size: footerSize,
      font: fontRegular,
      color: mutedColor,
    });
  }

  const pdfBytes = await pdfDoc.save();

  return {
    pdfBytes,
    pageCount: totalPages,
    rowCount: tableData.length,
    colCount,
    size: pdfBytes.length,
  };
}
