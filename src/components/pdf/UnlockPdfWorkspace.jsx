"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Lock,
  Unlock,
  Download,
  AlertCircle,
  Undo2,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import PdfUploadZone from "./PdfUploadZone";
import PdfProcessingState from "./PdfProcessingState";
import PdfDownloadResult from "./PdfDownloadResult";
import { unlockPdfDocument, isPdfEncrypted } from "@/tools/pdf/unlockPdf";
import { formatBytes } from "@/tools/pdf/validatePdf";

export default function UnlockPdfWorkspace() {
  const [status, setStatus] = useState("idle"); // idle | loaded | processing | completed | error
  const [fileItem, setFileItem] = useState(null);
  const [isEncrypted, setIsEncrypted] = useState(true);

  // Password fields
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      const encrypted = await isPdfEncrypted(buffer);

      setFileItem({
        file: selected.file,
        name: selected.name,
        size: selected.size,
        buffer,
      });
      setIsEncrypted(encrypted);
      setStatus("loaded");
    } catch (err) {
      setErrorMessage(
        err?.message || "Failed to inspect the selected PDF file. Please ensure it is a valid PDF."
      );
      setStatus("idle");
    }
  }

  async function handleUnlockPdf() {
    if (!fileItem?.buffer) return;
    setErrorMessage(null);
    setStatus("processing");
    setProgress({ percent: 30, message: "Validating password against document encryption dictionary..." });

    try {
      setProgress({ percent: 70, message: "Decrypting streams and removing security restrictions..." });

      const { pdfBytes, pageCount } = await unlockPdfDocument(fileItem.buffer, password);

      setProgress({ percent: 95, message: "Finalizing unlocked PDF document..." });

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const downloadName = fileItem.name.replace(/\.[^/.]+$/, "") + "-unlocked.pdf";

      setResult({
        blob,
        url,
        fileName: downloadName,
        originalSize: fileItem.size,
        newSize: blob.size,
        totalPages: pageCount,
      });
      setStatus("completed");
    } catch (err) {
      setErrorMessage(err?.message || "Failed to unlock PDF. Please verify your password.");
      setStatus("loaded");
    }
  }

  function handleReset() {
    cleanupBlob();
    setFileItem(null);
    setPassword("");
    setResult(null);
    setErrorMessage(null);
    setStatus("idle");
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-red-700">
            <p className="font-semibold">Unlock Failed</p>
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
                  {isEncrypted ? (
                    <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Password Protected
                    </span>
                  ) : (
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Unprotected
                    </span>
                  )}
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

          {/* Password Prompt Area */}
          <div className="space-y-4 max-w-lg mx-auto py-4">
            {isEncrypted ? (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Enter Document Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Type the password to unlock this file..."
                      className="w-full px-3.5 py-2.5 pr-10 text-sm font-mono border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/30"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800">100% Client-Side Decryption</p>
                    <p>
                      Password verification and stream decryption run directly in your browser. The password is never sent to our servers.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm">No Open Password Required</p>
                  <p>
                    This PDF does not require a password to open. If it has editing or printing restrictions, clicking Unlock PDF will strip those restrictions.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              {isEncrypted ? "Ready to remove password protection." : "Ready to remove document restrictions."}
            </div>

            <PrimaryButton
              type="button"
              onClick={handleUnlockPdf}
              icon={Unlock}
              size="lg"
            >
              Unlock PDF
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* State 3: Processing */}
      {status === "processing" && (
        <PdfProcessingState
          title="Unlocking PDF..."
          message={progress.message}
          percent={progress.percent}
        />
      )}

      {/* State 4: Completed Download Result */}
      {status === "completed" && result && (
        <PdfDownloadResult
          title="PDF Successfully Unlocked!"
          fileName={result.fileName}
          fileSize={result.newSize}
          originalSize={result.originalSize}
          downloadUrl={result.url}
          onReset={handleReset}
          actionLabel="Download Unlocked PDF"
        />
      )}
    </div>
  );
}
