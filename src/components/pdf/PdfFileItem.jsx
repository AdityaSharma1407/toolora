"use client";

import React from "react";
import { FileText, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { formatBytes } from "@/tools/pdf/validatePdf";

export default function PdfFileItem({
  item,
  index,
  totalItems,
  onMoveUp,
  onMoveDown,
  onRemove,
}) {
  const isFirst = index === 0;
  const isLast = index === totalItems - 1;

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-white border border-black/[0.06] rounded-2xl hover:border-black/[0.12] shadow-subtle transition-all">
      {/* File order indicator */}
      <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold shrink-0">
        #{index + 1}
      </div>

      {/* PDF Icon */}
      <div className="p-2 rounded-xl bg-red-50 text-red-600 shrink-0">
        <FileText className="w-4 h-4" />
      </div>

      {/* File metadata */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs sm:text-sm font-semibold text-slate-900 truncate"
          title={item.name}
        >
          {item.name}
        </p>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
          {formatBytes(item.size)}
        </p>
      </div>

      {/* Action Controls (Strictly touch-friendly >= 40-44px on mobile) */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={() => onMoveUp(index)}
          disabled={isFirst}
          title={`Move ${item.name} up in order`}
          aria-label={`Move ${item.name} up`}
          className="min-w-[40px] min-h-[40px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onMoveDown(index)}
          disabled={isLast}
          title={`Move ${item.name} down in order`}
          aria-label={`Move ${item.name} down`}
          className="min-w-[40px] min-h-[40px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ArrowDown className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onRemove(index)}
          title={`Remove ${item.name}`}
          aria-label={`Remove ${item.name}`}
          className="min-w-[40px] min-h-[40px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
