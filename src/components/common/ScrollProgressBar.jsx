"use client";

import React, { useEffect, useState } from "react";

/**
 * Zero-Layout-Shift Sticky Scroll Progress Bar
 * 
 * Hardware-accelerated with CSS transform scaleX to eliminate any layout reflow.
 * Indicates reading/processing depth to visually encourage deep scroll engagement.
 */
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const currentProgress = Math.min(
          1,
          Math.max(0, window.scrollY / scrollHeight)
        );
        setProgress(currentProgress);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none bg-slate-100/60 overflow-hidden"
    >
      <div
        className="h-full w-full bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-500 origin-left transition-transform duration-75 ease-out"
        style={{
          transform: `scaleX(${progress})`,
        }}
      />
    </div>
  );
}
