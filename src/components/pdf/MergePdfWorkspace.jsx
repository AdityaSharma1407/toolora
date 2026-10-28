"use client";

import React, { useState, useEffect, useCallback } from "react";
import PdfUploadZone from "./PdfUploadZone";
import PdfFileList from "./PdfFileList";
import PdfProcessingState from "./PdfProcessingState";
import PdfDownloadResult from "./PdfDownloadResult";
import { mergePdfDocuments } from "@/tools/pdf/mergePdf";
import { moveItemInArray } from "@/tools/pdf/pdfUtils";
import { AlertCircle, RotateCcw } from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";

export default function MergePdfWorkspace() {
  const [status, setStatus] = useState("idle"); // idle | selected | processing | completed | error
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({ percent: 0, message: "" });
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Clean up blob URL on unmount or reset
  const cleanupResultUrl = useCallback(() => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
  }, [result]);

  useEffect(() => {
    return () => {
      cleanupResultUrl();
    };
  }, [cleanupResultUrl]);

  function handleFilesSelected(newItems) {
    setErrorMessage(null);
    setFiles((prev) => {
      const updated = [...prev, ...newItems];
      return updated;
    });
    setStatus("selected");
  }

  function handleMoveUp(index) {
    setFiles((prev) => moveItemInArray(prev, index, index - 1));
  }

  function handleMoveDown(index) {
    setFiles((prev) => moveItemInArray(prev, index, index + 1));
  }

  function handleRemove(index) {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setStatus("idle");
      }
      return updated;
    });
  }

  function handleClearAll() {
    setFiles([]);
    setStatus("idle");
    setErrorMessage(null);
  }

  async function handleMerge() {
    if (files.length < 2) {
      setErrorMessage("Please select at least 2 PDF files to perform a merge.");
      return;
    }

    setStatus("processing");
    setProgress({ percent: 5, message: "Initializing browser PDF engine..." });
    setErrorMessage(null);

    try {
      // Map file items for mergePdfDocuments
      const payload = files.map((item) => ({
        name: item.name,
        file: item.file,
      }));

      const mergeResult = await mergePdfDocuments(payload, (prog) => {
        setProgress(prog);
      });

      const blob = new Blob([mergeResult.bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResult({
        blob,
        url,
        filename: "merged-document.pdf",
        byteLength: mergeResult.byteLength,
        pageCount: mergeResult.pageCount,
        sourceCount: mergeResult.sourceCount,
        pageBreakdown: mergeResult.pageBreakdown,
      });

      setStatus("completed");
    } catch (err) {
      console.error("PDF Merge error:", err);
      setErrorMessage(
        err?.message || "An unexpected error occurred while processing the PDF documents."
      );
      setStatus("error");
    }
  }

  function handleReset() {
    cleanupResultUrl();
    setResult(null);
    setFiles([]);
    setStatus("idle");
    setErrorMessage(null);
    setProgress({ percent: 0, message: "" });
  }

  function handleRetryFromError() {
    setErrorMessage(null);
    setStatus(files.length > 0 ? "selected" : "idle");
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start justify-between gap-3 text-sm text-red-700 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-800">Merge Notice</p>
              <p className="mt-0.5 text-red-700 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRetryFromError}
              className="text-xs font-semibold px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* State Transitions */}
      {status === "idle" && (
        <PdfUploadZone
          onFilesSelected={handleFilesSelected}
          existingCount={files.length}
        />
      )}

      {status === "selected" && (
        <PdfFileList
          files={files}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onRemove={handleRemove}
          onClearAll={handleClearAll}
          onAddMore={handleFilesSelected}
          onMerge={handleMerge}
          isProcessing={false}
        />
      )}

      {status === "processing" && (
        <PdfProcessingState progress={progress} />
      )}

      {status === "completed" && result && (
        <PdfDownloadResult result={result} onReset={handleReset} />
      )}

      {status === "error" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-lg font-bold text-slate-900 mb-2">
            Could Not Complete PDF Merge
          </p>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            {errorMessage || "One or more of the files could not be processed. Please check that none of the documents are encrypted or password protected."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <PrimaryButton
              variant="primary"
              icon={RotateCcw}
              onClick={handleRetryFromError}
            >
              Back to File List
            </PrimaryButton>
            <PrimaryButton
              variant="outline"
              onClick={handleReset}
            >
              Start Over
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
