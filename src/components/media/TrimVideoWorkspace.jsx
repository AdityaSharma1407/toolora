"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import {
  Scissors,
  Film,
  Download,
  AlertCircle,
  CheckCircle2,
  Upload,
  Play,
  Pause,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import { formatTimecode } from "@/tools/media/audioEncode.js";
import { validateTrimBounds } from "@/tools/media/videoTrim.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

export default function TrimVideoWorkspace() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [duration, setDuration] = useState(0);

  // Trim times
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const videoRef = useRef(null);
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

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 10;
      setDuration(dur);
      setStartTime(0);
      setEndTime(Math.min(dur, Math.max(1, Math.round(dur * 0.7))));
    }
  };

  const handleTrim = async () => {
    if (!file || !videoRef.current) return;
    setIsProcessing(true);
    setProgress(0);
    setErrorMessage(null);

    try {
      const video = videoRef.current;
      const { start, end, trimDuration } = validateTrimBounds(startTime, endTime, duration);

      video.pause();
      video.currentTime = start;

      // Use MediaRecorder on video captureStream
      const stream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
      let mimeType = "video/webm";
      if (typeof MediaRecorder !== "undefined" && typeof MediaRecorder.isTypeSupported === "function") {
        if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")) {
          mimeType = "video/mp4;codecs=avc1";
        } else if (MediaRecorder.isTypeSupported("video/mp4")) {
          mimeType = "video/mp4";
        } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
          mimeType = "video/webm;codecs=vp9";
        } else if (MediaRecorder.isTypeSupported("video/webm")) {
          mimeType = "video/webm";
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const recordPromise = new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          const blobType = mimeType.split(";")[0] || "video/webm";
          const blob = new Blob(chunks, { type: blobType });
          resolve(blob);
        };
      });

      // Seek to start and play while recording
      video.currentTime = start;
      await new Promise((res) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          res();
        };
        video.addEventListener("seeked", onSeeked);
      });

      mediaRecorder.start();
      await video.play();

      // Monitor playback until end time reached
      const checkInterval = setInterval(() => {
        if (video.currentTime >= end || video.paused || video.ended) {
          clearInterval(checkInterval);
          video.pause();
          mediaRecorder.stop();
        } else {
          const pct = Math.round(((video.currentTime - start) / trimDuration) * 100);
          setProgress(Math.max(0, Math.min(100, pct)));
        }
      }, 50);

      const trimmedBlob = await recordPromise;
      const url = URL.createObjectURL(trimmedBlob);
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      const filename = `${baseName}-trimmed.${ext}`;

      setResult({
        url,
        filename,
        duration: trimDuration,
        size: trimmedBlob.size,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to trim video. Browser recording permission or codec issue.");
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
            <Scissors className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Drag and drop your video file (MP4, WebM, MOV)
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Cut out unwanted segments and adjust start and end points in your browser
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
                  onLoadedMetadata={handleLoadedMetadata}
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
                    Original Duration: {formatTimecode(duration)} • {formatBytes(file.size)}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Start Time</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatTimecode(startTime, true)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={duration || 10}
                      step="0.1"
                      value={startTime}
                      onChange={(e) => setStartTime(Math.min(Number(e.target.value), endTime - 0.2))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">End Time</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatTimecode(endTime, true)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={duration || 10}
                      step="0.1"
                      value={endTime}
                      onChange={(e) => setEndTime(Math.max(Number(e.target.value), startTime + 0.2))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Trimmed clip duration: {formatTimecode(Math.max(0, endTime - startTime), true)}
                  </p>
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
                    onClick={handleTrim}
                    disabled={isProcessing}
                    className="flex-1 py-2.5"
                  >
                    {isProcessing ? `Trimming Clip (${progress}%)...` : "Trim Video"}
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
                <Scissors className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    Video Trimmed Successfully!
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {formatTimecode(result.duration)} duration • {formatBytes(result.size)}
                </p>
              </div>
            </div>

            <a
              href={result.url}
              download={result.filename}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 shadow-sm hover:shadow transition"
            >
              <Download className="w-4 h-4" /> Download Trimmed Video
            </a>
          </div>

          <div className="pt-2">
            <video src={result.url} controls className="w-full max-h-64 rounded-xl bg-black" />
          </div>
        </div>
      )}
    </div>
  );
}
