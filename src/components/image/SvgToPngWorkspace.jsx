"use client";

import React, { useState, useEffect, useCallback, useId } from "react";
import {
  FileCode,
  Download,
  AlertCircle,
  Undo2,
  Sparkles,
  Upload,
  CheckCircle2,
  Sliders,
  Copy,
  Check,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { rasterizeSvg, getSvgDimensions } from "@/tools/image/svgToPng.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

const DEFAULT_SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad)" />
  <circle cx="100" cy="100" r="45" fill="#ffffff" opacity="0.95" />
  <path d="M 80 100 L 95 115 L 125 80" fill="none" stroke="#0284c7" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

export default function SvgToPngWorkspace() {
  const [svgInput, setSvgInput] = useState(DEFAULT_SAMPLE_SVG);
  const [fileName, setFileName] = useState("vector-graphic");
  const [scale, setScale] = useState(2);
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [format, setFormat] = useState("image/png");

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  const fileInputId = useId();

  const cleanupResultUrl = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
  }, [result]);

  useEffect(() => {
    return () => cleanupResultUrl();
  }, [cleanupResultUrl]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setErrorMessage(null);
    try {
      const text = await file.text();
      setSvgInput(text);
      setFileName(file.name.replace(/\.[^/.]+$/, ""));
      setResult(null);
    } catch (err) {
      setErrorMessage(err.message || "Failed to read SVG file.");
    }
  };

  const handleRasterize = async () => {
    if (!svgInput.trim()) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await rasterizeSvg(svgInput, {
        scale,
        format,
        backgroundColor,
      });

      const url = URL.createObjectURL(res.blob);
      const ext = format === "image/webp" ? "webp" : "png";
      const downloadName = `${fileName}-${res.width}x${res.height}.${ext}`;

      setResult({
        blob: res.blob,
        url,
        fileName: downloadName,
        width: res.width,
        height: res.height,
        size: res.size,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to render SVG.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopySvg = async () => {
    try {
      await navigator.clipboard.writeText(svgInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const inherentDims = getSvgDimensions(svgInput);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-red-700">
            <p className="font-semibold">Rendering error</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs text-red-500 hover:text-red-700 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Control & Input Card */}
      <div className="bg-white border border-black/[0.08] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Top Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-brand-600" />
            <span className="text-sm font-bold text-slate-800">
              Vector SVG Source
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({inherentDims.width} × {inherentDims.height} pt)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload .svg</span>
              <input
                id={fileInputId}
                type="file"
                accept=".svg,image/svg+xml"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleCopySvg}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SVG</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dual Layout: Code Editor + Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SVG Code Input */}
          <div className="lg:col-span-7 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              SVG Code Markup
            </label>
            <textarea
              value={svgInput}
              onChange={(e) => {
                setSvgInput(e.target.value);
                setResult(null);
              }}
              rows={9}
              className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-hidden focus:ring-2 focus:ring-brand-500/30 text-slate-800"
              spellCheck="false"
            />
          </div>

          {/* Raster Settings & Live Icon */}
          <div className="lg:col-span-5 space-y-4">
            {/* Scale multiplier */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Output Resolution Scale
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { s: 1, label: "1x (Standard)" },
                  { s: 2, label: "2x (Retina)" },
                  { s: 4, label: "4x (High Res)" },
                  { s: 8, label: "8x (Ultra HD)" },
                ].map((item) => (
                  <button
                    key={item.s}
                    type="button"
                    onClick={() => setScale(item.s)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs transition-all ${
                      scale === item.s
                        ? "bg-brand-600 text-white font-bold border-brand-600 shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="block font-bold">{item.s}x</span>
                    <span className="text-[10px] block opacity-80">
                      {Math.round(inherentDims.width * item.s)}px
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Style */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Background
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBackgroundColor("transparent")}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    backgroundColor === "transparent"
                      ? "bg-brand-50 text-brand-700 border-brand-300 font-bold"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  Transparent
                </button>
                <button
                  type="button"
                  onClick={() => setBackgroundColor("#ffffff")}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    backgroundColor === "#ffffff"
                      ? "bg-brand-50 text-brand-700 border-brand-300 font-bold"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  White Background
                </button>
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Format
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormat("image/png")}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    format === "image/png"
                      ? "bg-brand-50 text-brand-700 border-brand-300 font-bold"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  PNG (Lossless)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("image/webp")}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    format === "image/webp"
                      ? "bg-brand-50 text-brand-700 border-brand-300 font-bold"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  WebP (Modern)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Target image:{" "}
            <strong className="text-slate-800">
              {Math.round(inherentDims.width * scale)} × {Math.round(inherentDims.height * scale)} px
            </strong>{" "}
            at {scale}x scale.
          </div>

          <PrimaryButton
            type="button"
            onClick={handleRasterize}
            icon={Download}
            size="lg"
            disabled={isProcessing || !svgInput.trim()}
          >
            {isProcessing ? "Rendering..." : "Convert to PNG"}
          </PrimaryButton>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="p-6 sm:p-8 bg-emerald-50/50 border border-emerald-200 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Raster PNG Generated!</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Dimensions: <strong className="font-mono text-slate-800">{result.width} × {result.height} px</strong> ({formatBytes(result.size)})
                </p>
              </div>
            </div>

            <a
              href={result.url}
              download={result.fileName}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG Image</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
