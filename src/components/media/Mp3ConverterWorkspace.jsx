"use client";

import React, { useState, useEffect, useId } from "react";
import {
  Music,
  Headphones,
  Download,
  AlertCircle,
  CheckCircle2,
  Upload,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { extractAudioFromMedia } from "@/tools/media/audioExtract.js";
import { formatTimecode } from "@/tools/media/audioEncode.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

export default function Mp3ConverterWorkspace() {
  const [file, setFile] = useState(null);
  const [channels, setChannels] = useState("stereo");
  const [sampleRate, setSampleRate] = useState(44100);

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputId = useId();

  useEffect(() => {
    return () => {
      if (result?.dataUrl) URL.revokeObjectURL(result.dataUrl);
    };
  }, [result]);

  const handleFileUpload = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setErrorMessage(null);
    setResult(null);
  };

  const handleConvert = async () => {
    if (!file) {
      setErrorMessage("Please choose an audio file first.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await extractAudioFromMedia(file, {
        channels,
        sampleRate: Number(sampleRate),
      });

      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const filename = `${baseName}-converted.wav`;

      setResult({
        ...res,
        filename,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to convert audio file.");
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
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-500 rounded-2xl p-10 text-center bg-gray-50/50 dark:bg-gray-950/50"
        >
          <Headphones className="w-10 h-10 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {file ? file.name : "Drag and drop your audio file (WAV, OGG, AAC, M4A, FLAC, WebM)"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Converts audio formats into studio-fidelity universal 16-bit uncompressed audio directly in browser memory
          </p>
          <input
            id={fileInputId}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
          <label htmlFor={fileInputId}>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 text-white font-medium text-xs hover:bg-purple-700 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" /> Choose Audio File
            </span>
          </label>
        </div>

        {file && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-sm">
                {file.name}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Source size: {formatBytes(file.size)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={channels}
                onChange={(e) => setChannels(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                <option value="stereo">Stereo (2 Ch)</option>
                <option value="mono">Mono (1 Ch)</option>
              </select>

              <select
                value={sampleRate}
                onChange={(e) => setSampleRate(Number(e.target.value))}
                className="text-xs py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                <option value={44100}>44.1 kHz</option>
                <option value={48000}>48 kHz</option>
              </select>

              <PrimaryButton
                onClick={handleConvert}
                disabled={isProcessing}
                className="py-2 px-6 bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? "Converting..." : "Convert Audio"}
              </PrimaryButton>
            </div>
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
        <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 shadow-sm animate-in fade-in duration-300 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    Audio Converted!
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {formatTimecode(result.duration)} • {result.channels === 2 ? "Stereo" : "Mono"} • {result.sampleRate} Hz • {formatBytes(result.size)}
                </p>
              </div>
            </div>

            <a
              href={result.dataUrl}
              download={result.filename}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 shadow-sm hover:shadow transition"
            >
              <Download className="w-4 h-4" /> Download Universal Audio
            </a>
          </div>

          <div className="pt-2">
            <audio src={result.dataUrl} controls className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
