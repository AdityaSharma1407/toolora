import { PDFDocument } from "pdf-lib";

export const PAGE_SIZES = {
  a4: {
    name: "A4",
    width: 595.28,
    height: 841.89,
  },
  letter: {
    name: "US Letter",
    width: 612.0,
    height: 792.0,
  },
  fit: {
    name: "Fit to Image",
  },
};

export const MARGINS = {
  none: 0,
  small: 15,
  medium: 30,
  large: 50,
};

/**
 * Converts one or more JPG, JPEG, or PNG images into a PDF document.
 *
 * @param {Array<{ file?: File, data?: Uint8Array | ArrayBuffer | Buffer, name: string, type?: string }>} images
 * @param {object} options
 * @param {'a4' | 'letter' | 'fit'} [options.pageSize='a4']
 * @param {'portrait' | 'landscape'} [options.orientation='portrait']
 * @param {'fit' | 'fill'} [options.placement='fit']
 * @param {'none' | 'small' | 'medium' | 'large'} [options.margin='small']
 * @param {string} [options.outputName='converted-document.pdf']
 * @param {Function} [onProgress]
 * @returns {Promise<{ bytes: Uint8Array, pageCount: number, byteLength: number, filename: string }>}
 */
export async function convertImagesToPdf(images = [], options = {}, onProgress = null) {
  if (!Array.isArray(images) || images.length === 0) {
    throw new Error("Please select at least one image to convert to PDF.");
  }

  const {
    pageSize = "a4",
    orientation = "portrait",
    placement = "fit",
    margin: marginKey = "small",
    outputName = "converted-document.pdf",
  } = options;

  const margin = MARGINS[marginKey] ?? 15;
  const total = images.length;

  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < images.length; i++) {
    const imgItem = images[i];
    const fileName = imgItem.name || `Image ${i + 1}`;

    if (onProgress) {
      onProgress({
        percent: Math.round(((i + 0.3) / total) * 100),
        message: `Processing "${fileName}" (${i + 1} of ${total})...`,
      });
    }

    // 1. Resolve raw binary buffer
    let rawBuffer;
    if (imgItem.data instanceof Uint8Array || imgItem.data instanceof ArrayBuffer) {
      rawBuffer = imgItem.data;
    } else if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(imgItem.data)) {
      rawBuffer = imgItem.data;
    } else if (imgItem.file && typeof imgItem.file.arrayBuffer === "function") {
      rawBuffer = await imgItem.file.arrayBuffer();
    } else if (imgItem && typeof imgItem.arrayBuffer === "function") {
      rawBuffer = await imgItem.arrayBuffer();
    } else {
      throw new Error(`Unable to read binary data for "${fileName}".`);
    }

    // 2. Identify image format
    const lowerName = fileName.toLowerCase();
    const mime = (imgItem.type || "").toLowerCase();
    const isPng = lowerName.endsWith(".png") || mime === "image/png";
    const isJpg =
      lowerName.endsWith(".jpg") ||
      lowerName.endsWith(".jpeg") ||
      mime === "image/jpeg" ||
      mime === "image/jpg";

    if (!isPng && !isJpg) {
      throw new Error(
        `"${fileName}" is not a supported format. Please upload JPG or PNG images.`
      );
    }

    // 3. Embed image into PDF
    let embeddedImage;
    try {
      if (isPng) {
        embeddedImage = await pdfDoc.embedPng(rawBuffer);
      } else {
        embeddedImage = await pdfDoc.embedJpg(rawBuffer);
      }
    } catch (err) {
      // If PNG embedding failed (e.g. non-standard color model), try embedding as JPG if mislabeled, or provide clean error
      try {
        embeddedImage = await pdfDoc.embedJpg(rawBuffer);
      } catch {
        throw new Error(
          `Could not decode "${fileName}". The image file may be corrupted or use an unsupported color profile.`
        );
      }
    }

    const { width: imgWidth, height: imgHeight } = embeddedImage;

    // 4. Calculate page dimensions
    let pageWidth;
    let pageHeight;

    if (pageSize === "fit") {
      // Page size matches image aspect ratio plus margins
      pageWidth = imgWidth + margin * 2;
      pageHeight = imgHeight + margin * 2;
    } else {
      const base = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;
      if (orientation === "landscape") {
        pageWidth = Math.max(base.width, base.height);
        pageHeight = Math.min(base.width, base.height);
      } else {
        pageWidth = Math.min(base.width, base.height);
        pageHeight = Math.max(base.width, base.height);
      }
    }

    // 5. Calculate drawing position and scaling
    const availWidth = Math.max(10, pageWidth - margin * 2);
    const availHeight = Math.max(10, pageHeight - margin * 2);

    let drawWidth;
    let drawHeight;
    let x;
    let y;

    if (pageSize === "fit") {
      drawWidth = imgWidth;
      drawHeight = imgHeight;
      x = margin;
      y = margin;
    } else if (placement === "fill") {
      // Cover page
      const scale = Math.max(availWidth / imgWidth, availHeight / imgHeight);
      drawWidth = imgWidth * scale;
      drawHeight = imgHeight * scale;
      x = margin + (availWidth - drawWidth) / 2;
      y = margin + (availHeight - drawHeight) / 2;
    } else {
      // Fit (contain, preserve aspect ratio)
      const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);
      drawWidth = imgWidth * scale;
      drawHeight = imgHeight * scale;
      x = margin + (availWidth - drawWidth) / 2;
      y = margin + (availHeight - drawHeight) / 2;
    }

    // 6. Add page and draw
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });
  }

  if (onProgress) {
    onProgress({ percent: 90, message: "Finalizing compiled PDF document..." });
  }

  const outputBytes = await pdfDoc.save({ useObjectStreams: true });

  if (onProgress) {
    onProgress({ percent: 100, message: "Conversion complete!" });
  }

  return {
    bytes: outputBytes,
    pageCount: total,
    byteLength: outputBytes.byteLength,
    filename: outputName,
  };
}
