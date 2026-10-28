"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import {
  Music,
  Video,
  Download,
  AlertCircle,
  CheckCircle2,
  Upload,
  Play,
  Pause,
  Sliders,
  Volume2,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { extractAudioFromMedia } from "@/tools/media/audioExtract.js";
import { formatTimecode } from "@/tools/media/audioEncode.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

export default function ExtractAudioWorkspace() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  // Settings
  const [channels, setChannels] = useState("stereo");
  const [sampleRate, setSampleRate] = useState(44100);

  // Processing & result
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputId = useId();

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (result?.dataUrl) URL.revokeObjectURL(result.dataUrl);
    };
  }, [videoUrl, result]);

  const handleFileUpload = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setErrorMessage(null);
    setResult(null);

    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(selectedFile);
    setVideoUrl(url);
  };

  const handleExtract = async () => {
    if (!file) {
      setErrorMessage("Please choose a video or audio file first.");
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
      const filename = `${baseName}.wav`;

      setResult({
        ...res,
        filename,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to extract audio track. Ensure the video contains an audio stream.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
        {!file ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-500 rounded-2xl p-10 text-center bg-gray-50/50 dark:bg-gray-950/50"
          >
            <Music className="w-10 h-10 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Drag and drop your video file (MP4, WebM, MOV, MKV)
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Extract pristine studio-quality uncompressed WAV audio directly in browser RAM
            </p>
            <input
              id={fileInputId}
              type="file"
              accept="video/*,audio/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />
            <label htmlFor={fileInputId}>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 text-white font-medium text-xs hover:bg-purple-700 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" /> Choose Video File
              </span>
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Video Preview & File Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {file.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Source size: {formatBytes(file.size)}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <label className="text-xs font-semibold text-gray-900 dark:text-white block mb-1.5">
                      Audio Channels
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "stereo", label: "Stereo (2 Channels)" },
                        { id: "mono", label: "Mono (1 Channel)" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setChannels(opt.id)}
                          className={`py-1.5 px-3 rounded-xl text-xs font-medium border text-center transition ${
                            channels === opt.id
                              ? "border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                              : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-900 dark:text-white block mb-1.5">
                      Sample Rate
                    </label>
                    <select
                      value={sampleRate}
                      onChange={(e) => setSampleRate(Number(e.target.value))}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <option value={44100}>44,100 Hz (Studio / CD Quality)</option>
                      <option value={48000}>48,000 Hz (Broadcast / Video Quality)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setVideoUrl(null);
                      setResult(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Change File
                  </button>
                  <PrimaryButton
                    onClick={handleExtract}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700"
                  >
                    {isProcessing ? "Decoding & Extracting..." : "Extract Audio Track"}
                  </PrimaryButton>
                </div>
              </div>
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
                    Audio Extracted Successfully!
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
              <Download className="w-4 h-4" /> Download WAV Audio
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
