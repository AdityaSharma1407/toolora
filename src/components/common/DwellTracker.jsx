"use client";

import React, { useEffect } from "react";
import { initDwellTracker } from "@/lib/telemetry/dwell-tracker";
import { initSerpLandingTracker } from "@/lib/telemetry/serp-tracker";

/**
 * Client Dwell & SERP Session Tracking Component
 * 
 * Mounts in layout/pages to capture organic search entrances and monitor active
 * dwell intervals, executing speculative prefetching once 90s dwell is achieved.
 */
export default function DwellTracker({ nextRoute = "/compress-pdf" }) {
  useEffect(() => {
    // 1. Log landing SERP impression & referrer
    initSerpLandingTracker();

    // 2. Initialize active dwell tracking with 90s prefetch
    const cleanup = initDwellTracker({ nextRoute });

    return () => {
      cleanup();
    };
  }, [nextRoute]);

  return null; // Headless behavioral component
}
