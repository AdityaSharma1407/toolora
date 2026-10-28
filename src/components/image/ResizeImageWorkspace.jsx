"use client";

import React, { useState, useEffect, useCallback, useId } from "react";
import {
  Image as ImageIcon,
  Sliders,
  Download,
  AlertCircle,
  Undo2,
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  Upload,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { resizeImage, getImageMetadata } from "@/tools/image/imageResize.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

const PRESET_PERCENTAGES = [25, 50, 75, 100, 150, 200];

export default function ResizeImageWorkspace() {
  const [file, setFile] = useState(null);
  const [meta, setMeta] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Resize settings
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(90);

  // Processing & result
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputId = useId();

  const cleanupUrls = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
  }, [previewUrl, result]);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file (PNG, JPG, WebP, etc.).");
      return;
    }
    setErrorMessage(null);
    setResult(null);

    try {
      const metadata = await getImageMetadata(selectedFile);
      setFile(selectedFile);
      setMeta(metadata);
      setWidth(metadata.width);
      setHeight(metadata.height);

      if (selectedFile.type === "image/jpeg" || selectedFile.type === "image/webp") {
        setFormat(selectedFile.type);
      } else {
        setFormat("image/png");
      }

      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } catch (err) {
      setErrorMessage(err.message || "Failed to inspect image dimensions.");
    }
  };

  const handleWidthChange = (val) => {
    const num = Math.max(1, parseInt(val) || 0);
    setWidth(num);
    if (aspectRatioLocked && meta && meta.aspectRatio > 0) {
      setHeight(Math.max(1, Math.round(num / meta.aspectRatio)));
    }
  };

  const handleHeightChange = (val) => {
    const num = Math.max(1, parseInt(val) || 0);
    setHeight(num);
    if (aspectRatioLocked && meta && meta.aspectRatio > 0) {
      setWidth(Math.max(1, Math.round(num * meta.aspectRatio)));
    }
  };

  const handlePercentScale = (pct) => {
    if (!meta) return;
    const newW = Math.max(1, Math.round((meta.width * pct) / 100));
    const newH = Math.max(1, Math.round((meta.height * pct) / 100));
    setWidth(newW);
    setHeight(newH);
  };

  const handleApplyResize = async () => {
    if (!file || !meta) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await resizeImage(file, {
        width,
        height,
        maintainAspectRatio: false,
        format,
        quality: quality / 100,
      });

      const url = URL.createObjectURL(res.blob);
      const ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
      const downloadName = (file.name || "image").replace(/\.[^/.]+$/, "") + `-resized.${ext}`;

      setResult({
        blob: res.blob,
        url,
        fileName: downloadName,
        width: res.width,
        height: res.height,
        size: res.size,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to resize image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    cleanupUrls();
    setFile(null);
    setMeta(null);
    setPreviewUrl(null);
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-red-700">
            <p className="font-semibold">Resize error</p>
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
        /* Upload Zone */
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
              Drop your image here or <span className="text-brand-600 hover:underline">browse</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Supports PNG, JPG, WebP, GIF, and BMP. Processed 100% locally on your device.
            </p>
          </label>
        </div>
      ) : (
        /* Resize Controls & Preview */
        <div className="bg-white border border-black/[0.08] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header Bar */}
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
                  <span>{formatBytes(meta.size)}</span>
                  <span>&bull;</span>
                  <span className="font-mono font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                    {meta.width} × {meta.height} px
                  </span>
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Quick scale presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Quick Scale
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_PERCENTAGES.map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePercentScale(pct)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Width / Height Inputs with Lock */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Exact Dimensions (Pixels)
                  </span>
                  <button
                    type="button"
                    onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      aspectRatioLocked
                        ? "bg-brand-50 text-brand-700 border border-brand-200"
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    {aspectRatioLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>Lock Aspect Ratio</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Width (px)</label>
                    <input
                      type="number"
                      min="1"
                      max="16000"
                      value={width || ""}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Height (px)</label>
                    <input
                      type="number"
                      min="1"
                      max="16000"
                      value={height || ""}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>
                </div>
              </div>

              {/* Format & Quality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Output Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="image/png">PNG (Lossless, Transparent)</option>
                    <option value="image/jpeg">JPEG (Compressed, Web standard)</option>
                    <option value="image/webp">WebP (Modern high-compression)</option>
                  </select>
                </div>

                {format !== "image/png" && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold uppercase tracking-wider text-slate-600">
                        Quality
                      </span>
                      <span className="font-mono font-bold text-slate-800">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-brand-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Live Preview
              </span>
              <div className="max-h-64 max-w-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xs p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  loading="lazy"
                  decoding="async"
                  className="max-h-60 w-auto object-contain mx-auto"
                />
              </div>
              <div className="mt-3 text-center text-xs text-slate-500">
                Target: <strong className="text-slate-800">{width} × {height} px</strong>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Ready to resize <strong className="text-slate-800">{file.name}</strong> from{" "}
              {meta.width}×{meta.height} to {width}×{height}.
            </div>

            <PrimaryButton
              type="button"
              onClick={handleApplyResize}
              icon={Sliders}
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? "Resizing..." : "Resize Image"}
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* Completed Result Card */}
      {result && (
        <div className="p-6 sm:p-8 bg-emerald-50/50 border border-emerald-200 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Image Resized Successfully!</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  New size: <strong className="font-mono text-slate-800">{result.width} × {result.height} px</strong> ({formatBytes(result.size)})
                </p>
              </div>
            </div>

            <a
              href={result.url}
              download={result.fileName}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Resized Image</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
