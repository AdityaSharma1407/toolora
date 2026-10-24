"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Cookie, X } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(siteConfig.consent.storageKey);
      if (!stored) {
        // Show banner after brief delay for smooth appearance
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  function handleConsent(choice) {
    const preferences = {
      status: choice, // 'accepted' | 'essential'
      advertising: choice === "accepted",
      analytics: choice === "accepted",
      timestamp: new Date().toISOString(),
      version: siteConfig.consent.version,
    };

    try {
      localStorage.setItem(
        siteConfig.consent.storageKey,
        JSON.stringify(preferences)
      );
      // Notify other components
      window.dispatchEvent(
        new CustomEvent("toolora-consent-change", { detail: preferences })
      );
    } catch {}

    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      role="region"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-slate-900/95 text-white backdrop-blur-md border-t border-slate-800 shadow-2xl animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-4xl">
          <div className="p-2.5 rounded-xl bg-brand-900/60 text-brand-400 border border-brand-700/50 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Your Privacy Matters at Toolora</span>
              <span className="text-[11px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.2 rounded-full">
                Zero Server File Storage
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Toolora processes documents locally in your browser memory — your files are never transmitted to our servers.
              We use minimal local browser storage for functional preferences and, with your permission, standard advertising partners to keep our tools free.
              Read our{" "}
              <Link
                href="/privacy-policy"
                className="text-brand-400 hover:text-brand-300 underline underline-offset-2"
              >
                Privacy Policy
              </Link>{" "}
              for complete details.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleConsent("essential")}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            Essential Only
          </button>

          <button
            type="button"
            onClick={() => handleConsent("accepted")}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-sm transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
