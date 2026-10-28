import { resolveTemporalParity } from "./temporal-engine.js";

/**
 * Edge ETag & 304 Delta Caching Evaluator
 * 
 * Inspects incoming conditional request headers (If-None-Match, If-Modified-Since)
 * against the deterministic temporal registry to return 304 Not Modified when appropriate,
 * slashing crawl budget waste and signaling enterprise tier freshness stability to bots.
 */

export const CACHE_CONTROL_HEADER =
  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

/**
 * Evaluates a request against the canonical temporal metadata for a route
 * 
 * @param {Headers|object} requestHeaders - Incoming HTTP request headers
 * @param {string} route - Route pathname
 * @returns {{ isModified: boolean, status: number, headers: Record<string, string> }}
 */
export function evaluateConditionalRequest(requestHeaders, route = "/") {
  const temporal = resolveTemporalParity(route);
  const etag = temporal.etag;
  const lastModified = temporal.httpLastModified;
  const lastModTimestamp = temporal.lastModDate.getTime();

  // Normalize header lookup
  const getHeader = (name) => {
    if (!requestHeaders) return null;
    if (typeof requestHeaders.get === "function") return requestHeaders.get(name);
    return requestHeaders[name] || requestHeaders[name.toLowerCase()] || null;
  };

  const ifNoneMatch = getHeader("if-none-match");
  const ifModifiedSince = getHeader("if-modified-since");

  const responseHeaders = {
    ETag: etag,
    "Last-Modified": lastModified,
    "Cache-Control": CACHE_CONTROL_HEADER,
  };

  // 1. ETag validation (strong or weak)
  if (ifNoneMatch) {
    const cleanClientEtag = ifNoneMatch.trim().replace(/^W\//, "");
    const cleanServerEtag = etag.trim().replace(/^W\//, "");

    if (ifNoneMatch === "*" || ifNoneMatch === etag || cleanClientEtag === cleanServerEtag) {
      return {
        isModified: false,
        status: 304,
        headers: responseHeaders,
      };
    }
  }

  // 2. Last-Modified timestamp validation
  if (ifModifiedSince) {
    try {
      const clientDate = new Date(ifModifiedSince).getTime();
      if (!isNaN(clientDate) && clientDate >= lastModTimestamp) {
        return {
          isModified: false,
          status: 304,
          headers: responseHeaders,
        };
      }
    } catch {
      // Invalid date format; proceed to normal 200 response
    }
  }

  return {
    isModified: true,
    status: 200,
    headers: responseHeaders,
  };
}
