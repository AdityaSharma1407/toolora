"use client";

import React, { useState, useId } from "react";
import { analyzeText } from "@/tools/utility/wordCounter.js";
import {
  FileText,
  Clock,
  Mic,
  Copy,
  Check,
  RotateCcw,
  Download,
  BookOpen,
  Sparkles,
} from "lucide-react";

const SAMPLE_TEXT = `Online privacy is not a luxury—it is a fundamental right. In an era where web utilities routinely harvest user data, convert files on untrusted third-party servers, and track every click, Bits & Tools offers a fresh alternative: fast, elegant utilities that run 100% locally in your web browser.

By leveraging client-side WebAssembly, modern JavaScript APIs, and in-memory streams, your confidential documents, legal contracts, and personal records remain exclusively on your device. Zero telemetry, zero file storage, zero compromises.`;

export default function WordCounterWorkspace() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedStats, setCopiedStats] = useState(false);
  const textareaId = useId();

  const metrics = analyzeText(text);

  const handleCopyText = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyStats = async () => {
    const summary = `Text Statistics Summary:
- Words: ${metrics.wordCount}
- Characters (with spaces): ${metrics.characterCount}
- Characters (no spaces): ${metrics.charactersNoSpaces}
- Sentences: ${metrics.sentenceCount}
- Paragraphs: ${metrics.paragraphCount}
- Estimated Reading Time: ${metrics.readingTimeSeconds}s
- Estimated Speaking Time: ${metrics.speakingTimeSeconds}s
- Avg Word Length: ${metrics.avgWordLength} chars`;

    await navigator.clipboard.writeText(summary);
    setCopiedStats(true);
    setTimeout(() => setCopiedStats(false), 2000);
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document-word-count.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-subtle flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Words</span>
          <span className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1 tracking-tight">
            {metrics.wordCount.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">Total words counted</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-subtle flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Characters</span>
          <span className="text-3xl sm:text-4xl font-bold text-brand-600 mt-1 tracking-tight">
            {metrics.characterCount.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">{metrics.charactersNoSpaces.toLocaleString()} without spaces</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-subtle flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sentences</span>
          <span className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1 tracking-tight">
            {metrics.sentenceCount.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">{metrics.paragraphCount} paragraphs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-subtle flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reading Time</span>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {metrics.readingTimeSeconds < 60
                ? `${metrics.readingTimeSeconds}s`
                : `${Math.ceil(metrics.readingTimeSeconds / 60)}m`}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">~{Math.ceil(metrics.speakingTimeSeconds / 60)}m speaking</span>
        </div>
      </div>

      {/* Main Text Editor Box */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
        {/* Editor Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            <label htmlFor={textareaId} className="text-xs sm:text-sm font-semibold text-slate-800">
              Paste or type your text below
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setText(SAMPLE_TEXT)}
              className="text-xs font-medium text-slate-600 hover:text-brand-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Load Sample Text
            </button>
            <button
              type="button"
              onClick={() => setText("")}
              disabled={!text}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500 focus:outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            id={textareaId}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here (e.g. essay, article, blog post, email, or social media caption)..."
            rows={12}
            className="w-full p-4 sm:p-5 rounded-xl border border-black/[0.08] text-slate-800 text-sm sm:text-base leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-y"
          />
        </div>

        {/* Action Controls & Supplementary Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span>Avg. word length: <strong className="text-slate-800">{metrics.avgWordLength}</strong> chars</span>
            <span>Avg. sentence length: <strong className="text-slate-800">{metrics.avgSentenceLength}</strong> words</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyStats}
              disabled={!text}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {copiedStats ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedStats ? "Stats Copied!" : "Copy Stats"}
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              disabled={!text}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Text Copied!" : "Copy Text"}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!text}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-subtle active:scale-[0.985] disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Download className="w-3.5 h-3.5" />
              Download .txt
            </button>
          </div>
        </div>
      </div>

      {/* Keyword Density / Frequency Breakdown */}
      {metrics.keywords.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Top Keywords & Density Analysis
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {metrics.keywords.map((kw, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <span className="font-semibold text-slate-800 truncate mr-2">{kw.word}</span>
                <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {kw.count}× ({kw.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
