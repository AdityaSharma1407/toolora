import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { mergePdfDocuments } from "../src/tools/pdf/mergePdf.js";
import {
  hasValidPdfHeader,
  validatePdfFileMetadata,
} from "../src/tools/pdf/validatePdf.js";
import { moveItemInArray } from "../src/tools/pdf/pdfUtils.js";
import {
  getAllTools,
  getAvailableTools,
  searchTools,
} from "../src/data/toolsRegistry.js";

// Helper to create a minimal in-memory PDF with specified number of pages
async function createSamplePdf(pageCount = 1, title = "Sample") {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([400, 600]);
    page.drawText(`${title} - Page ${i}`, {
      x: 50,
      y: 550,
      size: 20,
      font,
      color: rgb(0.1, 0.2, 0.8),
    });
  }

  const bytes = await doc.save();
  return bytes;
}

describe("PDF Validation Tests", () => {
  test("accepts valid PDF byte header", async () => {
    const sample = await createSamplePdf(1, "Valid");
    assert.equal(hasValidPdfHeader(sample), true);
  });

  test("rejects non-PDF byte header", () => {
    const fakeBuffer = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]);
    assert.equal(hasValidPdfHeader(fakeBuffer), false);
  });

  test("rejects files with non-pdf extension", () => {
    const file = { name: "document.docx", size: 1024 };
    const result = validatePdfFileMetadata(file);
    assert.equal(result.valid, false);
    assert.match(result.error, /does not appear to be a PDF file/);
  });

  test("rejects empty files (0 bytes)", () => {
    const file = { name: "empty.pdf", size: 0 };
    const result = validatePdfFileMetadata(file);
    assert.equal(result.valid, false);
    assert.match(result.error, /is empty/);
  });

  test("rejects files exceeding size limit", () => {
    const file = { name: "huge.pdf", size: 60 * 1024 * 1024 };
    const result = validatePdfFileMetadata(file);
    assert.equal(result.valid, false);
    assert.match(result.error, /exceeds the maximum allowed file size/);
  });
});

describe("PDF Merge Core Logic", () => {
  test("fails when fewer than 2 documents are provided", async () => {
    const sample = await createSamplePdf(1, "Single");
    await assert.rejects(
      async () => {
        await mergePdfDocuments([{ name: "single.pdf", data: sample }]);
      },
      {
        message: /At least two PDF files are required/,
      }
    );
  });

  test("merges two PDFs correctly and validates combined page count", async () => {
    const pdf1 = await createSamplePdf(1, "Doc 1");
    const pdf2 = await createSamplePdf(2, "Doc 2");

    const result = await mergePdfDocuments([
      { name: "doc1.pdf", data: pdf1 },
      { name: "doc2.pdf", data: pdf2 },
    ]);

    assert.equal(result.sourceCount, 2);
    assert.equal(result.pageCount, 3);
    assert.ok(result.bytes.byteLength > 0);

    // Verify the merged document can be re-parsed and inspected
    const loadedMerged = await PDFDocument.load(result.bytes);
    assert.equal(loadedMerged.getPageCount(), 3);
  });

  test("merges three PDFs correctly in sequence", async () => {
    const pdf1 = await createSamplePdf(2, "Doc 1");
    const pdf2 = await createSamplePdf(3, "Doc 2");
    const pdf3 = await createSamplePdf(1, "Doc 3");

    const result = await mergePdfDocuments([
      { name: "doc1.pdf", data: pdf1 },
      { name: "doc2.pdf", data: pdf2 },
      { name: "doc3.pdf", data: pdf3 },
    ]);

    assert.equal(result.sourceCount, 3);
    assert.equal(result.pageCount, 6); // 2 + 3 + 1

    const loadedMerged = await PDFDocument.load(result.bytes);
    assert.equal(loadedMerged.getPageCount(), 6);
  });

  test("reordering files changes resulting page breakdown", () => {
    const list = ["FileA", "FileB", "FileC"];
    // Move FileC (index 2) to first position (index 0)
    const reordered = moveItemInArray(list, 2, 0);
    assert.deepEqual(reordered, ["FileC", "FileA", "FileB"]);
  });

  test("rejects corrupted PDF data during merge", async () => {
    const valid = await createSamplePdf(1, "Valid");
    const corrupted = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x99, 0x88, 0x77]);

    await assert.rejects(
      async () => {
        await mergePdfDocuments([
          { name: "valid.pdf", data: valid },
          { name: "corrupt.pdf", data: corrupted },
        ]);
      },
      {
        message: /Failed to parse "corrupt.pdf"/,
      }
    );
  });
});

describe("Tools Registry Verification", () => {
  test("Core tools (Merge, Split, Compress, JPG to PDF) are available and properly registered", () => {
    const available = getAvailableTools();
    const ids = available.map((t) => t.id);
    assert.ok(ids.includes("merge-pdf"));
    assert.ok(ids.includes("split-pdf"));
    assert.ok(ids.includes("compress-pdf"));
    assert.ok(ids.includes("jpg-to-pdf"));

    const split = available.find((t) => t.id === "split-pdf");
    assert.equal(split.route, "/split-pdf");
    assert.equal(split.status, "available");

    const compress = available.find((t) => t.id === "compress-pdf");
    assert.equal(compress.route, "/compress-pdf");
    assert.equal(compress.status, "available");

    const jpg = available.find((t) => t.id === "jpg-to-pdf");
    assert.equal(jpg.route, "/jpg-to-pdf");
    assert.equal(jpg.status, "available");
  });

  test("Planned tools are marked coming-soon", () => {
    const all = getAllTools();
    const comingSoon = all.filter((t) => t.status === "coming-soon");
    assert.ok(comingSoon.length >= 10);
  });

  test("Search filters by name and keywords", () => {
    const results = searchTools("merge");
    assert.ok(results.some((t) => t.id === "merge-pdf"));

    const qrResults = searchTools("qr");
    assert.ok(qrResults.some((t) => t.id === "qr-code-generator"));
  });
});
