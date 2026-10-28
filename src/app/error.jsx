"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, HelpCircle, ChevronDown } from "lucide-react";

export default function ErrorBoundary({ error, reset }) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log error to client console or monitoring service
    console.error("Bits & Tools Runtime Exception:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#fbfbfd]">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-black/[0.06] shadow-subtle p-8 sm:p-10 text-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner border border-rose-100">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
          An unexpected error occurred while running this tool. Because Bits &amp; Tools processes
          everything locally in your browser, your files remain completely safe and uncompromised.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-subtle transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Technical details accordion */}
        {error?.message && (
          <div className="pt-4 border-t border-slate-100 text-left">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <span>{showDetails ? "Hide error details" : "Show technical details"}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showDetails ? "rotate-180" : ""}`}
              />
            </button>

            {showDetails && (
              <pre className="mt-2.5 p-3 rounded-xl bg-slate-950 text-slate-300 text-[11px] font-mono overflow-x-auto whitespace-pre-wrap break-words leading-relaxed border border-slate-800">
                {error.toString()}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
