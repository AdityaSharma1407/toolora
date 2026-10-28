"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, Copy, Check, Smartphone, X, Star } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { logSerpTelemetry } from "@/lib/telemetry/serp-tracker";

/**
 * Native Direct-Access & Omnibox Shortcut Prompter
 * 
 * Educates users to bookmark and pin the tool, stimulating repeated direct omnibox
 * navigation to generate strong ChromeInTotal and direct visit authority.
 */
export default function DirectAccessPrompt({ toolName = "Bits & Tools" }) {
  const [isMac, setIsMac] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isInstallable, installPwa } = usePwaInstall();

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  const shortcutKey = isMac ? "⌘+D" : "Ctrl+D";

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      logSerpTelemetry("direct_access_url_copied");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    logSerpTelemetry("direct_access_prompt_opened");
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Bookmark and quick access shortcut"
        className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200/80 transition-colors"
        title="Pin or bookmark this tool for zero-click access"
      >
        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
        <span>Quick Access: <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-300 text-[10px] text-slate-800">{shortcutKey}</kbd></span>
      </button>

      {/* Popover / Modal Guidance */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Direct Quick Access Guidance"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-sm p-6 bg-white rounded-2xl shadow-xl border border-slate-200 text-left">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">Pin {toolName}</p>
                <p className="text-xs text-slate-500">Zero-click access from your browser</p>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <strong className="block text-slate-900 font-semibold mb-1">
                  Keyboard Shortcut
                </strong>
                <span>
                  Press <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border text-[11px] font-bold text-slate-900">{shortcutKey}</kbd> right now to add this utility to your Chrome or browser bookmarks bar.
                </span>
              </div>

              {isInstallable && (
                <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-100">
                  <strong className="block text-brand-900 font-semibold mb-1">
                    Install as Desktop / Mobile App
                  </strong>
                  <button
                    type="button"
                    onClick={() => {
                      installPwa();
                      setIsOpen(false);
                    }}
                    className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Install Offline PWA App</span>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied to clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Direct URL</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
