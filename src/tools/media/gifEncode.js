/**
 * Client-Side GIF89a Animation Encoder.
 * Encodes canvas video frames into lightweight, looping animated GIFs with zero external dependencies.
 * 100% pure JavaScript.
 */

/**
 * Builds a fast 256-color palette using 3:3:2 color quantization.
 * Red (3 bits, 8 levels), Green (3 bits, 8 levels), Blue (2 bits, 4 levels).
 * @returns {Uint8Array} - 768 bytes (256 RGB triplets)
 */
export function buildStandardPalette() {
  const palette = new Uint8Array(256 * 3);
  let idx = 0;
  for (let r = 0; r < 8; r++) {
    for (let g = 0; g < 8; g++) {
      for (let b = 0; b < 4; b++) {
        palette[idx++] = Math.round((r * 255) / 7);
        palette[idx++] = Math.round((g * 255) / 7);
        palette[idx++] = Math.round((b * 255) / 3);
      }
    }
  }
  return palette;
}

/**
 * Maps an RGBA pixel array to indices in the 3:3:2 palette.
 * @param {Uint8ClampedArray} rgbaData
 * @param {number} totalPixels
 * @returns {Uint8Array}
 */
export function quantizeRgbaToIndices(rgbaData, totalPixels) {
  const indices = new Uint8Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    const r = rgbaData[i * 4];
    const g = rgbaData[i * 4 + 1];
    const b = rgbaData[i * 4 + 2];

    const r3 = Math.min(7, Math.floor((r * 8) / 256));
    const g3 = Math.min(7, Math.floor((g * 8) / 256));
    const b2 = Math.min(3, Math.floor((b * 4) / 256));

    indices[i] = (r3 << 5) | (g3 << 2) | b2;
  }
  return indices;
}

/**
 * Encodes pixel indices into LZW compressed data blocks for GIF.
 * @param {Uint8Array} pixels
 * @param {number} minCodeSize - typically 8 for 256-color GIF
 * @returns {Uint8Array}
 */
export function lzwEncode(pixels, minCodeSize = 8) {
  const clearCode = 1 << minCodeSize; // 256
  const eoiCode = clearCode + 1; // 257

  let codeSize = minCodeSize + 1;
  let nextCode = eoiCode + 1;
  const maxTableSize = 4096;

  // LZW Dictionary using Map: key = `${prefixCode},${character}`
  const table = new Map();

  const resetTable = () => {
    table.clear();
    codeSize = minCodeSize + 1;
    nextCode = eoiCode + 1;
  };

  const outputBytes = [];
  let curAccum = 0;
  let curBits = 0;

  const emitCode = (code) => {
    curAccum |= code << curBits;
    curBits += codeSize;
    while (curBits >= 8) {
      outputBytes.push(curAccum & 0xff);
      curAccum >>= 8;
      curBits -= 8;
    }
  };

  const flushBits = () => {
    if (curBits > 0) {
      outputBytes.push(curAccum & 0xff);
    }
  };

  emitCode(clearCode);

  let prefix = pixels[0];

  for (let i = 1; i < pixels.length; i++) {
    const k = pixels[i];
    const key = (prefix << 8) | k;

    if (table.has(key)) {
      prefix = table.get(key);
    } else {
      emitCode(prefix);

      if (nextCode < maxTableSize) {
        table.set(key, nextCode++);
        if (nextCode >= (1 << codeSize) && codeSize < 12) {
          codeSize++;
        }
      } else {
        emitCode(clearCode);
        resetTable();
      }
      prefix = k;
    }
  }

  emitCode(prefix);
  emitCode(eoiCode);
  flushBits();

  // Package into sub-blocks of at most 255 bytes
  const blocks = [];
  blocks.push(minCodeSize); // First byte is LZW min code size

  let offset = 0;
  while (offset < outputBytes.length) {
    const chunkSize = Math.min(255, outputBytes.length - offset);
    blocks.push(chunkSize);
    for (let c = 0; c < chunkSize; c++) {
      blocks.push(outputBytes[offset + c]);
    }
    offset += chunkSize;
  }
  blocks.push(0x00); // Block terminator

  return new Uint8Array(blocks);
}

/**
 * Compiles a list of RGBA frames into a binary GIF89a file.
 *
 * @param {Array<{ data: Uint8ClampedArray, width: number, height: number, delayMs: number }>} frames
 * @param {number} [loopCount=0] - 0 for infinite looping
 * @returns {Uint8Array}
 */
export function encodeGif(frames, loopCount = 0) {
  if (!frames || frames.length === 0) {
    throw new Error("No frames provided for GIF encoding.");
  }

  const { width, height } = frames[0];
  const palette = buildStandardPalette();
  const bytes = [];

  // 1. GIF89a Header
  bytes.push(0x47, 0x49, 0x46, 0x38, 0x39, 0x61); // "GIF89a"

  // 2. Logical Screen Descriptor
  bytes.push(width & 0xff, (width >> 8) & 0xff);
  bytes.push(height & 0xff, (height >> 8) & 0xff);
  bytes.push(0xf7); // Global color table flag (1), color resolution (7), sorted (0), table size (7 = 256 colors)
  bytes.push(0x00); // Background color index
  bytes.push(0x00); // Pixel aspect ratio

  // 3. Global Color Table (256 * 3 bytes)
  for (let i = 0; i < palette.length; i++) {
    bytes.push(palette[i]);
  }

  // 4. Netscape Application Extension for Looping
  bytes.push(
    0x21, 0xff, 0x0b,
    0x4e, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2e, 0x30, // "NETSCAPE2.0"
    0x03, 0x01,
    loopCount & 0xff, (loopCount >> 8) & 0xff,
    0x00
  );

  // 5. Frames
  for (const frame of frames) {
    // Graphic Control Extension
    const delayHundredths = Math.max(2, Math.round(frame.delayMs / 10));
    bytes.push(
      0x21, 0xf9, 0x04,
      0x04, // Disposal method: restore to background
      delayHundredths & 0xff, (delayHundredths >> 8) & 0xff,
      0x00, // Transparent color index
      0x00
    );

    // Image Descriptor
    bytes.push(0x2c); // Separator
    bytes.push(0x00, 0x00, 0x00, 0x00); // Left = 0, Top = 0
    bytes.push(width & 0xff, (width >> 8) & 0xff);
    bytes.push(height & 0xff, (height >> 8) & 0xff);
    bytes.push(0x00); // No local color table (uses global)

    // Quantize RGBA to color indices
    const totalPixels = width * height;
    const pixelIndices = quantizeRgbaToIndices(frame.data, totalPixels);

    // LZW Compression
    const lzwData = lzwEncode(pixelIndices, 8);
    for (let b = 0; b < lzwData.length; b++) {
      bytes.push(lzwData[b]);
    }
  }

  // 6. GIF Trailer
  bytes.push(0x3b); // ';'

  return new Uint8Array(bytes);
}
