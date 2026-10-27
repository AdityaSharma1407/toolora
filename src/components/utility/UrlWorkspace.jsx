"use client";

import React, { useState, useId } from "react";
import {
  encodeUrl,
  decodeUrl,
  parseUrlParameters,
  rebuildUrl,
} from "@/tools/utility/urlTool.js";
import {
  Link as LinkIcon,
  Copy,
  Check,
  RotateCcw,
  ArrowRightLeft,
  Plus,
  Trash2,
  Table,
  Sparkles,
} from "lucide-react";

export default function UrlWorkspace() {
  const [input, setInput] = useState("");
  const [encodeMode, setEncodeMode] = useState("component"); // 'component' | 'full'
  const [action, setAction] = useState("encode"); // 'encode' | 'decode' | 'params'
  const [copied, setCopied] = useState(false);
  const textareaId = useId();

  // Params mode state
  const parsedData = parseUrlParameters(input);
  const [paramsList, setParamsList] = useState([]);
  const [basePath, setBasePath] = useState("");

  const syncParamsFromInput = () => {
    const p = parseUrlParameters(input);
    setParamsList(p.params);
    setBasePath(p.pathname ? `${p.protocol ? p.protocol + "//" + p.host : ""}${p.pathname}` : "");
  };

  // Derive output
  let output = "";
  let error = null;

  if (action === "encode") {
    output = encodeUrl(input, encodeMode);
  } else if (action === "decode") {
    const res = decodeUrl(input);
    if (res.success) {
      output = res.output;
    } else {
      error = res.error;
    }
  }

  const handleCopy = async (val) => {
    if (!val) return;
    await navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setAction(action === "encode" ? "decode" : "encode");
  };

  const handleParamChange = (id, field, val) => {
    const updated = paramsList.map((p) => (p.id === id ? { ...p, [field]: val } : p));
    setParamsList(updated);
    setInput(rebuildUrl(basePath, updated));
  };

  const handleAddParam = () => {
    const newParam = { key: "param", value: "value", id: Math.random().toString(36).slice(2, 9) };
    const updated = [...paramsList, newParam];
    setParamsList(updated);
    setInput(rebuildUrl(basePath, updated));
  };

  const handleDeleteParam = (id) => {
    const updated = paramsList.filter((p) => p.id !== id);
    setParamsList(updated);
    setInput(rebuildUrl(basePath, updated));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Action Tabs */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setAction("encode")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              action === "encode"
                ? "bg-brand-600 text-white shadow-subtle"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Encode URL
          </button>
          <button
            type="button"
            onClick={() => setAction("decode")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              action === "decode"
                ? "bg-brand-600 text-white shadow-subtle"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Decode URL
          </button>
          <button
            type="button"
            onClick={() => {
              setAction("params");
              syncParamsFromInput();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              action === "params"
                ? "bg-brand-600 text-white shadow-subtle"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            URL Parameter Inspector
          </button>
        </div>

        {action === "encode" && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium">Mode:</span>
            <button
              type="button"
              onClick={() => setEncodeMode("component")}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                encodeMode === "component" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              Component (all symbols)
            </button>
            <button
              type="button"
              onClick={() => setEncodeMode("full")}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                encodeMode === "full" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              Full URL (preserves :// & ?)
            </button>
          </div>
        )}
      </div>

      {action !== "params" ? (
        /* Dual Panel for Encode/Decode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <label htmlFor={textareaId} className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {action === "encode" ? "Raw Input URL or Text" : "Encoded URL Input"}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setInput(
                      action === "encode"
                        ? "https://example.com/search?q=pdf tools & convert=true#results"
                        : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dpdf%20tools%20%26%20convert%3Dtrue%23results"
                    )
                  }
                  className="text-xs font-medium text-slate-600 hover:text-brand-600 px-2 py-1 rounded hover:bg-slate-50"
                >
                  Sample
                </button>
                <button
                  type="button"
                  onClick={() => setInput("")}
                  disabled={!input}
                  className="text-xs font-medium text-slate-400 hover:text-rose-600 px-2 py-1 rounded hover:bg-rose-50 disabled:opacity-30"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              id={textareaId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste or type URL or query parameters here..."
              rows={9}
              className="w-full flex-1 p-3.5 rounded-xl border border-black/[0.08] text-slate-800 text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-y break-all"
            />

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>{input.length} characters</span>
              <button
                type="button"
                onClick={handleSwap}
                disabled={!output}
                className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-40"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Swap Direction
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {action === "encode" ? "Percent-Encoded Output" : "Decoded Output"}
              </span>

              <button
                type="button"
                onClick={() => handleCopy(output)}
                disabled={!output}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <textarea
              readOnly
              value={output}
              placeholder="Output will appear here automatically..."
              rows={9}
              className="w-full flex-1 p-3.5 rounded-xl border border-black/[0.08] bg-slate-50/70 text-slate-900 font-mono text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none resize-y break-all"
            />

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>{output.length} characters</span>
              <span className="text-emerald-600 font-medium">100% Client-side</span>
            </div>
          </div>
        </div>
      ) : (
        /* Parameter Inspector Table */
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">URL Query Parameters Editor</h3>
              <p className="text-xs text-slate-500">Edit key-value parameters below to automatically rebuild your URL.</p>
            </div>
            <button
              type="button"
              onClick={handleAddParam}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-subtle transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Parameter
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Base URL:
            </label>
            <input
              type="text"
              value={basePath}
              onChange={(e) => {
                setBasePath(e.target.value);
                setInput(rebuildUrl(e.target.value, paramsList));
              }}
              placeholder="https://example.com/api/v1"
              className="w-full p-3 rounded-xl border border-black/[0.08] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Query Parameters:
            </label>

            {paramsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl text-center">
                No query parameters found. Click &quot;Add Parameter&quot; to append one.
              </p>
            ) : (
              <div className="space-y-2">
                {paramsList.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={p.key}
                      onChange={(e) => handleParamChange(p.id, "key", e.target.value)}
                      placeholder="key"
                      className="w-1/3 p-2.5 rounded-xl border border-black/[0.08] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <span className="text-slate-400 font-bold">=</span>
                    <input
                      type="text"
                      value={p.value}
                      onChange={(e) => handleParamChange(p.id, "value", e.target.value)}
                      placeholder="value"
                      className="flex-1 p-2.5 rounded-xl border border-black/[0.08] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteParam(p.id)}
                      className="p-2.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono truncate max-w-md">
              {input || "Reconstructed URL will display here..."}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(input)}
              disabled={!input}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Full URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
