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
    <div className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 shadow-2xs transition-all">
      {/* File order indicator */}
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold shrink-0">
        #{index + 1}
      </div>

      {/* PDF Icon */}
      <div className="p-2 rounded-lg bg-red-50 text-red-600 shrink-0">
        <FileText className="w-4 h-4" />
      </div>

      {/* File metadata */}
      <div className="flex-1 min-w-0">
        <h4
          className="text-sm font-semibold text-slate-800 truncate"
          title={item.name}
        >
          {item.name}
        </h4>
        <p className="text-xs text-slate-400 mt-0.5">
          {formatBytes(item.size)}
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onMoveUp(index)}
          disabled={isFirst}
          title={`Move ${item.name} up in order`}
          aria-label={`Move ${item.name} up`}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onMoveDown(index)}
          disabled={isLast}
          title={`Move ${item.name} down in order`}
          aria-label={`Move ${item.name} down`}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowDown className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onRemove(index)}
          title={`Remove ${item.name}`}
          aria-label={`Remove ${item.name}`}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
