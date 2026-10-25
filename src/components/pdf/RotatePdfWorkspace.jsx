"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileText,
  RotateCw,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Undo2,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import PdfUploadZone from "./PdfUploadZone";
import PdfProcessingState from "./PdfProcessingState";
import PdfPageGrid from "./PdfPageGrid";
import PdfDownloadResult from "./PdfDownloadResult";
import { rotatePdfDocument, normalizeAngle } from "@/tools/pdf/rotatePdf";
import { formatBytes } from "@/tools/pdf/validatePdf";
import { triggerBlobDownload } from "@/tools/pdf/pdfUtils";

export default function RotatePdfWorkspace() {
  const [status, setStatus] = useState("idle"); // idle | loaded | processing | completed | error
  const [fileItem, setFileItem] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [rotations, setRotations] = useState({}); // { [pageIndex]: angle }
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

  // When a file is uploaded, inspect its page count
  async function handleFileSelected(files) {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setErrorMessage(null);

    try {
      const buffer = await selected.file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
      if (doc.isEncrypted) {
        throw new Error("This PDF document is password-protected. Please unlock it before rotating.");
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
      setRotations({});
      setStatus("loaded");
    } catch (err) {
      setErrorMessage(
        err?.message || "Failed to inspect the selected PDF file. Please ensure it is a valid PDF."
      );
      setStatus("idle");
    }
  }

  // Rotate an individual page
  function handleRotateSinglePage(pageIndex, delta) {
    setRotations((prev) => {
      const current = prev[pageIndex] || 0;
      const next = normalizeAngle(current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[pageIndex];
      } else {
        updated[pageIndex] = next;
      }
      return updated;
    });
  }

  // Rotate all pages at once
  function handleRotateAll(delta) {
    setRotations((prev) => {
      const updated = {};
      for (let i = 0; i < totalPages; i++) {
        const current = prev[i] || 0;
        const next = normalizeAngle(current + delta);
        if (next !== 0) {
          updated[i] = next;
        }
      }
      return updated;
    });
  }

  // Reset all rotations
  function handleResetRotations() {
    setRotations({});
  }

  // Process and save rotated PDF
  async function handleSaveRotation() {
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

    try {
      setStatus("processing");
      setProgress({ percent: 20, message: "Rotating PDF pages..." });

      const res = await rotatePdfDocument(
        buffer,
        rotations,
        { baseName: fileItem.name },
        (prog) => setProgress(prog)
      );

      const blob = new Blob([res.bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResult({
        blob,
        url,
        filename: res.filename,
        pageCount: res.pageCount,
        byteLength: res.bytes.byteLength,
      });

      setStatus("completed");
    } catch (err) {
      console.error("Rotate PDF error:", err);
      setErrorMessage(err?.message || "Failed to rotate the PDF document.");
      setStatus("error");
    }
  }

  function handleReset() {
    cleanupBlob();
    setResult(null);
    setFileItem(null);
    setTotalPages(0);
    setRotations({});
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

  const rotatedPagesCount = Object.keys(rotations).length;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Error Notice */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start justify-between gap-3 text-sm text-red-700 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-800">Rotation Notice</h4>
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
              <Undo2 className="w-3.5 h-3.5" />
              <span>Choose Another File</span>
            </button>
          </div>

          {/* Quick Rotation Action Bar */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 mr-1">Rotate All Pages:</span>
              <button
                type="button"
                onClick={() => handleRotateAll(-90)}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-brand-600" />
                <span>All -90° (Left)</span>
              </button>
              <button
                type="button"
                onClick={() => handleRotateAll(90)}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-xs transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-brand-600" />
                <span>All +90° (Right)</span>
              </button>
              <button
                type="button"
                onClick={() => handleRotateAll(180)}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-xs transition-colors"
              >
                <span>All 180° (Upside Down)</span>
              </button>
            </div>

            {rotatedPagesCount > 0 && (
              <button
                type="button"
                onClick={handleResetRotations}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 border border-red-200 rounded-xl transition-colors"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Reset All Rotations ({rotatedPagesCount})</span>
              </button>
            )}
          </div>

          {/* Page Preview Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Click -90° or +90° below any page to rotate individually:
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                {rotatedPagesCount === 0
                  ? "No changes yet"
                  : `${rotatedPagesCount} of ${totalPages} pages rotated`}
              </span>
            </div>

            <PdfPageGrid
              pages={pageItems}
              pdfBuffer={fileItem.buffer}
              mode="rotate"
              rotations={rotations}
              onRotatePage={handleRotateSinglePage}
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              {rotatedPagesCount === 0 ? (
                <span>All pages are currently at their default orientation.</span>
              ) : (
                <span>
                  Modified orientation on <strong className="text-slate-800">{rotatedPagesCount}</strong> pages.
                </span>
              )}
            </div>

            <PrimaryButton
              type="button"
              onClick={handleSaveRotation}
              icon={RotateCw}
              size="lg"
              className="w-full sm:w-auto"
            >
              Save &amp; Download Rotated PDF
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* State 3: Processing */}
      {status === "processing" && (
        <div className="bg-white border border-black/[0.08] rounded-2xl p-8 sm:p-12 shadow-xs max-w-xl mx-auto">
          <PdfProcessingState
            progress={progress.percent}
            title="Rotating PDF Document"
            message={progress.message}
          />
        </div>
      )}

      {/* State 4: Completed Result */}
      {status === "completed" && result && (
        <PdfDownloadResult
          result={result}
          title="PDF Rotated Successfully!"
          subtitle={`Your document (${result.pageCount} pages) has been rotated and is ready for download.`}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
