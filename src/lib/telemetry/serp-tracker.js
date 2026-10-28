/**
 * @file serp-tracker.js
 * @description Client-side telemetry logger for organic SERP snippet performance,
 * A/B variant tracking, and dwell milestones.
 */

const STORAGE_KEY = "bts_serp_telemetry";
const MAX_LOG_ENTRIES = 50;

/**
 * Detects if the current session was referred by an organic search engine
 * 
 * @returns {boolean}
 */
export function isOrganicSearchReferrer() {
  if (typeof document === "undefined") return false;
  const ref = document.referrer.toLowerCase();
  return (
    ref.includes("google.") ||
    ref.includes("bing.") ||
    ref.includes("yahoo.") ||
    ref.includes("duckduckgo.") ||
    ref.includes("ecosia.") ||
    ref.includes("yandex.") ||
    ref.includes("baidu.")
  );
}

/**
 * Retrieves the active A/B variant from cookies or query string
 * 
 * @returns {"a" | "b"}
 */
export function getClientSerpVariant() {
  if (typeof window === "undefined") return "a";

  const urlParams = new URLSearchParams(window.location.search);
  const qv = urlParams.get("serp_v");
  if (qv === "b" || qv === "a") return qv;

  const match = document.cookie.match(/(?:^|;\s*)bts_serp_v=([^;]*)/);
  if (match && (match[1] === "b" || match[1] === "a")) {
    return match[1];
  }

  return "a";
}

/**
 * Logs an organic SERP entry or behavioral milestone
 * 
 * @param {string} eventName - e.g. "serp_landing", "first_click_100ms", "dwell_90s"
 * @param {object} [metadata]
 */
export function logSerpTelemetry(eventName, metadata = {}) {
  if (typeof window === "undefined") return;

  try {
    const payload = {
      event: eventName,
      route: window.location.pathname,
      variant: getClientSerpVariant(),
      isOrganicSearch: isOrganicSearchReferrer(),
      referrer: document.referrer || "direct",
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    // 1. Store in local telemetry buffer
    const rawHistory = localStorage.getItem(STORAGE_KEY);
    const history = rawHistory ? JSON.parse(rawHistory) : [];
    history.push(payload);
    if (history.length > MAX_LOG_ENTRIES) {
      history.shift();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

    // 2. Dispatch custom event for local analytics/listeners
    window.dispatchEvent(new CustomEvent("bts:telemetry", { detail: payload }));
  } catch {
    // Fail silently in restricted storage environments
  }
}

/**
 * Initializes SERP landing impression logging on window mount
 */
export function initSerpLandingTracker() {
  if (typeof window === "undefined") return;

  // Prevent duplicate impression logging in single SPA session
  if (window.__bts_serp_logged) return;
  window.__bts_serp_logged = true;

  logSerpTelemetry("serp_landing_impression", {
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  });
}
