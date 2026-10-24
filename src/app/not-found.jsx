import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft, Sparkles } from "lucide-react";

export const metadata = {
  title: "Page Not Found (404) | Toolora",
  description: "The requested page could not be found on Toolora.",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
        <FileQuestion className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
        Error 404
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        Page Not Found
      </h1>

      <p className="text-base text-slate-600 max-w-md mx-auto mb-8">
        The tool or page you requested could not be located. You can return to our homepage or use our active PDF Merger.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>

        <Link
          href="/merge-pdf"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>Go to Merge PDF</span>
        </Link>
      </div>
    </div>
  );
}
