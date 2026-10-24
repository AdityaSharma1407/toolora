import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import JSZip from "jszip";
import { splitPdfDocument, parsePageRange } from "../src/tools/pdf/splitPdf.js";
import { compressPdfDocument } from "../src/tools/pdf/compressPdf.js";
import { convertImagesToPdf } from "../src/tools/pdf/imagesToPdf.js";
import { validateImageFile } from "../src/tools/pdf/validateImage.js";

// Helper to create a multi-page test PDF in memory
async function createMultiPagePdf(count = 4) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= count; i++) {
    const page = doc.addPage([400, 600]);
    page.drawText(`Page ${i} Content`, {
      x: 50,
      y: 500,
      size: 24,
      font,
      color: rgb(0.2, 0.4, 0.8),
    });
  }

  return await doc.save();
}

// Minimal valid PNG byte stream (1x1 red pixel PNG)
const MINIMAL_PNG = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG Signature
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, // 8-bit RGB
  0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, // IDAT chunk
  0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
  0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xdd, 0x8d,
  0xb0, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, // IEND chunk
  0x44, 0xae, 0x42, 0x60, 0x82,
]);

describe("Split PDF Core Logic", () => {
  test("parsePageRange correctly parses comma-separated numbers and ranges", () => {
    const indices = parsePageRange("1, 3-5, 2", 6);
    // 1 -> 0, 3-5 -> 2,3,4, 2 -> 1
    assert.deepEqual(indices, [0, 2, 3, 4, 1]);
  });

  test("parsePageRange throws on out-of-range page number", () => {
    assert.throws(
      () => {
        parsePageRange("1, 7", 5);
      },
      {
        message: /exceeds total document pages/,
      }
    );
  });

  test("parsePageRange throws on invalid range where start > end", () => {
    assert.throws(
      () => {
        parsePageRange("5-2", 6);
      },
      {
        message: /start page \(5\) must be less than or equal to end page \(2\)/,
      }
    );
  });

  test("Mode A extracts selected page range into a single valid PDF", async () => {
    const pdfBytes = await createMultiPagePdf(5);
    const result = await splitPdfDocument(pdfBytes, {
      mode: "extract",
      ranges: "1, 3-4",
      baseName: "contract.pdf",
    });

    assert.equal(result.type, "pdf");
    assert.equal(result.pageCount, 3);
    assert.equal(result.filename, "contract-extracted.pdf");

    // Re-load and verify page count
    const loaded = await PDFDocument.load(result.bytes);
    assert.equal(loaded.getPageCount(), 3);
  });

  test("Mode B splits all pages into individual PDFs in a ZIP archive", async () => {
    const pdfBytes = await createMultiPagePdf(3);
    const result = await splitPdfDocument(pdfBytes, {
      mode: "split-all",
      baseName: "report.pdf",
    });

    assert.equal(result.type, "zip");
    assert.equal(result.fileCount, 3);
    assert.equal(result.filename, "report-pages.zip");

    // Inspect the generated zip archive
    const zip = await JSZip.loadAsync(result.bytes);
    const fileNames = Object.keys(zip.files);
    assert.equal(fileNames.length, 3);
    assert.ok(fileNames.includes("report-page-01.pdf"));
    assert.ok(fileNames.includes("report-page-02.pdf"));
    assert.ok(fileNames.includes("report-page-03.pdf"));

    // Verify first extracted page in zip is a valid 1-page PDF
    const page1Bytes = await zip.file("report-page-01.pdf").async("uint8array");
    const loadedPage1 = await PDFDocument.load(page1Bytes);
    assert.equal(loadedPage1.getPageCount(), 1);
  });
});

describe("Compress PDF Core Logic", () => {
  test("runs basic, recommended, and maximum compression modes", async () => {
    const pdfBytes = await createMultiPagePdf(2);

    for (const level of ["basic", "recommended", "maximum"]) {
      const result = await compressPdfDocument(pdfBytes, {
        level,
        baseName: "sample.pdf",
      });

      assert.ok(result.bytes.byteLength > 0);
      assert.equal(result.originalSize, pdfBytes.byteLength);
      assert.equal(result.pageCount, 2);
      assert.equal(result.level, level);
      assert.equal(typeof result.isSmaller, "boolean");

      // Verify the compressed document is fully valid and readable
      const loaded = await PDFDocument.load(result.bytes);
      assert.equal(loaded.getPageCount(), 2);
    }
  });

  test("accurately calculates size differences and percentage", async () => {
    const pdfBytes = await createMultiPagePdf(3);
    const result = await compressPdfDocument(pdfBytes, {
      level: "recommended",
      baseName: "audit.pdf",
    });

    if (result.isSmaller) {
      assert.ok(result.compressedSize < result.originalSize);
      assert.ok(result.savedBytes > 0);
      assert.ok(result.percentSaved > 0);
    } else {
      assert.equal(result.savedBytes, 0);
      assert.equal(result.percentSaved, 0);
    }
  });
});

describe("JPG/PNG to PDF Core Logic", () => {
  test("converts single PNG image to PDF with A4 portrait layout", async () => {
    const result = await convertImagesToPdf(
      [{ name: "photo1.png", data: MINIMAL_PNG }],
      { pageSize: "a4", orientation: "portrait", margin: "small" }
    );

    assert.equal(result.pageCount, 1);
    assert.ok(result.bytes.byteLength > 0);

    const loaded = await PDFDocument.load(result.bytes);
    assert.equal(loaded.getPageCount(), 1);
    const page = loaded.getPage(0);
    const { width, height } = page.getSize();
    // A4 width ~595, height ~841
    assert.ok(Math.abs(width - 595.28) < 1);
    assert.ok(Math.abs(height - 841.89) < 1);
  });

  test("converts multiple images with landscape orientation", async () => {
    const result = await convertImagesToPdf(
      [
        { name: "first.png", data: MINIMAL_PNG },
        { name: "second.png", data: MINIMAL_PNG },
      ],
      { pageSize: "letter", orientation: "landscape", margin: "none" }
    );

    assert.equal(result.pageCount, 2);
    const loaded = await PDFDocument.load(result.bytes);
    assert.equal(loaded.getPageCount(), 2);

    const page = loaded.getPage(0);
    const { width, height } = page.getSize();
    // Letter landscape: width ~792, height ~612
    assert.ok(Math.abs(width - 792.0) < 1);
    assert.ok(Math.abs(height - 612.0) < 1);
  });

  test("converts with Fit to Image layout option", async () => {
    const result = await convertImagesToPdf(
      [{ name: "pixel.png", data: MINIMAL_PNG }],
      { pageSize: "fit", margin: "none" }
    );

    const loaded = await PDFDocument.load(result.bytes);
    const page = loaded.getPage(0);
    const { width, height } = page.getSize();
    // 1x1 image with 0 margin
    assert.equal(width, 1);
    assert.equal(height, 1);
  });

  test("rejects unsupported file formats", async () => {
    await assert.rejects(
      async () => {
        await convertImagesToPdf([
          { name: "animation.gif", data: new Uint8Array([0x47, 0x49, 0x46]) },
        ]);
      },
      {
        message: /is not a supported format/,
      }
    );
  });

  test("validates image metadata and reject empty/unsupported images", () => {
    const valid = validateImageFile({ name: "picture.jpg", size: 1024 });
    assert.equal(valid.valid, true);

    const unsupported = validateImageFile({ name: "picture.bmp", size: 1024 });
    assert.equal(unsupported.valid, false);

    const empty = validateImageFile({ name: "picture.png", size: 0 });
    assert.equal(empty.valid, false);
  });
});
