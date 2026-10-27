"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import { calculateAllHashes } from "@/tools/utility/hashGenerator.js";
import {
  Hash,
  Copy,
  Check,
  RotateCcw,
  Upload,
  Sparkles,
  ShieldCheck,
  FileCode,
} from "lucide-react";

export default function HashGeneratorWorkspace() {
  const [text, setText] = useState("Hello World!");
  const [uppercase, setUppercase] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [hashes, setHashes] = useState({
    md5: "",
    sha1: "",
    sha256: "",
    sha384: "",
    sha512: "",
  });
  const [fileInfo, setFileInfo] = useState(null);
  const fileInputRef = useRef(null);
  const textareaId = useId();

  // Recompute hashes
  useEffect(() => {
    let cancelled = false;

    async function runHash() {
      if (!text && !fileInfo) {
        setHashes({ md5: "", sha1: "", sha256: "", sha384: "", sha512: "" });
        return;
      }
      try {
        const inputData = fileInfo ? fileInfo.bytes : text;
        const res = await calculateAllHashes(inputData);
        if (!cancelled) {
          setHashes(res);
        }
      } catch (err) {
        console.error("Hashing failed:", err);
      }
    }

    runHash();
    return () => {
      cancelled = true;
    };
  }, [text, fileInfo]);

  const handleCopy = async (hashVal, key) => {
    if (!hashVal) return;
    const finalVal = uppercase ? hashVal.toUpperCase() : hashVal.toLowerCase();
    await navigator.clipboard.writeText(finalVal);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const bytes = new Uint8Array(reader.result);
      setFileInfo({
        name: file.name,
        size: file.size,
        bytes,
      });
      setText("");
    };
    reader.readAsArrayBuffer(file);
  };

  const clearFile = () => {
    setFileInfo(null);
    setText("Hello World!");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const HASH_CONFIGS = [
    { key: "md5", label: "MD5 (128-bit)", desc: "Fast legacy checksum" },
    { key: "sha1", label: "SHA-1 (160-bit)", desc: "Git & legacy integrity" },
    { key: "sha256", label: "SHA-256 (256-bit)", desc: "Standard high security (FIPS 180-4)" },
    { key: "sha384", label: "SHA-384 (384-bit)", desc: "NSA Suite B cryptographic hash" },
    { key: "sha512", label: "SHA-512 (512-bit)", desc: "Maximum 512-bit digest security" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Box */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-brand-600" />
            <label htmlFor={textareaId} className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {fileInfo ? "Uploaded File for Checksum" : "Text to Hash"}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Hash File
            </button>

            {fileInfo && (
              <button
                type="button"
                onClick={clearFile}
                className="text-xs font-medium text-rose-600 hover:underline px-2 py-1"
              >
                Clear File
              </button>
            )}

            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer ml-2">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-brand-600"
              />
              <span>UPPERCASE HEX</span>
            </label>
          </div>
        </div>

        {fileInfo ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{fileInfo.name}</p>
                <p className="text-xs text-slate-500">{(fileInfo.size / 1024).toFixed(1)} KB &bull; In-memory stream</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="text-xs text-slate-400 hover:text-rose-600 font-semibold"
            >
              Remove
            </button>
          </div>
        ) : (
          <textarea
            id={textareaId}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to compute cryptographic hashes..."
            rows={3}
            className="w-full p-3.5 rounded-xl border border-black/[0.08] text-slate-800 text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        )}
      </div>

      {/* Hash Results List */}
      <div className="space-y-3">
        {HASH_CONFIGS.map((cfg) => {
          const rawHash = hashes[cfg.key] || "";
          const displayHash = rawHash ? (uppercase ? rawHash.toUpperCase() : rawHash.toLowerCase()) : "—";
          const isCopied = copiedKey === cfg.key;

          return (
            <div
              key={cfg.key}
              className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-0.5 sm:w-1/3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{cfg.label}</span>
                </div>
                <p className="text-[11px] text-slate-400">{cfg.desc}</p>
              </div>

              <div className="flex-1 overflow-hidden">
                <span className="font-mono text-xs text-slate-800 break-all select-all block bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {displayHash}
                </span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleCopy(rawHash, cfg.key)}
                  disabled={!rawHash}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors disabled:opacity-30"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
