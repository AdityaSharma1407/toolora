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

/**
 * Custom React Hook for managing user-pinned tools stored in localStorage.
 * 100% client-side with zero server telemetry.
 */
export function usePinnedTools() {
  const [pinnedIds, setPinnedIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPinnedIds(parsed);
          setIsLoaded(true);
          return;
        }
      }
    } catch {
      // Ignore parse/storage error
    }
    setPinnedIds(DEFAULT_PINNED);
    setIsLoaded(true);
  }, []);

  // Listen for sync events across tabs/components
  useEffect(() => {
    function handleSync(e) {
      if (e.detail && Array.isArray(e.detail)) {
        setPinnedIds(e.detail);
      }
    }

    window.addEventListener(EVENT_NAME, handleSync);
    return () => window.removeEventListener(EVENT_NAME, handleSync);
  }, []);

  const isPinned = useCallback(
    (toolId) => {
      return pinnedIds.includes(toolId);
    },
    [pinnedIds]
  );

  const togglePin = useCallback(
    (toolId, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      setPinnedIds((prev) => {
        let updated;
        if (prev.includes(toolId)) {
          updated = prev.filter((id) => id !== toolId);
        } else {
          updated = [...prev, toolId];
        }

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Ignore write error
        }

        // Dispatch sync event
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent(EVENT_NAME, { detail: updated })
          );
        }

        return updated;
      });
    },
    []
  );

  return {
    pinnedIds,
    isPinned,
    togglePin,
    isLoaded,
  };
}
