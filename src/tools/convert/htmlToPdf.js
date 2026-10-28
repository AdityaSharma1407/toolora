/**
 * Client-Side HTML to PDF Conversion Engine.
 * Formats HTML text, code, tables, and documents into high-quality paginated PDFs using pdf-lib.
 * 100% private in-browser execution with zero server dependencies.
 */

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const PAGE_SIZES = {
  a4: { name: "A4", width: 595.28, height: 841.89 },
  letter: { name: "US Letter", width: 612.0, height: 792.0 },
  legal: { name: "Legal", width: 612.0, height: 1008.0 },
};

/**
 * Strips HTML tags and decodes common HTML entities for plain text measurement.
 * @param {string} str
 * @returns {string}
 */
export function cleanHtmlText(str = "") {
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Splits text into words and wraps them to fit within a given maximum width.
 * @param {string} text
 * @param {number} maxWidth
 * @param {import('pdf-lib').PDFFont} font
 * @param {number} fontSize
 * @returns {string[]}
 */
export function wrapText(text, maxWidth, font, fontSize) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = words[0] || "";

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = `${currentLine} ${word}`;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Parses raw HTML string into structured logical blocks for PDF rendering.
 * @param {string} html
 * @returns {{ title: string, blocks: Array<{ type: string, text?: string, items?: string[], rows?: string[][] }> }}
 */
export function parseHtmlStructure(html = "") {
  let title = "Document";
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch && titleMatch[1].trim()) {
    title = cleanHtmlText(titleMatch[1]);
  }

  // Remove <head> and <style> and <script> contents
  const bodyHtml = html
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "");

  const blocks = [];

  // Match major tags sequentially
  const tagRegex = /<(h[1-6]|p|blockquote|pre|ul|ol|table|hr)[^>]*>([\s\S]*?)<\/\1>|<(hr)[^>]*\/?>/gi;
  let match;
  let lastIndex = 0;

  while ((match = tagRegex.exec(bodyHtml)) !== null) {
    const tagName = (match[1] || match[3] || "").toLowerCase();
    const content = match[2] || "";

    if (tagName.startsWith("h")) {
      const clean = cleanHtmlText(content);
      if (clean) {
        blocks.push({ type: tagName, text: clean });
        if (title === "Document" && tagName === "h1") title = clean;
      }
    } else if (tagName === "p") {
      const clean = cleanHtmlText(content);
      if (clean) blocks.push({ type: "p", text: clean });
    } else if (tagName === "blockquote") {
      const clean = cleanHtmlText(content);
      if (clean) blocks.push({ type: "blockquote", text: clean });
    } else if (tagName === "pre") {
      const clean = content.replace(/<[^>]*>/g, "").trim();
      if (clean) blocks.push({ type: "pre", text: clean });
    } else if (tagName === "ul" || tagName === "ol") {
      const liMatches = [...content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
      const items = liMatches.map((m) => cleanHtmlText(m[1])).filter(Boolean);
      if (items.length > 0) {
        blocks.push({ type: tagName, items });
      }
    } else if (tagName === "table") {
      const rowMatches = [...content.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
      const rows = [];
      for (const rowMatch of rowMatches) {
        const cellMatches = [...rowMatch[1].matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)];
        const cells = cellMatches.map((c) => cleanHtmlText(c[1]));
        if (cells.length > 0) rows.push(cells);
      }
      if (rows.length > 0) {
        blocks.push({ type: "table", rows });
      }
    } else if (tagName === "hr") {
      blocks.push({ type: "hr" });
    }
  }

  // Fallback: If no structured tags found (e.g. raw text with <br>), split by paragraphs
  if (blocks.length === 0) {
    const cleanBody = cleanHtmlText(bodyHtml);
    const paragraphs = cleanBody.split(/\n\s*\n|\r\n\s*\r\n/);
    for (const p of paragraphs) {
      if (p.trim()) blocks.push({ type: "p", text: p.trim() });
    }
  }

  return { title, blocks };
}

/**
 * Converts an HTML string or File into a paginated PDF document.
 *
 * @param {string | File | Blob} htmlInput
 * @param {object} [options]
 * @param {'a4'|'letter'|'legal'} [options.pageSize='a4']
 * @param {'portrait'|'landscape'} [options.orientation='portrait']
 * @param {number} [options.margin=40]
 * @param {'modern'|'classic'|'minimal'} [options.theme='modern']
 * @returns {Promise<{ pdfBytes: Uint8Array, pageCount: number, title: string, size: number }>}
 */
export async function convertHtmlToPdf(htmlInput, options = {}) {
  let htmlString = "";
  if (typeof htmlInput === "string") {
    htmlString = htmlInput;
  } else if (htmlInput instanceof Blob) {
    htmlString = await htmlInput.text();
  } else {
    throw new Error("Invalid HTML input provided.");
  }

  const {
    pageSize = "a4",
    orientation = "portrait",
    margin = 40,
    theme = "modern",
  } = options;

  const sizeDef = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;
  let pageWidth = sizeDef.width;
  let pageHeight = sizeDef.height;

  if (orientation === "landscape") {
    pageWidth = sizeDef.height;
    pageHeight = sizeDef.width;
  }

  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  // Initialize PDF document
  const pdfDoc = await PDFDocument.create();

  // Load fonts
  const fontRegular = await pdfDoc.embedFont(
    theme === "classic" ? StandardFonts.TimesRoman : StandardFonts.Helvetica
  );
  const fontBold = await pdfDoc.embedFont(
    theme === "classic" ? StandardFonts.TimesRomanBold : StandardFonts.HelveticaBold
  );
  const fontOblique = await pdfDoc.embedFont(
    theme === "classic" ? StandardFonts.TimesRomanItalic : StandardFonts.HelveticaOblique
  );
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  const { title, blocks } = parseHtmlStructure(htmlString);

  // Pagination cursor
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - margin;

  const checkPageBreak = (neededHeight) => {
    if (currentY - neededHeight < margin + 20) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      currentY = pageHeight - margin;
      return true;
    }
    return false;
  };

  // Color palette
  const textColor = rgb(0.12, 0.14, 0.17); // Slate 900
  const brandColor = rgb(0.14, 0.38, 0.92); // Blue 600
  const mutedColor = rgb(0.4, 0.45, 0.5); // Slate 500
  const borderGray = rgb(0.85, 0.88, 0.92); // Slate 200
  const bgLightGray = rgb(0.96, 0.97, 0.98); // Slate 50

  // Render blocks
  for (const block of blocks) {
    if (block.type === "h1") {
      const fontSize = 20;
      const lines = wrapText(block.text, contentWidth, fontBold, fontSize);
      checkPageBreak(lines.length * 26 + 16);

      for (const line of lines) {
        currentPage.drawText(line, {
          x: margin,
          y: currentY - fontSize,
          size: fontSize,
          font: fontBold,
          color: theme === "modern" ? brandColor : textColor,
        });
        currentY -= 26;
      }
      currentY -= 10;
    } else if (block.type === "h2") {
      const fontSize = 15;
      const lines = wrapText(block.text, contentWidth, fontBold, fontSize);
      checkPageBreak(lines.length * 20 + 12);

      for (const line of lines) {
        currentPage.drawText(line, {
          x: margin,
          y: currentY - fontSize,
          size: fontSize,
          font: fontBold,
          color: textColor,
        });
        currentY -= 20;
      }
      currentY -= 8;
    } else if (block.type === "h3") {
      const fontSize = 12.5;
      const lines = wrapText(block.text, contentWidth, fontBold, fontSize);
      checkPageBreak(lines.length * 17 + 8);

      for (const line of lines) {
        currentPage.drawText(line, {
          x: margin,
          y: currentY - fontSize,
          size: fontSize,
          font: fontBold,
          color: textColor,
        });
        currentY -= 17;
      }
      currentY -= 6;
    } else if (block.type === "p") {
      const fontSize = 10;
      const lineHeight = 15;
      const lines = wrapText(block.text, contentWidth, fontRegular, fontSize);
      checkPageBreak(lines.length * lineHeight + 8);

      for (const line of lines) {
        currentPage.drawText(line, {
          x: margin,
          y: currentY - fontSize,
          size: fontSize,
          font: fontRegular,
          color: textColor,
        });
        currentY -= lineHeight;
      }
      currentY -= 6;
    } else if (block.type === "blockquote") {
      const fontSize = 9.5;
      const lineHeight = 14;
      const indent = 16;
      const lines = wrapText(block.text, contentWidth - indent, fontOblique, fontSize);
      const totalH = lines.length * lineHeight + 10;
      checkPageBreak(totalH);

      // Accent vertical bar
      currentPage.drawLine({
        start: { x: margin, y: currentY },
        end: { x: margin, y: currentY - totalH + 4 },
        thickness: 3,
        color: brandColor,
      });

      for (const line of lines) {
        currentPage.drawText(line, {
          x: margin + indent,
          y: currentY - fontSize - 2,
          size: fontSize,
          font: fontOblique,
          color: textColor,
        });
        currentY -= lineHeight;
      }
      currentY -= 8;
    } else if (block.type === "pre") {
      const fontSize = 8.5;
      const lineHeight = 12;
      const codeLines = block.text.split("\n");
      const boxH = codeLines.length * lineHeight + 14;
      checkPageBreak(boxH);

      // Background box
      currentPage.drawRectangle({
        x: margin,
        y: currentY - boxH,
        width: contentWidth,
        height: boxH,
        color: bgLightGray,
        borderColor: borderGray,
        borderWidth: 1,
      });

      let codeY = currentY - 12;
      for (const cline of codeLines) {
        const truncated = cline.length > 80 ? cline.slice(0, 77) + "..." : cline;
        currentPage.drawText(truncated, {
          x: margin + 8,
          y: codeY - fontSize,
          size: fontSize,
          font: fontMono,
          color: textColor,
        });
        codeY -= lineHeight;
      }
      currentY -= boxH + 8;
    } else if (block.type === "ul" || block.type === "ol") {
      const fontSize = 10;
      const lineHeight = 15;

      for (let i = 0; i < block.items.length; i++) {
        const itemText = block.items[i];
        const prefix = block.type === "ol" ? `${i + 1}. ` : "\u2022 ";
        const prefixWidth = fontBold.widthOfTextAtSize(prefix, fontSize) + 4;
        const lines = wrapText(itemText, contentWidth - prefixWidth, fontRegular, fontSize);
        checkPageBreak(lines.length * lineHeight + 4);

        currentPage.drawText(prefix, {
          x: margin + 6,
          y: currentY - fontSize,
          size: fontSize,
          font: fontBold,
          color: brandColor,
        });

        for (let l = 0; l < lines.length; l++) {
          currentPage.drawText(lines[l], {
            x: margin + 6 + prefixWidth,
            y: currentY - fontSize,
            size: fontSize,
            font: fontRegular,
            color: textColor,
          });
          currentY -= lineHeight;
        }
      }
      currentY -= 6;
    } else if (block.type === "table") {
      const rows = block.rows;
      if (rows.length === 0) continue;
      const colCount = Math.max(...rows.map((r) => r.length));
      if (colCount === 0) continue;

      const colWidth = contentWidth / colCount;
      const rowHeight = 22;
      const fontSize = 9;

      for (let r = 0; r < rows.length; r++) {
        checkPageBreak(rowHeight + 4);
        const row = rows[r];
        const isHeader = r === 0;

        if (isHeader) {
          currentPage.drawRectangle({
            x: margin,
            y: currentY - rowHeight,
            width: contentWidth,
            height: rowHeight,
            color: bgLightGray,
            borderColor: borderGray,
            borderWidth: 1,
          });
        }

        for (let c = 0; c < colCount; c++) {
          const val = row[c] || "";
          const truncated = fontRegular.widthOfTextAtSize(val, fontSize) > colWidth - 8
            ? val.slice(0, Math.floor((colWidth - 8) / 6)) + "..."
            : val;

          currentPage.drawText(truncated, {
            x: margin + c * colWidth + 4,
            y: currentY - rowHeight + 6,
            size: fontSize,
            font: isHeader ? fontBold : fontRegular,
            color: isHeader ? brandColor : textColor,
          });
        }

        // Horizontal row line
        currentPage.drawLine({
          start: { x: margin, y: currentY - rowHeight },
          end: { x: margin + contentWidth, y: currentY - rowHeight },
          thickness: 0.5,
          color: borderGray,
        });

        currentY -= rowHeight;
      }
      currentY -= 8;
    } else if (block.type === "hr") {
      checkPageBreak(12);
      currentPage.drawLine({
        start: { x: margin, y: currentY - 6 },
        end: { x: margin + contentWidth, y: currentY - 6 },
        thickness: 1,
        color: borderGray,
      });
      currentY -= 14;
    }
  }

  // Running footer on all pages: "Page X of Y" and document title
  const totalPages = pdfDoc.getPageCount();
  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const footerText = `Page ${i + 1} of ${totalPages}`;
    const footerSize = 8;
    const footerW = fontRegular.widthOfTextAtSize(footerText, footerSize);

    // Page number on right
    page.drawText(footerText, {
      x: pageWidth - margin - footerW,
      y: margin / 2,
      size: footerSize,
      font: fontRegular,
      color: mutedColor,
    });

    // Title on left
    const truncTitle = title.length > 50 ? title.slice(0, 47) + "..." : title;
    page.drawText(truncTitle, {
      x: margin,
      y: margin / 2,
      size: footerSize,
      font: fontRegular,
      color: mutedColor,
    });

    // Subtle footer separator
    page.drawLine({
      start: { x: margin, y: margin / 2 + 12 },
      end: { x: pageWidth - margin, y: margin / 2 + 12 },
      thickness: 0.5,
      color: borderGray,
    });
  }

  const pdfBytes = await pdfDoc.save();

  return {
    pdfBytes,
    pageCount: totalPages,
    title,
    size: pdfBytes.length,
  };
}
