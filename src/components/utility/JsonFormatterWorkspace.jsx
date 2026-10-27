"use client";

import React, { useState, useId } from "react";
import {
  formatJson,
  validateJson,
  unescapeJsonString,
} from "@/tools/utility/jsonFormatter.js";
import {
  Braces,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Download,
  Minimize2,
  Maximize2,
  ArrowDownAZ,
  Unlink,
} from "lucide-react";

const SAMPLE_JSON = `{
  "platform": "Bits & Tools",
  "version": 1.0,
  "privacy": {
    "zeroServerUploads": true,
    "localExecution": true,
    "storage": "RAM only"
  },
  "supportedFormats": ["PDF", "JSON", "Images", "Text"],
  "metrics": {
    "speed": "instant",
    "activeUsers": 125000
  }
}`;

export default function JsonFormatterWorkspace() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(null);
  const textareaId = useId();

  // Validate on the fly
  const validation = input.trim() ? validateJson(input) : { valid: null };

  const handlePrettify = (sortKeys = false) => {
    if (!input.trim()) return;
    const res = formatJson(input, { indent, sortKeys, minify: false });
    if (res.success) {
      setInput(res.output);
      setMessage({ type: "success", text: sortKeys ? "Formatted & keys sorted alphabetically!" : "JSON prettified successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: `Syntax Error: ${res.error}` });
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    const res = formatJson(input, { minify: true });
    if (res.success) {
      setInput(res.output);
      setMessage({ type: "success", text: `Minified! Saved ${Math.abs(res.stats.difference)} bytes.` });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: `Syntax Error: ${res.error}` });
    }
  };

  const handleUnescape = () => {
    if (!input.trim()) return;
    const unescaped = unescapeJsonString(input);
    setInput(unescaped);
    setMessage({ type: "success", text: "Backslash escapes removed!" });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCopy = async () => {
    if (!input) return;
    await navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!input) return;
    const blob = new Blob([input], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Toolbar */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Validation Status Indicator */}
        <div className="flex items-center gap-2">
          {validation.valid === true && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Valid JSON</span>
            </div>
          )}
          {validation.valid === false && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>
                Invalid Syntax {validation.line ? `(Line ${validation.line}, Col ${validation.column})` : ""}
              </span>
            </div>
          )}
          {validation.valid === null && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
              <Braces className="w-3.5 h-3.5 text-slate-500" />
              <span>Ready for input</span>
            </div>
          )}
        </div>

        {/* Center: Formatting Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Indent Selector */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-black/[0.04] text-xs">
            <span className="px-2 text-slate-500 font-medium">Indent:</span>
            {[2, 4, "tab"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setIndent(opt)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  indent === opt ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {opt === "tab" ? "Tab" : `${opt} Spaces`}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handlePrettify(false)}
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-subtle active:scale-[0.985] disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Prettify
          </button>

          <button
            type="button"
            onClick={handleMinify}
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40 focus:outline-none"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            Minify
          </button>

          <button
            type="button"
            onClick={() => handlePrettify(true)}
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40 focus:outline-none"
            title="Sort object keys alphabetically"
          >
            <ArrowDownAZ className="w-3.5 h-3.5" />
            Sort Keys
          </button>

          <button
            type="button"
            onClick={handleUnescape}
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40 focus:outline-none"
            title="Remove backslash escape characters"
          >
            <Unlink className="w-3.5 h-3.5" />
            Unescape
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {message && (
        <div
          className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Editor Main Canvas */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Braces className="w-4 h-4 text-brand-600" />
            <label htmlFor={textareaId} className="text-xs sm:text-sm font-semibold text-slate-800">
              JSON Code Editor
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInput(SAMPLE_JSON)}
              className="text-xs font-medium text-slate-600 hover:text-brand-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Load Sample
            </button>
            <button
              type="button"
              onClick={() => setInput("")}
              disabled={!input}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            id={textareaId}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your raw, minified, or malformed JSON here..."
            rows={16}
            spellCheck={false}
            className={`w-full p-4 sm:p-5 rounded-xl border font-mono text-xs sm:text-sm leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-y ${
              validation.valid === false ? "border-rose-300 bg-rose-50/20" : "border-black/[0.08] bg-slate-50/40 text-slate-900"
            }`}
          />
        </div>

        {/* Footer controls & info */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Size: <strong>{new Blob ? new Blob([input]).size : input.length}</strong> bytes</span>
            <span>Lines: <strong>{input ? input.split("\n").length : 0}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!input}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy JSON"}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!input}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              Download .json
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
