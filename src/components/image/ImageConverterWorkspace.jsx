"use client";

import React, { useState, useEffect, useCallback, useId } from "react";
import {
  ArrowLeftRight,
  Download,
  AlertCircle,
  Undo2,
  Sparkles,
  Upload,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { convertImageFormat, SUPPORTED_FORMATS } from "@/tools/image/imageConvert.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

export default function ImageConverterWorkspace({ defaultTarget = "image/png", title = "Convert Image" }) {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState(defaultTarget);
  const [quality, setQuality] = useState(92);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputId = useId();

  const cleanupUrls = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
  }, [previewUrl, result]);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const handleFile = (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }
    setErrorMessage(null);
    setResult(null);

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await convertImageFormat(file, targetFormat, {
        quality: quality / 100,
        backgroundColor,
      });

      const url = URL.createObjectURL(res.blob);

      setResult({
        blob: res.blob,
        url,
        fileName: res.fileName,
        originalSize: res.originalSize,
        newSize: res.newSize,
        width: res.width,
        height: res.height,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to convert image format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    cleanupUrls();
    setFile(null);
    setResult(null);
    setPreviewUrl(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-red-700">
            <p className="font-semibold">Conversion error</p>
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
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Drop image here or <span className="text-brand-600 hover:underline">browse</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Convert between PNG, JPEG, and WebP instantly without quality loss.
            </p>
          </label>
        </div>
      ) : (
        <div className="bg-white border border-black/[0.08] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* File summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-3 rounded-xl bg-brand-50 text-brand-600 shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 truncate" title={file.name}>
                  {file.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-700">{formatBytes(file.size)}</span>
                  <span>&bull;</span>
                  <span className="font-mono text-slate-500">{file.type}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors self-start sm:self-auto"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Choose Another Image</span>
            </button>
          </div>

          {/* Target Format Selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Convert To Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {SUPPORTED_FORMATS.map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setTargetFormat(fmt.id)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      targetFormat === fmt.id
                        ? "border-brand-600 bg-brand-50/50 shadow-xs ring-2 ring-brand-500/20"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="block font-bold text-sm text-slate-900">{fmt.name}</span>
                    <span className="text-[11px] text-slate-500">.{fmt.ext}</span>
                  </button>
                ))}
              </div>
            </div>

            {targetFormat !== "image/png" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold uppercase tracking-wider text-slate-600">
                      Quality
                    </span>
                    <span className="font-mono font-bold text-slate-800">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="2"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                </div>

                {targetFormat === "image/jpeg" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Background Fill (for transparent areas)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-600 uppercase">{backgroundColor}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Converting to{" "}
              <strong className="text-slate-800">
                {SUPPORTED_FORMATS.find((f) => f.id === targetFormat)?.name}
              </strong>{" "}
              locally in memory.
            </div>

            <PrimaryButton
              type="button"
              onClick={handleConvert}
              icon={ArrowLeftRight}
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? "Converting..." : "Convert Format"}
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="p-6 sm:p-8 bg-emerald-50/50 border border-emerald-200 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">Conversion Successful!</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Saved as <strong className="font-mono text-slate-800">{result.fileName}</strong> ({formatBytes(result.newSize)})
                </p>
              </div>
            </div>

            <a
              href={result.url}
              download={result.fileName}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Image</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
