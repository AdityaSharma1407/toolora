"use client";

import React, { useState, useId } from "react";
import { generateSlug } from "@/tools/utility/slugGenerator.js";
import {
  Link as LinkIcon,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Settings,
} from "lucide-react";

export default function SlugGeneratorWorkspace() {
  const [title, setTitle] = useState(
    "How to Build Ultra-Fast, Private Web Utilities with Next.js in 2026!"
  );
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [stripNumbers, setStripNumbers] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputId = useId();

  const slug = generateSlug(title, {
    separator,
    lowercase,
    removeStopWords,
    stripNumbers,
  });

  const handleCopy = async () => {
    if (!slug) return;
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <label htmlFor={inputId} className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4 text-brand-600" />
            <span>Article / Page Title</span>
          </label>
          <button
            type="button"
            onClick={() => setTitle("")}
            disabled={!title}
            className="text-xs text-slate-400 hover:text-rose-600 disabled:opacity-30"
          >
            Clear
          </button>
        </div>

        <input
          id={inputId}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title, heading, or blog post name to generate slug..."
          className="w-full p-3.5 rounded-xl border border-black/[0.08] text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        {/* Options Row */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Separator:</span>
            {["-", "_", ".", ""].map((sep) => (
              <button
                key={sep}
                type="button"
                onClick={() => setSeparator(sep)}
                className={`px-3 py-1 rounded-lg font-mono font-bold transition-colors ${
                  separator === sep
                    ? "bg-brand-600 text-white shadow-subtle"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {sep === "" ? "None" : sep === "_" ? "Underscore (_)" : sep === "." ? "Dot (.)" : "Hyphen (-)"}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-brand-600"
              />
              <span>lowercase</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={removeStopWords}
                onChange={(e) => setRemoveStopWords(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-brand-600"
              />
              <span>Remove Stop Words</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={stripNumbers}
                onChange={(e) => setStripNumbers(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-brand-600"
              />
              <span>Strip Numbers</span>
            </label>
          </div>
        </div>
      </div>

      {/* Generated Slug Result Card */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Generated SEO Slug
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {slug.length} characters
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs sm:text-sm text-slate-900 select-all break-all">
            {slug || "slug-will-appear-here"}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!slug}
            className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-subtle active:scale-[0.985] disabled:opacity-40"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          URL Preview: <strong className="text-slate-800 font-mono">https://example.com/posts/{slug || "..."}</strong>
        </p>
      </div>
    </div>
  );
}
