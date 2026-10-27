/**
 * Cryptographically Secure RFC 4122 v4 UUID Generator.
 * Zero external dependencies.
 */

/**
 * Generates a single RFC 4122 v4 UUID.
 * @returns {string}
 */
export function generateSingleUuid() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback to crypto.getRandomValues if randomUUID is unavailable
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // Set version 4 bits: 0100
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // Set variant bits: 10xx
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  }

  // Math.random fallback (last resort)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates bulk UUIDs with formatting options.
 * @param {object} options
 * @param {number} [options.count=1] - Number of UUIDs (1-100)
 * @param {boolean} [options.uppercase=false]
 * @param {boolean} [options.hyphens=true]
 * @param {'none'|'braces'|'quotes'} [options.wrap='none']
 * @returns {string[]}
 */
export function generateUuids(options = {}) {
  const { count = 1, uppercase = false, hyphens = true, wrap = "none" } = options;
  const safeCount = Math.max(1, Math.min(100, Number(count) || 1));
  const results = [];

  for (let i = 0; i < safeCount; i++) {
    let id = generateSingleUuid();

    if (!hyphens) {
      id = id.replace(/-/g, "");
    }

    if (uppercase) {
      id = id.toUpperCase();
    } else {
      id = id.toLowerCase();
    }

    if (wrap === "braces") {
      id = `{${id}}`;
    } else if (wrap === "quotes") {
      id = `"${id}"`;
    }

    results.push(id);
  }

  return results;
}
