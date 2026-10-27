"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileText,
  Stamp,
  Download,
  AlertCircle,
  Undo2,
  Sparkles,
  Sliders,
  RotateCw,
  Image as ImageIcon,
  Type,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import PdfUploadZone from "./PdfUploadZone";
import PdfProcessingState from "./PdfProcessingState";
import PdfDownloadResult from "./PdfDownloadResult";
import { watermarkPdfDocument } from "@/tools/pdf/watermarkPdf";
import { formatBytes } from "@/tools/pdf/validatePdf";

const PRESET_WATERMARKS = [
  "CONFIDENTIAL",
  "DRAFT",
  "SAMPLE",
  "DO NOT COPY",
  "INTERNAL ONLY",
  "COPY",
];

const COLOR_PRESETS = [
  { id: "red", label: "Crimson Red", value: { r: 0.8, g: 0.15, b: 0.15 }, bg: "bg-red-500" },
  { id: "gray", label: "Subtle Gray", value: { r: 0.35, g: 0.35, b: 0.35 }, bg: "bg-neutral-500" },
  { id: "blue", label: "Navy Blue", value: { r: 0.1, g: 0.3, b: 0.7 }, bg: "bg-blue-600" },
  { id: "green", label: "Forest Green", value: { r: 0.15, g: 0.5, b: 0.2 }, bg: "bg-emerald-600" },
];

export default function WatermarkPdfWorkspace() {
  const [status, setStatus] = useState("idle");
  const [fileItem, setFileItem] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  // Configuration options
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.25);
  const [rotation, setRotation] = useState(-45);
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);

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
        throw new Error("This PDF document is password-protected. Please unlock it before adding a watermark.");
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

  async function handleApplyWatermark() {
    if (!fileItem?.buffer) return;
    setStatus("processing");
    setProgress({ percent: 25, message: "Preparing typography matrix and font glyphs..." });

    try {
      setProgress({ percent: 65, message: "Stamping watermark across all document pages..." });

      const { pdfBytes } = await watermarkPdfDocument(fileItem.buffer, {
        text: text.trim() || "WATERMARK",
        fontSize,
        opacity,
        rotation,
        color: selectedColor.value,
      });

      setProgress({ percent: 95, message: "Finalizing protected document stream..." });

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const downloadName = fileItem.name.replace(/\.[^/.]+$/, "") + "-watermarked.pdf";

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
      setErrorMessage(err?.message || "Failed to watermark PDF.");
      setStatus("error");
    }
  }

  function handleReset() {
    cleanupBlob();
    setFileItem(null);
    setTotalPages(0);
    setResult(null);
    setErrorMessage(null);
    setStatus("idle");
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls Column */}
            <div className="lg:col-span-7 space-y-5">
              {/* Preset Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_WATERMARKS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setText(preset)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                        text === preset
                          ? "bg-brand-600 text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Text Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter watermark text..."
                  maxLength={60}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/30"
                />
              </div>

              {/* Color & Rotation Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Color Style
                  </label>
                  <div className="flex items-center gap-2">
                    {COLOR_PRESETS.map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          selectedColor.id === col.id
                            ? "border-slate-800 bg-slate-50 ring-2 ring-slate-800/10 font-bold"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${col.bg}`} />
                        <span>{col.label.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Orientation
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[
                      { deg: -45, label: "Diagonal (-45°)" },
                      { deg: 0, label: "Horizontal (0°)" },
                      { deg: 90, label: "Vertical (90°)" },
                    ].map((rot) => (
                      <button
                        key={rot.deg}
                        type="button"
                        onClick={() => setRotation(rot.deg)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          rotation === rot.deg
                            ? "bg-brand-600 text-white border-brand-600 font-bold"
                            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {rot.label.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sliders: Opacity & Size */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold uppercase tracking-wider text-slate-600">
                      Transparency (Opacity)
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {Math.round(opacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="5"
                    value={Math.round(opacity * 100)}
                    onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold uppercase tracking-wider text-slate-600">
                      Font Size
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {fontSize} pt
                    </span>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="80"
                    step="2"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right Mockup Preview Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Live Layout Preview
              </span>
              <div className="w-full max-w-[280px] aspect-[1/1.3] bg-white border-2 border-slate-200 rounded-2xl shadow-md p-6 flex flex-col justify-between relative overflow-hidden select-none">
                {/* Mock lines */}
                <div className="space-y-2 opacity-25">
                  <div className="h-2 bg-slate-300 rounded-sm w-3/4" />
                  <div className="h-2 bg-slate-300 rounded-sm w-full" />
                  <div className="h-2 bg-slate-300 rounded-sm w-5/6" />
                  <div className="h-2 bg-slate-300 rounded-sm w-4/5" />
                </div>

                {/* Centered Watermark overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none p-4"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                  }}
                >
                  <span
                    className="font-bold tracking-widest text-center break-words select-none"
                    style={{
                      fontSize: `${Math.round(fontSize * 0.45)}px`,
                      color: `rgb(${Math.round(selectedColor.value.r * 255)}, ${Math.round(selectedColor.value.g * 255)}, ${Math.round(selectedColor.value.b * 255)})`,
                      opacity: opacity,
                    }}
                  >
                    {text || "WATERMARK"}
                  </span>
                </div>

                {/* Mock bottom lines */}
                <div className="space-y-2 opacity-25">
                  <div className="h-2 bg-slate-300 rounded-sm w-full" />
                  <div className="h-2 bg-slate-300 rounded-sm w-2/3" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Watermark will be stamped across all{" "}
              <strong className="text-slate-800">{totalPages}</strong> pages.
            </div>

            <PrimaryButton
              type="button"
              onClick={handleApplyWatermark}
              icon={Stamp}
              size="lg"
            >
              Apply Watermark
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* State 3: Processing */}
      {status === "processing" && (
        <PdfProcessingState
          title="Applying Watermark..."
          message={progress.message}
          percent={progress.percent}
        />
      )}

      {/* State 4: Completed Download Result */}
      {status === "completed" && result && (
        <PdfDownloadResult
          title="Watermark Applied Successfully!"
          fileName={result.fileName}
          fileSize={result.newSize}
          originalSize={result.originalSize}
          downloadUrl={result.url}
          onReset={handleReset}
          actionLabel="Download Watermarked PDF"
        />
      )}
    </div>
  );
}
