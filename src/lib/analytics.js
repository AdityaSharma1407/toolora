import { siteConfig } from "../config/site.js";

/**
 * Generic safe event dispatcher for Google Analytics 4.
 * Only sends data if analytics is explicitly enabled and consent is granted.
 *
 * @param {string} eventName
 * @param {object} params
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;

  const config = siteConfig.analytics;
  if (!config?.enabled || !config?.googleAnalyticsId) {
    return;
  }

  // Check consent preferences
  try {
    const rawConsent = localStorage.getItem(siteConfig.consent.storageKey);
    if (rawConsent) {
      const parsed = JSON.parse(rawConsent);
      if (parsed.status === "declined" || parsed.analytics === false) {
        return;
      }
    }
  } catch {}

  // Sanitize: remove any sensitive file names or paths if accidentally passed
  const sanitized = { ...params };
  delete sanitized.fileName;
  delete sanitized.filePath;
  delete sanitized.name;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, sanitized);
  }
}

/**
 * Tracks anonymized tool lifecycle events (started, completed, failed)
 * without logging file contents or personal filenames.
 *
 * @param {string} toolId - e.g. 'merge-pdf', 'split-pdf', 'compress-pdf', 'jpg-to-pdf'
 * @param {'start' | 'complete' | 'error' | 'download'} action
 * @param {object} [metadata] - Anonymized statistics (e.g. fileCount, pageCount, bytesSaved)
 */
export function trackToolUsage(toolId, action, metadata = {}) {
  const safeData = {
    tool_id: toolId,
    action_type: action,
    file_count: metadata.fileCount,
    page_count: metadata.pageCount,
    reduction_percent: metadata.percentSaved,
    duration_ms: metadata.durationMs,
  };

  // Remove undefined values
  Object.keys(safeData).forEach((k) => safeData[k] === undefined && delete safeData[k]);

  trackEvent("tool_usage", safeData);
}
