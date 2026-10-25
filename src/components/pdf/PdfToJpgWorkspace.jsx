"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileText,
  Image as ImageIcon,
  Download,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Archive,
  Layers,
  Sliders,
  Eye,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import PdfUploadZone from "./PdfUploadZone";
import PdfProcessingState from "./PdfProcessingState";
import PdfPageGrid from "./PdfPageGrid";
import { convertPdfToJpg, packageJpgsToZip, JPG_QUALITY_PRESETS } from "@/tools/pdf/pdfToJpg";
import { formatBytes } from "@/tools/pdf/validatePdf";
import { triggerBlobDownload } from "@/tools/pdf/pdfUtils";

export default function PdfToJpgWorkspace() {
  const [status, setStatus] = useState("idle"); // idle | loaded | processing | completed | error
  const [fileItem, setFileItem] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectionMode, setSelectionMode] = useState("all"); // 'all' | 'custom'
  const [selectedPages, setSelectedPages] = useState([]);
  const [quality, setQuality] = useState("high"); // standard | high | very-high
  const [progress, setProgress] = useState({ percent: 0, message: "" });
  const [convertedJpgs, setConvertedJpgs] = useState([]);
  const [zipResult, setZipResult] = useState(null);
  const [isZipping, setIsZipping] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Clean up object URLs on unmount/reset
  const cleanupUrls = useCallback(() => {
    convertedJpgs.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    if (zipResult?.url) {
      URL.revokeObjectURL(zipResult.url);
    }
  }, [convertedJpgs, zipResult]);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  // When a file is uploaded, inspect its page count
  async function handleFileSelected(files) {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setErrorMessage(null);

    try {
      const buffer = await selected.file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
      if (doc.isEncrypted) {
        throw new Error("This PDF document is password-protected. Please unlock it before converting.");
      }
      const count = doc.getPageCount();
      if (count === 0) {
        throw new Error("This PDF document contains 0 pages.");
      }

      setFileItem({
        file: selected.file,
        name: selected.name,
        size: selected.size,
        buffer,
      });
      setTotalPages(count);
      setSelectedPages(Array.from({ length: count }, (_, i) => i + 1));
      setStatus("loaded");
    } catch (err) {
      setErrorMessage(
        err?.message || "Failed to inspect the selected PDF file. Please ensure it is a readable PDF."
      );
      setStatus("idle");
    }
  }

  // Toggle page selection in custom mode
  function handleToggleSelect(pageNum) {
    setSelectedPages((prev) => {
      if (prev.includes(pageNum)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter((p) => p !== pageNum);
      } else {
        return [...prev, pageNum].sort((a, b) => a - b);
      }
    });
  }

  // Quick selection helpers
  function selectAll() {
    setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
  }

  function selectFirst() {
    setSelectedPages([1]);
  }

  function selectOdd() {
    setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p % 2 !== 0));
  }

  function selectEven() {
    setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p % 2 === 0));
  }

  // Convert PDF to JPG
  async function handleConvert() {
    if (!fileItem || totalPages === 0) return;

    let buffer = fileItem.buffer;
    if (!buffer || buffer.byteLength === 0) {
      if (fileItem.file) {
        buffer = await fileItem.file.arrayBuffer();
        setFileItem((prev) => ({ ...prev, buffer }));
      } else {
        setErrorMessage("PDF document data is no longer available. Please select the file again.");
        return;
      }
    }

    const pagesToConvert = selectionMode === "all"
      ? "all"
      : selectedPages;

    if (Array.isArray(pagesToConvert) && pagesToConvert.length === 0) {
      setErrorMessage("Please select at least one page to convert.");
      return;
    }

    try {
      setStatus("processing");
      setProgress({ percent: 10, message: "Initializing high-definition canvas renderer..." });

      const results = await convertPdfToJpg(
        buffer,
        {
          pages: pagesToConvert,
          quality,
          baseName: fileItem.name,
        },
        (prog) => setProgress(prog)
      );

      setConvertedJpgs(results);
      setStatus("completed");
    } catch (err) {
      console.error("PDF to JPG conversion error:", err);
      setErrorMessage(err?.message || "Failed to convert PDF pages into JPG images.");
      setStatus("error");
    }
  }

  // Package all generated JPGs into a ZIP archive
  async function handleDownloadAllZip() {
    if (zipResult?.blob) {
      triggerBlobDownload(zipResult.blob, zipResult.filename);
      return;
    }

    try {
      setIsZipping(true);
      const zip = await packageJpgsToZip(convertedJpgs, fileItem?.name || "document");
      setZipResult(zip);
      triggerBlobDownload(zip.blob, zip.filename);
    } catch (err) {
      setErrorMessage("Failed to create ZIP package: " + err.message);
    } finally {
      setIsZipping(false);
    }
  }

  function handleReset() {
    cleanupUrls();
    setConvertedJpgs([]);
    setZipResult(null);
    setFileItem(null);
    setTotalPages(0);
    setSelectedPages([]);
    setSelectionMode("all");
    setStatus("idle");
    setErrorMessage(null);
    setProgress({ percent: 0, message: "" });
  }

  const pageItems = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => ({
      pageIndex: i,
      pageNumber: i + 1,
    }));
  }, [totalPages]);

  const activePagesCount = selectionMode === "all" ? totalPages : selectedPages.length;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Error Notice */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start justify-between gap-3 text-sm text-red-700 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-800">Conversion Notice</h4>
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

      {/* State 2: Configuration & Preview Workspace */}
      {status === "loaded" && fileItem && (
        <div className="bg-white border border-black/[0.08] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* File summary bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-3 rounded-xl bg-brand-50 text-brand-600 shrink-0">
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
              className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Choose Another File</span>
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Resolution Preset */}
            <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-brand-600" />
                <span>Image Quality &amp; Resolution</span>
              </div>

              <div className="space-y-2">
                {Object.entries(JPG_QUALITY_PRESETS).map(([key, item]) => (
                  <label
                    key={key}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      quality === key
                        ? "bg-white border-brand-500 ring-2 ring-brand-500/10 shadow-xs"
                        : "bg-white/60 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="quality"
                      value={key}
                      checked={quality === key}
                      onChange={() => setQuality(key)}
                      className="mt-0.5 text-brand-600 focus:ring-brand-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block">{item.label}</span>
                      <span className="text-slate-500 mt-0.5 block leading-normal">{item.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Page Selection Mode */}
            <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-brand-600" />
                <span>Pages to Convert</span>
              </div>

              <div className="space-y-2">
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectionMode === "all"
                      ? "bg-white border-brand-500 ring-2 ring-brand-500/10 shadow-xs"
                      : "bg-white/60 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="selectionMode"
                    value="all"
                    checked={selectionMode === "all"}
                    onChange={() => setSelectionMode("all")}
                    className="mt-0.5 text-brand-600 focus:ring-brand-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">Convert All Pages ({totalPages})</span>
                    <span className="text-slate-500 mt-0.5 block">Every page will be exported as an individual JPG file.</span>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectionMode === "custom"
                      ? "bg-white border-brand-500 ring-2 ring-brand-500/10 shadow-xs"
                      : "bg-white/60 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="selectionMode"
                    value="custom"
                    checked={selectionMode === "custom"}
                    onChange={() => setSelectionMode("custom")}
                    className="mt-0.5 text-brand-600 focus:ring-brand-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">Select Specific Pages ({selectedPages.length} selected)</span>
                    <span className="text-slate-500 mt-0.5 block">Click individual page thumbnails below to choose pages.</span>
                  </div>
                </label>
              </div>

              {selectionMode === "custom" && (
                <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="px-2.5 py-1 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={selectFirst}
                    className="px-2.5 py-1 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
                  >
                    First Only
                  </button>
                  {totalPages >= 3 && (
                    <>
                      <button
                        type="button"
                        onClick={selectOdd}
                        className="px-2.5 py-1 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
                      >
                        Odd Pages
                      </button>
                      <button
                        type="button"
                        onClick={selectEven}
                        className="px-2.5 py-1 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
                      >
                        Even Pages
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Page Preview Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {selectionMode === "custom" ? "Click to Select / Deselect Pages:" : "Document Page Previews:"}
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                {activePagesCount} of {totalPages} pages will be converted
              </span>
            </div>

            <PdfPageGrid
              pages={pageItems}
              pdfBuffer={fileItem.buffer}
              mode={selectionMode === "custom" ? "select" : "view"}
              selectedPages={selectedPages}
              onToggleSelect={handleToggleSelect}
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Output: <strong className="text-slate-800">{activePagesCount} JPG images</strong> ({JPG_QUALITY_PRESETS[quality].label})
            </div>

            <PrimaryButton
              type="button"
              onClick={handleConvert}
              icon={ImageIcon}
              size="lg"
              className="w-full sm:w-auto"
            >
              Convert {activePagesCount} {activePagesCount === 1 ? "Page" : "Pages"} to JPG
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* State 3: Processing */}
      {status === "processing" && (
        <div className="bg-white border border-black/[0.08] rounded-2xl p-8 sm:p-12 shadow-xs max-w-xl mx-auto">
          <PdfProcessingState
            progress={progress.percent}
            title="Converting PDF to JPG"
            message={progress.message}
          />
        </div>
      )}

      {/* State 4: Completed Result */}
      {status === "completed" && convertedJpgs.length > 0 && (
        <div className="bg-white border border-black/[0.08] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Success Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Conversion Complete!
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generated {convertedJpgs.length} high-resolution JPG {convertedJpgs.length === 1 ? "image" : "images"}.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {convertedJpgs.length > 1 && (
                <PrimaryButton
                  type="button"
                  onClick={handleDownloadAllZip}
                  loading={isZipping}
                  icon={Archive}
                  size="md"
                >
                  Download All as ZIP
                </PrimaryButton>
              )}
              <PrimaryButton
                type="button"
                variant="secondary"
                size="md"
                icon={RotateCcw}
                onClick={handleReset}
              >
                Convert Another PDF
              </PrimaryButton>
            </div>
          </div>

          {/* Grid of Converted JPG Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {convertedJpgs.map((item) => (
              <div
                key={item.filename}
                className="bg-white border border-black/[0.08] rounded-xl overflow-hidden flex flex-col hover:shadow-subtle transition-shadow"
              >
                {/* Preview Image */}
                <div className="p-3 bg-slate-50 flex items-center justify-center h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="max-h-full max-w-full object-contain rounded-sm shadow-xs"
                  />
                </div>

                {/* Details & Download Button */}
                <div className="p-3 bg-white border-t border-black/[0.04] flex flex-col justify-between flex-1 space-y-2.5">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 truncate" title={item.filename}>
                      {item.filename}
                    </h5>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                      <span>{item.width} × {item.height} px</span>
                      <span>{formatBytes(item.sizeBytes)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => triggerBlobDownload(item.blob, item.filename)}
                    className="min-h-[38px] w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JPG</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
