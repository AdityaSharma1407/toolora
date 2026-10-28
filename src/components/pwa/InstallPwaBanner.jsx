"use client";

import React, { useState } from "react";
import { Download, X, Layers, Share, Smartphone, Laptop } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export default function InstallPwaBanner() {
  const {
    canInstall,
    isInstalled,
    isDismissed,
    isIOS,
    promptInstall,
    dismissPrompt,
  } = usePwaInstall();

  const [showIosGuide, setShowIosGuide] = useState(false);
  const [cookieConsentResolved, setCookieConsentResolved] = useState(true);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("bitsandtools_consent_preferences");
      if (!stored) {
        setCookieConsentResolved(false);
      }
    } catch {
      // Ignore localStorage error
    }

    function handleConsentChange() {
      setCookieConsentResolved(true);
    }

    window.addEventListener("bitsandtools-consent-change", handleConsentChange);
    return () =>
      window.removeEventListener("bitsandtools-consent-change", handleConsentChange);
  }, []);

  // If already installed, dismissed, unsupported, or cookie consent is pending, do not display
  if (isInstalled || isDismissed || (!canInstall && !isIOS) || !cookieConsentResolved) {
    return null;
  }

  const handleInstallClick = async () => {
    if (canInstall) {
      await promptInstall();
    } else if (isIOS) {
      setShowIosGuide((prev) => !prev);
    }
  };

  return (
    <aside
      aria-label="Install Bits & Tools App"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-3"
    >
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/[0.08] shadow-floating flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-subtle">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Install Bits & Tools
              </h3>
              <p className="text-xs text-slate-500">
                Offline access & zero upload latency
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={dismissPrompt}
            aria-label="Close install prompt"
            className="text-slate-400 hover:text-slate-600 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* iOS Instruction accordion */}
        {showIosGuide && isIOS && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5 animate-in fade-in">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Share className="w-3.5 h-3.5 text-brand-600" />
              <span>How to install on iOS:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] pl-1">
              <li>Tap the <strong className="font-semibold text-slate-800">Share</strong> icon at the bottom of Safari.</li>
              <li>Scroll down and select <strong className="font-semibold text-slate-800">Add to Home Screen</strong>.</li>
              <li>Tap <strong className="font-semibold text-slate-800">Add</strong> in the top-right corner.</li>
            </ol>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl text-xs font-semibold shadow-subtle transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isIOS ? "How to Install" : "Install App"}</span>
          </button>

          <button
            type="button"
            onClick={dismissPrompt}
            className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </aside>
  );
}
