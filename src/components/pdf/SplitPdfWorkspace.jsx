"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileText,
  Scissors,
  Archive,
  Download,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import PdfUploadZone from "./PdfUploadZone";
import PdfProcessingState from "./PdfProcessingState";
import { splitPdfDocument, parsePageRange } from "@/tools/pdf/splitPdf";
import { formatBytes } from "@/tools/pdf/validatePdf";
import { triggerBlobDownload } from "@/tools/pdf/pdfUtils";

export default function SplitPdfWorkspace() {
  const [status, setStatus] = useState("idle"); // idle | loaded | processing | completed | error
  const [fileItem, setFileItem] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [mode, setMode] = useState("extract"); // 'extract' | 'split-all'
  const [rangeInput, setRangeInput] = useState("");
  const [progress, setProgress] = useState({ percent: 0, message: "" });
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Clean up Blob URLs on unmount/reset
  const cleanupBlob = useCallback(() => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
  }, [result]);

  useEffect(() => {
    return () => cleanupBlob();
  }, [cleanupBlob]);

  // When a file is uploaded, inspect its total page count
  async function handleFileSelected(files) {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setErrorMessage(null);

    try {
      const buffer = await selected.file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
      if (doc.isEncrypted) {
        throw new Error("This PDF is password-protected. Please unlock it before splitting.");
      }
      const count = doc.getPageCount();
      if (count === 0) {
        throw new Error("This PDF has 0 pages.");
      }

      setFileItem({
        file: selected.file,
        name: selected.name,
        size: selected.size,
        buffer,
      });
      setTotalPages(count);
      setRangeInput(count === 1 ? "1" : `1-${Math.min(count, 3)}`);
      setStatus("loaded");
    } catch (err) {
      setErrorMessage(
        err?.message || "Failed to inspect the selected PDF file. Please ensure it is valid."
      );
      setStatus("idle");
    }
  }

  // Parse and validate live selection
  const parsedSelection = useMemo(() => {
    if (mode !== "extract" || !rangeInput.trim() || totalPages === 0) {
      return { valid: false, count: 0, indices: [], error: null };
    }
    try {
      const indices = parsePageRange(rangeInput, totalPages);
      return { valid: true, count: indices.length, indices, error: null };
    } catch (err) {
      return { valid: false, count: 0, indices: [], error: err.message };
    }
  }, [mode, rangeInput, totalPages]);

  // Quick preset helpers
  function applyPreset(preset) {
    if (totalPages === 0) return;
    if (preset === "all") {
      setRangeInput(totalPages === 1 ? "1" : `1-${totalPages}`);
    } else if (preset === "first") {
      setRangeInput("1");
    } else if (preset === "last") {
      setRangeInput(String(totalPages));
    } else if (preset === "odd") {
      const odds = [];
      for (let i = 1; i <= totalPages; i += 2) odds.push(i);
      setRangeInput(odds.join(", "));
    } else if (preset === "even") {
      const evens = [];
      for (let i = 2; i <= totalPages; i += 2) evens.push(i);
      setRangeInput(evens.join(", ") || "1");
    }
  }

  // Toggle individual page selection
  function togglePage(pageNum) {
    const pageIndex = pageNum - 1;
    let current = parsedSelection.indices.slice();

    if (current.includes(pageIndex)) {
      current = current.filter((idx) => idx !== pageIndex);
    } else {
      current.push(pageIndex);
      current.sort((a, b) => a - b);
    }

    if (current.length === 0) {
      setRangeInput("");
    } else {
      // Build clean comma list
      setRangeInput(current.map((i) => i + 1).join(", "));
    }
  }

  async function handleSplit() {
    if (!fileItem) return;

    if (mode === "extract" && (!parsedSelection.valid || parsedSelection.count === 0)) {
      setErrorMessage(
        parsedSelection.error || "Please select at least one valid page to extract."
      );
      return;
    }

    setStatus("processing");
    setProgress({ percent: 10, message: "Preparing PDF splitting engine..." });
    setErrorMessage(null);

    try {
      const splitResult = await splitPdfDocument(
        fileItem.buffer || fileItem.file,
        {
          mode,
          ranges: rangeInput,
          baseName: fileItem.name,
        },
        (prog) => setProgress(prog)
      );

      const mimeType = splitResult.type === "zip" ? "application/zip" : "application/pdf";
      const blob = new Blob([splitResult.bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);

      setResult({
        blob,
        url,
        type: splitResult.type,
        filename: splitResult.filename,
        byteLength: splitResult.bytes.byteLength,
        pageCount: splitResult.pageCount,
        fileCount: splitResult.fileCount,
        mode,
      });

      setStatus("completed");
    } catch (err) {
      console.error("Split PDF error:", err);
      setErrorMessage(err?.message || "Failed to split the PDF document.");
      setStatus("error");
    }
  }

  function handleReset() {
    cleanupBlob();
    setResult(null);
    setFileItem(null);
    setTotalPages(0);
    setRangeInput("");
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
              <h4 className="font-bold text-red-800">Split Notice</h4>
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

      {/* State 2: Configuration & Split Workspace */}
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
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span>{formatBytes(fileItem.size)}</span>
                  <span>&bull;</span>
                  <span className="font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                    {totalPages} {totalPages === 1 ? "page" : "pages"} total
                  </span>
                </div>
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

          {/* Mode Selector Tabs */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">
              Choose Split Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode("extract")}
                className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                  mode === "extract"
                    ? "border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    mode === "extract" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Extract Selected Pages
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Choose specific page numbers or ranges to combine into one new PDF document.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("split-all")}
                className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                  mode === "split-all"
                    ? "border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    mode === "split-all" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Split Every Page (ZIP)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Save each page as an individual PDF document, neatly bundled into a ZIP file.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Mode A Controls: Page Range Input & Presets */}
          {mode === "extract" && (
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 sm:p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="range-input" className="text-xs font-bold text-slate-700">
                    Pages to Extract:
                  </label>
                  <span className="text-xs text-slate-500">
                    e.g. 1-3, 5 or 2, 4, 6
                  </span>
                </div>
                <input
                  id="range-input"
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="1-3, 5, 8-10"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 font-mono"
                />
                {parsedSelection.error && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {parsedSelection.error}
                  </p>
                )}
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                  Presets:
                </span>
                <button
                  type="button"
                  onClick={() => applyPreset("all")}
                  className="min-h-[36px] sm:min-h-[32px] px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  All ({totalPages})
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("first")}
                  className="min-h-[36px] sm:min-h-[32px] px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  First Page
                </button>
                {totalPages > 1 && (
                  <button
                    type="button"
                    onClick={() => applyPreset("last")}
                    className="min-h-[36px] sm:min-h-[32px] px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    Last Page (#{totalPages})
                  </button>
                )}
                {totalPages >= 3 && (
                  <>
                    <button
                      type="button"
                      onClick={() => applyPreset("odd")}
                      className="min-h-[36px] sm:min-h-[32px] px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      Odd Pages
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("even")}
                      className="min-h-[36px] sm:min-h-[32px] px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      Even Pages
                    </button>
                  </>
                )}
              </div>

              {/* Visual Page Selector Grid (for documents with <= 48 pages) */}
              {totalPages <= 48 && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Click to Toggle Individual Pages:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                      const isSelected = parsedSelection.indices.includes(num - 1);
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => togglePage(num)}
                          aria-label={`Toggle page ${num}`}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                            isSelected
                              ? "bg-brand-600 text-white shadow-xs"
                              : "bg-white text-slate-600 border border-slate-200 hover:border-brand-400"
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode B Info Box */}
          {mode === "split-all" && (
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-5 flex items-start gap-3">
              <Archive className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800">Complete Document Split: </span>
                All {totalPages} pages will be rendered as individual single-page PDF files and packaged into a convenient ZIP archive.
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              {mode === "extract" && (
                <span>
                  Will extract: <strong className="text-slate-800">{parsedSelection.count}</strong> of {totalPages} pages
                </span>
              )}
              {mode === "split-all" && (
                <span>
                  Will generate: <strong className="text-slate-800">{totalPages}</strong> individual PDF files
                </span>
              )}
            </div>

            <PrimaryButton
              size="lg"
              variant="primary"
              icon={Scissors}
              disabled={mode === "extract" && (!parsedSelection.valid || parsedSelection.count === 0)}
              onClick={handleSplit}
              className="w-full sm:w-auto min-w-[200px]"
            >
              Split PDF
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
            {result.type === "zip" ? "PDF Pages Successfully Split!" : "Selected Pages Extracted!"}
          </h3>

          <p className="text-sm text-slate-600 max-w-md mb-8">
            {result.type === "zip"
              ? `Your ${result.fileCount} individual PDF files have been packaged into a ZIP archive.`
              : `Successfully extracted ${result.pageCount} pages into a unified PDF document.`}
          </p>

          {/* File details card */}
          <div className="w-full max-w-lg bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-8 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white text-brand-600 border border-slate-200">
                  {result.type === "zip" ? <Archive className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Ready File</div>
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

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
            <PrimaryButton
              size="lg"
              variant="primary"
              icon={Download}
              onClick={handleDownload}
              className="w-full sm:flex-1 py-3.5 shadow-md shadow-brand-500/20"
            >
              {result.type === "zip" ? "Download ZIP Archive" : "Download Extracted PDF"}
            </PrimaryButton>

            <PrimaryButton
              size="lg"
              variant="secondary"
              icon={RotateCcw}
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              Split Another PDF
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
            Could Not Complete PDF Split
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            {errorMessage || "The document could not be split. Please check that the file is not password-protected."}
          </p>
          <PrimaryButton variant="primary" icon={RotateCcw} onClick={handleReset}>
            Start Over
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
