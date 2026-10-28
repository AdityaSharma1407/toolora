"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  RotateCw,
  RotateCcw,
  Trash2,
  Undo2,
  ArrowLeft,
  ArrowRight,
  GripVertical,
  CheckCircle2,
  FileText,
  Loader2,
} from "lucide-react";
import { loadPdfJsDoc, renderPageThumbnail } from "@/tools/pdf/pdfToJpg";

/**
 * Reusable interactive PDF page preview grid for Rotate, Delete, Reorder, and Selection workflows.
 */
export default function PdfPageGrid({
  pages = [],
  pdfBuffer,
  mode = "select", // 'rotate' | 'delete' | 'reorder' | 'select'
  rotations = {},
  deletedIndices = new Set(),
  selectedPages = [],
  onRotatePage,
  onToggleDelete,
  onMovePage,
  onToggleSelect,
}) {
  const [thumbnails, setThumbnails] = useState({});
  const [loadingPages, setLoadingPages] = useState(new Set());
  const [draggedIndex, setDraggedIndex] = useState(null);
  const pdfDocRef = useRef(null);

  // Initialize PDF.js document and load thumbnails progressively
  useEffect(() => {
    let isCancelled = false;
    let activeDoc = null;

    async function loadThumbnails() {
      if (!pdfBuffer || pdfBuffer.byteLength === 0) return;

      try {
        const doc = await loadPdfJsDoc(pdfBuffer);
        if (isCancelled) {
          try {
            doc.destroy();
          } catch (_) {}
          return;
        }
        activeDoc = doc;
        pdfDocRef.current = doc;

        const totalPages = doc.numPages;

        // Render visible thumbnails sequentially with slight yield
        for (let i = 1; i <= totalPages; i++) {
          if (isCancelled) break;

          setLoadingPages((prev) => new Set(prev).add(i));

          try {
            const thumb = await renderPageThumbnail(doc, i, 220);
            if (!isCancelled) {
              setThumbnails((prev) => ({ ...prev, [i]: thumb.dataUrl }));
            }
          } catch (err) {
            console.debug(`Failed to render thumbnail for page ${i}:`, err);
          } finally {
            if (!isCancelled) {
              setLoadingPages((prev) => {
                const next = new Set(prev);
                next.delete(i);
                return next;
              });
            }
          }

          // Small yield so the browser remains 100% responsive
          await new Promise((r) => setTimeout(r, 10));
        }
      } catch (err) {
        console.error("Failed to load PDF thumbnails:", err);
      }
    }

    loadThumbnails();

    return () => {
      isCancelled = true;
      if (activeDoc) {
        try {
          activeDoc.destroy();
        } catch (_) {}
      }
      pdfDocRef.current = null;
    };
  }, [pdfBuffer]);

  // Drag and drop handlers for Reorder mode
  function handleDragStart(e, index) {
    if (mode !== "reorder") return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  }

  function handleDragOver(e, index) {
    if (mode !== "reorder") return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e, targetIndex) {
    if (mode !== "reorder") return;
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    if (onMovePage) {
      onMovePage(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {pages.map((item, index) => {
          const pageNum = item.originalNumber || item.pageNumber || index + 1;
          const thumbUrl = thumbnails[pageNum];
          const isLoading = loadingPages.has(pageNum) && !thumbUrl;
          const rotationAngle = rotations[index] || rotations[item.pageIndex] || 0;
          const isDeleted = deletedIndices instanceof Set
            ? deletedIndices.has(item.pageIndex !== undefined ? item.pageIndex : index)
            : Array.isArray(deletedIndices)
            ? deletedIndices.includes(item.pageIndex !== undefined ? item.pageIndex : index)
            : false;
          const isSelected = selectedPages.includes(pageNum);
          const isDragging = draggedIndex === index;

          return (
            <div
              key={`${pageNum}-${index}`}
              draggable={mode === "reorder"}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={() => setDraggedIndex(null)}
              className={`group relative flex flex-col bg-white rounded-2xl border transition-all select-none overflow-hidden ${
                isDragging
                  ? "opacity-40 border-brand-500 scale-95 shadow-md"
                  : isDeleted
                  ? "border-red-300 bg-red-50/40 opacity-75 shadow-none"
                  : isSelected && mode === "select"
                  ? "border-brand-500 ring-2 ring-brand-500/20 shadow-sm"
                  : "border-black/[0.08] hover:border-brand-300 hover:shadow-subtle"
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50/80 border-b border-black/[0.04]">
                <div className="flex items-center gap-1.5 min-w-0">
                  {mode === "reorder" && (
                    <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab active:cursor-grabbing shrink-0" />
                  )}
                  <span className="text-xs font-bold text-slate-800 truncate">
                    Page {index + 1}
                  </span>
                </div>

                {mode === "reorder" && item.originalNumber && item.originalNumber !== index + 1 && (
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded-md">
                    Was #{item.originalNumber}
                  </span>
                )}

                {mode === "rotate" && rotationAngle !== 0 && (
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-1.5 py-0.5 rounded-md">
                    {rotationAngle}°
                  </span>
                )}

                {mode === "delete" && isDeleted && (
                  <span className="text-[10px] font-bold text-red-700 bg-red-100 border border-red-200 px-1.5 py-0.5 rounded-md">
                    Deleted
                  </span>
                )}

                {mode === "select" && (
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                      isSelected ? "bg-brand-600 text-white" : "border border-slate-300"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                )}
              </div>

              {/* Thumbnail Preview Area */}
              <div
                onClick={() => {
                  if (mode === "delete" && onToggleDelete) {
                    onToggleDelete(item.pageIndex !== undefined ? item.pageIndex : index);
                  } else if (mode === "select" && onToggleSelect) {
                    onToggleSelect(pageNum);
                  }
                }}
                className={`relative flex items-center justify-center p-3 h-44 sm:h-48 cursor-pointer overflow-hidden ${
                  mode === "delete" ? "hover:bg-red-50/50" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                    <span className="text-[11px] font-medium">Loading...</span>
                  </div>
                ) : thumbUrl ? (
                  <div
                    className="relative w-full h-full flex items-center justify-center transition-transform duration-200"
                    style={{
                      transform: `rotate(${rotationAngle}deg)`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbUrl}
                      alt={`Page ${pageNum} preview`}
                      loading="lazy"
                      decoding="async"
                      className={`max-w-full max-h-full object-contain rounded-md shadow-xs pointer-events-none transition-opacity ${
                        isDeleted ? "grayscale opacity-40" : "opacity-100"
                      }`}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-300">
                    <FileText className="w-10 h-10" />
                    <span className="text-xs font-semibold text-slate-400">Page {pageNum}</span>
                  </div>
                )}

                {/* Deleted Overlay Banner */}
                {mode === "delete" && isDeleted && (
                  <div className="absolute inset-0 bg-red-900/15 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Will Be Deleted</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mode-Specific Actions Footer */}
              <div className="px-2 py-2 bg-slate-50 border-t border-black/[0.04] flex items-center justify-center gap-1.5">
                {mode === "rotate" && (
                  <>
                    <button
                      type="button"
                      onClick={() => onRotatePage(item.pageIndex !== undefined ? item.pageIndex : index, -90)}
                      title="Rotate counter-clockwise 90°"
                      aria-label={`Rotate page ${index + 1} counter-clockwise 90 degrees`}
                      className="min-h-[36px] flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-white rounded-lg border border-black/[0.06] transition-all active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">-90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRotatePage(item.pageIndex !== undefined ? item.pageIndex : index, 90)}
                      title="Rotate clockwise 90°"
                      aria-label={`Rotate page ${index + 1} clockwise 90 degrees`}
                      className="min-h-[36px] flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-white rounded-lg border border-black/[0.06] transition-all active:scale-95"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">+90°</span>
                    </button>
                  </>
                )}

                {mode === "delete" && (
                  <button
                    type="button"
                    onClick={() => onToggleDelete(item.pageIndex !== undefined ? item.pageIndex : index)}
                    aria-label={isDeleted ? `Restore page ${index + 1}` : `Delete page ${index + 1}`}
                    className={`min-h-[36px] w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all active:scale-95 ${
                      isDeleted
                        ? "bg-slate-200 hover:bg-slate-300 text-slate-700"
                        : "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80"
                    }`}
                  >
                    {isDeleted ? (
                      <>
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>Restore Page</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Page</span>
                      </>
                    )}
                  </button>
                )}

                {mode === "reorder" && (
                  <div className="flex items-center justify-between w-full gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onMovePage(index, index - 1)}
                      title="Move page left"
                      aria-label={`Move page ${index + 1} left`}
                      className="min-h-[36px] flex-1 inline-flex items-center justify-center p-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white rounded-lg border border-black/[0.06] transition-all active:scale-95"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-bold text-slate-500 px-1">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      disabled={index === pages.length - 1}
                      onClick={() => onMovePage(index, index + 1)}
                      title="Move page right"
                      aria-label={`Move page ${index + 1} right`}
                      className="min-h-[36px] flex-1 inline-flex items-center justify-center p-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white rounded-lg border border-black/[0.06] transition-all active:scale-95"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {mode === "select" && (
                  <button
                    type="button"
                    onClick={() => onToggleSelect(pageNum)}
                    className="min-h-[36px] w-full text-xs font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                  >
                    {isSelected ? "Selected" : "Click to select"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
