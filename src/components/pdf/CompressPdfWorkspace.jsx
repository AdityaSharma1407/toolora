"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Minimize2,
  Download,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Zap,
  Sparkles,
  Info,
  ShieldCheck,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import PdfUploadZone from "./PdfUploadZone";
import PdfProcessingState from "./PdfProcessingState";
import { compressPdfDocument } from "@/tools/pdf/compressPdf";
import { formatBytes } from "@/tools/pdf/validatePdf";
import { triggerBlobDownload } from "@/tools/pdf/pdfUtils";

export default function CompressPdfWorkspace() {
  const [status, setStatus] = useState("idle"); // idle | loaded | processing | completed | error
  const [fileItem, setFileItem] = useState(null);
  const [level, setLevel] = useState("recommended"); // 'basic' | 'recommended' | 'maximum'
  const [progress, setProgress] = useState({ percent: 0, message: "" });
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const cleanupBlob = useCallback(() => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
  }, [result]);

  useEffect(() => {
    return () => cleanupBlob();
  }, [cleanupBlob]);

  function handleFileSelected(files) {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setErrorMessage(null);

    setFileItem({
      file: selected.file,
      name: selected.name,
      size: selected.size,
    });
    setStatus("loaded");
  }

  async function handleCompress() {
    if (!fileItem) return;

    setStatus("processing");
    setProgress({ percent: 10, message: "Analyzing PDF structure..." });
    setErrorMessage(null);

    try {
      const compressResult = await compressPdfDocument(
        fileItem.file,
        {
          level,
          baseName: fileItem.name,
        },
        (prog) => setProgress(prog)
      );

      const blob = new Blob([compressResult.bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResult({
        blob,
        url,
        filename: compressResult.filename,
        originalSize: compressResult.originalSize,
        compressedSize: compressResult.compressedSize,
        savedBytes: compressResult.savedBytes,
        percentSaved: compressResult.percentSaved,
        isSmaller: compressResult.isSmaller,
        pageCount: compressResult.pageCount,
        level: compressResult.level,
      });

      setStatus("completed");
    } catch (err) {
      console.error("Compress PDF error:", err);
      setErrorMessage(err?.message || "Failed to compress the PDF document.");
      setStatus("error");
    }
  }

  function handleReset() {
    cleanupBlob();
    setResult(null);
    setFileItem(null);
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
              <h4 className="font-bold text-red-800">Compression Notice</h4>
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
        <PdfUploadZone
          onFilesSelected={handleFileSelected}
          existingCount={0}
        />
      )}

      {/* State 2: Configuration & Compression Options */}
      {status === "loaded" && fileItem && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* File summary bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-3 rounded-xl bg-red-50 text-red-600 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 truncate" title={fileItem.name}>
                  {fileItem.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Original file size: <span className="font-semibold text-slate-800">{formatBytes(fileItem.size)}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors self-start sm:self-auto"
            >
              Choose different file
            </button>
          </div>

          {/* Compression Level Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">
              Select Compression Level
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Basic */}
              <button
                type="button"
                onClick={() => setLevel("basic")}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  level === "basic"
                    ? "border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">Basic</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      Fastest
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-1">
                    Structural Clean
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Cleans standard metadata and packs objects into streams. Zero risk to formatting or embedded images.
                  </p>
                </div>
              </button>

              {/* Option 2: Recommended */}
              <button
                type="button"
                onClick={() => setLevel("recommended")}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                  level === "recommended"
                    ? "border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-brand-700">Recommended</span>
                    <span className="text-[10px] bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full font-semibold">
                      Popular
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-1">
                    Stream Optimization
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Purges unreferenced XML metadata packages and enables high-efficiency FlateDecode object streams.
                  </p>
                </div>
              </button>

              {/* Option 3: Maximum */}
              <button
                type="button"
                onClick={() => setLevel("maximum")}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  level === "maximum"
                    ? "border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">Maximum</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      Deep
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-1">
                    Full Document Repack
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Rebuilds document pages into a fresh PDF container, dropping old revision histories and orphaned objects.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Genuine Compression Disclosure Notice */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-700">Genuine Client-Side Compression: </strong>
              Toolora performs structural cleanup and stream optimization locally in your browser.
              If a PDF was already exported with aggressive compression or consists primarily of pre-compressed JPEG scans,
              further compression may yield minimal size reduction to avoid corrupting image or vector text data.
            </p>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Selected: <strong className="text-slate-800 capitalize">{level}</strong> optimization mode
            </div>

            <PrimaryButton
              size="lg"
              variant="primary"
              icon={Minimize2}
              onClick={handleCompress}
              className="w-full sm:w-auto min-w-[200px]"
            >
              Compress PDF
            </PrimaryButton>
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
            PDF Optimization Complete!
          </h3>

          <p className="text-sm text-slate-600 max-w-md mb-8">
            {result.isSmaller
              ? `Your PDF file size was reduced by ${result.percentSaved}% (${formatBytes(result.savedBytes)} saved).`
              : "Your document is already fully optimized. A clean, optimized copy is ready."}
          </p>

          {/* Size Comparison Card */}
          <div className="w-full max-w-lg bg-slate-50 border border-slate-200/80 rounded-xl p-5 mb-8 text-left">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200/80">
              <div>
                <span className="text-xs font-medium text-slate-500">Original Size</span>
                <div className="text-lg font-bold text-slate-800 mt-0.5">
                  {formatBytes(result.originalSize)}
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500">Optimized Size</span>
                <div className="text-lg font-bold text-brand-600 mt-0.5 flex items-center gap-2">
                  <span>{formatBytes(result.compressedSize)}</span>
                  {result.isSmaller && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      -{result.percentSaved}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status notice */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Output Document:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[220px]">
                {result.filename}
              </span>
            </div>

            {!result.isSmaller && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
                <strong>Notice: </strong>
                This PDF was already heavily compressed. Additional reduction was not possible without loss of document visual quality.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
            <PrimaryButton
              size="lg"
              variant="primary"
              icon={Download}
              onClick={handleDownload}
              className="w-full sm:flex-1 py-3.5 shadow-md shadow-brand-500/20"
            >
              Download Compressed PDF
            </PrimaryButton>

            <PrimaryButton
              size="lg"
              variant="secondary"
              icon={RotateCcw}
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              Compress Another PDF
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* State 5: Error fallback */}
      {status === "error" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Could Not Complete PDF Compression
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            {errorMessage || "The document could not be compressed. Please check that the file is not password-protected or corrupted."}
          </p>
          <PrimaryButton variant="primary" icon={RotateCcw} onClick={handleReset}>
            Start Over
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
