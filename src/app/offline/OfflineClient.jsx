"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  WifiOff,
  Wifi,
  RefreshCw,
  Home,
  ShieldCheck,
  FileText,
  FileCode,
  Braces,
  Hash,
  Binary,
} from "lucide-react";

const OFFLINE_RECOMMENDED = [
  {
    name: "Merge PDF",
    href: "/merge-pdf",
    icon: FileText,
    desc: "Combine PDF pages locally",
  },
  {
    name: "Markdown Editor",
    href: "/markdown-editor",
    icon: FileCode,
    desc: "Live preview & Markdown export",
  },
  {
    name: "JSON Formatter",
    href: "/json-formatter",
    icon: Braces,
    desc: "Validate, format & minify JSON",
  },
  {
    name: "Regex Tester",
    href: "/regex-tester",
    icon: Hash,
    desc: "Real-time regular expression testing",
  },
  {
    name: "Base64 Encoder",
    href: "/base64-encoder-decoder",
    icon: Binary,
    desc: "Convert text & files to Base64",
  },
];

export default function OfflineClient() {
  const [isOnline, setIsOnline] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setChecking(true);
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.reload();
      } else {
        setChecking(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#fbfbfd]">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-black/[0.06] shadow-subtle p-8 sm:p-10 text-center">
        {/* Status Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 shadow-inner">
          {isOnline ? (
            <Wifi className="w-8 h-8 text-emerald-600 animate-pulse" />
          ) : (
            <WifiOff className="w-8 h-8 text-slate-500" />
          )}
        </div>

        {/* Heading & Notice */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
          {isOnline ? "Back Online!" : "You're Offline"}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
          {isOnline
            ? "Your internet connection has been restored. You can resume full browsing."
            : "No active internet connection was detected. But don't worry — Bits & Tools runs entirely client-side!"}
        </p>

        {/* Privacy & Offline Guarantee Box */}
        <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 text-left mb-8 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-brand-900 leading-relaxed">
            <strong className="font-semibold">Client-Side Architecture:</strong> Because your
            documents never leave your device and require zero server APIs, any tools you have
            already cached will continue to run seamlessly offline.
          </p>
        </div>

        {/* Recommended Cached Tools */}
        <div className="text-left mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Quick Offline Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {OFFLINE_RECOMMENDED.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 hover:border-brand-500 hover:bg-slate-50/80 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 truncate">
                      {tool.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{tool.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            disabled={checking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-subtle transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
            <span>{checking ? "Checking..." : "Retry Connection"}</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
