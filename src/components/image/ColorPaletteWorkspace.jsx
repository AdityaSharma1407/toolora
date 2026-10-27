"use client";

import React, { useState, useEffect, useCallback, useId } from "react";
import {
  Palette,
  Copy,
  Check,
  Undo2,
  Sparkles,
  Upload,
  Pipette,
  CheckCircle2,
  FileCode,
  Image as ImageIcon,
} from "lucide-react";
import { extractPalette, formatCssVariables, formatTailwindConfig } from "@/tools/image/colorPalette.js";

export default function ColorPaletteWorkspace() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [palette, setPalette] = useState([]);
  const [copiedKey, setCopiedKey] = useState(null);
  const [exportFormat, setExportFormat] = useState("hex"); // 'hex' | 'css' | 'tailwind' | 'json'
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputId = useId();

  const cleanupUrl = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    return () => cleanupUrl();
  }, [cleanupUrl]);

  const handleFile = async (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setErrorMessage("Please select an image file.");
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const url = URL.createObjectURL(selected);
      setFile(selected);
      setPreviewUrl(url);

      const colors = await extractPalette(selected, 8);
      setPalette(colors);
    } catch (err) {
      setErrorMessage(err.message || "Failed to extract color palette from image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleReset = () => {
    cleanupUrl();
    setFile(null);
    setPreviewUrl(null);
    setPalette([]);
    setErrorMessage(null);
  };

  const getExportText = () => {
    if (!palette.length) return "";
    switch (exportFormat) {
      case "css":
        return formatCssVariables(palette);
      case "tailwind":
        return formatTailwindConfig(palette);
      case "json":
        return JSON.stringify(palette.map((p) => ({ hex: p.hex, rgb: p.rgb, hsl: p.hsl })), null, 2);
      default:
        return palette.map((p) => p.hex).join(", ");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <div className="flex-1 text-sm text-red-700">
            <p className="font-semibold">Palette error</p>
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

      {!file ? (
        <div className="p-8 sm:p-12 bg-white border-2 border-dashed border-slate-200 hover:border-brand-500 rounded-3xl text-center transition-all">
          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
          <label htmlFor={fileInputId} className="cursor-pointer flex flex-col items-center">
            <div className="p-4 rounded-2xl bg-brand-50 text-brand-600 mb-4">
              <Palette className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Upload any photo or graphic to <span className="text-brand-600 hover:underline">extract palette</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Automatically clusters dominant colors into HEX, RGB, HSL, CSS, and Tailwind themes.
            </p>
          </label>
        </div>
      ) : (
        <div className="bg-white border border-black/[0.08] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-3 rounded-xl bg-brand-50 text-brand-600 shrink-0">
                <Palette className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 truncate" title={file.name}>
                  {file.name}
                </h3>
                <span className="text-xs text-slate-500">
                  Extracted {palette.length} dominant colors
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors self-start sm:self-auto"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Analyze Another Image</span>
            </button>
          </div>

          {/* Palette Swatches Bar */}
          {palette.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {palette.map((c, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col"
                  >
                    <div
                      className="h-24 w-full cursor-pointer transition-transform group-hover:scale-105"
                      style={{ backgroundColor: c.hex }}
                      onClick={() => handleCopy(c.hex, `swatch-${idx}`)}
                      title={`Click to copy ${c.hex}`}
                    />
                    <div className="p-2.5 bg-white text-center space-y-1">
                      <div className="font-mono text-xs font-bold text-slate-900">
                        {c.hex}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(c.hex, `swatch-${idx}`)}
                        className="w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-brand-600 transition-colors"
                      >
                        {copiedKey === `swatch-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image & Export Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-slate-200">
            {/* Image Thumbnail */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Analyzed Image
              </span>
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-h-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Uploaded Source"
                  className="max-h-60 w-auto object-contain"
                />
              </div>
            </div>

            {/* Export Code Formats */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Export Theme Code
                </span>
                <div className="flex items-center gap-1 text-xs">
                  {[
                    { id: "hex", label: "HEX" },
                    { id: "css", label: "CSS Variables" },
                    { id: "tailwind", label: "Tailwind" },
                    { id: "json", label: "JSON" },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setExportFormat(fmt.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        exportFormat === fmt.id
                          ? "bg-brand-600 text-white font-semibold"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  value={getExportText()}
                  rows={6}
                  className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-hidden text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(getExportText(), "exportCode")}
                  className="absolute right-3 top-3 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === "exportCode" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
