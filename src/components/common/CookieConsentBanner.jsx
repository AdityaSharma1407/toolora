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
        new CustomEvent("bitsandtools-consent-change", { detail: preferences })
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
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-5 bg-white/95 text-slate-900 backdrop-blur-md border-t border-black/[0.08] shadow-modal animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 max-w-4xl">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 flex flex-wrap items-center gap-2">
              <span>Your Privacy Matters at Bits &amp; Tools</span>
              <span className="text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                Zero Server File Storage
              </span>
            </p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Bits &amp; Tools processes documents locally in your browser memory — your files are never transmitted to our servers.
              We use minimal local browser storage for functional preferences and, with your permission, standard advertising partners to keep our tools free.
              Read our{" "}
              <Link
                href="/privacy-policy"
                className="text-brand-600 hover:text-brand-700 underline underline-offset-2 font-medium"
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
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Essential Only
          </button>

          <button
            type="button"
            onClick={() => handleConsent("accepted")}
            className="flex-1 sm:flex-none min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-subtle transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
