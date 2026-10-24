import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import JSZip from "jszip";
import { mergePdfDocuments } from "../src/tools/pdf/mergePdf.js";
import { splitPdfDocument } from "../src/tools/pdf/splitPdf.js";
import { compressPdfDocument } from "../src/tools/pdf/compressPdf.js";
import { convertImagesToPdf } from "../src/tools/pdf/imagesToPdf.js";

async function makeTestPdf(pages = 2, label = "Test") {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= pages; i++) {
    const page = doc.addPage([500, 700]);
    page.drawText(`${label} Page ${i}`, { x: 50, y: 600, size: 22, font, color: rgb(0, 0.3, 0.7) });
  }
  return await doc.save();
}

// Minimal valid PNG
const VALID_PNG_BYTES = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41,
  0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
  0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xdd, 0x8d,
  0xb0, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e,
  0x44, 0xae, 0x42, 0x60, 0x82,
]);

describe("Full E2E Verification of Active Tools", () => {
  test("1. Merge PDF Tool: Merges files and generates valid downloadable PDF", async () => {
    const doc1 = await makeTestPdf(2, "DocA");
    const doc2 = await makeTestPdf(3, "DocB");

    const progressReports = [];
    const result = await mergePdfDocuments(
      [
        { name: "DocA.pdf", data: doc1 },
        { name: "DocB.pdf", data: doc2 },
      ],
      (p) => progressReports.push(p)
    );

    assert.equal(result.sourceCount, 2);
    assert.equal(result.pageCount, 5);
    assert.ok(result.bytes.byteLength > 0);
    assert.ok(progressReports.length > 0);

    // Verify downloadable PDF is parsable
    const parsed = await PDFDocument.load(result.bytes);
    assert.equal(parsed.getPageCount(), 5);
  });

  test("2. Split PDF Tool (Mode A - Extract): Extracts ranges into downloadable PDF", async () => {
    const sourcePdf = await makeTestPdf(6, "Source");
    const result = await splitPdfDocument(sourcePdf, {
      mode: "extract",
      ranges: "1-2, 5",
      baseName: "Source.pdf",
    });

    assert.equal(result.type, "pdf");
    assert.equal(result.pageCount, 3);
    assert.equal(result.filename, "Source-extracted.pdf");

    const parsed = await PDFDocument.load(result.bytes);
    assert.equal(parsed.getPageCount(), 3);
  });

  test("2. Split PDF Tool (Mode B - Split All): Bursts into ZIP archive of single-page PDFs", async () => {
    const sourcePdf = await makeTestPdf(3, "Invoice");
    const result = await splitPdfDocument(sourcePdf, {
      mode: "split-all",
      baseName: "Invoice.pdf",
    });

    assert.equal(result.type, "zip");
    assert.equal(result.fileCount, 3);
    assert.equal(result.filename, "Invoice-pages.zip");

    const zip = await JSZip.loadAsync(result.bytes);
    assert.equal(Object.keys(zip.files).length, 3);
    assert.ok(zip.file("Invoice-page-01.pdf"));
    assert.ok(zip.file("Invoice-page-02.pdf"));
    assert.ok(zip.file("Invoice-page-03.pdf"));
  });

  test("3. Compress PDF Tool: Optimizes document stream safely", async () => {
    const sourcePdf = await makeTestPdf(4, "Audit");
    const result = await compressPdfDocument(sourcePdf, {
      level: "recommended",
      baseName: "Audit.pdf",
    });

    assert.equal(result.pageCount, 4);
    assert.equal(result.filename, "Audit-compressed.pdf");
    assert.ok(result.bytes.byteLength > 0);

    const parsed = await PDFDocument.load(result.bytes);
    assert.equal(parsed.getPageCount(), 4);
  });

  test("4. JPG/PNG to PDF Tool: Compiles images into downloadable PDF with custom layout", async () => {
    const result = await convertImagesToPdf(
      [
        { name: "img1.png", data: VALID_PNG_BYTES },
        { name: "img2.png", data: VALID_PNG_BYTES },
      ],
      { pageSize: "a4", orientation: "portrait", margin: "small" }
    );

    assert.equal(result.pageCount, 2);
    assert.ok(result.bytes.byteLength > 0);

    const parsed = await PDFDocument.load(result.bytes);
    assert.equal(parsed.getPageCount(), 2);
  });
});
