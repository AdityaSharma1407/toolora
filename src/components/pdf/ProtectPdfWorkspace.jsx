"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileText,
  Lock,
  Download,
  AlertCircle,
  Undo2,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  Key,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import PdfUploadZone from "./PdfUploadZone";
import PdfProcessingState from "./PdfProcessingState";
import PdfDownloadResult from "./PdfDownloadResult";
import { protectPdfDocument } from "@/tools/pdf/protectPdf";
import { formatBytes } from "@/tools/pdf/validatePdf";

export default function ProtectPdfWorkspace() {
  const [status, setStatus] = useState("idle");
  const [fileItem, setFileItem] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  // Password fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
      if (doc.isEncrypted) {
        throw new Error("This PDF document is already password-protected.");
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

  async function handleProtectPdf() {
    if (!fileItem?.buffer) return;
    setErrorMessage(null);

    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please ensure both fields are identical.");
      return;
    }

    if (password.length < 4) {
      setErrorMessage("Please choose a password with at least 4 characters.");
      return;
    }

    setStatus("processing");
    setProgress({ percent: 30, message: "Deriving encryption keys using Web Crypto..." });

    try {
      setProgress({ percent: 70, message: "Applying AES-256 standard encryption to document streams..." });

      const { pdfBytes } = await protectPdfDocument(fileItem.buffer, password);

      setProgress({ percent: 95, message: "Finalizing encrypted document..." });

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const downloadName = fileItem.name.replace(/\.[^/.]+$/, "") + "-protected.pdf";

      setResult({
        blob,
        url,
        fileName: downloadName,
        originalSize: fileItem.size,
        newSize: blob.size,
        totalPages,
      });
      setStatus("completed");
    } catch (err) {
      setErrorMessage(err?.message || "Failed to protect PDF.");
      setStatus("error");
    }
  }

  function handleReset() {
    cleanupBlob();
    setFileItem(null);
    setTotalPages(0);
    setPassword("");
    setConfirmPassword("");
    setResult(null);
    setErrorMessage(null);
    setStatus("idle");
  }

  // Calculate password strength indicator
  const passwordLength = password.length;
  let strength = "Too Short";
  let strengthColor = "bg-red-500";
  if (passwordLength >= 12 && /[A-Z]/.test(password) && /\d/.test(password)) {
    strength = "Very Strong";
    strengthColor = "bg-emerald-500";
  } else if (passwordLength >= 8) {
    strength = "Good";
    strengthColor = "bg-teal-500";
  } else if (passwordLength >= 4) {
    strength = "Weak";
    strengthColor = "bg-amber-500";
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
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

          {/* Password Entry Card */}
          <div className="space-y-4 max-w-lg mx-auto py-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Set Document Password
                </label>
                {password && (
                  <span className="text-xs font-semibold text-slate-500">
                    Strength: <strong className="text-slate-800">{strength}</strong>
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a secure password..."
                  className="w-full px-3.5 py-2.5 pr-10 text-sm font-mono border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/30"
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type password to confirm..."
                className={`w-full px-3.5 py-2.5 text-sm font-mono border rounded-xl focus:outline-hidden focus:ring-2 ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red-300 focus:ring-red-500/30 bg-red-50/20"
                    : "border-slate-300 focus:ring-brand-500/30"
                }`}
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-[11px] text-red-500 mt-1">Passwords do not match yet.</p>
              )}
            </div>

            {/* Security Notice */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">Standard AES-256 Encryption</p>
                <p>
                  The document is encrypted directly in your browser. Be sure to remember your password, as files cannot be recovered without it.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Protecting all <strong className="text-slate-800">{totalPages}</strong> pages with password access.
            </div>

            <PrimaryButton
              type="button"
              onClick={handleProtectPdf}
              icon={Lock}
              size="lg"
              disabled={!password || password !== confirmPassword}
            >
              Protect PDF
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* State 3: Processing */}
      {status === "processing" && (
        <PdfProcessingState
          title="Encrypting PDF..."
          message={progress.message}
          percent={progress.percent}
        />
      )}

      {/* State 4: Completed Download Result */}
      {status === "completed" && result && (
        <PdfDownloadResult
          title="PDF Successfully Encrypted!"
          fileName={result.fileName}
          fileSize={result.newSize}
          originalSize={result.originalSize}
          downloadUrl={result.url}
          onReset={handleReset}
          actionLabel="Download Protected PDF"
        />
      )}
    </div>
  );
}
