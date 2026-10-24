"use client";

import React from "react";
import { Loader2, ShieldCheck } from "lucide-react";

export default function PdfProcessingState({ progress }) {
  const percent = progress?.percent ?? 45;
  const message = progress?.message ?? "Preparing documents for merge...";

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm flex flex-col items-center justify-center text-center animate-in fade-in"
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 animate-spin">
          <Loader2 className="w-8 h-8" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Merging Your PDF Documents
      </h3>

      <p className="text-sm text-slate-600 max-w-md mb-6">
        {message}
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-md bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
        <div
          className="bg-brand-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(Math.max(percent, 5), 100)}%` }}
        />
      </div>

      <div className="text-xs font-semibold text-slate-400">
        {percent}% Complete
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Local client-side execution &bull; No upload to external servers</span>
      </div>
    </div>
  );
}
