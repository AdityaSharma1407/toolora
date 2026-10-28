"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Download,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Sparkles,
  FileText,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import PdfProcessingState from "../pdf/PdfProcessingState";
import { convertImagesToPdf, PAGE_SIZES, MARGINS } from "@/tools/pdf/imagesToPdf";
import { validateImageFile } from "@/tools/pdf/validateImage";
import { formatBytes } from "@/tools/pdf/validatePdf";
import { triggerBlobDownload, moveItemInArray } from "@/tools/pdf/pdfUtils";

export default function JpgToPdfWorkspace() {
  const [status, setStatus] = useState("idle"); // idle | loaded | processing | completed | error
  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState("a4"); // 'a4' | 'letter' | 'fit'
  const [orientation, setOrientation] = useState("portrait"); // 'portrait' | 'landscape'
  const [placement, setPlacement] = useState("fit"); // 'fit' | 'fill'
  const [margin, setMargin] = useState("small"); // 'none' | 'small' | 'medium' | 'large'
  const [progress, setProgress] = useState({ percent: 0, message: "" });
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fileInputRef = useRef(null);

  // Clean up object URLs
  const cleanupImages = useCallback((items) => {
    items.forEach((item) => {
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
  }, []);

  const cleanupBlob = useCallback(() => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
  }, [result]);

  useEffect(() => {
    return () => {
      cleanupImages(images);
      cleanupBlob();
    };
  }, [cleanupImages, cleanupBlob, images]);

  async function handleFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const rawFiles = Array.from(fileList);
    const validItems = [];
    const errors = [];

    for (const file of rawFiles) {
      const check = validateImageFile(file);
      if (!check.valid) {
        errors.push(check.error);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);

      // Extract image dimensions asynchronously
      const dimensions = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => resolve({ width: 0, height: 0 });
        img.src = previewUrl;
      });

      validItems.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        width: dimensions.width,
        height: dimensions.height,
      });
    }

    if (errors.length > 0) {
      setErrorMessage(errors[0]);
    }

    if (validItems.length > 0) {
      setImages((prev) => [...prev, ...validItems]);
      setStatus("loaded");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleMoveUp(index) {
    setImages((prev) => moveItemInArray(prev, index, index - 1));
  }

  function handleMoveDown(index) {
    setImages((prev) => moveItemInArray(prev, index, index + 1));
  }

  function handleRemove(index) {
    setImages((prev) => {
      const target = prev[index];
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setStatus("idle");
      }
      return updated;
    });
  }

  function handleClearAll() {
    cleanupImages(images);
    setImages([]);
    setStatus("idle");
    setErrorMessage(null);
  }

  async function handleConvert() {
    if (images.length === 0) {
      setErrorMessage("Please upload at least one JPG or PNG image to convert.");
      return;
    }

    setStatus("processing");
    setProgress({ percent: 10, message: "Setting up PDF compiler..." });
    setErrorMessage(null);

    try {
      const convertResult = await convertImagesToPdf(
        images,
        {
          pageSize,
          orientation,
          placement,
          margin,
          outputName: "converted-document.pdf",
        },
        (prog) => setProgress(prog)
      );

      const blob = new Blob([convertResult.bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResult({
        blob,
        url,
        filename: convertResult.filename,
        byteLength: convertResult.byteLength,
        pageCount: convertResult.pageCount,
      });

      setStatus("completed");
    } catch (err) {
      console.error("JPG to PDF error:", err);
      setErrorMessage(err?.message || "Failed to convert images to PDF.");
      setStatus("error");
    }
  }

  function handleReset() {
    cleanupBlob();
    cleanupImages(images);
    setImages([]);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
    setProgress({ percent: 0, message: "" });
  }

  function handleDownload() {
    if (result?.blob) {
      triggerBlobDownload(result.blob, result.filename);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Error Notice */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start justify-between gap-3 text-sm text-red-700 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-800">Upload Notice</h4>
              <p className="mt-0.5 text-red-700 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs font-semibold px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* State 1: Upload (Idle) */}
      {status === "idle" && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          role="region"
          aria-label="Image upload target"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className="relative flex flex-col items-center justify-center cursor-pointer rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-300 hover:border-brand-400 bg-white hover:bg-slate-50/50 p-6 sm:p-10 md:p-14 shadow-subtle transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 sm:mb-4">
            <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <h3 className="text-base sm:text-xl font-bold text-slate-900 text-center mb-1.5 sm:mb-2">
            Select or Drop JPG &amp; PNG Images
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 text-center max-w-md mb-5 sm:mb-6 leading-relaxed">
            Choose single or multiple pictures from your computer or phone. Converts directly in your browser.
          </p>

          <PrimaryButton
            size="lg"
            icon={UploadCloud}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Select Images
          </PrimaryButton>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span>Supports JPG, JPEG, and PNG</span>
            <span>&bull;</span>
            <span>Up to 30 images</span>
            <span>&bull;</span>
            <span className="text-brand-600 font-medium">100% Client-Side Privacy</span>
          </div>
        </div>
      )}

      {/* State 2: Configuration & Image List */}
      {status === "loaded" && images.length > 0 && (
        <div className="space-y-6">
          {/* Top image list container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Selected Images ({images.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Images will appear as individual PDF pages in the order shown below.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-brand-600" />
                  <span>Add More Images</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Images List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {images.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-slate-50/70 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
                >
                  <div className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                    #{index + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                    {item.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  {/* File Metadata */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 truncate" title={item.name}>
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatBytes(item.size)}
                      {item.width > 0 && ` • ${item.width} × ${item.height} px`}
                    </p>
                  </div>

                  {/* Controls (Strictly touch-friendly >= 40-44px on mobile) */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      aria-label={`Move image ${item.name} up`}
                      className="min-w-[40px] min-h-[40px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === images.length - 1}
                      aria-label={`Move image ${item.name} down`}
                      className="min-w-[40px] min-h-[40px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      aria-label={`Remove image ${item.name}`}
                      className="min-w-[40px] min-h-[40px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Page Layout Settings Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <Sliders className="w-4 h-4 text-brand-600" />
              <h4 className="text-sm font-bold text-slate-900">
                PDF Page Layout Settings
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Page Size */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                  Page Size
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <option value="a4">A4 (210 × 297 mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="fit">Fit to Image</option>
                </select>
              </div>

              {/* Orientation */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                  Orientation
                </label>
                <select
                  value={orientation}
                  disabled={pageSize === "fit"}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              {/* Placement */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                  Image Placement
                </label>
                <select
                  value={placement}
                  disabled={pageSize === "fit"}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50"
                >
                  <option value="fit">Fit within page (No crop)</option>
                  <option value="fill">Fill page (May crop)</option>
                </select>
              </div>

              {/* Margins */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                  Margins
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <option value="none">No Margin (0 pt)</option>
                  <option value="small">Small (15 pt)</option>
                  <option value="medium">Medium (30 pt)</option>
                  <option value="large">Large (50 pt)</option>
                </select>
              </div>
            </div>

            {/* Placement hint */}
            {placement === "fill" && pageSize !== "fit" && (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                Notice: &apos;Fill page&apos; scales photos to cover the entire page. Some outer edges may be clipped if photo and page aspect ratios differ.
              </p>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Converting <strong className="text-slate-800">{images.length}</strong> {images.length === 1 ? "image" : "images"} into 1 document
              </span>

              <PrimaryButton
                size="lg"
                variant="primary"
                icon={FileText}
                onClick={handleConvert}
                className="w-full sm:w-auto min-w-[200px]"
              >
                Convert to PDF
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* State 3: Processing */}
      {status === "processing" && (
        <PdfProcessingState progress={progress} />
      )}

      {/* State 4: Completed Result */}
      {status === "completed" && result && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm flex flex-col items-center text-center animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
            PDF Generated Successfully!
          </h3>

          <p className="text-sm text-slate-600 max-w-md mb-8">
            Compiled {result.pageCount} {result.pageCount === 1 ? "image" : "images"} into a clean, ready-to-use PDF document.
          </p>

          {/* File details card */}
          <div className="w-full max-w-lg bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-8 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white text-brand-600 border border-slate-200">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Output File</div>
                  <div className="text-sm font-bold text-slate-900 truncate max-w-[220px] sm:max-w-xs">
                    {result.filename}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">Size</div>
                <div className="text-sm font-bold text-slate-900">
                  {formatBytes(result.byteLength)}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
            <PrimaryButton
              size="lg"
              variant="primary"
              icon={Download}
              onClick={handleDownload}
              className="w-full sm:flex-1 py-3.5 shadow-md shadow-brand-500/20"
            >
              Download PDF
            </PrimaryButton>

            <PrimaryButton
              size="lg"
              variant="secondary"
              icon={RotateCcw}
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              Convert More Images
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* State 5: Error */}
      {status === "error" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Could Not Convert Images to PDF
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            {errorMessage || "One or more images could not be processed. Please check file integrity."}
          </p>
          <PrimaryButton variant="primary" icon={RotateCcw} onClick={handleReset}>
            Start Over
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
