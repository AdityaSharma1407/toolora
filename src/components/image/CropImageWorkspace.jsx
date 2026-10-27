"use client";

import React, { useState, useEffect, useRef, useCallback, useId } from "react";
import {
  Crop as CropIcon,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Download,
  AlertCircle,
  Undo2,
  CheckCircle2,
  Sparkles,
  Upload,
  Maximize2,
  Layers,
} from "lucide-react";
import PrimaryButton from "../common/PrimaryButton";
import {
  ASPECT_RATIO_PRESETS,
  calculateInitialCrop,
  clampCropRect,
  cropImage,
} from "@/tools/image/imageCrop.js";
import { getImageMetadata } from "@/tools/image/imageResize.js";
import { formatBytes } from "@/tools/pdf/validatePdf.js";

export default function CropImageWorkspace() {
  const [file, setFile] = useState(null);
  const [meta, setMeta] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Natural image dimensions
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);

  // Active crop rectangle in natural image pixels: { x, y, width, height }
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [selectedRatioId, setSelectedRatioId] = useState("free");

  // Transformations
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // Output settings
  const [outputFormat, setOutputFormat] = useState("image/png");
  const [quality, setQuality] = useState(92);

  // Container sizing & scale tracking
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Interaction / Drag state
  const dragRef = useRef(null);

  // Processing & result
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputId = useId();

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [previewUrl, result]);

  // Recalculate displayed size on resize
  const updateDisplaySize = useCallback(() => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setDisplaySize({ width: rect.width, height: rect.height });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateDisplaySize);
    return () => window.removeEventListener("resize", updateDisplaySize);
  }, [updateDisplaySize]);

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file (PNG, JPG, WebP, SVG, etc.).");
      return;
    }
    setErrorMessage(null);
    setResult(null);

    try {
      const metadata = await getImageMetadata(selectedFile);
      setFile(selectedFile);
      setMeta(metadata);
      setNaturalWidth(metadata.width);
      setNaturalHeight(metadata.height);

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      // Default freeform crop box (85% centered)
      const initial = calculateInitialCrop(metadata.width, metadata.height, null);
      setCropRect(initial);
      setSelectedRatioId("free");
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
    } catch (err) {
      setErrorMessage(err.message || "Failed to read image file.");
    }
  };

  const handleRatioSelect = (preset) => {
    setSelectedRatioId(preset.id);
    if (!naturalWidth || !naturalHeight) return;
    const nextCrop = calculateInitialCrop(naturalWidth, naturalHeight, preset.ratio);
    setCropRect(nextCrop);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    if (!naturalWidth || !naturalHeight) return;
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setSelectedRatioId("free");
    setCropRect(calculateInitialCrop(naturalWidth, naturalHeight, null));
  };

  // Drag handling
  const getScale = () => {
    if (!displaySize.width || !naturalWidth) return 1;
    return naturalWidth / displaySize.width;
  };

  const handlePointerDown = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    dragRef.current = {
      mode,
      startX: clientX,
      startY: clientY,
      startRect: { ...cropRect },
      ratio: ASPECT_RATIO_PRESETS.find((p) => p.id === selectedRatioId)?.ratio || null,
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current) return;
    if (e.cancelable) e.preventDefault();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const { mode, startX, startY, startRect, ratio } = dragRef.current;
    const scale = getScale();

    const deltaX = (clientX - startX) * scale;
    const deltaY = (clientY - startY) * scale;

    let { x, y, width, height } = startRect;

    if (mode === "move") {
      x = Math.max(0, Math.min(naturalWidth - width, Math.round(startRect.x + deltaX)));
      y = Math.max(0, Math.min(naturalHeight - height, Math.round(startRect.y + deltaY)));
    } else {
      // Handle resizing modes
      if (mode.includes("e")) {
        width = Math.max(20, Math.min(naturalWidth - x, Math.round(startRect.width + deltaX)));
        if (ratio) height = Math.round(width / ratio);
      }
      if (mode.includes("s")) {
        height = Math.max(20, Math.min(naturalHeight - y, Math.round(startRect.height + deltaY)));
        if (ratio) width = Math.round(height * ratio);
      }
      if (mode.includes("w")) {
        const potentialW = Math.max(20, Math.round(startRect.width - deltaX));
        const maxAllowed = startRect.x + startRect.width;
        width = Math.min(maxAllowed, potentialW);
        x = startRect.x + (startRect.width - width);
        if (ratio) height = Math.round(width / ratio);
      }
      if (mode.includes("n")) {
        const potentialH = Math.max(20, Math.round(startRect.height - deltaY));
        const maxAllowed = startRect.y + startRect.height;
        height = Math.min(maxAllowed, potentialH);
        y = startRect.y + (startRect.height - height);
        if (ratio) width = Math.round(height * ratio);
      }
    }

    const clamped = clampCropRect({ x, y, width, height }, naturalWidth, naturalHeight);
    setCropRect(clamped);
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    window.removeEventListener("mousemove", handlePointerMove);
    window.removeEventListener("mouseup", handlePointerUp);
    window.removeEventListener("touchmove", handlePointerMove);
    window.removeEventListener("touchend", handlePointerUp);
  };

  const handleExecuteCrop = async () => {
    if (!file || !meta) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const cropped = await cropImage(file, cropRect, {
        format: outputFormat,
        quality: quality / 100,
        flipHorizontal: flipH,
        flipVertical: flipV,
        rotation,
      });

      const url = URL.createObjectURL(cropped.blob);
      const ext = outputFormat === "image/jpeg" ? "jpg" : outputFormat === "image/webp" ? "webp" : "png";
      const baseName = meta.name ? meta.name.replace(/\.[^/.]+$/, "") : "image";
      const filename = `${baseName}-cropped.${ext}`;

      setResult({
        ...cropped,
        url,
        filename,
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to crop image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Compute CSS coordinates for displayed crop box
  const scale = displaySize.width > 0 && naturalWidth > 0 ? displaySize.width / naturalWidth : 1;
  const boxLeft = cropRect.x * scale;
  const boxTop = cropRect.y * scale;
  const boxWidth = cropRect.width * scale;
  const boxHeight = cropRect.height * scale;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Upload Dropzone */}
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-3xl p-10 md:p-14 text-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-200"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Upload an image to crop
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Drag and drop your photo here or browse your device. PNG, JPG, WebP, SVG, and AVIF supported.
          </p>

          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
          />
          <label htmlFor={fileInputId}>
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition cursor-pointer shadow-sm hover:shadow">
              <CropIcon className="w-4 h-4" /> Choose Image
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Bar with File details & Change image */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <CropIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs md:max-w-md">
                  {meta?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Original: {meta?.width} × {meta?.height} px ({formatBytes(meta?.size || 0)})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Undo2 className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setMeta(null);
                  setResult(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Change Image
              </button>
            </div>
          </div>

          {/* Interactive Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cropper Viewport (Col 1 & 2) */}
            <div className="lg:col-span-2 bg-gray-950 rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[420px] shadow-inner relative overflow-hidden select-none">
              <div
                ref={containerRef}
                className="relative inline-block max-w-full max-h-[500px]"
                style={{
                  transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                  transition: "transform 0.2s ease",
                }}
              >
                {/* Visual Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="Crop preview"
                  onLoad={updateDisplaySize}
                  className="max-h-[500px] w-auto max-w-full object-contain pointer-events-none block rounded-lg"
                  draggable={false}
                />

                {/* Crop Box Overlay with Box Shadow Backdrop */}
                {displaySize.width > 0 && (
                  <div
                    style={{
                      left: `${boxLeft}px`,
                      top: `${boxTop}px`,
                      width: `${boxWidth}px`,
                      height: `${boxHeight}px`,
                      boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.65)",
                    }}
                    onMouseDown={(e) => handlePointerDown(e, "move")}
                    onTouchStart={(e) => handlePointerDown(e, "move")}
                    className="absolute border-2 border-white cursor-move z-10 touch-none"
                  >
                    {/* Rule of Thirds Grid Guidelines */}
                    <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-white" />
                      <div className="border-r border-white" />
                      <div />
                    </div>

                    {/* Dimensions Pill inside Crop Box */}
                    <div className="absolute bottom-1 right-1 pointer-events-none bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white px-1.5 py-0.5 rounded shadow">
                      {cropRect.width} × {cropRect.height}
                    </div>

                    {/* Corner Handles */}
                    {/* Top-Left */}
                    <div
                      onMouseDown={(e) => handlePointerDown(e, "nw")}
                      onTouchStart={(e) => handlePointerDown(e, "nw")}
                      className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border border-blue-600 rounded-sm cursor-nwse-resize shadow touch-none"
                    />
                    {/* Top-Right */}
                    <div
                      onMouseDown={(e) => handlePointerDown(e, "ne")}
                      onTouchStart={(e) => handlePointerDown(e, "ne")}
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border border-blue-600 rounded-sm cursor-nesw-resize shadow touch-none"
                    />
                    {/* Bottom-Left */}
                    <div
                      onMouseDown={(e) => handlePointerDown(e, "sw")}
                      onTouchStart={(e) => handlePointerDown(e, "sw")}
                      className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border border-blue-600 rounded-sm cursor-nesw-resize shadow touch-none"
                    />
                    {/* Bottom-Right */}
                    <div
                      onMouseDown={(e) => handlePointerDown(e, "se")}
                      onTouchStart={(e) => handlePointerDown(e, "se")}
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border border-blue-600 rounded-sm cursor-nwse-resize shadow touch-none"
                    />

                    {/* Edge Handles */}
                    <div
                      onMouseDown={(e) => handlePointerDown(e, "n")}
                      onTouchStart={(e) => handlePointerDown(e, "n")}
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border border-blue-600 rounded-sm cursor-ns-resize shadow touch-none"
                    />
                    <div
                      onMouseDown={(e) => handlePointerDown(e, "s")}
                      onTouchStart={(e) => handlePointerDown(e, "s")}
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border border-blue-600 rounded-sm cursor-ns-resize shadow touch-none"
                    />
                    <div
                      onMouseDown={(e) => handlePointerDown(e, "w")}
                      onTouchStart={(e) => handlePointerDown(e, "w")}
                      className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-4 bg-white border border-blue-600 rounded-sm cursor-ew-resize shadow touch-none"
                    />
                    <div
                      onMouseDown={(e) => handlePointerDown(e, "e")}
                      onTouchStart={(e) => handlePointerDown(e, "e")}
                      className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-4 bg-white border border-blue-600 rounded-sm cursor-ew-resize shadow touch-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Controls Panel (Col 3) */}
            <div className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CropIcon className="w-4 h-4 text-blue-600" /> Aspect Ratio
              </h3>

              {/* Ratio Presets Grid */}
              <div className="grid grid-cols-2 gap-2">
                {ASPECT_RATIO_PRESETS.map((preset) => {
                  const isActive = selectedRatioId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleRatioSelect(preset)}
                      className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                        isActive
                          ? "border-blue-600 bg-blue-50/70 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold shadow-xs"
                          : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="font-medium">{preset.label}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                        {preset.description}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Transform Controls */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <label className="text-xs font-semibold text-gray-900 dark:text-white block mb-2.5">
                  Orientation & Flip
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    title="Rotate 90 degrees clockwise"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> 90°
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlipH((prev) => !prev)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition ${
                      flipH
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                        : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    title="Flip horizontally"
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" /> Flip H
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlipV((prev) => !prev)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition ${
                      flipV
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                        : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    title="Flip vertically"
                  >
                    <FlipVertical className="w-3.5 h-3.5" /> Flip V
                  </button>
                </div>
              </div>

              {/* Output Format & Quality */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-900 dark:text-white block mb-1.5">
                    Save Format
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "image/png", label: "PNG" },
                      { id: "image/jpeg", label: "JPG" },
                      { id: "image/webp", label: "WebP" },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setOutputFormat(fmt.id)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition ${
                          outputFormat === fmt.id
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {outputFormat !== "image/png" && (
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Quality</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <PrimaryButton
                  onClick={handleExecuteCrop}
                  disabled={isProcessing}
                  className="w-full py-3"
                >
                  {isProcessing ? (
                    "Cropping..."
                  ) : (
                    <span className="inline-flex items-center justify-center gap-2">
                      <CropIcon className="w-4 h-4" /> Crop Image
                    </span>
                  )}
                </PrimaryButton>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Results Download Card */}
          {result && (
            <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 shadow-sm animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.url}
                    alt="Cropped output"
                    className="w-16 h-16 rounded-xl object-cover border border-emerald-300 dark:border-emerald-700 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                        Cropped Successfully!
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                      {result.width} × {result.height} px • {formatBytes(result.size)}
                    </p>
                  </div>
                </div>

                <a
                  href={result.url}
                  download={result.filename}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 shadow-sm hover:shadow transition"
                >
                  <Download className="w-4 h-4" /> Download Cropped Image
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
