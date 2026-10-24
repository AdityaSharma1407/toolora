"use client";

import React from "react";
import { CheckCircle2, Download, RotateCcw, FileCheck, Layers } from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { formatBytes } from "@/tools/pdf/validatePdf";
import { triggerBlobDownload } from "@/tools/pdf/pdfUtils";

export default function PdfDownloadResult({ result, onReset }) {
  if (!result) return null;

  const {
    blob,
    filename = "merged-document.pdf",
    byteLength = 0,
    pageCount = 0,
    sourceCount = 0,
    pageBreakdown = [],
  } = result;

  function handleDownload() {
    if (blob) {
      triggerBlobDownload(blob, filename);
    }
  }

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
      {/* Success Badge */}
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 ring-8 ring-emerald-50/50">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
        PDFs Successfully Combined!
      </h3>

      <p className="text-sm text-slate-600 max-w-md mb-8">
        Your new document is ready. We combined{" "}
        <span className="font-semibold text-slate-800">{sourceCount} documents</span> into{" "}
        <span className="font-semibold text-slate-800">{pageCount} total pages</span>.
      </p>

      {/* File Details Card */}
      <div className="w-full max-w-lg bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-8 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white text-brand-600 border border-slate-200">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Output File</div>
              <div className="text-sm font-bold text-slate-900 truncate max-w-[220px] sm:max-w-xs">
                {filename}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Size</div>
            <div className="text-sm font-bold text-slate-900">
              {formatBytes(byteLength)}
            </div>
          </div>
        </div>

        {pageBreakdown && pageBreakdown.length > 0 && (
          <div className="mt-3">
            <div className="text-[11px] font-semibold uppercase text-slate-400 mb-1.5 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>Page Breakdown</span>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {pageBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs text-slate-600 py-0.5"
                >
                  <span className="truncate pr-2">{item.name}</span>
                  <span className="font-medium text-slate-800 shrink-0">
                    {item.pages} {item.pages === 1 ? "page" : "pages"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
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
          Download Merged PDF
        </PrimaryButton>

        <PrimaryButton
          size="lg"
          variant="secondary"
          icon={RotateCcw}
          onClick={onReset}
          className="w-full sm:w-auto"
        >
          Merge More PDFs
        </PrimaryButton>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Your combined file was generated client-side in memory and will be cleared when you navigate away.
      </p>
    </div>
  );
}
