"use client";

import React, { useState, useEffect, useId } from "react";
import {
  Presentation,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  Upload,
  Layers,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { convertPowerpointToPdf } from "@/tools/convert/powerpointToPdf.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

const SAMPLE_OUTLINE = `# Product Strategy 2026
- Global privacy-first architecture
- Sub-millisecond browser client performance
- Complete zero-server document conversion

---

# Key Milestones & Architecture
- Full PDF, Image, and Document Conversion engines
- Pure client-side WebAssembly, Canvas & OpenXML
- Zero telemetry, zero uploads, zero tracking

---

# Growth & Impact
- Over 35+ accessible free utilities
- Instant browser processing without cloud queues
- Complete independence from backend server costs`;

export default function PowerpointToPdfWorkspace() {
  const [file, setFile] = useState(null);
  const [outlineText, setOutlineText] = useState(SAMPLE_OUTLINE);
  const [mode, setMode] = useState("file"); // 'file' | 'outline'
  const [theme, setTheme] = useState("modern"); // 'modern' | 'dark'

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputId = useId();

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const handleFileUpload = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith(".pptx")) {
      setErrorMessage("Please upload a Microsoft PowerPoint (.pptx) presentation.");
      return;
    }
    setFile(selectedFile);
    setErrorMessage(null);
    setResult(null);
  };

  const handleConvert = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const input = mode === "file" && file ? file : outlineText;
      const baseName = file ? file.name.replace(/\.pptx$/i, "") : "presentation";

      const res = await convertPowerpointToPdf(input, { theme });

      const blob = new Blob([res.pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const filename = `${baseName}.pdf`;

      setResult({
        ...res,
        url,
        filename,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to convert presentation to PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              type="button"
              onClick={() => setMode("file")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition ${
                mode === "file"
                  ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Upload PowerPoint (.pptx)
            </button>
            <button
              type="button"
              onClick={() => setMode("outline")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition ${
                mode === "outline"
                  ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Markdown / Text Slides
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="modern">Modern Light Theme</option>
              <option value="dark">Pro Dark Theme</option>
            </select>
          </div>
        </div>

        {mode === "file" ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-amber-500 rounded-2xl p-10 text-center bg-gray-50/50 dark:bg-gray-950/50"
          >
            <Presentation className="w-10 h-10 text-amber-500 dark:text-amber-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {file ? file.name : "Drag and drop your PowerPoint presentation (.pptx)"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Converts slide decks into crisp 16:9 widescreen landscape PDF presentations
            </p>
            <input
              id={fileInputId}
              type="file"
              accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />
            <label htmlFor={fileInputId}>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 text-white font-medium text-xs hover:bg-amber-600 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" /> Choose Presentation
              </span>
            </label>
          </div>
        ) : (
          <div>
            <label className="text-xs font-semibold text-gray-900 dark:text-white block mb-2">
              Slide Outline (Use &quot;---&quot; to separate slides)
            </label>
            <textarea
              rows={10}
              value={outlineText}
              onChange={(e) => setOutlineText(e.target.value)}
              className="w-full font-mono text-xs p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <PrimaryButton
            onClick={handleConvert}
            disabled={isProcessing}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600"
          >
            {isProcessing ? "Formatting Slides..." : "Convert PowerPoint to PDF"}
          </PrimaryButton>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {result && (
        <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 shadow-sm animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Presentation className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    Presentation Converted!
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {result.slideCount} slides • 16:9 widescreen format • {formatBytes(result.size)}
                </p>
              </div>
            </div>

            <a
              href={result.url}
              download={result.filename}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 shadow-sm hover:shadow transition"
            >
              <Download className="w-4 h-4" /> Download PDF Presentation
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
