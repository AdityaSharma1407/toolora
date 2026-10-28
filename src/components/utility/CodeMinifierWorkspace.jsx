"use client";

import React, { useState, useMemo } from "react";
import { processCode } from "@/tools/utility/codeMinifier.js";
import {
  Minimize2,
  Maximize2,
  Copy,
  Check,
  RotateCcw,
  Download,
  AlertCircle,
  FileCode,
  TrendingDown,
  Sparkles,
} from "lucide-react";

const SAMPLES = {
  json: `{
  "appName": "Toolora",
  "version": "2.0.0",
  "privacy": {
    "zeroServerUploads": true,
    "inBrowser": true
  },
  "modules": ["pdf", "image", "media", "dev"]
}`,
  css: `/* Toolora Global Theme */
.card-container {
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}`,
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Meta Configuration -->
    <meta charset="UTF-8" />
    <title>Toolora - Developer Suite</title>
  </head>
  <body>
    <header class="navbar">
      <h1>Toolora</h1>
    </header>
  </body>
</html>`,
  javascript: `// Fibonacci sequence calculator
function getFibonacci(n) {
  if (n <= 1) return n;
  let prev = 0;
  let curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`,
};

export default function CodeMinifierWorkspace() {
  const [language, setLanguage] = useState("json"); // "json" | "css" | "html" | "javascript"
  const [mode, setMode] = useState("minify"); // "minify" | "beautify"
  const [inputCode, setInputCode] = useState(SAMPLES.json);
  const [copied, setCopied] = useState(false);

  const processed = useMemo(() => {
    return processCode(inputCode, language, mode);
  }, [inputCode, language, mode]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setInputCode(SAMPLES[lang]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(processed.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extMap = {
      json: "json",
      css: "css",
      html: "html",
      javascript: "js",
    };
    const ext = extMap[language];
    const filename = mode === "minify" ? `code.min.${ext}` : `code.formatted.${ext}`;
    const blob = new Blob([processed.result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Controls: Language & Mode */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Language Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl">
          {[
            { id: "json", label: "JSON" },
            { id: "css", label: "CSS" },
            { id: "html", label: "HTML" },
            { id: "javascript", label: "JavaScript" },
          ].map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => handleLanguageChange(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                language === lang.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Action Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl">
          <button
            type="button"
            onClick={() => setMode("minify")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === "minify"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Minimize2 className="w-3.5 h-3.5" />
            Minify (Compress)
          </button>
          <button
            type="button"
            onClick={() => setMode("beautify")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === "beautify"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Beautify (Format)
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      {processed.success && processed.metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-subtle text-center">
            <div className="text-xl sm:text-2xl font-bold text-slate-800">
              {processed.metrics.originalBytes} B
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Original Size</div>
          </div>
          <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-subtle text-center">
            <div className="text-xl sm:text-2xl font-bold text-slate-800">
              {processed.metrics.resultBytes} B
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Output Size</div>
          </div>
          <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-subtle text-center">
            <div
              className={`text-xl sm:text-2xl font-bold ${
                processed.metrics.savingsBytes >= 0 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {processed.metrics.savingsBytes >= 0 ? `-${processed.metrics.savingsBytes} B` : `+${Math.abs(processed.metrics.savingsBytes)} B`}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Delta</div>
          </div>
          <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-subtle text-center">
            <div
              className={`text-xl sm:text-2xl font-bold flex items-center justify-center gap-1 ${
                processed.metrics.savingsPercent >= 0 ? "text-emerald-600" : "text-slate-800"
              }`}
            >
              {processed.metrics.savingsPercent >= 0 && <TrendingDown className="w-4 h-4" />}
              {processed.metrics.savingsPercent}%
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Compression</div>
          </div>
        </div>
      )}

      {/* Error alert */}
      {!processed.success && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>Syntax Error: {processed.error}</span>
        </div>
      )}

      {/* Editor Grid: Input & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Pane */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-brand-600" />
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                Input Code ({language.toUpperCase()})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInputCode(SAMPLES[language])}
                className="text-xs font-medium text-slate-600 hover:text-brand-600 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Sample
              </button>
              <button
                type="button"
                onClick={() => setInputCode("")}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>

          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder={`Paste raw ${language.toUpperCase()} code here...`}
            rows={16}
            spellCheck={false}
            className="w-full p-4 rounded-xl border border-black/[0.08] bg-slate-50/40 text-slate-900 font-mono text-xs sm:text-sm leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-y"
          />
        </div>

        {/* Output Pane */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                {mode === "minify" ? "Minified Result" : "Beautified Result"}
              </span>
            </div>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              In-Memory
            </span>
          </div>

          <textarea
            value={processed.result}
            readOnly
            rows={16}
            spellCheck={false}
            className="w-full p-4 rounded-xl border border-black/[0.08] bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed placeholder:text-slate-500 focus:outline-none transition-all resize-y"
          />

          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!processed.result}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Output"}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!processed.result}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
