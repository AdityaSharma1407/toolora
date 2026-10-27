import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

/**
 * Applies text or image watermarks across PDF pages.
 * 
 * @param {ArrayBuffer | Uint8Array} pdfBytes
 * @param {object} options
 * @param {string} [options.text='CONFIDENTIAL']
 * @param {number} [options.fontSize=48]
 * @param {number} [options.opacity=0.25]
 * @param {number} [options.rotation=-45] - Rotation in degrees
 * @param {object} [options.color] - { r: 0.8, g: 0.2, b: 0.2 }
 * @param {string} [options.position='center'] - 'center' | 'top' | 'bottom'
 * @param {ArrayBuffer} [options.imageBytes] - Optional image watermark bytes
 * @param {string} [options.imageType] - 'png' | 'jpg'
 * @returns {Promise<{ pdfBytes: Uint8Array, pageCount: number }>}
 */
export async function watermarkPdfDocument(pdfBytes, options = {}) {
  const {
    text = "CONFIDENTIAL",
    fontSize = 48,
    opacity = 0.25,
    rotation = -45,
    color = { r: 0.7, g: 0.1, b: 0.1 },
    position = "center",
    imageBytes = null,
    imageType = "png",
  } = options;

  if (!pdfBytes || pdfBytes.byteLength === 0) {
    throw new Error("Invalid PDF buffer: buffer is empty.");
  }

  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: false });
  if (doc.isEncrypted) {
    throw new Error("This PDF document is password-protected. Please unlock it before adding a watermark.");
  }

  const pageCount = doc.getPageCount();
  if (pageCount === 0) {
    throw new Error("This PDF document contains 0 pages.");
  }

  let embeddedImage = null;
  if (imageBytes && imageBytes.byteLength > 0) {
    if (imageType === "jpg" || imageType === "jpeg") {
      embeddedImage = await doc.embedJpg(imageBytes);
    } else {
      embeddedImage = await doc.embedPng(imageBytes);
    }
  }

  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const markColor = rgb(color.r ?? 0.7, color.g ?? 0.1, color.b ?? 0.1);
  const rotAngle = degrees(rotation);

  for (let i = 0; i < pageCount; i++) {
    const page = doc.getPage(i);
    const { width, height } = page.getSize();

    if (embeddedImage) {
      // Draw image watermark
      const imgDims = embeddedImage.scale(0.5);
      const x = (width - imgDims.width) / 2;
      const y = (height - imgDims.height) / 2;

      page.drawImage(embeddedImage, {
        x,
        y,
        width: imgDims.width,
        height: imgDims.height,
        opacity: Math.max(0.05, Math.min(1, opacity)),
      });
    } else {
      // Draw text watermark
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      let x = (width - textWidth) / 2;
      let y = (height - textHeight) / 2;

      if (position === "top") {
        y = height * 0.75;
      } else if (position === "bottom") {
        y = height * 0.25;
      }

      // Adjust for center rotation
      if (rotation !== 0) {
        // When rotated around (x, y), adjust origin to rotate around text center
        const rad = (rotation * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const cx = width / 2;
        const cy = height / 2;

        x = cx - (textWidth / 2) * cos + (textHeight / 2) * sin;
        y = cy - (textWidth / 2) * sin - (textHeight / 2) * cos;
      }

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: markColor,
        opacity: Math.max(0.05, Math.min(1, opacity)),
        rotate: rotAngle,
      });
    }
  }

  const outputBytes = await doc.save();
  return {
    pdfBytes: outputBytes,
    pageCount,
  };
}
