import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  ASPECT_RATIO_PRESETS,
  calculateInitialCrop,
  clampCropRect,
} from "../src/tools/image/imageCrop.js";
import { getToolById, getAvailableTools } from "../src/data/toolsRegistry.js";

describe("1. Crop Image Geometry & Aspect Ratio Calculations", () => {
  test("calculates initial freeform crop centered with 85% bounds", () => {
    const crop = calculateInitialCrop(1000, 1000, null);
    assert.equal(crop.width, 850);
    assert.equal(crop.height, 850);
    assert.equal(crop.x, 75);
    assert.equal(crop.y, 75);
  });

  test("calculates 1:1 square crop for widescreen 1920x1080 image", () => {
    const crop = calculateInitialCrop(1920, 1080, 1);
    assert.equal(crop.height, 972); // 90% of 1080
    assert.equal(crop.width, 972);
    assert.equal(crop.x, Math.round((1920 - 972) / 2));
    assert.equal(crop.y, Math.round((1080 - 972) / 2));
  });

  test("calculates 16:9 widescreen crop for tall 1080x1920 portrait image", () => {
    const crop = calculateInitialCrop(1080, 1920, 16 / 9);
    assert.equal(crop.width, 972); // 90% of 1080
    assert.equal(crop.height, Math.round(972 / (16 / 9)));
    assert.ok(crop.width <= 1080);
    assert.ok(crop.height <= 1920);
    assert.ok(crop.x >= 0);
    assert.ok(crop.y >= 0);
  });

  test("clamps rectangle strictly within image bounds", () => {
    const clamped = clampCropRect({ x: -50, y: -20, width: 2500, height: 1500 }, 1920, 1080);
    assert.equal(clamped.x, 0);
    assert.equal(clamped.y, 0);
    assert.equal(clamped.width, 1920);
    assert.equal(clamped.height, 1080);
  });

  test("clamps rectangle out of bounds to right and bottom", () => {
    const clamped = clampCropRect({ x: 1800, y: 1000, width: 300, height: 300 }, 1920, 1080);
    assert.ok(clamped.x + clamped.width <= 1920);
    assert.ok(clamped.y + clamped.height <= 1080);
  });

  test("provides all expected social & standard aspect ratio presets", () => {
    const ids = ASPECT_RATIO_PRESETS.map((p) => p.id);
    assert.ok(ids.includes("free"));
    assert.ok(ids.includes("1:1"));
    assert.ok(ids.includes("16:9"));
    assert.ok(ids.includes("4:5"));
    assert.ok(ids.includes("9:16"));
    assert.ok(ids.includes("4:3"));
    assert.ok(ids.includes("3:2"));
  });
});
