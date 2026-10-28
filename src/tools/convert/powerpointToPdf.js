/**
 * Client-Side PowerPoint (.pptx) & Outline to PDF Presentation Engine.
 * Extracts slides, titles, and body bullets from .pptx OpenXML archives via JSZip
 * and formats them into high-definition 16:9 landscape PDF slides using pdf-lib.
 * 100% private in browser memory.
 */

import JSZip from "jszip";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { wrapText } from "./htmlToPdf.js";

/**
 * Extracts slides from a .pptx archive.
 * @param {JSZip} zip
 * @returns {Promise<Array<{ title: string, bullets: string[] }>>}
 */
export async function extractPptxSlides(zip) {
  // Find all slide XML files
  const slideFiles = zip.file(/ppt\/slides\/slide\d+\.xml/i);

  // Sort sequentially: slide1.xml, slide2.xml ...
  slideFiles.sort((a, b) => {
    const numA = parseInt(a.name.match(/\d+/)[0], 10);
    const numB = parseInt(b.name.match(/\d+/)[0], 10);
    return numA - numB;
  });

  if (slideFiles.length === 0) {
    throw new Error("No slide XML files found inside the PowerPoint presentation.");
  }

  const slides = [];

  for (const sFile of slideFiles) {
    const xmlText = await sFile.async("text");

    // Extract all paragraphs <a:p>
    const pRegex = /<a:p\b[^>]*>([\s\S]*?)<\/a:p>/gi;
    let pMatch;
    const paragraphs = [];

    while ((pMatch = pRegex.exec(xmlText)) !== null) {
      const pContent = pMatch[1];
      const tRegex = /<a:t\b[^>]*>([\s\S]*?)<\/a:t>/gi;
      let tMatch;
      let lineText = "";
      while ((tMatch = tRegex.exec(pContent)) !== null) {
        lineText += tMatch[1];
      }
      const clean = lineText.trim();
      if (clean) paragraphs.push(clean);
    }

    if (paragraphs.length > 0) {
      const title = paragraphs[0];
      const bullets = paragraphs.slice(1);
      slides.push({ title, bullets });
    }
  }

  return slides;
}

/**
 * Parses markdown or text outline into slide objects.
 * Slide delimiter: '---' or lines starting with '# '
 * @param {string} outlineText
 * @returns {Array<{ title: string, bullets: string[] }>>}
 */
export function parseOutlineSlides(outlineText = "") {
  const rawSections = outlineText.split(/\n\s*---\s*\n/);
  const slides = [];

  for (const sec of rawSections) {
    const lines = sec.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    let title = lines[0].replace(/^#+\s*/, "");
    let bullets = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const cleanBullet = line.replace(/^[-*•]\s*|\d+\.\s*/, "").trim();
      if (cleanBullet) bullets.push(cleanBullet);
    }

    slides.push({ title, bullets });
  }

  return slides.length > 0 ? slides : [{ title: "Presentation", bullets: ["Slide content"] }];
}

/**
 * Converts a PowerPoint (.pptx) file or outline into a landscape PDF slide presentation.
 *
 * @param {ArrayBuffer | Uint8Array | Blob | string} input
 * @param {object} [options]
 * @param {'modern'|'dark'|'clean'} [options.theme='modern']
 * @returns {Promise<{ pdfBytes: Uint8Array, slideCount: number, size: number }>}
 */
export async function convertPowerpointToPdf(input, options = {}) {
  const { theme = "modern" } = options;

  let slides = [];

  if (typeof input === "string") {
    slides = parseOutlineSlides(input);
  } else {
    let buffer;
    if (input instanceof Blob) buffer = await input.arrayBuffer();
    else if (input instanceof Uint8Array) buffer = input.buffer;
    else if (input instanceof ArrayBuffer) buffer = input;

    const isZip = buffer && buffer.byteLength > 4 &&
      new Uint8Array(buffer, 0, 2)[0] === 0x50 &&
      new Uint8Array(buffer, 0, 2)[1] === 0x4b;

    if (isZip) {
      const zip = await JSZip.loadAsync(buffer);
      slides = await extractPptxSlides(zip);
    } else {
      const text = new TextDecoder("utf-8").decode(buffer);
      slides = parseOutlineSlides(text);
    }
  }

  if (slides.length === 0) {
    throw new Error("No slide content could be extracted.");
  }

  // Standard 16:9 Slide Dimensions (960 x 540 pt)
  const slideWidth = 960;
  const slideHeight = 540;
  const margin = 60;
  const contentWidth = slideWidth - margin * 2;

  const pdfDoc = await PDFDocument.create();
  const fontTitle = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontBody = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  // Theme palettes
  const isDark = theme === "dark";
  const bgColor = isDark ? rgb(0.08, 0.1, 0.14) : rgb(0.98, 0.99, 1);
  const titleColor = isDark ? rgb(1, 1, 1) : rgb(0.09, 0.12, 0.18);
  const textColor = isDark ? rgb(0.85, 0.88, 0.92) : rgb(0.25, 0.3, 0.38);
  const accentColor = rgb(0.14, 0.38, 0.92); // Vivid blue
  const mutedColor = isDark ? rgb(0.5, 0.55, 0.6) : rgb(0.55, 0.6, 0.65);
  const cardBg = isDark ? rgb(0.12, 0.15, 0.2) : rgb(1, 1, 1);
  const cardBorder = isDark ? rgb(0.2, 0.25, 0.32) : rgb(0.9, 0.92, 0.95);

  for (let sIdx = 0; sIdx < slides.length; sIdx++) {
    const slide = slides[sIdx];
    const page = pdfDoc.addPage([slideWidth, slideHeight]);

    // Canvas background
    page.drawRectangle({
      x: 0,
      y: 0,
      width: slideWidth,
      height: slideHeight,
      color: bgColor,
    });

    // Top Accent Header Bar
    page.drawRectangle({
      x: margin,
      y: slideHeight - 35,
      width: 40,
      height: 4,
      color: accentColor,
    });

    // Slide Number badge
    const badgeText = `${String(sIdx + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    const badgeW = fontMono.widthOfTextAtSize(badgeText, 11);
    page.drawText(badgeText, {
      x: slideWidth - margin - badgeW,
      y: slideHeight - 40,
      size: 11,
      font: fontMono,
      color: mutedColor,
    });

    // Slide Title
    const titleLines = wrapText(slide.title, contentWidth, fontTitle, 26);
    let titleY = slideHeight - 80;
    for (const tLine of titleLines) {
      page.drawText(tLine, {
        x: margin,
        y: titleY,
        size: 26,
        font: fontTitle,
        color: titleColor,
      });
      titleY -= 34;
    }

    // Slide Body Container Card
    const cardTop = titleY - 15;
    const cardBottom = 75;
    const cardHeight = Math.max(120, cardTop - cardBottom);

    page.drawRectangle({
      x: margin,
      y: cardBottom,
      width: contentWidth,
      height: cardHeight,
      color: cardBg,
      borderColor: cardBorder,
      borderWidth: 1,
    });

    // Bullets inside card
    let bulletY = cardTop - 35;
    const bulletFontSize = 14;
    const bulletLineHeight = 22;

    for (const bullet of slide.bullets) {
      if (bulletY < cardBottom + 25) break; // prevent overflow

      const lines = wrapText(bullet, contentWidth - 50, fontBody, bulletFontSize);

      // Bullet disc
      page.drawCircle({
        x: margin + 25,
        y: bulletY + 4,
        size: 3.5,
        color: accentColor,
      });

      for (const line of lines) {
        if (bulletY < cardBottom + 20) break;
        page.drawText(line, {
          x: margin + 40,
          y: bulletY,
          size: bulletFontSize,
          font: fontBody,
          color: textColor,
        });
        bulletY -= bulletLineHeight;
      }
      bulletY -= 8;
    }

    // Slide Footer
    page.drawText("Bits & Tools Presentation Converter", {
      x: margin,
      y: 35,
      size: 9,
      font: fontBody,
      color: mutedColor,
    });
  }

  const pdfBytes = await pdfDoc.save();

  return {
    pdfBytes,
    slideCount: slides.length,
    size: pdfBytes.length,
  };
}
