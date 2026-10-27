"use client";

import React, { useState, useId } from "react";
import { computeTextDiff } from "@/tools/utility/textDiff.js";
import {
  FileDiff,
  ArrowRightLeft,
  RotateCcw,
  Sparkles,
  Columns,
  List,
  Plus,
  Minus,
  Equal,
} from "lucide-react";

const SAMPLE_ORIGINAL = `// User Authentication Service
function authenticateUser(email, password) {
  if (!email || !password) {
    throw new Error("Missing credentials");
  }
  const user = database.findUserByEmail(email);
  return user.verifyPassword(password);
}`;

const SAMPLE_MODIFIED = `// User Authentication Service (v2 Updated)
function authenticateUser(email, password) {
  if (!email || !password) {
    throw new Error("Missing required credentials");
  }
  // Added rate limiting security check
  rateLimiter.checkLimit(email);

  const user = database.findUserByEmail(email);
  return user.verifyPassword(password);
}`;

export default function TextDiffWorkspace() {
  const [original, setOriginal] = useState(SAMPLE_ORIGINAL);
  const [modified, setModified] = useState(SAMPLE_MODIFIED);
  const [viewMode, setViewMode] = useState("split"); // 'split' | 'unified'
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const originalId = useId();
  const modifiedId = useId();

  const diffResult = computeTextDiff(original, modified, {
    ignoreWhitespace,
    ignoreCase,
  });

  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Options & Stats Banner */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        {/* Diff Stats */}
        <div className="flex items-center gap-3 text-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{diffResult.stats.additions} Added</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 font-semibold border border-rose-200">
            <Minus className="w-3.5 h-3.5 text-rose-600" />
            <span>-{diffResult.stats.deletions} Removed</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
            <Equal className="w-3.5 h-3.5 text-slate-500" />
            <span>{diffResult.stats.unchanged} Unchanged</span>
          </div>
        </div>

        {/* View and Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                viewMode === "split" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Split View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("unified")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                viewMode === "unified" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Unified
            </button>
          </div>

          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 text-brand-600"
            />
            <span>Ignore Whitespace</span>
          </label>

          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 text-brand-600"
            />
            <span>Ignore Case</span>
          </label>
        </div>
      </div>

      {/* Input Editors (Collapsible / Resizable) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-4 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <label htmlFor={originalId} className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Original Text (Before)
            </label>
            <button
              type="button"
              onClick={() => setOriginal("")}
              disabled={!original}
              className="text-xs text-slate-400 hover:text-rose-600 disabled:opacity-30"
            >
              Clear
            </button>
          </div>
          <textarea
            id={originalId}
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here..."
            rows={6}
            className="w-full p-3 rounded-xl border border-black/[0.08] font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
          />
        </div>

        {/* Modified */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-4 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <label htmlFor={modifiedId} className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Modified Text (After)
              </label>
              <button
                type="button"
                onClick={handleSwap}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700"
              >
                <ArrowRightLeft className="w-3 h-3" />
                Swap
              </button>
            </div>
            <button
              type="button"
              onClick={() => setModified("")}
              disabled={!modified}
              className="text-xs text-slate-400 hover:text-rose-600 disabled:opacity-30"
            >
              Clear
            </button>
          </div>
          <textarea
            id={modifiedId}
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here to compare..."
            rows={6}
            className="w-full p-3 rounded-xl border border-black/[0.08] font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
          />
        </div>
      </div>

      {/* Difference Inspection Visualizer */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileDiff className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Line-by-Line Comparison Diff
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {diffResult.lines.length} total lines rendered
          </span>
        </div>

        {/* Diff Output Container */}
        <div className="rounded-xl border border-slate-200 overflow-x-auto bg-slate-900 text-slate-100 font-mono text-xs">
          {diffResult.lines.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No text to compare. Enter text in both fields above.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <tbody>
                {diffResult.lines.map((line, idx) => {
                  const isAdd = line.type === "added";
                  const isDel = line.type === "removed";

                  let rowBg = "hover:bg-slate-800/50";
                  let prefix = " ";
                  let symbolColor = "text-slate-600";

                  if (isAdd) {
                    rowBg = "bg-emerald-950/40 text-emerald-200 hover:bg-emerald-950/60";
                    prefix = "+";
                    symbolColor = "text-emerald-500 font-bold";
                  } else if (isDel) {
                    rowBg = "bg-rose-950/40 text-rose-200 hover:bg-rose-950/60";
                    prefix = "-";
                    symbolColor = "text-rose-500 font-bold";
                  }

                  return (
                    <tr key={idx} className={`${rowBg} transition-colors border-b border-slate-800/40`}>
                      <td className="w-10 px-2 py-1 text-right text-slate-500 select-none border-r border-slate-800">
                        {line.originalLineNumber || ""}
                      </td>
                      <td className="w-10 px-2 py-1 text-right text-slate-500 select-none border-r border-slate-800">
                        {line.modifiedLineNumber || ""}
                      </td>
                      <td className={`w-6 px-1.5 py-1 text-center select-none ${symbolColor}`}>
                        {prefix}
                      </td>
                      <td className="px-3 py-1 whitespace-pre-wrap break-all">
                        {line.content || " "}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
