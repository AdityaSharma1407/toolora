"use client";

import React, { useRef } from "react";
import { Plus, Trash2, Combine, AlertTriangle } from "lucide-react";
import PdfFileItem from "./PdfFileItem";
import PrimaryButton from "../common/PrimaryButton";
import { formatBytes } from "@/tools/pdf/validatePdf";
import { calculateTotalSize } from "@/tools/pdf/pdfUtils";

export default function PdfFileList({
  files,
  onMoveUp,
  onMoveDown,
  onRemove,
  onClearAll,
  onAddMore,
  onMerge,
  isProcessing = false,
}) {
  const fileInputRef = useRef(null);
  const totalSize = calculateTotalSize(files);
  const canMerge = files.length >= 2;

  return (
    <div className="w-full bg-slate-50/60 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs">
      {/* Top Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Selected Documents ({files.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Total size: <span className="font-semibold text-slate-700">{formatBytes(totalSize)}</span> &bull; Output will follow list order
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                onAddMore(e.target.files);
                e.target.value = "";
              }
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-brand-600" />
            <span>Add More PDFs</span>
          </button>

          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Files List */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
        {files.map((item, index) => (
          <PdfFileItem
            key={item.id || index}
            item={item}
            index={index}
            totalItems={files.length}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Guidance & Merge Action Bar */}
      <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          {!canMerge && (
            <div className="flex items-center gap-1.5 text-amber-600 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Select at least 2 PDF files to begin merge.</span>
            </div>
          )}
          {canMerge && (
            <span className="text-slate-500">
              Files will be combined from top (#1) to bottom (#{files.length}).
            </span>
          )}
        </div>

        <PrimaryButton
          size="lg"
          variant="primary"
          icon={Combine}
          disabled={!canMerge || isProcessing}
          loading={isProcessing}
          onClick={onMerge}
          className="w-full sm:w-auto min-w-[200px]"
        >
          Merge PDF Files
        </PrimaryButton>
      </div>
    </div>
  );
}
