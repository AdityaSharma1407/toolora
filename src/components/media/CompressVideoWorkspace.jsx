"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import {
  Minimize2,
  Video,
  Download,
  AlertCircle,
  CheckCircle2,
  Upload,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import {
  VIDEO_RESOLUTION_PRESETS,
  BITRATE_PRESETS,
  calculateScaledVideoDimensions,
  estimateCompressedFileSize,
} from "@/tools/media/videoCompress.js";
import { formatTimecode } from "@/tools/media/audioEncode.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

export default function CompressVideoWorkspace() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Settings
  const [resolutionId, setResolutionId] = useState("720p");
  const [bitrateId, setBitrateId] = useState("medium");

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
      setDuration(videoRef.current.duration || 10);
      setDimensions({
        width: videoRef.current.videoWidth || 1280,
        height: videoRef.current.videoHeight || 720,
      });
    }
  };

  const handleCompress = async () => {
    if (!file || !videoRef.current) return;
    setIsProcessing(true);
    setProgress(0);
    setErrorMessage(null);

    try {
      const video = videoRef.current;
      video.pause();

      const preset = VIDEO_RESOLUTION_PRESETS.find((p) => p.id === resolutionId);
      const { width: targetW, height: targetH } = calculateScaledVideoDimensions(
        dimensions.width,
        dimensions.height,
        preset?.maxDimension || null
      );

      const bitrateConfig = BITRATE_PRESETS[bitrateId] || BITRATE_PRESETS.medium;
      const videoBitsPerSecond = bitrateConfig.videoBits;

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");

      // Set up capture stream from canvas & audio from video
      const stream = canvas.captureStream(30);

      // Try capturing audio from video
      try {
        const videoStream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
        const audioTracks = videoStream.getAudioTracks();
        if (audioTracks.length > 0) {
          stream.addTrack(audioTracks[0]);
        }
      } catch {
        // Fallback without audio if cross-origin or unsupported
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond,
      });

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const recordPromise = new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          resolve(blob);
        };
      });

      video.currentTime = 0;
      await new Promise((res) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          res();
        };
        video.addEventListener("seeked", onSeeked);
      });

      mediaRecorder.start();
      await video.play();

      // Render frames to canvas during playback
      let animId;
      const renderFrame = () => {
        if (!video.paused && !video.ended) {
          ctx.drawImage(video, 0, 0, targetW, targetH);
          const pct = Math.round((video.currentTime / duration) * 100);
          setProgress(Math.max(0, Math.min(100, pct)));
          animId = requestAnimationFrame(renderFrame);
        } else {
          cancelAnimationFrame(animId);
          if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
        }
      };
      animId = requestAnimationFrame(renderFrame);

      video.onended = () => {
        cancelAnimationFrame(animId);
        if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
      };

      const compressedBlob = await recordPromise;
      const url = URL.createObjectURL(compressedBlob);
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const filename = `${baseName}-compressed.webm`;

      setResult({
        url,
        filename,
        originalSize: file.size,
        size: compressedBlob.size,
        width: targetW,
        height: targetH,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to compress video. Browser MediaRecorder error.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const selectedPreset = VIDEO_RESOLUTION_PRESETS.find((p) => p.id === resolutionId);
  const selectedBitrate = BITRATE_PRESETS[bitrateId] || BITRATE_PRESETS.medium;
  const estimatedBytes = duration > 0 ? estimateCompressedFileSize(duration, selectedBitrate.videoBits) : 0;

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
            <Minimize2 className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Drag and drop your video file (MP4, WebM, MOV)
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Reduce file sizes by up to 70% with intelligent dimension and bitrate scaling
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
                    Original: {dimensions.width}×{dimensions.height} px • {formatTimecode(duration)} • {formatBytes(file.size)}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <label className="text-xs font-semibold text-gray-900 dark:text-white block mb-1">
                      Target Resolution
                    </label>
                    <select
                      value={resolutionId}
                      onChange={(e) => setResolutionId(e.target.value)}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {VIDEO_RESOLUTION_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-900 dark:text-white block mb-1">
                      Compression Strength
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {Object.entries(BITRATE_PRESETS).map(([id, p]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setBitrateId(id)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition ${
                            bitrateId === id
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                              : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {id === "low" ? "Maximum" : id === "medium" ? "Balanced" : "High Quality"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {estimatedBytes > 0 && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Estimated output size: ~{formatBytes(estimatedBytes)}
                    </p>
                  )}
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
                    onClick={handleCompress}
                    disabled={isProcessing}
                    className="flex-1 py-2.5"
                  >
                    {isProcessing ? `Compressing (${progress}%)...` : "Compress Video"}
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
                <Minimize2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    Video Compressed!
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {formatBytes(result.originalSize)} → {formatBytes(result.size)} ({Math.round((1 - result.size / result.originalSize) * 100)}% smaller) • {result.width}×{result.height} px
                </p>
              </div>
            </div>

            <a
              href={result.url}
              download={result.filename}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 shadow-sm hover:shadow transition"
            >
              <Download className="w-4 h-4" /> Download Compressed Video
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
