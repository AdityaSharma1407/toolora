/**
 * Client-Side Video Trimmer Engine.
 * Manages video timeline slicing, bounds checking, and browser-native segment extraction.
 * 100% private in browser memory.
 */

import { formatTimecode } from "./audioEncode.js";

/**
 * Validates and clamps trim boundaries within a video duration.
 * @param {number} start
 * @param {number} end
 * @param {number} duration
 * @returns {{ start: number, end: number, trimDuration: number }}
 */
export function validateTrimBounds(start = 0, end = 0, duration = 0) {
  const safeDuration = Math.max(0.1, duration);
  const clampedStart = Math.max(0, Math.min(safeDuration - 0.1, Number(start) || 0));
  const clampedEnd = end > 0
    ? Math.max(clampedStart + 0.1, Math.min(safeDuration, Number(end)))
    : safeDuration;

  const trimDuration = Math.max(0.1, clampedEnd - clampedStart);

  return {
    start: Number(clampedStart.toFixed(2)),
    end: Number(clampedEnd.toFixed(2)),
    trimDuration: Number(trimDuration.toFixed(2)),
  };
}

/**
 * Parses time string (MM:SS or HH:MM:SS or SS) into numeric seconds.
 * @param {string} timeStr
 * @returns {number}
 */
export function parseTimeToSeconds(timeStr = "") {
  if (typeof timeStr === "number") return timeStr;
  const parts = String(timeStr).trim().split(":").map(Number);
  if (parts.some(isNaN)) return 0;

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parts[0];
  }
  return 0;
}
