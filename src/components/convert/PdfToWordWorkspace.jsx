"use client";

import React, { useState, useEffect, useId } from "react";
import {
  FileText,
  FileEdit,
  Download,
  AlertCircle,
  CheckCircle2,
  Upload,
  Copy,
  Check,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { convertPdfToWord } from "@/tools/convert/pdfToWord.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

export default function PdfToWordWorkspace() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  const fileInputId = useId();

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const handleFileUpload = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith(".pdf") && selectedFile.type !== "application/pdf") {
      setErrorMessage("Please upload a PDF document (.pdf).");
      return;
    }
    setFile(selectedFile);
    setErrorMessage(null);
    setResult(null);
  };

  const handleConvert = async () => {
    if (!file) {
      setErrorMessage("Please choose a PDF document first.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await convertPdfToWord(file);
      const blob = new Blob([res.docxBytes], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);
      const filename = `${file.name.replace(/\.pdf$/i, "")}.docx`;

      setResult({
        ...res,
        url,
        filename,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to convert PDF to Word.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = async () => {
    if (!result?.fullText) return;
    await navigator.clipboard.writeText(result.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 rounded-2xl p-10 text-center bg-gray-50/50 dark:bg-gray-950/50"
        >
          <FileEdit className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {file ? file.name : "Drag and drop your PDF file to convert to Word"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Extracts text, headers, and structure into an editable Microsoft Word (.docx) file
          </p>
          <input
            id={fileInputId}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
          <label htmlFor={fileInputId}>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" /> Choose PDF File
            </span>
          </label>
        </div>

        {file && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-sm">
                {file.name}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {formatBytes(file.size)}
              </p>
            </div>

            <PrimaryButton
              onClick={handleConvert}
              disabled={isProcessing}
              className="py-2.5 px-6"
            >
              {isProcessing ? "Extracting & Packaging..." : "Convert to Word (.docx)"}
            </PrimaryButton>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                      Converted to Editable Word (.docx)!
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                    {result.pageCount} {result.pageCount === 1 ? "page" : "pages"} • {result.wordCount} words • {formatBytes(result.size)}
                  </p>
                </div>
              </div>

              <a
                href={result.url}
                download={result.filename}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 shadow-sm hover:shadow transition"
              >
                <Download className="w-4 h-4" /> Download Word (.docx)
              </a>
            </div>
          </div>

          {/* Extracted Text Preview with Copy button */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                Extracted Text Preview
              </h4>
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy Text"}
              </button>
            </div>
            <textarea
              readOnly
              rows={8}
              value={result.fullText}
              className="w-full font-mono text-xs p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}
