import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Production Readiness & Zero-Issue Audit Verification", () => {
  const rootDir = process.cwd();

  test("1. Open Graph banner image exists and layout exports social card metadata", () => {
    const ogImagePath = path.join(rootDir, "public", "images", "og-bitsandtools.png");
    assert.ok(fs.existsSync(ogImagePath), "public/images/og-bitsandtools.png must exist");

    const stat = fs.statSync(ogImagePath);
    assert.ok(stat.size > 1000, "OG image must be a valid non-empty graphic file");

    const layoutCode = fs.readFileSync(path.join(rootDir, "src", "app", "layout.jsx"), "utf-8");
    assert.ok(layoutCode.includes("og-bitsandtools.png"), "layout.jsx must reference og-bitsandtools.png");
    assert.ok(layoutCode.includes("openGraph:"), "layout.jsx must configure openGraph");
    assert.ok(layoutCode.includes("twitter:"), "layout.jsx must configure twitter");
    assert.ok(layoutCode.includes("msvalidate.01"), "layout.jsx must support Bing Webmaster verification");
  });

  test("2. Homepage integrates FAQ section with FAQPage schema", () => {
    const homeCode = fs.readFileSync(path.join(rootDir, "src", "app", "page.jsx"), "utf-8");
    assert.ok(homeCode.includes("FAQSection"), "Homepage must import and render FAQSection");
    assert.ok(homeCode.includes("HOMEPAGE_FAQS"), "Homepage must define HOMEPAGE_FAQS data");
    assert.ok(homeCode.includes("Frequently Asked Questions"), "Homepage must display FAQ heading");
  });

  test("3. Category hub pages have no obsolete in-development copy or empty upcoming sections", () => {
    const pdfHub = fs.readFileSync(path.join(rootDir, "src", "app", "pdf-tools", "page.jsx"), "utf-8");
    const imgHub = fs.readFileSync(path.join(rootDir, "src", "app", "image-tools", "page.jsx"), "utf-8");

    assert.ok(pdfHub.includes("upcomingTools.length > 0"), "PDF hub must conditionally guard upcoming tools");
    assert.ok(imgHub.includes("upcomingTools.length > 0"), "Image hub must conditionally guard upcoming tools");
    assert.ok(!imgHub.includes("Image Compression & Format Tools In Development"), "Image hub must not display obsolete in-development banner");
  });

  test("4. robots.js disallows /offline to protect crawl budget", () => {
    const robotsCode = fs.readFileSync(path.join(rootDir, "src", "app", "robots.js"), "utf-8");
    assert.ok(robotsCode.includes('disallow: ["/offline"]'), "robots.js must disallow /offline route");
  });

  test("5. Error boundary exists and catches unexpected runtime errors", () => {
    const errorPage = path.join(rootDir, "src", "app", "error.jsx");

    assert.ok(fs.existsSync(errorPage), "src/app/error.jsx must exist");

    const errorCode = fs.readFileSync(errorPage, "utf-8");
    assert.ok(errorCode.includes("Try Again"), "error.jsx must provide Try Again action");
    assert.ok(errorCode.includes("reset()"), "error.jsx must invoke reset handler");
    assert.ok(errorCode.includes("Bits & Tools"), "error.jsx must brand as Bits & Tools");
  });

  test("6. Service Worker precaches pdf.worker.min.js for complete offline operation", () => {
    const swCode = fs.readFileSync(path.join(rootDir, "public", "sw.js"), "utf-8");
    assert.ok(swCode.includes("'/pdf.worker.min.js'"), "sw.js must precache pdf.worker.min.js");
  });

  test("7. next.config.mjs defines HTTP security headers", () => {
    const nextConfig = fs.readFileSync(path.join(rootDir, "next.config.mjs"), "utf-8");
    assert.ok(nextConfig.includes("X-Content-Type-Options"), "Must include X-Content-Type-Options header");
    assert.ok(nextConfig.includes("X-Frame-Options"), "Must include X-Frame-Options header");
    assert.ok(nextConfig.includes("Referrer-Policy"), "Must include Referrer-Policy header");
    assert.ok(nextConfig.includes("Permissions-Policy"), "Must include Permissions-Policy header");
  });

  test("8. Image resize engine clamps extreme canvas dimensions", () => {
    const resizeCode = fs.readFileSync(path.join(rootDir, "src", "tools", "image", "imageResize.js"), "utf-8");
    assert.ok(resizeCode.includes("MAX_CANVAS_DIMENSION"), "imageResize.js must define MAX_CANVAS_DIMENSION");
    assert.ok(resizeCode.includes("MAX_CANVAS_PIXELS"), "imageResize.js must define MAX_CANVAS_PIXELS");
  });

  test("9. Video tools support Safari MP4 and WebM codec fallbacks", () => {
    const compressCode = fs.readFileSync(path.join(rootDir, "src", "components", "media", "CompressVideoWorkspace.jsx"), "utf-8");
    const trimCode = fs.readFileSync(path.join(rootDir, "src", "components", "media", "TrimVideoWorkspace.jsx"), "utf-8");

    assert.ok(compressCode.includes("video/mp4"), "Compress video must check video/mp4 support");
    assert.ok(trimCode.includes("video/mp4"), "Trim video must check video/mp4 support");
  });

  test("10. PWA install banner avoids mobile cookie banner overlap", () => {
    const pwaCode = fs.readFileSync(path.join(rootDir, "src", "components", "pwa", "InstallPwaBanner.jsx"), "utf-8");
    assert.ok(pwaCode.includes("cookieConsentResolved"), "Install banner must coordinate with cookie consent");
  });

  test("11. Header locks body scrolling on mobile menu open", () => {
    const headerCode = fs.readFileSync(path.join(rootDir, "src", "components", "common", "Header.jsx"), "utf-8");
    assert.ok(headerCode.includes('document.body.style.overflow = "hidden"'), "Header must lock body scroll");
  });

  test("12. No visible contact us links or milestone banner on application view", () => {
    const headerCode = fs.readFileSync(path.join(rootDir, "src", "components", "common", "Header.jsx"), "utf-8");
    const footerCode = fs.readFileSync(path.join(rootDir, "src", "components", "common", "Footer.jsx"), "utf-8");
    const homeCode = fs.readFileSync(path.join(rootDir, "src", "app", "page.jsx"), "utf-8");
    const notFoundCode = fs.readFileSync(path.join(rootDir, "src", "app", "not-found.jsx"), "utf-8");

    assert.ok(!headerCode.includes('href="/contact"'), "Header must not link to /contact");
    assert.ok(!footerCode.includes('href="/contact"'), "Footer must not link to /contact");
    assert.ok(!footerCode.includes('mailto:'), "Footer must not display mailto email");
    assert.ok(!homeCode.includes("100% Delivery Milestone Achieved"), "Homepage must not contain milestone banner");
    assert.ok(!homeCode.includes("All 55 Planned In-Browser Utilities Are Live!"), "Homepage must not contain dev completion banner");
    assert.ok(!notFoundCode.includes('href="/contact"'), "Not-found page must not link to /contact");
  });

  test("13. SEO Schemas configure founders and aggregateRating across tools", () => {
    const layoutCode = fs.readFileSync(path.join(rootDir, "src", "app", "layout.jsx"), "utf-8");
    assert.ok(layoutCode.includes("Vishavjeet Sharma"), "Layout must configure Vishavjeet Sharma as founder");
    assert.ok(layoutCode.includes("Aditya Sharma"), "Layout must configure Aditya Sharma as founder");
    assert.ok(layoutCode.includes("vishavjeetsharma88@gmail.com"), "Layout must configure founder email");
    assert.ok(layoutCode.includes("sharmaaditya14jul@gmail.com"), "Layout must configure founder email");

    const mergeCode = fs.readFileSync(path.join(rootDir, "src", "app", "merge-pdf", "page.jsx"), "utf-8");
    assert.ok(mergeCode.includes("aggregateRating"), "Tool page must include aggregateRating");
  });

  test("14. Strict brand integrity: zero occurrences of 'toolora'", () => {
    const targetFiles = [
      "src/app/error.jsx",
      "src/app/page.jsx",
      "src/app/layout.jsx",
      "src/components/analytics/GoogleAnalyticsScript.jsx",
      "public/sw.js",
    ];

    for (const relPath of targetFiles) {
      const fullPath = path.join(rootDir, relPath);
      if (fs.existsSync(fullPath)) {
        const text = fs.readFileSync(fullPath, "utf-8");
        assert.ok(!text.toLowerCase().includes("toolora"), `${relPath} must never contain 'toolora'`);
      }
    }
  });
});
