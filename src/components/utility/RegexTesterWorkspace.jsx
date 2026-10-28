"use client";

import React, { useState, useMemo } from "react";
import { executeRegex, COMMON_REGEX_PATTERNS } from "@/tools/utility/regexEngine.js";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Sliders,
  Layers,
} from "lucide-react";

const SAMPLE_TEXT = `Welcome to Toolora Developer Tools Suite!
Contact support at support@toolora.io or sales@toolora.com for inquiries.
Documentation is accessible at https://toolora.io/docs and https://github.com/toolora/core.
Primary server IP is 192.168.1.1, fallback at 10.0.0.254.
Release tagged 2026-10-28 with build ID 550e8400-e29b-41d4-a716-446655440000.
Brand accent color: #3b82f6 or #0f172a.`;

export default function RegexTesterWorkspace() {
  const [pattern, setPattern] = useState("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
  const [flags, setFlags] = useState({ g: true, i: true, m: false, s: false, u: false });
  const [text, setText] = useState(SAMPLE_TEXT);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("highlight"); // "highlight" | "matches"

  const flagsString = useMemo(() => {
    return Object.entries(flags)
      .filter(([, active]) => active)
      .map(([f]) => f)
      .join("");
  }, [flags]);

  const result = useMemo(() => {
    return executeRegex(pattern, flagsString, text);
  }, [pattern, flagsString, text]);

  const toggleFlag = (flag) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleSelectPreset = (p) => {
    setPattern(p.pattern);
    const hasG = p.flags.includes("g");
    const hasI = p.flags.includes("i");
    setFlags((prev) => ({ ...prev, g: hasG, i: hasI }));
  };

  const handleCopyMatches = () => {
    if (!result.matches.length) return;
    const list = result.matches.map((m, idx) => `#${idx + 1}: ${m.text}`).join("\n");
    navigator.clipboard.writeText(list);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Pattern Selector Pills */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <BookOpen className="w-4 h-4 text-brand-600" />
          <span>Quick Presets</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_REGEX_PATTERNS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleSelectPreset(p)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-medium transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Regex Input & Flags Canvas */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-brand-600" />
            <h2 className="text-xs sm:text-sm font-semibold text-slate-800">
              Regular Expression Pattern
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPattern("");
                setText("");
              }}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 border border-black/[0.08] rounded-xl p-2 font-mono text-sm">
          <span className="text-slate-400 font-bold px-2 hidden sm:inline">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern (e.g. [a-z0-9]+)..."
            spellCheck={false}
            className="flex-1 bg-transparent px-2 py-1 outline-none text-slate-900 font-mono text-xs sm:text-sm placeholder:text-slate-400"
          />
          <span className="text-slate-400 font-bold px-2 hidden sm:inline">/{flagsString}</span>

          {/* Flags checkboxes */}
          <div className="flex items-center gap-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-2">
            {["g", "i", "m", "s", "u"].map((flag) => (
              <button
                key={flag}
                type="button"
                onClick={() => toggleFlag(flag)}
                className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all ${
                  flags[flag]
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
                title={`Flag: ${flag}`}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {!result.valid && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>Regex Error: {result.error}</span>
          </div>
        )}

        {/* Match Count Badge */}
        {result.valid && (
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full ${
                  result.matches.length > 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {result.matches.length}{" "}
                {result.matches.length === 1 ? "match" : "matches"} found
              </span>
            </div>
            {result.matches.length > 0 && (
              <button
                type="button"
                onClick={handleCopyMatches}
                className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-brand-600 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Matches"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Test String Canvas */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-600" />
            <h3 className="text-xs sm:text-sm font-semibold text-slate-800">
              Test String & Match Viewer
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("highlight")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                activeTab === "highlight"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Highlighted
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("matches")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                activeTab === "matches"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              List ({result.matches.length})
            </button>
          </div>
        </div>

        {/* Editable Test Input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type sample text to test your regex against..."
          rows={6}
          spellCheck={false}
          className="w-full p-4 rounded-xl border border-black/[0.08] bg-slate-50/40 text-slate-900 font-mono text-xs sm:text-sm leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-y"
        />

        {/* Result view */}
        {activeTab === "highlight" ? (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-500">
              Real-Time Highlighted Result:
            </div>
            <div
              className="p-4 rounded-xl border border-black/[0.08] bg-slate-50/60 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-all min-h-[120px] text-slate-900"
              dangerouslySetInnerHTML={{ __html: result.highlightedHtml }}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-500">
              Match Breakdown ({result.matches.length}):
            </div>
            {result.matches.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center italic">
                No matches found in the test string.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto rounded-xl border border-black/[0.08]">
                {result.matches.map((m, idx) => (
                  <div key={idx} className="p-3 text-xs font-mono space-y-1 hover:bg-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-600">Match #{idx + 1}</span>
                      <span className="text-slate-400">
                        Index: {m.index}..{m.index + m.length}
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-amber-50 text-amber-900 border border-amber-200/60 break-all">
                      {m.text}
                    </div>
                    {m.groups.length > 0 && (
                      <div className="pl-4 pt-1 space-y-1">
                        {m.groups.map((g) => (
                          <div key={g.index} className="text-slate-600 flex items-center gap-2">
                            <span className="font-semibold text-slate-400">Group ${g.index}:</span>
                            <span className="bg-slate-100 px-1 rounded">{g.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
