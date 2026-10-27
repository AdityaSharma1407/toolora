"use client";

import React, { useState } from "react";
import { generateUuids } from "@/tools/utility/uuidGenerator.js";
import {
  Fingerprint,
  Copy,
  Check,
  RefreshCw,
  Download,
  Sparkles,
} from "lucide-react";

export default function UuidGeneratorWorkspace() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [wrap, setWrap] = useState("none"); // 'none' | 'braces' | 'quotes'
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [uuids, setUuids] = useState(() =>
    generateUuids({ count: 5, uppercase: false, hyphens: true, wrap: "none" })
  );

  const handleRegenerate = (customOptions = {}) => {
    const opts = {
      count,
      uppercase,
      hyphens,
      wrap,
      ...customOptions,
    };
    setUuids(generateUuids(opts));
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = async (uuid, idx) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([uuids.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `uuids-${uuids.length}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Configuration Controls Bar */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Generator Settings
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleRegenerate()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </button>
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-subtle"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAll ? "All Copied!" : "Copy All"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {/* Quantity */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Quantity (1-100):</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => {
                const c = Math.max(1, Math.min(100, Number(e.target.value) || 1));
                setCount(c);
                handleRegenerate({ count: c });
              }}
              className="w-full p-2.5 rounded-xl border border-black/[0.08] font-semibold text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Casing */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Case Format:</label>
            <select
              value={uppercase ? "upper" : "lower"}
              onChange={(e) => {
                const isUp = e.target.value === "upper";
                setUppercase(isUp);
                handleRegenerate({ uppercase: isUp });
              }}
              className="w-full p-2.5 rounded-xl border border-black/[0.08] font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="lower">lowercase (standard)</option>
              <option value="upper">UPPERCASE</option>
            </select>
          </div>

          {/* Hyphens */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Hyphens:</label>
            <select
              value={hyphens ? "yes" : "no"}
              onChange={(e) => {
                const h = e.target.value === "yes";
                setHyphens(h);
                handleRegenerate({ hyphens: h });
              }}
              className="w-full p-2.5 rounded-xl border border-black/[0.08] font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="yes">Include Hyphens (-)</option>
              <option value="no">No Hyphens (Compact)</option>
            </select>
          </div>

          {/* Enclosing Brackets */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Wrap Enclosure:</label>
            <select
              value={wrap}
              onChange={(e) => {
                const w = e.target.value;
                setWrap(w);
                handleRegenerate({ wrap: w });
              }}
              className="w-full p-2.5 rounded-xl border border-black/[0.08] font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="none">None</option>
              <option value="braces">{`{ Braces }`}</option>
              <option value="quotes">{`" Double Quotes "`}</option>
            </select>
          </div>
        </div>
      </div>

      {/* UUID List Display */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-2">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs text-slate-400">
          <span>Generated {uuids.length} RFC 4122 v4 UUID(s)</span>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-brand-600"
          >
            <Download className="w-3.5 h-3.5" />
            Download .txt
          </button>
        </div>

        <div className="space-y-2">
          {uuids.map((id, idx) => (
            <div
              key={idx}
              className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors"
            >
              <span className="font-mono text-xs sm:text-sm text-slate-800 tracking-wide select-all">
                {id}
              </span>
              <button
                type="button"
                onClick={() => handleCopySingle(id, idx)}
                className="opacity-80 group-hover:opacity-100 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-brand-700 bg-white border border-black/[0.06] hover:bg-brand-50 transition-colors"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
