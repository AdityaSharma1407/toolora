"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileText,
  Hash,
  Download,
  AlertCircle,
  Undo2,
  Sparkles,
  Layers,
  Settings2,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import PdfUploadZone from "./PdfUploadZone";
import PdfProcessingState from "./PdfProcessingState";
import PdfDownloadResult from "./PdfDownloadResult";
import { addPageNumbersToPdf } from "@/tools/pdf/addPageNumbers";
import { formatBytes } from "@/tools/pdf/validatePdf";
import { triggerBlobDownload } from "@/tools/pdf/pdfUtils";

const POSITION_OPTIONS = [
  { id: "top-left", label: "Top Left", gridCol: "col-start-1", gridRow: "row-start-1" },
  { id: "top-center", label: "Top Center", gridCol: "col-start-2", gridRow: "row-start-1" },
  { id: "top-right", label: "Top Right", gridCol: "col-start-3", gridRow: "row-start-1" },
  { id: "bottom-left", label: "Bottom Left", gridCol: "col-start-1", gridRow: "row-start-2" },
  { id: "bottom-center", label: "Bottom Center", gridCol: "col-start-2", gridRow: "row-start-2" },
  { id: "bottom-right", label: "Bottom Right", gridCol: "col-start-3", gridRow: "row-start-2" },
];

const FORMAT_OPTIONS = [
  { id: "page-x-of-y", label: "Page 1 of 10", description: "Standard formal style" },
  { id: "x-of-y", label: "1 of 10", description: "Minimalist total style" },
  { id: "page-x", label: "Page 1", description: "Simple page prefix" },
  { id: "x", label: "1", description: "Single number only" },
  { id: "-x-", label: "- 1 -", description: "Hyphenated decorative" },
];

export default function AddPageNumbersWorkspace() {
  const [status, setStatus] = useState("idle"); // idle | loaded | processing | completed | error
  const [fileItem, setFileItem] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  // Configuration options
  const [position, setPosition] = useState("bottom-center");
  const [format, setFormat] = useState("page-x-of-y");
  const [fontSize, setFontSize] = useState(10);
  const [margin, setMargin] = useState(30);
  const [skipFirstPage, setSkipFirstPage] = useState(false);
  const [startPageNumber, setStartPageNumber] = useState(1);

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

  async function handleFileSelected(files) {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setErrorMessage(null);

    try {
      const buffer = await selected.file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
      if (doc.isEncrypted) {
        throw new Error("This PDF document is password-protected. Please unlock it before adding page numbers.");
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
      setStatus("loaded");
    } catch (err) {
      setErrorMessage(
        err?.message || "Failed to inspect the selected PDF file. Please ensure it is a valid PDF."
      );
      setStatus("idle");
    }
  }

  async function handleApplyPageNumbers() {
    if (!fileItem?.buffer) return;
    setStatus("processing");
    setProgress({ percent: 25, message: "Embedding typography and analyzing page dimensions..." });

    try {
      setProgress({ percent: 60, message: "Calculating coordinates and stamping page numbers..." });
      
      const { pdfBytes, modifiedPages } = await addPageNumbersToPdf(fileItem.buffer, {
        position,
        format,
        fontSize,
        margin,
        skipFirstPage,
        startPageNumber,
      });

      setProgress({ percent: 90, message: "Finalizing optimized document..." });

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const downloadName = fileItem.name.replace(/\.[^/.]+$/, "") + "-numbered.pdf";

      setResult({
        blob,
        url,
        fileName: downloadName,
        originalSize: fileItem.size,
        newSize: blob.size,
        modifiedPages,
        totalPages,
      });
      setStatus("completed");
    } catch (err) {
      setErrorMessage(err?.message || "Failed to add page numbers to PDF.");
      setStatus("error");
    }
  }

  function handleReset() {
    cleanupBlob();
    setFileItem(null);
    setTotalPages(0);
    setResult(null);
    setErrorMessage(null);
    setStatus("idle");
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-red-700">
            <p className="font-semibold">Operation failed</p>
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

      {/* State 1: Upload (Idle) */}
      {status === "idle" && (
        <PdfUploadZone
          onFilesSelected={handleFileSelected}
          existingCount={0}
        />
      )}

      {/* State 2: Configuration Workspace */}
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
              <Undo2 className="w-3.5 h-3.5" />
              <span>Choose Another File</span>
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Position Picker with visual sheet */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Position on Page
              </label>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="aspect-[4/3] max-w-[260px] mx-auto bg-white border border-slate-300 rounded-xl p-3 shadow-xs grid grid-cols-3 grid-rows-2 gap-2 relative">
                  {POSITION_OPTIONS.map((pos) => {
                    const isSelected = position === pos.id;
                    return (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => setPosition(pos.id)}
                        className={`flex items-center justify-center rounded-lg p-2 text-[11px] font-semibold transition-all ${
                          isSelected
                            ? "bg-brand-600 text-white shadow-xs ring-2 ring-brand-600/30 font-bold"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        title={pos.label}
                      >
                        {pos.label.replace("Bottom ", "Btm ").replace("Top ", "Top ")}
                      </button>
                    );
                  })}
                </div>
                <p className="text-center text-xs text-slate-500">
                  Selected: <strong className="text-slate-800">{POSITION_OPTIONS.find((p) => p.id === position)?.label}</strong>
                </p>
              </div>
            </div>

            {/* Numbering Format & Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Numbering Format
                </label>
                <div className="space-y-2">
                  {FORMAT_OPTIONS.map((fmt) => {
                    const isSelected = format === fmt.id;
                    return (
                      <label
                        key={fmt.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-brand-600 bg-brand-50/40 text-brand-900"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="page-format"
                            checked={isSelected}
                            onChange={() => setFormat(fmt.id)}
                            className="text-brand-600 focus:ring-brand-500"
                          />
                          <div>
                            <span className="text-xs font-bold font-mono">{fmt.label}</span>
                            <span className="text-[11px] text-slate-500 block">{fmt.description}</span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Cover page & start number */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={skipFirstPage}
                    onChange={(e) => setSkipFirstPage(e.target.checked)}
                    className="rounded-sm border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>Skip first page (e.g. cover page)</span>
                </label>

                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span>Start sequence at:</span>
                    <input
                      type="number"
                      min="1"
                      max="9999"
                      value={startPageNumber}
                      onChange={(e) => setStartPageNumber(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2.5 py-1 text-xs border border-slate-300 rounded-lg font-mono text-center"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Font size:</span>
                    <input
                      type="number"
                      min="8"
                      max="20"
                      value={fontSize}
                      onChange={(e) => setFontSize(Math.max(8, Math.min(20, parseInt(e.target.value) || 10)))}
                      className="w-16 px-2.5 py-1 text-xs border border-slate-300 rounded-lg font-mono text-center"
                    />
                    <span>pt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Numbers will be added to{" "}
              <strong className="text-slate-800">
                {skipFirstPage ? totalPages - 1 : totalPages}
              </strong>{" "}
              pages.
            </div>

            <PrimaryButton
              type="button"
              onClick={handleApplyPageNumbers}
              icon={Hash}
              size="lg"
            >
              Add Page Numbers
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* State 3: Processing */}
      {status === "processing" && (
        <PdfProcessingState
          title="Adding Page Numbers..."
          message={progress.message}
          percent={progress.percent}
        />
      )}

      {/* State 4: Completed Download Result */}
      {status === "completed" && result && (
        <PdfDownloadResult
          title="Page Numbers Added Successfully!"
          fileName={result.fileName}
          fileSize={result.newSize}
          originalSize={result.originalSize}
          downloadUrl={result.url}
          onReset={handleReset}
          actionLabel="Download Numbered PDF"
        />
      )}
    </div>
  );
}
