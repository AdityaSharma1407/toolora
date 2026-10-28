"use client";

import React, { useState, useEffect, useId } from "react";
import {
  Table,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Upload,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { convertPdfToExcel } from "@/tools/convert/pdfToExcel.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

export default function PdfToExcelWorkspace() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputId = useId();

  useEffect(() => {
    return () => {
      if (result?.xlsxUrl) URL.revokeObjectURL(result.xlsxUrl);
      if (result?.csvUrl) URL.revokeObjectURL(result.csvUrl);
    };
  }, [result]);

  const handleFileUpload = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith(".pdf") && selectedFile.type !== "application/pdf") {
      setErrorMessage("Please upload a PDF document (.pdf).");
      return;
    }
    setFile(selectedFile);
    setErrorMessage(null);
    setResult(null);
  };

  const handleConvert = async () => {
    if (!file) {
      setErrorMessage("Please select a PDF document first.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const baseName = file.name.replace(/\.pdf$/i, "");
      const res = await convertPdfToExcel(file, baseName);

      const xlsxBlob = new Blob([res.xlsxBytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const xlsxUrl = URL.createObjectURL(xlsxBlob);

      const csvBlob = new Blob([res.csvText], { type: "text/csv;charset=utf-8;" });
      const csvUrl = URL.createObjectURL(csvBlob);

      setResult({
        ...res,
        xlsxUrl,
        csvUrl,
        xlsxFilename: `${baseName}.xlsx`,
        csvFilename: `${baseName}.csv`,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to extract table data from PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-500 rounded-2xl p-10 text-center bg-gray-50/50 dark:bg-gray-950/50"
        >
          <Table className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {file ? file.name : "Drag and drop your PDF file to extract tables"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Automatically detects grid columns and converts them to Microsoft Excel (.xlsx) and CSV
          </p>
          <input
            id={fileInputId}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
          <label htmlFor={fileInputId}>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" /> Choose PDF File
            </span>
          </label>
        </div>

        {file && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-sm">
                {file.name}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {formatBytes(file.size)}
              </p>
            </div>

            <PrimaryButton
              onClick={handleConvert}
              disabled={isProcessing}
              className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessing ? "Extracting Tables..." : "Extract to Excel & CSV"}
            </PrimaryButton>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                      Tables Extracted Successfully!
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                    {result.rowCount} rows detected • {result.colCount} columns • {formatBytes(result.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={result.xlsxUrl}
                  download={result.xlsxFilename}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download Excel (.xlsx)
                </a>
                <a
                  href={result.csvUrl}
                  download={result.csvFilename}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-emerald-600 text-emerald-700 dark:text-emerald-300 font-medium text-xs hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download CSV
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
