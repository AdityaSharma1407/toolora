import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { formatCssVariables, formatTailwindConfig } from "../src/tools/image/colorPalette.js";
import { getSvgDimensions } from "../src/tools/image/svgToPng.js";
import { getAvailableTools, getToolById, CATEGORIES } from "../src/data/toolsRegistry.js";

describe("1. Color Palette Formatter Core Logic", () => {
  const mockPalette = [
    { hex: "#0284C7", rgb: { r: 2, g: 132, b: 199 }, hsl: { h: 200, s: 98, l: 39 } },
    { hex: "#4F46E5", rgb: { r: 79, g: 70, b: 229 }, hsl: { h: 243, s: 75, l: 59 } },
  ];

  test("formats palette into valid CSS custom variables", () => {
    const css = formatCssVariables(mockPalette);
    assert.ok(css.includes(":root {"));
    assert.ok(css.includes("--color-1: #0284C7;"));
    assert.ok(css.includes("--color-2: #4F46E5;"));
  });

  test("formats palette into valid Tailwind CSS configuration JSON", () => {
    const tailwindJson = formatTailwindConfig(mockPalette);
    const parsed = JSON.parse(tailwindJson);
    assert.equal(parsed["brand-100"], "#0284C7");
    assert.equal(parsed["brand-200"], "#4F46E5");
  });
});

describe("2. SVG Dimensions Extractor Core Logic", () => {
  test("extracts explicit width and height from SVG attributes", () => {
    const svg = '<svg width="800" height="600" viewBox="0 0 800 600"></svg>';
    const dims = getSvgDimensions(svg);
    assert.equal(dims.width, 800);
    assert.equal(dims.height, 600);
  });

  test("extracts dimensions from viewBox when width/height are percentages", () => {
    const svg = '<svg width="100%" height="100%" viewBox="0 0 1200 800"></svg>';
    const dims = getSvgDimensions(svg);
    assert.equal(dims.width, 1200);
    assert.equal(dims.height, 800);
  });
});

describe("3. Image Tools Registry Verification", () => {
  test("all 10 active Image tools are marked available with valid routes", () => {
    const expected = [
      { id: "resize-image", route: "/resize-image" },
      { id: "compress-image", route: "/compress-image" },
      { id: "image-converter", route: "/image-converter" },
      { id: "jpg-to-png", route: "/jpg-to-png" },
      { id: "png-to-jpg", route: "/png-to-jpg" },
      { id: "webp-converter", route: "/webp-converter" },
      { id: "color-palette-extractor", route: "/color-palette-extractor" },
      { id: "svg-to-png", route: "/svg-to-png" },
      { id: "crop-image", route: "/crop-image" },
      { id: "image-to-pdf", route: "/jpg-to-pdf" },
    ];

    for (const item of expected) {
      const tool = getToolById(item.id);
      assert.ok(tool, `Tool ${item.id} must exist in registry`);
      assert.equal(tool.status, "available", `${item.id} must have status: available`);
      assert.equal(tool.route, item.route, `${item.id} must point to ${item.route}`);
      assert.equal(tool.category, CATEGORIES.IMAGE.id);
    }

    const available = getAvailableTools().filter((t) => t.category === "image");
    assert.equal(available.length, 10);
  });
});

describe("4. Image Tool Pages SEO & Schema Verification", () => {
  const pages = [
    { name: "Resize Image", path: "src/app/resize-image/page.jsx", canonical: "/resize-image" },
    { name: "Compress Image", path: "src/app/compress-image/page.jsx", canonical: "/compress-image" },
    { name: "Image Converter", path: "src/app/image-converter/page.jsx", canonical: "/image-converter" },
    { name: "JPG to PNG", path: "src/app/jpg-to-png/page.jsx", canonical: "/jpg-to-png" },
    { name: "PNG to JPG", path: "src/app/png-to-jpg/page.jsx", canonical: "/png-to-jpg" },
    { name: "WebP Converter", path: "src/app/webp-converter/page.jsx", canonical: "/webp-converter" },
    { name: "Color Palette Extractor", path: "src/app/color-palette-extractor/page.jsx", canonical: "/color-palette-extractor" },
    { name: "SVG to PNG", path: "src/app/svg-to-png/page.jsx", canonical: "/svg-to-png" },
    { name: "Crop Image", path: "src/app/crop-image/page.jsx", canonical: "/crop-image" },
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
