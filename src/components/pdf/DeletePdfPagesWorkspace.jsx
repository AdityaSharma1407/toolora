"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileText,
  Trash2,
  Undo2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import PdfUploadZone from "./PdfUploadZone";
import PdfProcessingState from "./PdfProcessingState";
import PdfPageGrid from "./PdfPageGrid";
import PdfDownloadResult from "./PdfDownloadResult";
import { deletePdfPages } from "@/tools/pdf/deletePdfPages";
import { formatBytes } from "@/tools/pdf/validatePdf";
import { triggerBlobDownload } from "@/tools/pdf/pdfUtils";

export default function DeletePdfPagesWorkspace() {
  const [status, setStatus] = useState("idle"); // idle | loaded | processing | completed | error
  const [fileItem, setFileItem] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [deletedIndices, setDeletedIndices] = useState(new Set()); // Set of 0-based page indices
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
        throw new Error("This PDF document is password-protected. Please unlock it before deleting pages.");
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
      setDeletedIndices(new Set());
      setStatus("loaded");
    } catch (err) {
      setErrorMessage(
        err?.message || "Failed to inspect the selected PDF file. Please ensure it is a valid PDF."
      );
      setStatus("idle");
    }
  }

  // Toggle page deletion status
  function handleToggleDelete(pageIndex) {
    setDeletedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(pageIndex)) {
        next.delete(pageIndex);
      } else {
        next.add(pageIndex);
      }
      return next;
    });
  }

  // Quick preset helpers
  function clearAllSelections() {
    setDeletedIndices(new Set());
  }

  function selectOdd() {
    const next = new Set();
    for (let i = 0; i < totalPages; i++) {
      if (i % 2 === 0) next.add(i); // Page 1, 3, 5 are indices 0, 2, 4
    }
    if (next.size === totalPages) next.delete(0); // Ensure at least 1 remains
    setDeletedIndices(next);
  }

  function selectEven() {
    const next = new Set();
    for (let i = 0; i < totalPages; i++) {
      if (i % 2 !== 0) next.add(i); // Page 2, 4, 6 are indices 1, 3, 5
    }
    setDeletedIndices(next);
  }

  const deleteCount = deletedIndices.size;
  const remainingCount = totalPages - deleteCount;
  const isInvalidAllDeleted = deleteCount >= totalPages;

  // Process page deletion
  async function handleExecuteDelete() {
    if (!fileItem || totalPages === 0) return;

    if (deleteCount === 0) {
      setErrorMessage("Please select at least one page to delete.");
      return;
    }

    if (isInvalidAllDeleted) {
      setErrorMessage("A PDF document must retain at least one page. You cannot delete every page.");
      return;
    }

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

    setShowConfirmModal(false);

    try {
      setStatus("processing");
      setProgress({ percent: 20, message: "Removing selected pages from PDF..." });

      const res = await deletePdfPages(
        buffer,
        deletedIndices,
        { baseName: fileItem.name },
        (prog) => setProgress(prog)
      );

      const blob = new Blob([res.bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResult({
        blob,
        url,
        filename: res.filename,
        pageCount: res.retainedPageCount,
        deletedCount: res.deletedCount,
        byteLength: res.bytes.byteLength,
      });

      setStatus("completed");
    } catch (err) {
      console.error("Delete PDF pages error:", err);
      setErrorMessage(err?.message || "Failed to remove pages from the PDF document.");
      setStatus("error");
    }
  }

  function handleReset() {
    cleanupBlob();
    setResult(null);
    setFileItem(null);
    setTotalPages(0);
    setDeletedIndices(new Set());
    setShowConfirmModal(false);
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

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Error Notice */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start justify-between gap-3 text-sm text-red-700 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-800">Deletion Notice</h4>
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
              className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors self-start sm:self-auto"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Choose Another File</span>
            </button>
          </div>

          {/* Quick Selection Toolbar */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 mr-1">Quick Select:</span>
              {totalPages >= 3 && (
                <>
                  <button
                    type="button"
                    onClick={selectOdd}
                    className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-xs transition-colors"
                  >
                    Select Odd Pages
                  </button>
                  <button
                    type="button"
                    onClick={selectEven}
                    className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-xs transition-colors"
                  >
                    Select Even Pages
                  </button>
                </>
              )}
              {deleteCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllSelections}
                  className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-xs transition-colors"
                >
                  Clear Selection ({deleteCount})
                </button>
              )}
            </div>

            {/* Live Count Counter */}
            <div className="text-xs font-semibold">
              {isInvalidAllDeleted ? (
                <span className="text-red-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Cannot delete all {totalPages} pages!
                </span>
              ) : (
                <span className="text-slate-600">
                  Deleting: <strong className="text-red-600">{deleteCount}</strong> | Remaining:{" "}
                  <strong className="text-emerald-700">{remainingCount}</strong> of {totalPages}
                </span>
              )}
            </div>
          </div>

          {/* Page Preview Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Click any page to mark it for deletion:
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                {deleteCount === 0
                  ? "Click pages below to remove them"
                  : `${deleteCount} marked for deletion`}
              </span>
            </div>

            <PdfPageGrid
              pages={pageItems}
              pdfBuffer={fileItem.buffer}
              mode="delete"
              deletedIndices={deletedIndices}
              onToggleDelete={handleToggleDelete}
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              {deleteCount === 0 ? (
                <span>No pages selected yet. Click any page card above to remove it.</span>
              ) : isInvalidAllDeleted ? (
                <span className="text-red-600 font-semibold">
                  You must keep at least 1 page. Please deselect a page to continue.
                </span>
              ) : (
                <span>
                  Will delete <strong className="text-red-600">{deleteCount}</strong> {deleteCount === 1 ? "page" : "pages"}.{" "}
                  <strong className="text-emerald-700">{remainingCount}</strong> {remainingCount === 1 ? "page" : "pages"} will remain in the new document.
                </span>
              )}
            </div>

            <PrimaryButton
              type="button"
              disabled={deleteCount === 0 || isInvalidAllDeleted}
              onClick={() => setShowConfirmModal(true)}
              icon={Trash2}
              size="lg"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              Delete {deleteCount} {deleteCount === 1 ? "Page" : "Pages"} &amp; Download
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-modal border border-black/[0.08] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Confirm Page Deletion
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                You are about to permanently remove <strong className="text-red-600">{deleteCount}</strong> {deleteCount === 1 ? "page" : "pages"} from{" "}
                <span className="font-semibold text-slate-900">{fileItem?.name}</span>. The remaining{" "}
                <strong className="text-emerald-700">{remainingCount}</strong> {remainingCount === 1 ? "page" : "pages"} will be compiled into your new PDF.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors"
              >
                Yes, Delete Pages
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State 3: Processing */}
      {status === "processing" && (
        <div className="bg-white border border-black/[0.08] rounded-2xl p-8 sm:p-12 shadow-xs max-w-xl mx-auto">
          <PdfProcessingState
            progress={progress.percent}
            title="Deleting Selected Pages"
            message={progress.message}
          />
        </div>
      )}

      {/* State 4: Completed Result */}
      {status === "completed" && result && (
        <PdfDownloadResult
          result={result}
          title="Pages Deleted Successfully!"
          subtitle={`Removed ${result.deletedCount} ${result.deletedCount === 1 ? "page" : "pages"}. Your modified document has ${result.pageCount} ${result.pageCount === 1 ? "page" : "pages"}.`}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
