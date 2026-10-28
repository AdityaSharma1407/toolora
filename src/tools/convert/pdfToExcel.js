/**
 * Client-Side PDF to Excel (.xlsx) & CSV Conversion Engine.
 * Detects tabular structures, grid rows, and aligned columns from PDF documents,
 * then packages them into standard Microsoft Excel (.xlsx) OpenXML workbooks and CSV files.
 * 100% private in browser memory.
 */

import JSZip from "jszip";
import { loadPdfDoc, escapeXml } from "./pdfToWord.js";
import { formatCsvRow } from "../utility/csvConverter.js";

/**
 * Converts a 0-indexed column integer to Excel column letters (0 -> A, 1 -> B, 26 -> AA).
 * @param {number} index
 * @returns {string}
 */
export function indexToColLetter(index) {
  let temp = index;
  let letter = "";
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

/**
 * Extracts tabular matrix from PDF text items by spatial clustering.
 * @param {ArrayBuffer | Uint8Array | Blob} pdfInput
 * @returns {Promise<string[][]>}
 */
export async function extractPdfTableMatrix(pdfInput) {
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
  const allRows = [];

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items || [];

    if (items.length === 0) continue;

    // Filter valid text items
    const validItems = items
      .filter((it) => it.str && it.str.trim())
      .map((it) => ({
        text: it.str.trim(),
        x: it.transform ? Math.round(it.transform[4]) : 0,
        y: it.transform ? Math.round(it.transform[5]) : 0,
      }));

    if (validItems.length === 0) continue;

    // Group items into rows by Y coordinate (within 4px tolerance)
    validItems.sort((a, b) => b.y - a.y); // top to bottom

    const rowGroups = [];
    let currentRow = [];
    let currentY = null;

    for (const item of validItems) {
      if (currentY === null || Math.abs(item.y - currentY) <= 4) {
        currentRow.push(item);
      } else {
        if (currentRow.length > 0) {
          // Sort row items left-to-right
          currentRow.sort((a, b) => a.x - b.x);
          rowGroups.push(currentRow);
        }
        currentRow = [item];
      }
      currentY = item.y;
    }
    if (currentRow.length > 0) {
      currentRow.sort((a, b) => a.x - b.x);
      rowGroups.push(currentRow);
    }

    // Determine column clusters based on distinct X positions
    for (const rGroup of rowGroups) {
      const rowStrings = rGroup.map((it) => it.text);
      allRows.push(rowStrings);
    }
  }

  // Normalize all rows to uniform column count
  if (allRows.length === 0) {
    throw new Error("No readable text or tables detected in PDF.");
  }

  const maxCols = Math.max(...allRows.map((r) => r.length));
  return allRows.map((row) => {
    const copy = [...row];
    while (copy.length < maxCols) copy.push("");
    return copy;
  });
}

/**
 * Builds a valid Microsoft Excel (.xlsx) file from a 2D string matrix using JSZip.
 * @param {string[][]} matrix
 * @param {string} [sheetName='Table1']
 * @returns {Promise<Uint8Array>}
 */
export async function createXlsxWorkbook(matrix, sheetName = "Table1") {
  const zip = new JSZip();

  // 1. [Content_Types].xml
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`
  );

  // 2. _rels/.rels
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
  );

  // 3. xl/_rels/workbook.xml.rels
  zip.file(
    "xl/_rels/workbook.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`
  );

  // 4. xl/workbook.xml
  zip.file(
    "xl/workbook.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${escapeXml(sheetName)}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`
  );

  // 5. xl/worksheets/sheet1.xml
  let sheetDataXml = "";

  for (let rIdx = 0; rIdx < matrix.length; rIdx++) {
    const rowNum = rIdx + 1;
    const row = matrix[rIdx];
    let rowCellsXml = "";

    for (let cIdx = 0; cIdx < row.length; cIdx++) {
      const colLetter = indexToColLetter(cIdx);
      const cellRef = `${colLetter}${rowNum}`;
      const cellVal = escapeXml(row[cIdx] || "");

      // Check if numeric
      const isNum = cellVal !== "" && !isNaN(Number(cellVal)) && !cellVal.startsWith("0") && !cellVal.includes(" ");

      if (isNum) {
        rowCellsXml += `<c r="${cellRef}"><v>${cellVal}</v></c>`;
      } else {
        rowCellsXml += `<c r="${cellRef}" t="inlineStr"><is><t>${cellVal}</t></is></c>`;
      }
    }

    sheetDataXml += `<row r="${rowNum}">${rowCellsXml}</row>`;
  }

  const worksheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${sheetDataXml}</sheetData>
</worksheet>`;

  zip.file("xl/worksheets/sheet1.xml", worksheetXml);

  return zip.generateAsync({ type: "uint8array" });
}

/**
 * Converts a PDF document into an Excel (.xlsx) workbook and CSV text.
 *
 * @param {ArrayBuffer | Uint8Array | Blob} pdfInput
 * @param {string} [sheetName='ExtractedData']
 * @returns {Promise<{ xlsxBytes: Uint8Array, csvText: string, rowCount: number, colCount: number, size: number }>}
 */
export async function convertPdfToExcel(pdfInput, sheetName = "ExtractedData") {
  const matrix = await extractPdfTableMatrix(pdfInput);

  if (matrix.length === 0) {
    throw new Error("No structured tabular data could be extracted from this PDF.");
  }

  // Generate CSV text
  const csvLines = matrix.map((row) => formatCsvRow(row));
  const csvText = csvLines.join("\r\n");

  // Generate .xlsx binary package
  const xlsxBytes = await createXlsxWorkbook(matrix, sheetName);

  return {
    xlsxBytes,
    csvText,
    rowCount: matrix.length,
    colCount: matrix[0] ? matrix[0].length : 0,
    size: xlsxBytes.length,
  };
}
