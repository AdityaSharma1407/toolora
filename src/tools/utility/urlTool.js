/**
 * URL Encoder, Decoder, and Query Parameter Parser.
 * Zero external dependencies.
 */

/**
 * Encodes text or URL.
 * @param {string} input
 * @param {'component' | 'full'} mode
 * @returns {string}
 */
export function encodeUrl(input = "", mode = "component") {
  if (!input) return "";
  try {
    if (mode === "full") {
      return encodeURI(input);
    }
    return encodeURIComponent(input);
  } catch (err) {
    return input;
  }
}

/**
 * Decodes URL or percent-encoded component.
 * @param {string} input
 * @returns {{ success: boolean, output: string, error?: string }}
 */
export function decodeUrl(input = "") {
  if (!input) return { success: true, output: "" };
  try {
    const output = decodeURIComponent(input);
    return { success: true, output };
  } catch (err) {
    // Attempt relaxed replacement of lone % characters that broke decodeURIComponent
    try {
      const relaxed = input.replace(/%(?![0-9a-fA-F]{2})/g, "%25");
      const output = decodeURIComponent(relaxed);
      return { success: true, output };
    } catch {
      return {
        success: false,
        output: input,
        error: "Malformed URI sequence: could not decode percent-encoded characters.",
      };
    }
  }
}

/**
 * Parses a full URL or query string into structured parts and query parameters.
 * @param {string} input
 * @returns {{ isFullUrl: boolean, protocol: string, host: string, pathname: string, hash: string, params: Array<{ key: string, value: string, id: string }> }}
 */
export function parseUrlParameters(input = "") {
  const trimmed = input.trim();
  const idGen = () => Math.random().toString(36).slice(2, 9);

  if (!trimmed) {
    return {
      isFullUrl: false,
      protocol: "",
      host: "",
      pathname: "",
      hash: "",
      params: [],
    };
  }

  // Check if it's a full URL
  try {
    const url = new URL(trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`);
    const params = [];
    url.searchParams.forEach((val, key) => {
      params.push({ key, value: val, id: idGen() });
    });

    const isFull = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(trimmed);

    return {
      isFullUrl: isFull,
      protocol: isFull ? url.protocol : "",
      host: isFull ? url.host : "",
      pathname: isFull ? url.pathname : trimmed.split("?")[0],
      hash: url.hash,
      params,
    };
  } catch {
    // Parse as raw query string like "foo=bar&baz=qux"
    const queryPart = trimmed.includes("?") ? trimmed.split("?")[1] : trimmed;
    const cleanQuery = queryPart.split("#")[0];
    const searchParams = new URLSearchParams(cleanQuery);
    const params = [];
    searchParams.forEach((val, key) => {
      params.push({ key, value: val, id: idGen() });
    });

    return {
      isFullUrl: false,
      protocol: "",
      host: "",
      pathname: trimmed.split("?")[0],
      hash: trimmed.includes("#") ? `#${trimmed.split("#")[1]}` : "",
      params,
    };
  }
}

/**
 * Re-assembles a URL from base, params, and hash.
 * @param {string} baseUrl
 * @param {Array<{ key: string, value: string }>} params
 * @param {string} hash
 * @returns {string}
 */
export function rebuildUrl(baseUrl = "", params = [], hash = "") {
  const cleanBase = (baseUrl || "").split("?")[0].split("#")[0];
  const searchParams = new URLSearchParams();

  for (const p of params) {
    if (p.key && p.key.trim()) {
      searchParams.append(p.key.trim(), p.value || "");
    }
  }

  const queryString = searchParams.toString();
  let result = cleanBase;
  if (queryString) {
    result += (result.includes("?") ? "&" : "?") + queryString;
  }
  if (hash) {
    result += (hash.startsWith("#") ? "" : "#") + hash;
  }

  return result;
}
