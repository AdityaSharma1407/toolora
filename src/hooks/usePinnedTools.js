"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bitsandtools_pinned_tools";
const DEFAULT_PINNED = [
  "merge-pdf",
  "markdown-editor",
  "json-formatter",
  "regex-tester",
  "compress-pdf",
];

const EVENT_NAME = "bitsandtools:pinned_updated";

// Singleton in-memory cache shared by all ToolCard instances to avoid redundant localStorage hits
let cachedPinnedIds = null;
let cacheLoaded = false;
const subscribers = new Set();

function initCache() {
  if (cacheLoaded) return cachedPinnedIds;
  if (typeof window === "undefined") return DEFAULT_PINNED;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        cachedPinnedIds = parsed;
        cacheLoaded = true;
        return cachedPinnedIds;
      }
    }
  } catch {
    // Ignore error
  }

  cachedPinnedIds = DEFAULT_PINNED;
  cacheLoaded = true;
  return cachedPinnedIds;
}

if (typeof window !== "undefined") {
  window.addEventListener(EVENT_NAME, (e) => {
    if (e.detail && Array.isArray(e.detail)) {
      cachedPinnedIds = e.detail;
      cacheLoaded = true;
      subscribers.forEach((fn) => fn(e.detail));
    }
  });
}

/**
 * Custom React Hook for managing user-pinned tools stored in localStorage.
 * 100% client-side with zero server telemetry.
 */
export function usePinnedTools() {
  const [pinnedIds, setPinnedIds] = useState(() => (cacheLoaded ? cachedPinnedIds : DEFAULT_PINNED));
  const [isLoaded, setIsLoaded] = useState(cacheLoaded);

  useEffect(() => {
    if (!cacheLoaded) {
      const initial = initCache();
      setPinnedIds(initial);
      setIsLoaded(true);
    } else {
      setIsLoaded(true);
    }

    const handler = (updated) => {
      setPinnedIds(updated);
      setIsLoaded(true);
    };

    subscribers.add(handler);
    return () => subscribers.delete(handler);
  }, []);

  const isPinned = useCallback(
    (toolId) => {
      return (pinnedIds || DEFAULT_PINNED).includes(toolId);
    },
    [pinnedIds]
  );

  const togglePin = useCallback((toolId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const current = cachedPinnedIds || DEFAULT_PINNED;
    const updated = current.includes(toolId)
      ? current.filter((id) => id !== toolId)
      : [...current, toolId];

    cachedPinnedIds = updated;
    cacheLoaded = true;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore write error
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    }
  }, []);

  return {
    pinnedIds: pinnedIds || DEFAULT_PINNED,
    isPinned,
    togglePin,
    isLoaded,
  };
}
