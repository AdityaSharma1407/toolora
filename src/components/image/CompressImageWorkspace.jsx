"use client";

import React, { useState, useEffect, useCallback, useId } from "react";
import {
  Minimize2,
  Download,
  AlertCircle,
  Undo2,
  Sparkles,
  Upload,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { compressImage } from "@/tools/image/imageCompress.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

export default function CompressImageWorkspace() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState("image/jpeg");
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

    if (selected.type === "image/webp") {
      setFormat("image/webp");
    } else {
      setFormat("image/jpeg");
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await compressImage(file, {
        quality: quality / 100,
        format,
      });

      const url = URL.createObjectURL(res.blob);
      const ext = format === "image/webp" ? "webp" : "jpg";
      const downloadName = file.name.replace(/\.[^/.]+$/, "") + `-compressed.${ext}`;

      setResult({
        blob: res.blob,
        url,
        fileName: downloadName,
        originalSize: res.originalSize,
        compressedSize: res.compressedSize,
        percentSaved: res.percentSaved,
        width: res.width,
        height: res.height,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to compress image.");
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
            <p className="font-semibold">Compression error</p>
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
              Shrink JPG, PNG, and WebP images up to 80% without visible quality loss.
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
              <span>Choose Another File</span>
            </button>
          </div>

          {/* Quality Slider & Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-slate-600">
                  Target Quality
                </span>
                <span className="font-mono font-bold text-slate-800">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Maximum Compression</span>
                <span>Balanced (Recommended)</span>
                <span>High Quality</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white"
              >
                <option value="image/jpeg">JPEG (Universal compatibility)</option>
                <option value="image/webp">WebP (Smallest file size)</option>
              </select>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Compressed entirely in your browser using WebAssembly and Canvas.
            </div>

            <PrimaryButton
              type="button"
              onClick={handleCompress}
              icon={Minimize2}
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? "Compressing..." : "Compress Image"}
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
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">Compression Complete!</h4>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                    -{result.percentSaved}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Reduced from <span className="line-through">{formatBytes(result.originalSize)}</span> to{" "}
                  <strong className="text-emerald-800 font-bold">{formatBytes(result.compressedSize)}</strong>
                </p>
              </div>
            </div>

            <a
              href={result.url}
              download={result.fileName}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Compressed Image</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
