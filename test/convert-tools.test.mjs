import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parseHtmlStructure, cleanHtmlText, convertHtmlToPdf } from "../src/tools/convert/htmlToPdf.js";
import { parseSpreadsheet, convertExcelToPdf } from "../src/tools/convert/excelToPdf.js";
import { parseDocxXml } from "../src/tools/convert/wordToPdf.js";
import { escapeXml } from "../src/tools/convert/pdfToWord.js";
import { indexToColLetter } from "../src/tools/convert/pdfToExcel.js";
import { parseOutlineSlides, convertPowerpointToPdf } from "../src/tools/convert/powerpointToPdf.js";
import { getToolById, getToolsByCategory, getAvailableTools } from "../src/data/toolsRegistry.js";

describe("1. HTML to PDF Core Logic", () => {
  test("cleans HTML tags and entities properly", () => {
    const raw = "<p>Hello &amp; welcome to &lt;Toolora&gt;&nbsp;suite!</p>";
    assert.equal(cleanHtmlText(raw), "Hello & welcome to <Toolora> suite!");
  });

  test("parses HTML structure into headings, paragraphs, and lists", () => {
    const html = `
      <html>
        <head><title>Project Proposal</title></head>
        <body>
          <h1>Quarterly Objectives</h1>
          <p>This document details our primary growth milestones for 2026.</p>
          <ul>
            <li>Client-side privacy preservation</li>
            <li>Zero server processing overhead</li>
          </ul>
        </body>
      </html>
    `;
    const parsed = parseHtmlStructure(html);
    assert.equal(parsed.title, "Project Proposal");
    assert.ok(parsed.blocks.some((b) => b.type === "h1" && b.text.includes("Quarterly")));
    assert.ok(parsed.blocks.some((b) => b.type === "p" && b.text.includes("milestones")));
    assert.ok(parsed.blocks.some((b) => b.type === "ul" && b.items.length === 2));
  });

  test("converts HTML markup into a valid downloadable PDF byte stream", async () => {
    const html = "<h1>Invoice #1042</h1><p>Client: Acme Corp</p><hr><p>Total Due: $450.00</p>";
    const res = await convertHtmlToPdf(html, { pageSize: "a4" });
    assert.ok(res.pdfBytes instanceof Uint8Array);
    assert.ok(res.pdfBytes.length > 500);
    assert.equal(res.pageCount, 1);
  });
});

describe("2. Excel & CSV to PDF Core Logic", () => {
  test("parses raw CSV text into 2D matrix", async () => {
    const csv = "Product,Category,Price\nWidget A,Hardware,19.99\nService B,Cloud,99.00";
    const parsed = await parseSpreadsheet(csv);
    assert.equal(parsed.rows.length, 3);
    assert.equal(parsed.rows[0][0], "Product");
    assert.equal(parsed.rows[1][2], "19.99");
  });

  test("converts tabular data into a multi-page PDF document", async () => {
    const csv = "ID,Name,Role\n1,Alice,Engineer\n2,Bob,Designer\n3,Charlie,Product";
    const res = await convertExcelToPdf(csv, { orientation: "landscape" });
    assert.ok(res.pdfBytes.length > 500);
    assert.equal(res.rowCount, 4);
    assert.equal(res.colCount, 3);
  });
});

describe("3. Word to PDF Core Logic", () => {
  test("parses word/document.xml tags into paragraphs and headings", () => {
    const sampleXml = `
      <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
          <w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>Executive Summary</w:t></w:r></w:p>
          <w:p><w:r><w:t>Toolora delivers client-side web utilities.</w:t></w:r></w:p>
        </w:body>
      </w:document>
    `;
    const elements = parseDocxXml(sampleXml);
    assert.equal(elements.length, 2);
    assert.equal(elements[0].type, "h1");
    assert.equal(elements[0].text, "Executive Summary");
    assert.equal(elements[1].type, "p");
  });
});

describe("4. PDF to Excel & Helper Core Logic", () => {
  test("converts column indices to Excel column letters", () => {
    assert.equal(indexToColLetter(0), "A");
    assert.equal(indexToColLetter(1), "B");
    assert.equal(indexToColLetter(25), "Z");
    assert.equal(indexToColLetter(26), "AA");
    assert.equal(indexToColLetter(27), "AB");
  });

  test("escapes XML special characters properly", () => {
    assert.equal(escapeXml('A & B < C > "D"'), "A &amp; B &lt; C &gt; &quot;D&quot;");
  });
});

describe("5. PowerPoint to PDF Core Logic", () => {
  test("parses outline markdown into slide objects with titles and bullets", () => {
    const outline = `
# Q4 Roadmap
- Launch file conversion suite
- Optimize bundle size

---

# Architecture
- 100% client-side WebAssembly & Canvas
- Zero server dependencies
    `;
    const slides = parseOutlineSlides(outline);
    assert.equal(slides.length, 2);
    assert.equal(slides[0].title, "Q4 Roadmap");
    assert.equal(slides[0].bullets.length, 2);
    assert.equal(slides[1].title, "Architecture");
  });

  test("converts presentation outline into landscape 16:9 PDF slides", async () => {
    const outline = "# Title Slide\n- First point\n- Second point";
    const res = await convertPowerpointToPdf(outline, { theme: "modern" });
    assert.ok(res.pdfBytes.length > 500);
    assert.equal(res.slideCount, 1);
  });
});

describe("6. Conversion Tools Registry & Routing Verification", () => {
  const expectedTools = [
    { id: "word-to-pdf", route: "/word-to-pdf" },
    { id: "pdf-to-word", route: "/pdf-to-word" },
    { id: "excel-to-pdf", route: "/excel-to-pdf" },
    { id: "pdf-to-excel", route: "/pdf-to-excel" },
    { id: "powerpoint-to-pdf", route: "/powerpoint-to-pdf" },
    { id: "html-to-pdf", route: "/html-to-pdf" },
  ];

  test("all 6 conversion tools are active, available, and correctly routed", () => {
    for (const item of expectedTools) {
      const tool = getToolById(item.id);
      assert.ok(tool, `Tool ${item.id} must exist in toolsRegistry`);
      assert.equal(tool.status, "available", `${item.id} must have status: available`);
      assert.equal(tool.route, item.route, `${item.id} must route to ${item.route}`);
      assert.equal(tool.category, "convert");
    }

    const convTools = getToolsByCategory("convert");
    assert.equal(convTools.filter((t) => t.status === "available").length, 6);
  });

  test("total available tools in registry reaches 50", () => {
    assert.equal(getAvailableTools().length, 55);
  });
});

describe("7. Conversion Tool Pages SEO & Schema Verification", () => {
  const pages = [
    { name: "HTML to PDF", path: "src/app/html-to-pdf/page.jsx", canonical: "/html-to-pdf" },
    { name: "Excel to PDF", path: "src/app/excel-to-pdf/page.jsx", canonical: "/excel-to-pdf" },
    { name: "Word to PDF", path: "src/app/word-to-pdf/page.jsx", canonical: "/word-to-pdf" },
    { name: "PDF to Word", path: "src/app/pdf-to-word/page.jsx", canonical: "/pdf-to-word" },
    { name: "PDF to Excel", path: "src/app/pdf-to-excel/page.jsx", canonical: "/pdf-to-excel" },
    { name: "PowerPoint to PDF", path: "src/app/powerpoint-to-pdf/page.jsx", canonical: "/powerpoint-to-pdf" },
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

  test("Convert Tools category hub exports canonical metadata", () => {
    const hubContent = fs.readFileSync("src/app/convert-tools/page.jsx", "utf8");
    assert.ok(hubContent.includes('canonical: "/convert-tools"'));
    assert.ok(hubContent.includes("export const metadata = {"));
  });
});
