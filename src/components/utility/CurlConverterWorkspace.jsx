"use client";

import React, { useState, useMemo } from "react";
import {
  parseCurl,
  generateFetchCode,
  generateAxiosCode,
  generatePythonCode,
  generateNodeHttpCode,
  generatePhpCode,
  generateGoCode,
} from "@/tools/utility/curlParser.js";
import {
  Terminal,
  Code2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Globe,
  Lock,
} from "lucide-react";

const SAMPLE_CURL = `curl -X POST https://api.bitsandtools.com/v1/tools \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sec_tok_9981248" \\
  -d '{"action": "convert", "format": "pdf", "optimize": true}'`;

const SAMPLE_GET = `curl "https://api.bitsandtools.com/v1/metrics?period=30d&format=json" \\
  -H "Accept: application/json"`;

export default function CurlConverterWorkspace() {
  const [curlInput, setCurlInput] = useState(SAMPLE_CURL);
  const [activeLang, setActiveLang] = useState("fetch"); // "fetch" | "axios" | "python" | "node" | "php" | "go"
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => parseCurl(curlInput), [curlInput]);

  const generatedCode = useMemo(() => {
    switch (activeLang) {
      case "fetch":
        return generateFetchCode(parsed);
      case "axios":
        return generateAxiosCode(parsed);
      case "python":
        return generatePythonCode(parsed);
      case "node":
        return generateNodeHttpCode(parsed);
      case "php":
        return generatePhpCode(parsed);
      case "go":
        return generateGoCode(parsed);
      default:
        return generateFetchCode(parsed);
    }
  }, [activeLang, parsed]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languages = [
    { id: "fetch", label: "JavaScript (Fetch)" },
    { id: "axios", label: "Axios" },
    { id: "python", label: "Python (Requests)" },
    { id: "node", label: "Node.js (Native)" },
    { id: "php", label: "PHP (cURL)" },
    { id: "go", label: "Go (net/http)" },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Sample Quick Selector */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>Quick Samples</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCurlInput(SAMPLE_CURL)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-medium transition-all"
          >
            POST with JSON & Bearer Token
          </button>
          <button
            type="button"
            onClick={() => setCurlInput(SAMPLE_GET)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-medium transition-all"
          >
            GET with Query Params
          </button>
        </div>
      </div>

      {/* cURL Input Canvas */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brand-600" />
            <h2 className="text-xs sm:text-sm font-semibold text-slate-800">
              cURL Command Input
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCurlInput("")}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>

        <textarea
          value={curlInput}
          onChange={(e) => setCurlInput(e.target.value)}
          placeholder="Paste curl command here (e.g. curl https://api.example.com)..."
          rows={5}
          spellCheck={false}
          className="w-full p-4 rounded-xl border border-black/[0.08] bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm leading-relaxed placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-y"
        />

        {/* Extracted Request Summary */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
          <span className="font-semibold px-2 py-0.5 rounded bg-brand-100 text-brand-800 uppercase">
            {parsed.method}
          </span>
          <span className="flex items-center gap-1 text-slate-500 font-mono truncate max-w-sm">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {parsed.url || "No URL detected"}
          </span>
          <span className="text-slate-400">
            {Object.keys(parsed.headers).length} headers
          </span>
          {parsed.auth && (
            <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono">
              <Lock className="w-3 h-3" /> Basic Auth
            </span>
          )}
        </div>
      </div>

      {/* Target Language Output Canvas */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-brand-600" />
            <h3 className="text-xs sm:text-sm font-semibold text-slate-800">
              Generated Code
            </h3>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl">
          {languages.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setActiveLang(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeLang === lang.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Code block display */}
        <pre className="p-4 sm:p-5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[180px]">
          <code>{generatedCode}</code>
        </pre>
      </div>
    </div>
  );
}
