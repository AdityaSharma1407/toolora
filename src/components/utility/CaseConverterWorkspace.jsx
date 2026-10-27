"use client";

import React, { useState, useId } from "react";
import {
  CASE_CONVERTERS,
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toDotCase,
  toAlternatingCase,
  toInverseCase,
} from "@/tools/utility/caseConverter.js";
import {
  Type,
  Copy,
  Check,
  RotateCcw,
  Download,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const SAMPLE_TEXT = "convert text between uppercase, lowercase, Title Case, camelCase, and snake_case easily.";

export default function CaseConverterWorkspace() {
  const [text, setText] = useState("");
  const [activeCase, setActiveCase] = useState("uppercase");
  const [copied, setCopied] = useState(false);
  const textareaId = useId();

  const currentConverter = CASE_CONVERTERS[activeCase]?.convert || toUpperCase;
  const transformedText = text ? currentConverter(text) : "";

  const handleCopy = async () => {
    if (!transformedText) return;
    await navigator.clipboard.writeText(transformedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!transformedText) return;
    const blob = new Blob([transformedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `converted-${activeCase}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const applyTransformationDirectly = (caseKey) => {
    setActiveCase(caseKey);
    if (text) {
      const converter = CASE_CONVERTERS[caseKey]?.convert;
      if (converter) {
        setText(converter(text));
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Transformation Selector Pills */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-4 sm:p-5">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Type className="w-4 h-4 text-brand-600" />
          <span>Select Target Case Style</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
          {Object.values(CASE_CONVERTERS).map((c) => {
            const isSelected = activeCase === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => applyTransformationDirectly(c.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all text-center truncate ${
                  isSelected
                    ? "bg-brand-600 text-white shadow-subtle scale-[1.02]"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-black/[0.04]"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual Editor Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Input Box */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <label htmlFor={textareaId} className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Original Input
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setText(SAMPLE_TEXT)}
                className="text-xs font-medium text-slate-600 hover:text-brand-600 px-2 py-1 rounded hover:bg-slate-50"
              >
                Sample
              </button>
              <button
                type="button"
                onClick={() => setText("")}
                disabled={!text}
                className="text-xs font-medium text-slate-400 hover:text-rose-600 px-2 py-1 rounded hover:bg-rose-50 disabled:opacity-30"
              >
                Clear
              </button>
            </div>
          </div>

          <textarea
            id={textareaId}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to convert..."
            rows={10}
            className="w-full flex-1 p-3.5 rounded-xl border border-black/[0.08] text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-y"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>{text.length} characters</span>
            <span>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </div>

        {/* Output Box */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Transformed Output</span>
              <span className="text-[10px] text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full font-semibold">
                {CASE_CONVERTERS[activeCase]?.name}
              </span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!transformedText}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!transformedText}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={transformedText}
            placeholder="Transformed text appears here automatically..."
            rows={10}
            className="w-full flex-1 p-3.5 rounded-xl border border-black/[0.08] bg-slate-50/70 text-slate-900 font-mono text-sm placeholder:text-slate-400 focus:outline-none resize-y"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>{transformedText.length} characters</span>
            <span className="text-emerald-600 font-medium">Ready to copy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
