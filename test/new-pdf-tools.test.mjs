import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { rotatePdfDocument, normalizeAngle } from "../src/tools/pdf/rotatePdf.js";
import { deletePdfPages } from "../src/tools/pdf/deletePdfPages.js";
import { reorderPdfPages } from "../src/tools/pdf/reorderPdfPages.js";
import { addPageNumbersToPdf } from "../src/tools/pdf/addPageNumbers.js";
import { watermarkPdfDocument } from "../src/tools/pdf/watermarkPdf.js";
import { protectPdfDocument } from "../src/tools/pdf/protectPdf.js";
import { unlockPdfDocument } from "../src/tools/pdf/unlockPdf.js";
import {
  TOOLS,
  getAvailableTools,
  getToolById,
  searchTools,
} from "../src/data/toolsRegistry.js";

/**
 * Helper to generate a multi-page test PDF in memory with distinct page labels.
 * @param {number} count
 * @returns {Promise<Uint8Array>}
 */
async function createTestDoc(count = 3) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < count; i++) {
    const page = doc.addPage([595, 842]); // A4 dimensions
    page.drawText(`Page Content ${i + 1}`, {
      x: 50,
      y: 750,
      size: 24,
      font,
      color: rgb(0.1, 0.2, 0.4),
    });
  }
  return await doc.save();
}

describe("1. Rotate PDF Core Logic", () => {
  test("normalizeAngle correctly wraps positive, negative, and out-of-range degrees", () => {
    assert.equal(normalizeAngle(0), 0);
    assert.equal(normalizeAngle(90), 90);
    assert.equal(normalizeAngle(180), 180);
    assert.equal(normalizeAngle(270), 270);
    assert.equal(normalizeAngle(360), 0);
    assert.equal(normalizeAngle(450), 90);
    assert.equal(normalizeAngle(-90), 270);
    assert.equal(normalizeAngle(-180), 180);
    assert.equal(normalizeAngle(-270), 90);
    assert.equal(normalizeAngle(-360), 0);
  });

  test("rotates a single target page while leaving other pages unchanged", async () => {
    const inputBytes = await createTestDoc(3);
    const progressLog = [];

    // Rotate only page 1 (second page) clockwise by +90°
    const result = await rotatePdfDocument(
      inputBytes,
      { 1: 90 },
      { baseName: "quarterly-report.pdf" },
      (p) => progressLog.push(p)
    );

    assert.equal(result.pageCount, 3);
    assert.equal(result.filename, "quarterly-report-rotated.pdf");
    assert.ok(result.bytes.byteLength > 0);
    assert.ok(progressLog.length > 0);
    assert.equal(progressLog[progressLog.length - 1].percent, 100);

    // Verify rotation degrees inside loaded PDF
    const reloaded = await PDFDocument.load(result.bytes);
    const pages = reloaded.getPages();
    assert.equal(pages[0].getRotation().angle, 0);
    assert.equal(pages[1].getRotation().angle, 90);
    assert.equal(pages[2].getRotation().angle, 0);
  });

  test("rotates all pages globally by 180 degrees", async () => {
    const inputBytes = await createTestDoc(2);

    const result = await rotatePdfDocument(inputBytes, 180, {
      baseName: "contract.pdf",
    });

    const reloaded = await PDFDocument.load(result.bytes);
    const pages = reloaded.getPages();
    assert.equal(pages[0].getRotation().angle, 180);
    assert.equal(pages[1].getRotation().angle, 180);
  });

  test("correctly applies negative rotation (-90°) to normalize to 270°", async () => {
    const inputBytes = await createTestDoc(2);

    const result = await rotatePdfDocument(inputBytes, { 0: -90 });
    const reloaded = await PDFDocument.load(result.bytes);
    const pages = reloaded.getPages();
    assert.equal(pages[0].getRotation().angle, 270);
    assert.equal(pages[1].getRotation().angle, 0);
  });

  test("throws when input buffer is empty or invalid", async () => {
    await assert.rejects(
      async () => {
        await rotatePdfDocument(new Uint8Array(0), 90);
      },
      { message: /The provided document is empty/ }
    );
  });
});

describe("2. Delete PDF Pages Core Logic", () => {
  test("deletes selected pages from multi-page PDF and preserves remaining pages in order", async () => {
    const inputBytes = await createTestDoc(4);
    const progressLog = [];

    // Delete page index 1 (page 2) and index 3 (page 4)
    const result = await deletePdfPages(
      inputBytes,
      [1, 3],
      { baseName: "document.pdf" },
      (p) => progressLog.push(p)
    );

    assert.equal(result.originalPageCount, 4);
    assert.equal(result.retainedPageCount, 2);
    assert.equal(result.deletedCount, 2);
    assert.equal(result.filename, "document-pages-removed.pdf");
    assert.ok(result.bytes.byteLength > 0);
    assert.ok(progressLog.length > 0);
    assert.equal(progressLog[progressLog.length - 1].percent, 100);

    // Verify output document structure
    const reloaded = await PDFDocument.load(result.bytes);
    assert.equal(reloaded.getPageCount(), 2);
  });

  test("rejects attempt to delete all pages (at least one page must be retained)", async () => {
    const inputBytes = await createTestDoc(3);

    await assert.rejects(
      async () => {
        await deletePdfPages(inputBytes, [0, 1, 2]);
      },
      { message: /A PDF document must retain at least one page/ }
    );
  });

  test("rejects when no pages are selected for deletion", async () => {
    const inputBytes = await createTestDoc(3);

    await assert.rejects(
      async () => {
        await deletePdfPages(inputBytes, []);
      },
      { message: /No pages were selected for deletion/ }
    );
  });

  test("throws when input buffer is empty", async () => {
    await assert.rejects(
      async () => {
        await deletePdfPages(new Uint8Array(0), [0]);
      },
      { message: /The provided document is empty/ }
    );
  });
});

describe("3. Reorder PDF Pages Core Logic", () => {
  test("reorders pages according to arbitrary permutation [2, 0, 1]", async () => {
    const inputBytes = await createTestDoc(3);
    const progressLog = [];

    const result = await reorderPdfPages(
      inputBytes,
      [2, 0, 1],
      { baseName: "deck.pdf" },
      (p) => progressLog.push(p)
    );

    assert.equal(result.pageCount, 3);
    assert.equal(result.filename, "deck-reordered.pdf");
    assert.ok(result.bytes.byteLength > 0);
    assert.ok(progressLog.length > 0);
    assert.equal(progressLog[progressLog.length - 1].percent, 100);

    const reloaded = await PDFDocument.load(result.bytes);
    assert.equal(reloaded.getPageCount(), 3);
  });

  test("reverses page order [2, 1, 0]", async () => {
    const inputBytes = await createTestDoc(3);

    const result = await reorderPdfPages(inputBytes, [2, 1, 0], {
      baseName: "invoices.pdf",
    });

    const reloaded = await PDFDocument.load(result.bytes);
    assert.equal(reloaded.getPageCount(), 3);
  });

  test("throws when sequence length does not match total page count", async () => {
    const inputBytes = await createTestDoc(3);

    await assert.rejects(
      async () => {
        await reorderPdfPages(inputBytes, [1, 0]);
      },
      { message: /Expected 3 pages, but received 2/ }
    );
  });

  test("throws when duplicate indices are provided in order sequence", async () => {
    const inputBytes = await createTestDoc(3);

    await assert.rejects(
      async () => {
        await reorderPdfPages(inputBytes, [0, 0, 1]);
      },
      { message: /Duplicate page index detected/ }
    );
  });

  test("throws when out-of-range index is provided", async () => {
    const inputBytes = await createTestDoc(3);

    await assert.rejects(
      async () => {
        await reorderPdfPages(inputBytes, [0, 1, 9]);
      },
      { message: /Must be between 0 and 2/ }
    );
  });
});

describe("4. Tools Registry and Navigation Integration", () => {
  test("all 8 PDF tools are active and marked available with clean root routes", () => {
    const requiredPdfTools = [
      { id: "merge-pdf", route: "/merge-pdf" },
      { id: "split-pdf", route: "/split-pdf" },
      { id: "compress-pdf", route: "/compress-pdf" },
      { id: "jpg-to-pdf", route: "/jpg-to-pdf" },
      { id: "pdf-to-jpg", route: "/pdf-to-jpg" },
      { id: "rotate-pdf", route: "/rotate-pdf" },
      { id: "delete-pdf-pages", route: "/delete-pdf-pages" },
      { id: "reorder-pdf-pages", route: "/reorder-pdf-pages" },
    ];

    for (const item of requiredPdfTools) {
      const tool = getToolById(item.id);
      assert.ok(tool, `Tool ${item.id} must exist in registry`);
      assert.equal(tool.status, "available", `${item.id} must be marked available`);
      assert.equal(tool.route, item.route, `${item.id} must point to ${item.route}`);
      assert.equal(tool.category, "pdf");
    }
  });

  test("getAvailableTools includes all 8 PDF tools", () => {
    const available = getAvailableTools();
    const availableIds = available.map((t) => t.id);

    assert.ok(availableIds.includes("merge-pdf"));
    assert.ok(availableIds.includes("split-pdf"));
    assert.ok(availableIds.includes("compress-pdf"));
    assert.ok(availableIds.includes("jpg-to-pdf"));
    assert.ok(availableIds.includes("pdf-to-jpg"));
    assert.ok(availableIds.includes("rotate-pdf"));
    assert.ok(availableIds.includes("delete-pdf-pages"));
    assert.ok(availableIds.includes("reorder-pdf-pages"));
    assert.ok(available.length >= 8);
  });

  test("searchTools finds all four new PDF utilities by name and keyword", () => {
    const jpgResults = searchTools("pdf to jpg");
    assert.ok(jpgResults.some((t) => t.id === "pdf-to-jpg"));

    const rotateResults = searchTools("rotate");
    assert.ok(rotateResults.some((t) => t.id === "rotate-pdf"));

    const deleteResults = searchTools("delete");
    assert.ok(deleteResults.some((t) => t.id === "delete-pdf-pages"));

    const reorderResults = searchTools("reorder");
    assert.ok(reorderResults.some((t) => t.id === "reorder-pdf-pages"));
  });
});

import fs from "node:fs";

describe("5. New Tool Pages SEO & Structured Metadata Verification", () => {
  const pages = [
    { name: "PDF to JPG", path: "src/app/pdf-to-jpg/page.jsx", canonical: "/pdf-to-jpg" },
    { name: "Rotate PDF", path: "src/app/rotate-pdf/page.jsx", canonical: "/rotate-pdf" },
    { name: "Delete PDF Pages", path: "src/app/delete-pdf-pages/page.jsx", canonical: "/delete-pdf-pages" },
    { name: "Reorder PDF Pages", path: "src/app/reorder-pdf-pages/page.jsx", canonical: "/reorder-pdf-pages" },
  ];

  for (const page of pages) {
    test(`${page.name} exports canonical metadata, FAQPage, WebApplication, and HowTo schemas`, () => {
      const content = fs.readFileSync(page.path, "utf8");

      // Verify canonical URL
      assert.ok(content.includes(`canonical: "${page.canonical}"`));

      // Verify title & meta description presence
      assert.ok(content.includes("Bits & Tools"));
      assert.ok(content.includes("export const metadata = {"));
      assert.ok(content.includes("keywords: ["));
      assert.ok(content.includes("openGraph: {"));
      assert.ok(content.includes("twitter: {"));

      // Verify robots directives
      assert.ok(content.includes("robots: {"));
      assert.ok(content.includes("index: true"));
      assert.ok(content.includes("follow: true"));

      // Verify Schema.org Structured Data
      assert.ok(content.includes('"@type": "WebApplication"'));
      assert.ok(content.includes('"@type": "BreadcrumbList"'));
      assert.ok(content.includes('"@type": "HowTo"'));
      assert.ok(content.includes("application/ld+json"));

      // Verify FAQSection integration
      assert.ok(content.includes("<FAQSection"));
    });
  }
});

import { cloneBinaryData } from "../src/tools/pdf/pdfToJpg.js";

describe("6. ArrayBuffer Worker Transfer & Detachment Safeguard", () => {
  test("cloneBinaryData creates a new distinct ArrayBuffer copy and does not share memory", () => {
    const original = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]).buffer;
    const cloned = cloneBinaryData(original);

    // Verify it is a Uint8Array with identical byte content
    assert.ok(cloned instanceof Uint8Array);
    assert.equal(cloned.byteLength, 8);
    assert.deepEqual(Array.from(cloned), [1, 2, 3, 4, 5, 6, 7, 8]);

    // Crucial: The underlying ArrayBuffer must be a separate instance so Worker detachment
    // does not detach the original buffer!
    assert.notEqual(cloned.buffer, original);

    // Mutating the clone must not affect original
    cloned[0] = 99;
    assert.equal(new Uint8Array(original)[0], 1);
  });

  test("cloneBinaryData works with Uint8Array views", () => {
    const view = new Uint8Array([10, 20, 30, 40]);
    const cloned = cloneBinaryData(view);

    assert.ok(cloned instanceof Uint8Array);
    assert.equal(cloned.byteLength, 4);
    assert.notEqual(cloned.buffer, view.buffer);
    assert.deepEqual(Array.from(cloned), [10, 20, 30, 40]);
  });

  test("cloneBinaryData allows the original buffer to be cloned repeatedly without detaching", () => {
    const original = new Uint8Array([100, 200]).buffer;

    const copy1 = cloneBinaryData(original);
    const copy2 = cloneBinaryData(original);
    const copy3 = cloneBinaryData(original);

    assert.equal(original.byteLength, 2);
    assert.equal(copy1.byteLength, 2);
    assert.equal(copy2.byteLength, 2);
    assert.equal(copy3.byteLength, 2);
  });
});



describe("7. Add Page Numbers Core Logic", () => {
  test("inserts page numbers into multi-page PDF document", async () => {
    const inputBytes = await createTestDoc(3);
    const { pdfBytes, pageCount, modifiedPages } = await addPageNumbersToPdf(inputBytes, {
      position: "bottom-center",
      format: "page-x-of-y",
    });

    assert.equal(pageCount, 3);
    assert.equal(modifiedPages, 3);
    assert.ok(pdfBytes.byteLength > inputBytes.byteLength);

    const doc = await PDFDocument.load(pdfBytes);
    assert.equal(doc.getPageCount(), 3);
  });

  test("skips cover page when skipFirstPage is true", async () => {
    const inputBytes = await createTestDoc(4);
    const { modifiedPages } = await addPageNumbersToPdf(inputBytes, {
      skipFirstPage: true,
      format: "x-of-y",
    });

    assert.equal(modifiedPages, 3);
  });
});

describe("8. Watermark PDF Core Logic", () => {
  test("stamps text watermark on all pages of PDF", async () => {
    const inputBytes = await createTestDoc(3);
    const { pdfBytes, pageCount } = await watermarkPdfDocument(inputBytes, {
      text: "CONFIDENTIAL",
      opacity: 0.3,
      rotation: -45,
    });

    assert.equal(pageCount, 3);
    assert.ok(pdfBytes.byteLength > inputBytes.byteLength);

    const doc = await PDFDocument.load(pdfBytes);
    assert.equal(doc.getPageCount(), 3);
  });
});

describe("9. Protect & Unlock PDF Core Logic", () => {
  test("encrypts PDF with password and successfully unlocks with correct password", async () => {
    const inputBytes = await createTestDoc(2);

    // 1. Protect PDF
    const { pdfBytes: protectedBytes } = await protectPdfDocument(inputBytes, "StrongSecretKey123!");
    assert.ok(protectedBytes.byteLength > 0);

    // 2. Standard load without password must fail
    let loadFailed = false;
    try {
      await PDFDocument.load(protectedBytes);
    } catch {
      loadFailed = true;
    }
    assert.ok(loadFailed, "Protected PDF must fail to load without password");

    // 3. Unlock with wrong password must throw
    let wrongPassFailed = false;
    try {
      await unlockPdfDocument(protectedBytes, "WrongPassword");
    } catch (err) {
      wrongPassFailed = true;
      assert.ok(err.message.includes("Incorrect password"));
    }
    assert.ok(wrongPassFailed, "Unlocking with wrong password must throw error");

    // 4. Unlock with correct password
    const { pdfBytes: unlockedBytes, pageCount } = await unlockPdfDocument(protectedBytes, "StrongSecretKey123!");
    assert.equal(pageCount, 2);

    // 5. Unlocked PDF loads cleanly without passwords
    const cleanDoc = await PDFDocument.load(unlockedBytes);
    assert.equal(cleanDoc.getPageCount(), 2);
  });
});

describe("10. PDF Suite 2 SEO & Structured Metadata Verification", () => {
  const pages = [
    { name: "Add Page Numbers", path: "src/app/add-page-numbers/page.jsx", canonical: "/add-page-numbers" },
    { name: "Watermark PDF", path: "src/app/watermark-pdf/page.jsx", canonical: "/watermark-pdf" },
    { name: "Protect PDF", path: "src/app/protect-pdf/page.jsx", canonical: "/protect-pdf" },
    { name: "Unlock PDF", path: "src/app/unlock-pdf/page.jsx", canonical: "/unlock-pdf" },
  ];

  for (const page of pages) {
    test(`${page.name} exports canonical metadata, FAQPage, and WebApplication schemas`, () => {
      const pageContent = fs.readFileSync(page.path, "utf8");
      assert.ok(pageContent.includes(`canonical: "${page.canonical}"`));
      assert.ok(pageContent.includes("export const metadata = {"));
      assert.ok(pageContent.includes('"@type": "WebApplication"'));
      assert.ok(pageContent.includes("<FAQSection"));
      assert.ok(pageContent.includes("<HowItWorks"));
      assert.ok(pageContent.includes("<RelatedTools"));
    });
  }
});
