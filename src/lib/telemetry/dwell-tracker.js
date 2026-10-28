/**
 * @file dwell-tracker.js
 * @description Non-blocking dwell and active engagement engine.
 * Distinguishes idle background tabs from active reading/working sessions.
 * Triggers speculative prefetching of next siloed targets when the 90-second
 * NavBoost "longest-click" milestone is achieved.
 */

import { logSerpTelemetry } from "./serp-tracker.js";

const IDLE_TIMEOUT_MS = 15000; // 15 seconds of inactivity pauses dwell accumulation
const TARGET_DWELL_SECONDS = 90; // NavBoost qualification threshold

/**
 * Injects a speculative <link rel="prefetch"> into document.head
 * 
 * @param {string} url - Target URL to prefetch
 */
export function injectSpeculativePrefetch(url) {
  if (typeof document === "undefined" || !url) return;

  // Avoid duplicate prefetch links
  const existing = document.querySelector(`link[rel="prefetch"][href="${url}"]`);
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;
  link.as = "document";
  document.head.appendChild(link);
}

/**
 * Initializes active dwell session monitoring
 * 
 * @param {object} options
 * @param {string} [options.nextRoute] - Next logical route to prefetch at 90s
 * @param {Function} [options.onMilestone] - Callback fired at 90s
 * @returns {() => void} Cleanup function to tear down listeners
 */
export function initDwellTracker({ nextRoute = "/compress-pdf", onMilestone } = {}) {
  if (typeof window === "undefined") return () => {};

  let activeDwellSeconds = 0;
  let lastActiveTimestamp = Date.now();
  let hasTriggered90s = false;
  let isWindowFocused = !document.hidden;

  const registerUserActivity = () => {
    lastActiveTimestamp = Date.now();
  };

  const activityEvents = ["scroll", "mousemove", "keydown", "touchstart", "pointerdown"];
  activityEvents.forEach((ev) => {
    window.addEventListener(ev, registerUserActivity, { passive: true });
  });

  const onVisibilityChange = () => {
    isWindowFocused = !document.hidden;
    if (isWindowFocused) {
      lastActiveTimestamp = Date.now();
    }
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  // Interval ticking every 1 second
  const intervalId = window.setInterval(() => {
    const now = Date.now();
    const idleDuration = now - lastActiveTimestamp;

    // Accumulate dwell only if tab is visible and user engaged within last 15s
    if (isWindowFocused && idleDuration < IDLE_TIMEOUT_MS) {
      activeDwellSeconds += 1;

      // 30-second intermediate checkpoint
      if (activeDwellSeconds === 30) {
        logSerpTelemetry("dwell_30s_checkpoint", { activeDwellSeconds });
      }

      // 90-second NavBoost "longest-click" qualification milestone
      if (activeDwellSeconds >= TARGET_DWELL_SECONDS && !hasTriggered90s) {
        hasTriggered90s = true;

        logSerpTelemetry("dwell_90s_milestone", {
          activeDwellSeconds,
          targetPrefetch: nextRoute,
        });

        // Speculatively prefetch next siloed workflow
        if (nextRoute) {
          injectSpeculativePrefetch(nextRoute);
        }

        if (typeof onMilestone === "function") {
          onMilestone(activeDwellSeconds);
        }
      }
    }
  }, 1000);

  // Return teardown function
  return () => {
    window.clearInterval(intervalId);
    activityEvents.forEach((ev) => {
      window.removeEventListener(ev, registerUserActivity);
    });
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}
