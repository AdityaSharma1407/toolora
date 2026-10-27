"use client";

import React, { useState, useId, useRef } from "react";
import {
  encodeBase64,
  decodeBase64,
  fileToBase64,
} from "@/tools/utility/base64Tool.js";
import {
  Binary,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  Download,
  Upload,
  AlertCircle,
  FileCode,
  Sparkles,
} from "lucide-react";

export default function Base64Workspace() {
  const [mode, setMode] = useState("encode"); // 'encode' | 'decode' | 'file'
  const [input, setInput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileResult, setFileResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const textareaId = useId();

  // Compute text output
  let output = "";
  let error = null;

  if (mode === "encode") {
    output = input ? encodeBase64(input, { urlSafe }) : "";
  } else if (mode === "decode") {
    if (input) {
      const res = decodeBase64(input);
      if (res.success) {
        output = res.output;
      } else {
        error = res.error;
      }
    }
  }

  const handleCopy = async (textToCopy) => {
    if (!textToCopy) return;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    if (mode === "file") return;
    setInput(output);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      const res = await fileToBase64(file);
      setFileResult(res);
    } catch (err) {
      console.error("File read error:", err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Mode Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMode("encode")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === "encode"
                ? "bg-brand-600 text-white shadow-subtle"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Encode Text
          </button>
          <button
            type="button"
            onClick={() => setMode("decode")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === "decode"
                ? "bg-brand-600 text-white shadow-subtle"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Decode Base64
          </button>
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === "file"
                ? "bg-brand-600 text-white shadow-subtle"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            File to Base64
          </button>
        </div>

        {mode === "encode" && (
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none pr-2">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>URL-Safe Base64 (- and _)</span>
          </label>
        )}
      </div>

      {/* Mode A & B: Text Encode / Decode */}
      {mode !== "file" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {/* Input Box */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <label htmlFor={textareaId} className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {mode === "encode" ? "Plain Text Input (UTF-8)" : "Base64 Input"}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInput(mode === "encode" ? "Hello World! 🚀 Unicode & Emojis supported." : "SGVsbG8gV29ybGQhIPCfmYAgVW5pY29kZSAmIEVtb2ppcyBzdXBwb3J0ZWQu")}
                    className="text-xs font-medium text-slate-600 hover:text-brand-600 px-2 py-1 rounded hover:bg-slate-50"
                  >
                    Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => setInput("")}
                    disabled={!input}
                    className="text-xs font-medium text-slate-400 hover:text-rose-600 px-2 py-1 rounded hover:bg-rose-50 disabled:opacity-30"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <textarea
                id={textareaId}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === "encode"
                    ? "Type or paste text to encode into Base64..."
                    : "Paste valid Base64 string to decode..."
                }
                rows={10}
                className="w-full flex-1 p-3.5 rounded-xl border border-black/[0.08] text-slate-800 text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-y"
              />

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>{input.length} characters</span>
                <button
                  type="button"
                  onClick={handleSwap}
                  disabled={!output}
                  className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-40"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Swap Direction
                </button>
              </div>
            </div>

            {/* Output Box */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {mode === "encode" ? "Base64 Output" : "Decoded Text"}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(output)}
                  disabled={!output}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Output"}
                </button>
              </div>

              {error ? (
                <div className="p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              ) : (
                <textarea
                  readOnly
                  value={output}
                  placeholder="Processed output will display here..."
                  rows={10}
                  className="w-full flex-1 p-3.5 rounded-xl border border-black/[0.08] bg-slate-50/70 text-slate-900 font-mono text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none resize-y break-all"
                />
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>{output.length} characters</span>
                <span className="text-emerald-600 font-medium">100% Client-side</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode C: File to Base64 */
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-6 sm:p-8 space-y-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files?.[0])}
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-brand-500 bg-brand-50/50"
                : "border-slate-300 hover:border-brand-400 bg-slate-50/50"
            }`}
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-900">
              Drop any image, icon, or file here to convert to Base64
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Supports PNG, JPG, SVG, WebP, PDF, fonts, and binaries up to 25MB.
            </p>
          </div>

          {fileResult && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{fileResult.filename}</h4>
                  <p className="text-xs text-slate-500">
                    {fileResult.mimeType} &bull; {(fileResult.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(fileResult.dataUrl)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Data URL
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(fileResult.base64)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Raw Base64
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                value={fileResult.dataUrl}
                rows={6}
                className="w-full p-3 rounded-xl border border-black/[0.08] bg-slate-50 text-slate-800 font-mono text-xs resize-y break-all"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
