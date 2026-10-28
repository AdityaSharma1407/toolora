"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import {
  Film,
  Download,
  AlertCircle,
  CheckCircle2,
  Upload,
  Play,
  Settings2,
  Sparkles,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { encodeGif } from "@/tools/media/gifEncode.js";
import { calculateScaledVideoDimensions } from "@/tools/media/videoCompress.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

export default function VideoToGifWorkspace() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);

  // Settings
  const [fps, setFps] = useState(10);
  const [maxDuration, setMaxDuration] = useState(3); // seconds
  const [resolution, setResolution] = useState(360); // 360p
  const [startTime, setStartTime] = useState(0);

  // State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputId = useId();

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (result?.url) URL.revokeObjectURL(result.url);
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

  const handleConvert = async () => {
    if (!file || !videoRef.current) {
      setErrorMessage("Please choose a video file first.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setErrorMessage(null);

    try {
      const video = videoRef.current;
      video.pause();

      const origW = video.videoWidth || 640;
      const origH = video.videoHeight || 360;
      const { width: targetW, height: targetH } = calculateScaledVideoDimensions(origW, origH, resolution);

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      const totalFrames = Math.max(2, Math.floor(maxDuration * fps));
      const interval = 1 / fps;
      const delayMs = Math.round(1000 / fps);
      const frames = [];

      for (let i = 0; i < totalFrames; i++) {
        const targetTime = startTime + i * interval;
        if (targetTime >= video.duration) break;

        video.currentTime = targetTime;

        // Wait for seeked event
        await new Promise((resolve) => {
          const onSeeked = () => {
            video.removeEventListener("seeked", onSeeked);
            resolve();
          };
          video.addEventListener("seeked", onSeeked);
        });

        // Draw frame onto scaled canvas
        ctx.drawImage(video, 0, 0, targetW, targetH);
        const imgData = ctx.getImageData(0, 0, targetW, targetH);

        frames.push({
          data: imgData.data,
          width: targetW,
          height: targetH,
          delayMs,
        });

        setProgress(Math.round(((i + 1) / totalFrames) * 100));
      }

      if (frames.length === 0) {
        throw new Error("Could not extract frames from video.");
      }

      // Encode into GIF89a binary
      const gifBytes = encodeGif(frames, 0);
      const blob = new Blob([gifBytes], { type: "image/gif" });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const filename = `${baseName}.gif`;

      setResult({
        url,
        filename,
        width: targetW,
        height: targetH,
        framesCount: frames.length,
        size: blob.size,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to convert video to animated GIF.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
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
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 rounded-2xl p-10 text-center bg-gray-50/50 dark:bg-gray-950/50"
          >
            <Film className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Drag and drop your video (MP4, WebM, MOV)
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Extract looping animated GIFs with zero cloud uploads
            </p>
            <input
              id={fileInputId}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />
            <label htmlFor={fileInputId}>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" /> Choose Video File
              </span>
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
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
                    Original size: {formatBytes(file.size)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <label className="text-xs font-semibold text-gray-900 dark:text-white block mb-1">
                      Frame Rate (FPS)
                    </label>
                    <select
                      value={fps}
                      onChange={(e) => setFps(Number(e.target.value))}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <option value={5}>5 FPS (Compact)</option>
                      <option value={10}>10 FPS (Balanced)</option>
                      <option value={15}>15 FPS (Smooth)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-900 dark:text-white block mb-1">
                      Max Duration
                    </label>
                    <select
                      value={maxDuration}
                      onChange={(e) => setMaxDuration(Number(e.target.value))}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <option value={2}>2 Seconds</option>
                      <option value={3}>3 Seconds</option>
                      <option value={5}>5 Seconds</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-900 dark:text-white block mb-1">
                      Resolution
                    </label>
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(Number(e.target.value))}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <option value={480}>480p SD</option>
                      <option value={360}>360p (Recommended)</option>
                      <option value={240}>240p (Small Size)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-900 dark:text-white block mb-1">
                      Start Time (s)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={startTime}
                      onChange={(e) => setStartTime(Math.max(0, Number(e.target.value)))}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    />
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
                    Change Video
                  </button>
                  <PrimaryButton
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="flex-1 py-2.5"
                  >
                    {isProcessing ? `Rendering GIF (${progress}%)...` : "Convert to GIF"}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.url}
                alt="Animated GIF preview"
                loading="lazy"
                decoding="async"
                className="w-16 h-16 rounded-xl object-cover border border-emerald-300 dark:border-emerald-700 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    GIF Created Successfully!
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {result.width} × {result.height} px • {result.framesCount} frames • {formatBytes(result.size)}
                </p>
              </div>
            </div>

            <a
              href={result.url}
              download={result.filename}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 shadow-sm hover:shadow transition"
            >
              <Download className="w-4 h-4" /> Download Animated GIF
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
