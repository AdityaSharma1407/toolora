"use client";

import React, { useState, useEffect, useId } from "react";
import {
  FileSpreadsheet,
  Table,
  Download,
  AlertCircle,
  CheckCircle2,
  Upload,
  FileText,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { convertExcelToPdf, parseSpreadsheet } from "@/tools/convert/excelToPdf.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

const SAMPLE_CSV = `Product,Category,Q1 Sales,Q2 Sales,Status
Cloud Storage Pro,Infrastructure,$24,500,$31,200,Active
Developer API Tier,Developer Tools,$12,800,$18,400,Active
Enterprise SSO Addon,Security,$8,900,$14,200,Pending
AI Assist Engine,Intelligence,$42,000,$58,900,Active`;

export default function ExcelToPdfWorkspace() {
  const [file, setFile] = useState(null);
  const [tablePreview, setTablePreview] = useState(null);
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [mode, setMode] = useState("file"); // 'file' | 'paste'

  // Settings
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState("landscape");

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputId = useId();

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setErrorMessage(null);
    setResult(null);

    try {
      const parsed = await parseSpreadsheet(selectedFile, selectedFile.name);
      setTablePreview(parsed);
    } catch (err) {
      setErrorMessage(err.message || "Failed to parse spreadsheet file.");
    }
  };

  const handleConvert = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const input = mode === "file" && file ? file : csvText;
      const fileName = file ? file.name : "Spreadsheet";

      const res = await convertExcelToPdf(input, {
        pageSize,
        orientation,
        fileName,
      });

      const blob = new Blob([res.pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const filename = `${fileName.replace(/\.[^/.]+$/, "") || "spreadsheet"}.pdf`;

      setResult({
        ...res,
        url,
        filename,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to convert spreadsheet to PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
        {/* Mode Switcher & Settings */}
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
              <Upload className="w-3.5 h-3.5" /> Upload Excel (.xlsx) / CSV
            </button>
            <button
              type="button"
              onClick={() => setMode("paste")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition ${
                mode === "paste"
                  ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Table className="w-3.5 h-3.5" /> Paste Tabular CSV
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="landscape">Landscape (Recommended)</option>
              <option value="portrait">Portrait</option>
            </select>

            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="a4">A4 Page</option>
              <option value="letter">US Letter</option>
            </select>
          </div>
        </div>

        {/* Input Views */}
        {mode === "file" ? (
          <div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
              }}
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 rounded-2xl p-10 text-center bg-gray-50/50 dark:bg-gray-950/50"
            >
              <FileSpreadsheet className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {file ? file.name : "Drag and drop your Excel (.xlsx, .xls) or .csv file"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Structured into high-resolution paginated PDF tables in browser memory
              </p>
              <input
                id={fileInputId}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <label htmlFor={fileInputId}>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5" /> Choose Spreadsheet
                </span>
              </label>
            </div>

            {/* Table Preview snippet */}
            {tablePreview && tablePreview.rows.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Preview: {tablePreview.sheetName} ({tablePreview.rows.length} rows, {tablePreview.rows[0].length} cols)
                  </span>
                </div>
                <div className="overflow-x-auto max-h-48 text-xs font-mono">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead>
                      <tr>
                        {tablePreview.rows[0].map((col, idx) => (
                          <th key={idx} className="p-2 text-left bg-gray-100 dark:bg-gray-800 font-semibold text-gray-700 dark:text-gray-300">
                            {col || `Col ${idx + 1}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                      {tablePreview.rows.slice(1, 4).map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2 text-gray-600 dark:text-gray-400">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="text-xs font-semibold text-gray-900 dark:text-white block mb-2">
              Paste CSV / Tabular Data
            </label>
            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full font-mono text-xs p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <PrimaryButton
            onClick={handleConvert}
            disabled={isProcessing}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700"
          >
            {isProcessing ? "Rendering PDF..." : "Convert Excel to PDF"}
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
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    PDF Table Generated!
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {result.rowCount} rows • {result.colCount} columns • {result.pageCount} {result.pageCount === 1 ? "page" : "pages"} • {formatBytes(result.size)}
                </p>
              </div>
            </div>

            <a
              href={result.url}
              download={result.filename}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 shadow-sm hover:shadow transition"
            >
              <Download className="w-4 h-4" /> Download PDF Table
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
