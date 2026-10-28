"use client";

import React, { useState, useEffect, useId } from "react";
import {
  Code,
  FileCode,
  Download,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Upload,
  Settings2,
  FileText,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { convertHtmlToPdf } from "@/tools/convert/htmlToPdf.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

const DEFAULT_SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>Quarterly Business Report</title>
</head>
<body>
  <h1>Executive Summary & Milestones</h1>
  <p>Bits & Tools delivers high-performance client-side productivity utilities with zero server latency and total privacy.</p>
  
  <h2>Key Performance Indicators</h2>
  <ul>
    <li>100% Client-Side In-Memory Execution</li>
    <li>Zero External Server Dependencies</li>
    <li>Sub-millisecond processing speeds</li>
  </ul>

  <blockquote>"Privacy is not an afterthought; it is our primary architectural foundation."</blockquote>

  <h2>Financial Summary</h2>
  <table>
    <tr><th>Quarter</th><th>Revenue</th><th>Growth</th></tr>
    <tr><td>Q1 2026</td><td>$142,000</td><td>+24%</td></tr>
    <tr><td>Q2 2026</td><td>$189,500</td><td>+33%</td></tr>
  </table>
</body>
</html>`;

export default function HtmlToPdfWorkspace() {
  const [mode, setMode] = useState("editor"); // 'editor' | 'file'
  const [htmlInput, setHtmlInput] = useState(DEFAULT_SAMPLE_HTML);
  const [file, setFile] = useState(null);

  // Settings
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [theme, setTheme] = useState("modern");

  // State
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
    if (!selectedFile.name.endsWith(".html") && !selectedFile.name.endsWith(".htm") && selectedFile.type !== "text/html") {
      setErrorMessage("Please upload an HTML file (.html, .htm).");
      return;
    }
    setFile(selectedFile);
    setErrorMessage(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setHtmlInput(e.target.result);
      setMode("editor");
    };
    reader.readAsText(selectedFile);
  };

  const handleConvert = async () => {
    if (!htmlInput.trim()) {
      setErrorMessage("Please provide HTML markup or upload an HTML file.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await convertHtmlToPdf(htmlInput, {
        pageSize,
        orientation,
        theme,
      });

      const blob = new Blob([res.pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const filename = `${res.title.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase() || "document"}.pdf`;

      setResult({
        ...res,
        url,
        filename,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to convert HTML to PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Workspace Tabs & Options Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              type="button"
              onClick={() => setMode("editor")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition ${
                mode === "editor"
                  ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Code className="w-3.5 h-3.5" /> HTML Code Editor
            </button>
            <button
              type="button"
              onClick={() => setMode("file")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition ${
                mode === "file"
                  ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Upload .html File
            </button>
          </div>

          {/* Quick Settings */}
          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="a4">A4 Page</option>
              <option value="letter">US Letter</option>
              <option value="legal">Legal</option>
            </select>

            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="modern">Modern Theme</option>
              <option value="classic">Classic Serif</option>
            </select>
          </div>
        </div>

        {/* Input Area */}
        {mode === "editor" ? (
          <div>
            <label className="text-xs font-semibold text-gray-900 dark:text-white block mb-2">
              HTML Markup
            </label>
            <textarea
              rows={12}
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="Paste HTML markup here..."
              className="w-full font-mono text-xs p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        ) : (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 rounded-2xl p-10 text-center bg-gray-50/50 dark:bg-gray-950/50"
          >
            <FileCode className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {file ? file.name : "Drag and drop your .html or .htm file"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Processed directly in browser RAM without server uploads
            </p>
            <input
              id={fileInputId}
              type="file"
              accept=".html,.htm,text/html"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />
            <label htmlFor={fileInputId}>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" /> Choose HTML File
              </span>
            </label>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <PrimaryButton
            onClick={handleConvert}
            disabled={isProcessing}
            className="px-8 py-3"
          >
            {isProcessing ? "Generating PDF..." : "Convert HTML to PDF"}
          </PrimaryButton>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Result Card */}
      {result && (
        <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 shadow-sm animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    PDF Generated Successfully!
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {result.title} • {result.pageCount} {result.pageCount === 1 ? "page" : "pages"} • {formatBytes(result.size)}
                </p>
              </div>
            </div>

            <a
              href={result.url}
              download={result.filename}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 shadow-sm hover:shadow transition"
            >
              <Download className="w-4 h-4" /> Download PDF Document
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
