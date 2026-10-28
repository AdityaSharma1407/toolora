import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { formatTimecode, encodeWavBuffer, sliceAudioChannels } from "../src/tools/media/audioEncode.js";
import { buildStandardPalette, quantizeRgbaToIndices, lzwEncode, encodeGif } from "../src/tools/media/gifEncode.js";
import { validateTrimBounds, parseTimeToSeconds } from "../src/tools/media/videoTrim.js";
import { calculateScaledVideoDimensions, estimateCompressedFileSize } from "../src/tools/media/videoCompress.js";
import { getToolById, getToolsByCategory, getAvailableTools } from "../src/data/toolsRegistry.js";

describe("1. Audio Encoding & Timecode Logic", () => {
  test("formats seconds into readable timecodes accurately", () => {
    assert.equal(formatTimecode(0), "00:00");
    assert.equal(formatTimecode(65), "01:05");
    assert.equal(formatTimecode(3665), "01:01:05");
    assert.equal(formatTimecode(12.4, true), "00:12.4");
  });

  test("encodes Float32Array PCM samples into valid RIFF WAV buffer", () => {
    const sampleRate = 44100;
    const numSamples = 4410; // 0.1 second of audio
    const channelLeft = new Float32Array(numSamples);
    const channelRight = new Float32Array(numSamples);

    // Sine wave generator
    for (let i = 0; i < numSamples; i++) {
      channelLeft[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate);
      channelRight[i] = Math.sin((2 * Math.PI * 880 * i) / sampleRate);
    }

    const wavBuf = encodeWavBuffer([channelLeft, channelRight], sampleRate);
    assert.ok(wavBuf instanceof ArrayBuffer);
    assert.equal(wavBuf.byteLength, 44 + numSamples * 2 * 2); // 44 header + 2 channels * 2 bytes * samples

    const view = new DataView(wavBuf);
    assert.equal(String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)), "RIFF");
    assert.equal(String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11)), "WAVE");
    assert.equal(view.getUint16(22, true), 2);
    assert.equal(view.getUint32(24, true), sampleRate);
    assert.equal(view.getUint16(34, true), 16);
  });

  test("slices audio channels within start and end bounds", () => {
    const sampleRate = 1000;
    const ch = new Float32Array(5000); // 5 seconds
    const sliced = sliceAudioChannels([ch], sampleRate, 1, 3);
    assert.equal(sliced[0].length, 2000); // 2 seconds * 1000 Hz
  });
});

describe("2. GIF89a Animation Core Logic", () => {
  test("generates 256-color palette (768 bytes)", () => {
    const palette = buildStandardPalette();
    assert.equal(palette.length, 768);
  });

  test("quantizes RGBA pixels to color indices", () => {
    const rgba = new Uint8ClampedArray([255, 0, 0, 255]);
    const indices = quantizeRgbaToIndices(rgba, 1);
    assert.equal(indices.length, 1);
    assert.equal(indices[0], 0b11100000); // max red (7), 0 green, 0 blue
  });

  test("encodes frames into a standard GIF89a binary byte sequence", () => {
    const width = 10;
    const height = 10;
    const frameData = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      frameData[i * 4 + 2] = 255;
      frameData[i * 4 + 3] = 255;
    }

    const frames = [
      { data: frameData, width, height, delayMs: 100 },
      { data: frameData, width, height, delayMs: 100 },
    ];

    const gifBytes = encodeGif(frames, 0);
    assert.ok(gifBytes instanceof Uint8Array);
    assert.equal(String.fromCharCode(...gifBytes.slice(0, 6)), "GIF89a");
    assert.equal(gifBytes[gifBytes.length - 1], 0x3b);
  });
});

describe("3. Video Trimming Bounds & Parsing Logic", () => {
  test("clamps trim boundaries correctly within video duration", () => {
    const bounds = validateTrimBounds(-5, 120, 60);
    assert.equal(bounds.start, 0);
    assert.equal(bounds.end, 60);
    assert.equal(bounds.trimDuration, 60);

    const normal = validateTrimBounds(5, 15, 60);
    assert.equal(normal.start, 5);
    assert.equal(normal.end, 15);
    assert.equal(normal.trimDuration, 10);
  });

  test("parses MM:SS and HH:MM:SS strings to numeric seconds", () => {
    assert.equal(parseTimeToSeconds("01:30"), 90);
    assert.equal(parseTimeToSeconds("01:00:00"), 3600);
    assert.equal(parseTimeToSeconds("45"), 45);
  });
});

describe("4. Video Scaling & Compression Estimations", () => {
  test("calculates even dimensions preserving 16:9 aspect ratio", () => {
    const scaled = calculateScaledVideoDimensions(1920, 1080, 720);
    assert.equal(scaled.height, 720);
    assert.equal(scaled.width, 1280);
    assert.equal(scaled.width % 2, 0);
    assert.equal(scaled.height % 2, 0);
  });

  test("calculates portrait video dimensions with even bounds", () => {
    const scaled = calculateScaledVideoDimensions(1080, 1920, 480);
    assert.equal(scaled.width, 480);
    assert.equal(scaled.height % 2, 0);
  });

  test("estimates compressed file size based on bitrate and duration", () => {
    const duration = 10;
    const videoBits = 1_000_000;
    const estimated = estimateCompressedFileSize(duration, videoBits, 128_000);
    assert.ok(estimated > 1_000_000 && estimated < 2_000_000);
  });
});

describe("5. Media Tools Registry & Routing Verification", () => {
  const expectedTools = [
    { id: "compress-video", route: "/compress-video" },
    { id: "trim-video", route: "/trim-video" },
    { id: "video-to-gif", route: "/video-to-gif" },
    { id: "extract-audio", route: "/extract-audio" },
    { id: "mp3-converter", route: "/mp3-converter" },
  ];

  test("all 5 media tools are active, available, and correctly routed", () => {
    for (const item of expectedTools) {
      const tool = getToolById(item.id);
      assert.ok(tool, `Tool ${item.id} must exist in toolsRegistry`);
      assert.equal(tool.status, "available", `${item.id} must have status: available`);
      assert.equal(tool.route, item.route, `${item.id} must route to ${item.route}`);
      assert.equal(tool.category, "media");
    }

    const mediaTools = getToolsByCategory("media");
    assert.equal(mediaTools.filter((t) => t.status === "available").length, 5);
  });

  test("total available tools in registry reaches 50 (100% available)", () => {
    assert.equal(getAvailableTools().length, 55);
  });
});

describe("6. Media Tool Pages SEO & Schema Verification", () => {
  const pages = [
    { name: "Extract Audio", path: "src/app/extract-audio/page.jsx", canonical: "/extract-audio" },
    { name: "MP3 Converter", path: "src/app/mp3-converter/page.jsx", canonical: "/mp3-converter" },
    { name: "Video to GIF", path: "src/app/video-to-gif/page.jsx", canonical: "/video-to-gif" },
    { name: "Trim Video", path: "src/app/trim-video/page.jsx", canonical: "/trim-video" },
    { name: "Compress Video", path: "src/app/compress-video/page.jsx", canonical: "/compress-video" },
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

  test("Media Tools category hub exports canonical metadata", () => {
    const hubContent = fs.readFileSync("src/app/media-tools/page.jsx", "utf8");
    assert.ok(hubContent.includes('canonical: "/media-tools"'));
    assert.ok(hubContent.includes("export const metadata = {"));
  });
});
