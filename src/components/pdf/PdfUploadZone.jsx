"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, AlertCircle, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { validatePdfFileMetadata } from "@/tools/pdf/validatePdf";
import { readFirstBytes } from "@/tools/pdf/pdfUtils";
import PrimaryButton from "../common/PrimaryButton";

export default function PdfUploadZone({
  onFilesSelected,
  existingCount = 0,
  className = "",
  compact = false,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);

  const limits = siteConfig.limits.mergePdf;

  async function handleFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    setLocalError(null);

    const rawFiles = Array.from(fileList);
    const totalCount = existingCount + rawFiles.length;

    if (totalCount > limits.maxFiles) {
      setLocalError(
        `You can select a maximum of ${limits.maxFiles} files at a time. Please remove some files.`
      );
      return;
    }

    const validFiles = [];
    const errors = [];

    for (const file of rawFiles) {
      // 1. Validate basic metadata
      const metaCheck = validatePdfFileMetadata(file);
      if (!metaCheck.valid) {
        errors.push(metaCheck.error);
        continue;
      }

      // 2. Validate header signature by reading first 1024 bytes
      try {
        const headerBytes = await readFirstBytes(file, 1024);
        const headerCheck = validatePdfFileMetadata(file, headerBytes);
        if (!headerCheck.valid) {
          errors.push(headerCheck.error);
          continue;
        }
      } catch (err) {
        errors.push(`Could not read file "${file.name}".`);
        continue;
      }

      validFiles.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
      });
    }

    if (errors.length > 0) {
      setLocalError(errors[0]);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }

    // Reset input value to allow selecting the same file again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragOver(false);
  }

  return (
    <div className={`w-full ${className}`}>
      {localError && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1">
            <span className="font-semibold">Upload Notice: </span>
            {localError}
          </div>
          <button
            type="button"
            onClick={() => setLocalError(null)}
            className="text-red-400 hover:text-red-700 font-bold ml-2"
            aria-label="Dismiss upload error"
          >
            &times;
          </button>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        role="region"
        aria-label="PDF file upload area"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`relative flex flex-col items-center justify-center cursor-pointer rounded-2xl border-2 border-dashed transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
          isDragOver
            ? "border-brand-600 bg-brand-50/70 scale-[1.005]"
            : "border-slate-300 hover:border-brand-400 bg-white hover:bg-slate-50/60 shadow-xs"
        } ${compact ? "p-6" : "p-10 md:p-14"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          aria-label="Upload PDF files input"
        />

        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <FileText className="w-8 h-8" />
        </div>

        <h3 className="text-lg md:text-xl font-bold text-slate-900 text-center mb-2">
          {isDragOver ? "Drop your PDF files here" : "Select or Drop PDF Files"}
        </h3>

        <p className="text-xs md:text-sm text-slate-500 text-center max-w-md mb-6 leading-relaxed">
          Choose two or more PDF files from your device. Documents are merged directly in your browser.
        </p>

        <PrimaryButton
          size="lg"
          icon={UploadCloud}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Select PDF Files
        </PrimaryButton>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Up to {limits.maxFiles} files</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Max {limits.maxFileSizeFormatted} per file</span>
          </div>
          <div className="flex items-center gap-1.5 text-brand-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Private (Local Processing)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
