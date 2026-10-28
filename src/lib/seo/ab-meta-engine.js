/**
 * @file ab-meta-engine.js
 * @description Edge-Level Meta A/B Split Engine for SERP snippet optimization.
 * Resolves active variants ("a" vs "b") from incoming cookies, headers, or query params,
 * and outputs psychological high-CTR titles and descriptions.
 */

import { SERP_VARIANTS, SITELINK_METADATA, transformSerpTitle, transformSerpDescription } from "./serp-transformer.js";

export { SITELINK_METADATA };

export const SERP_COOKIE_NAME = "bts_serp_v";
export const SERP_HEADER_NAME = "x-serp-variant";

/**
 * Returns concise sitelink metadata (title <= 35 chars, description <= 120 chars)
 * for 2-column organic sitelinks generation.
 * 
 * @param {string} route
 * @returns {{ title: string, description: string }}
 */
export function getSitelinkMetadata(route) {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  return SITELINK_METADATA[normalizedRoute] || {
    title: "Bits & Tools Online",
    description: "Free, fast, and 100% private in-browser digital utilities with zero server file uploads.",
  };
}

/**
 * Resolves the active SERP variant from request headers, cookies, or query string
 * 
 * @param {object} context
 * @param {string} [context.searchParam] - e.g. "a" or "b" from url
 * @param {string} [context.cookieValue] - e.g. "a" or "b" from cookies
 * @param {string} [context.headerValue] - e.g. "a" or "b" from x-serp-variant
 * @returns {"a" | "b"} The active SERP variant
 */
export function resolveSerpVariant({ searchParam, cookieValue, headerValue } = {}) {
  const candidate = (searchParam || cookieValue || headerValue || "").trim().toLowerCase();
  if (candidate === "b") return "b";
  return "a";
}

/**
 * Returns psychological high-CTR metadata tailored to the active A/B variant
 * 
 * @param {object} params
 * @param {string} params.route - The page route (e.g. "/merge-pdf")
 * @param {string} params.toolName - Name of the tool
 * @param {string} [params.baseTitle] - Default fallback title
 * @param {string} [params.baseDescription] - Default fallback description
 * @param {"a" | "b"} [params.variant="a"] - Active variant
 * @returns {{ title: string, description: string, variant: "a" | "b" }}
 */
export function getSerpVariantMetadata({
  route,
  toolName,
  baseTitle = "",
  baseDescription = "",
  variant = "a",
}) {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  const preconfigured = SERP_VARIANTS[normalizedRoute];

  if (preconfigured) {
    const selected = variant === "b" ? preconfigured.variantB : preconfigured.variantA;
    return {
      title: selected.title,
      description: selected.description,
      variant,
    };
  }

  // Programmatically transform if not explicitly configured in static corpus
  const dynamicTitle = transformSerpTitle({
    toolName,
    baseTitle,
    variant,
  });

  const dynamicDesc = transformSerpDescription({
    toolName,
    actionDescription: baseDescription,
    variant,
  });

  return {
    title: dynamicTitle,
    description: dynamicDesc,
    variant,
  };
}
