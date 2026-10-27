"use client";

import React, { useState, useId, useEffect } from "react";
import {
  jsonToCsv,
  csvToJson,
} from "@/tools/utility/csvConverter.js";
import {
  ArrowLeftRight,
  FileSpreadsheet,
  FileJson,
  Upload,
  Download,
  Copy,
  Check,
  RotateCcw,
  Table,
  Settings2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const SAMPLE_JSON = `[
  {
    "id": 101,
    "name": "Sarah Connor",
    "role": "Lead Architect",
    "active": true,
    "contact": {
      "email": "sarah@cyberdyne.org",
      "city": "Los Angeles"
    },
    "score": 98.5
  },
  {
    "id": 102,
    "name": "Miles Dyson",
    "role": "Principal Researcher",
    "active": true,
    "contact": {
      "email": "miles@cyberdyne.org",
      "city": "Pasadena"
    },
    "score": 95.0
  },
  {
    "id": 103,
    "name": "John Connor",
    "role": "Operations Strategist",
    "active": false,
    "contact": {
      "email": "john@resistance.io",
      "city": "San Francisco"
    },
    "score": 89.2
  }
]`;

const SAMPLE_CSV = `id,name,role,active,contact.email,contact.city,score
101,"Sarah Connor","Lead Architect",true,sarah@cyberdyne.org,"Los Angeles",98.5
102,"Miles Dyson","Principal Researcher",true,miles@cyberdyne.org,Pasadena,95
103,"John Connor","Operations Strategist",false,john@resistance.io,"San Francisco",89.2`;

export default function CsvConverterWorkspace() {
  const [mode, setMode] = useState("json-to-csv"); // 'json-to-csv' | 'csv-to-json'
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [flatten, setFlatten] = useState(true);
  const [autoType, setAutoType] = useState(true);
  const [viewTable, setViewTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const inputId = useId();
  const outputId = useId();

  // Perform conversion
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setTableData([]);
      setTableHeaders([]);
      setStats(null);
      setError(null);
      return;
    }

    try {
      if (mode === "json-to-csv") {
        const res = jsonToCsv(input, { delimiter, flatten });
        if (res.success) {
          setOutput(res.output);
          setStats({ rows: res.rowCount, cols: res.columnCount });
          setError(null);

          // Prepare table preview
          const previewParse = csvToJson(res.output, { delimiter, autoType: false });
          if (previewParse.success && previewParse.data?.length > 0) {
            setTableHeaders(Object.keys(previewParse.data[0]));
            setTableData(previewParse.data.slice(0, 50));
          }
        } else {
          setOutput("");
          setError(res.error);
          setStats(null);
        }
      } else {
        const res = csvToJson(input, { delimiter, autoType });
        if (res.success) {
          setOutput(res.output);
          setStats({ rows: res.rowCount, cols: res.columnCount });
          setError(null);
          if (res.data && res.data.length > 0) {
            setTableHeaders(Object.keys(res.data[0]));
            setTableData(res.data.slice(0, 50));
          }
        } else {
          setOutput("");
          setError(res.error);
          setStats(null);
        }
      }
    } catch (err) {
      setError(err.message);
      setOutput("");
      setStats(null);
    }
  }, [input, mode, delimiter, flatten, autoType]);

  const handleSwapMode = () => {
    const nextMode = mode === "json-to-csv" ? "csv-to-json" : "json-to-csv";
    setMode(nextMode);
    if (output) {
      setInput(output);
    } else {
      setInput(nextMode === "json-to-csv" ? SAMPLE_JSON : SAMPLE_CSV);
    }
  };

  const handleLoadSample = () => {
    setInput(mode === "json-to-csv" ? SAMPLE_JSON : SAMPLE_CSV);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setStats(null);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const isCsv = mode === "json-to-csv";
    const blob = new Blob([output], {
      type: isCsv ? "text/csv;charset=utf-8;" : "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = isCsv ? "export.csv" : "export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        if (file.name.endsWith(".json")) {
          setMode("json-to-csv");
        } else if (file.name.endsWith(".csv")) {
          setMode("csv-to-json");
        }
        setInput(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#18181b] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs">
        {/* Direction Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-[#27272a] rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode("json-to-csv")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === "json-to-csv"
                ? "bg-white dark:bg-[#18181b] shadow-xs text-neutral-900 dark:text-white font-semibold"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <FileJson className="w-3.5 h-3.5 text-amber-500" />
            JSON → CSV
          </button>
          <button
            type="button"
            onClick={() => setMode("csv-to-json")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === "csv-to-json"
                ? "bg-white dark:bg-[#18181b] shadow-xs text-neutral-900 dark:text-white font-semibold"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            CSV → JSON
          </button>
        </div>

        {/* Delimiter & Options */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span>Delimiter:</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="bg-neutral-100 dark:bg-[#27272a] border border-black/[0.06] dark:border-white/[0.06] rounded-lg px-2.5 py-1 text-xs font-mono text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-apple-blue/30"
              aria-label="CSV Delimiter"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="&#9;">Tab (\t)</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>

          {mode === "json-to-csv" ? (
            <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={flatten}
                onChange={(e) => setFlatten(e.target.checked)}
                className="rounded-sm border-neutral-300 text-apple-blue focus:ring-apple-blue/30"
              />
              <span>Flatten Objects</span>
            </label>
          ) : (
            <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoType}
                onChange={(e) => setAutoType(e.target.checked)}
                className="rounded-sm border-neutral-300 text-apple-blue focus:ring-apple-blue/30"
              />
              <span>Auto-detect Types</span>
            </label>
          )}

          <button
            type="button"
            onClick={handleSwapMode}
            className="p-1.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-[#27272a] transition-colors"
            title="Swap input & output direction"
            aria-label="Swap input & output direction"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Presets & Actions */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-neutral-700 dark:text-neutral-200 rounded-xl cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
            <input
              type="file"
              accept=".json,.csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3 py-1.5 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-neutral-700 dark:text-neutral-200 rounded-xl transition-colors"
          >
            Sample
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#27272a] transition-colors"
            title="Clear all"
            aria-label="Clear all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Dual Editor Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="flex flex-col rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#18181b] overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06] bg-neutral-50/60 dark:bg-black/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {mode === "json-to-csv" ? "JSON Input" : "CSV Input"}
              </span>
              {input && (
                <span className="text-[11px] text-neutral-400 font-mono">
                  {input.length.toLocaleString()} chars
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setInput("")}
              disabled={!input}
              className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 disabled:opacity-40 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="p-3 grow flex flex-col">
            <textarea
              id={inputId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "json-to-csv"
                  ? "Paste JSON array or object here (or click Sample / Upload)..."
                  : "Paste CSV text here (with header row)..."
              }
              className="w-full h-80 sm:h-96 p-3 font-mono text-xs md:text-sm bg-neutral-50/50 dark:bg-black/30 border border-black/[0.06] dark:border-white/[0.06] rounded-xl resize-none focus:outline-hidden focus:ring-2 focus:ring-apple-blue/30 text-neutral-900 dark:text-neutral-100"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#18181b] overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06] bg-neutral-50/60 dark:bg-black/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {mode === "json-to-csv" ? "CSV Output" : "JSON Output"}
              </span>
              {stats && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-mono font-medium">
                    {stats.rows} rows
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-mono font-medium">
                    {stats.cols} columns
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {tableData.length > 0 && (
                <button
                  type="button"
                  onClick={() => setViewTable(!viewTable)}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    viewTable
                      ? "bg-apple-blue text-white"
                      : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#27272a]"
                  }`}
                  title="Toggle table preview"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleCopy}
                disabled={!output}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#27272a] rounded-lg disabled:opacity-40 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!output}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-apple-blue hover:bg-apple-blue/90 text-white rounded-lg disabled:opacity-40 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="p-3 grow flex flex-col">
            {error ? (
              <div className="w-full h-80 sm:h-96 p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs md:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Conversion Error</p>
                  <p className="font-mono">{error}</p>
                </div>
              </div>
            ) : (
              <textarea
                id={outputId}
                value={output}
                readOnly
                placeholder="Converted result will appear here instantly..."
                className="w-full h-80 sm:h-96 p-3 font-mono text-xs md:text-sm bg-neutral-50/50 dark:bg-black/30 border border-black/[0.06] dark:border-white/[0.06] rounded-xl resize-none focus:outline-hidden text-neutral-900 dark:text-neutral-100"
                spellCheck="false"
              />
            )}
          </div>
        </div>
      </div>

      {/* Optional Table Preview */}
      {viewTable && tableData.length > 0 && (
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#18181b] overflow-hidden shadow-xs">
          <div className="px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-apple-blue" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-200">
                Tabular Preview ({tableData.length} preview rows)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setViewTable(false)}
              className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              Hide Table
            </button>
          </div>
          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100/70 dark:bg-[#27272a] text-neutral-600 dark:text-neutral-300 font-semibold sticky top-0">
                <tr>
                  <th className="px-3 py-2 border-b border-black/[0.06] dark:border-white/[0.06] w-12 text-center text-neutral-400">
                    #
                  </th>
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className="px-3 py-2 border-b border-black/[0.06] dark:border-white/[0.06] whitespace-nowrap font-mono"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04] font-mono text-neutral-700 dark:text-neutral-300">
                {tableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02]">
                    <td className="px-3 py-2 text-center text-neutral-400 text-[11px]">
                      {idx + 1}
                    </td>
                    {tableHeaders.map((header) => (
                      <td
                        key={header}
                        className="px-3 py-2 whitespace-nowrap max-w-xs truncate"
                        title={String(row[header] ?? "")}
                      >
                        {typeof row[header] === "boolean" ? (
                          <span
                            className={`px-1.5 py-0.5 rounded-sm text-[10px] font-semibold ${
                              row[header]
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                            }`}
                          >
                            {String(row[header])}
                          </span>
                        ) : (
                          String(row[header] ?? "")
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Privacy & Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#27272a]/40 border border-black/[0.04] dark:border-white/[0.04]">
          <h4 className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            100% Client-Side Privacy
          </h4>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Your data never leaves your browser. Parsing, unflattening, and CSV generation run strictly in local JavaScript memory.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#27272a]/40 border border-black/[0.04] dark:border-white/[0.04]">
          <h4 className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-apple-blue" />
            RFC 4180 Compliant
          </h4>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Handles escaped quotation marks, embedded commas, multiple delimiters, and CRLF newline standards reliably.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#27272a]/40 border border-black/[0.04] dark:border-white/[0.04]">
          <h4 className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5 text-purple-500" />
            Object Flattening & Type Casting
          </h4>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Automatically decomposes nested object properties into clean dot-notated columns and casts boolean/numeric CSV entries.
          </p>
        </div>
      </div>
    </div>
  );
}
