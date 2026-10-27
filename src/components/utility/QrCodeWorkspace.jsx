"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  generateQrSvg,
  formatWifiString,
  formatVCardString,
  QRErrorCorrectLevel,
} from "@/tools/utility/qrCodeGenerator.js";
import {
  QrCode,
  Link as LinkIcon,
  Wifi,
  Contact,
  FileText,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function QrCodeWorkspace() {
  const [tab, setTab] = useState("url"); // 'url' | 'text' | 'wifi' | 'vcard'
  const [url, setUrl] = useState("https://www.bitsandtools.com");
  const [text, setText] = useState("Hello from Bits & Tools!");

  // WiFi state
  const [wifiSsid, setWifiSsid] = useState("MyHomeNetwork");
  const [wifiPass, setWifiPass] = useState("SuperSecret123");
  const [wifiEnc, setWifiEnc] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard state
  const [vcardName, setVcardName] = useState("Aditya Sharma");
  const [vcardPhone, setVcardPhone] = useState("+1 555-0199");
  const [vcardEmail, setVcardEmail] = useState("contact@example.com");
  const [vcardOrg, setVcardOrg] = useState("Bits & Tools");

  // Customization
  const [colorDark, setColorDark] = useState("#0f172a");
  const [colorLight, setColorLight] = useState("#ffffff");
  const [size, setSize] = useState(280);
  const [ecLevel, setEcLevel] = useState(QRErrorCorrectLevel.M);
  const [copied, setCopied] = useState(false);

  // Derive QR content string
  let qrContent = url;
  if (tab === "text") qrContent = text;
  else if (tab === "wifi") qrContent = formatWifiString({ ssid: wifiSsid, password: wifiPass, encryption: wifiEnc, hidden: wifiHidden });
  else if (tab === "vcard") qrContent = formatVCardString({ name: vcardName, phone: vcardPhone, email: vcardEmail, org: vcardOrg });

  // Generate SVG
  const svgMarkup = generateQrSvg(qrContent, {
    colorDark,
    colorLight,
    size,
    ecLevel,
  });

  const handleDownloadSvg = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "qrcode.svg";
    link.click();
    URL.revokeObjectURL(blobUrl);
  };

  const handleDownloadPng = () => {
    if (!svgMarkup) return;
    const img = new Image();
    const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const URLObject = window.URL || window.webkitURL || window;
    const blobURL = URLObject.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size * 2; // high-dpi
      canvas.height = size * 2;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URLObject.revokeObjectURL(blobURL);

      canvas.toBlob((pngBlob) => {
        const downloadUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "qrcode.png";
        link.click();
        URL.revokeObjectURL(downloadUrl);
      }, "image/png");
    };
    img.src = blobURL;
  };

  const handleCopySvg = async () => {
    await navigator.clipboard.writeText(svgMarkup);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Mode Selector Tabs */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tab === "url" ? "bg-brand-600 text-white shadow-subtle" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            Website URL
          </button>
          <button
            type="button"
            onClick={() => setTab("text")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tab === "text" ? "bg-brand-600 text-white shadow-subtle" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            <FileText className="w-4 h-4" />
            Plain Text
          </button>
          <button
            type="button"
            onClick={() => setTab("wifi")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tab === "wifi" ? "bg-brand-600 text-white shadow-subtle" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            <Wifi className="w-4 h-4" />
            WiFi Network
          </button>
          <button
            type="button"
            onClick={() => setTab("vcard")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tab === "vcard" ? "bg-brand-600 text-white shadow-subtle" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            <Contact className="w-4 h-4" />
            vCard Contact
          </button>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Client-Side Vector Engine
        </div>
      </div>

      {/* Main Dual Area: Inputs & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Customization Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Content Inputs */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
              {tab === "url" && "Website Address (URL)"}
              {tab === "text" && "Plain Text Content"}
              {tab === "wifi" && "WiFi Network Credentials"}
              {tab === "vcard" && "vCard Contact Information"}
            </h3>

            {tab === "url" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Enter URL:</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-3 rounded-xl border border-black/[0.08] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}

            {tab === "text" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Enter Text:</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type any message, note, or instructions..."
                  rows={4}
                  className="w-full p-3 rounded-xl border border-black/[0.08] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
                />
              </div>
            )}

            {tab === "wifi" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Network Name (SSID):</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="e.g. OfficeWiFi"
                    className="w-full p-2.5 rounded-xl border border-black/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Password:</label>
                    <input
                      type="text"
                      value={wifiPass}
                      onChange={(e) => setWifiPass(e.target.value)}
                      placeholder="Network password"
                      className="w-full p-2.5 rounded-xl border border-black/[0.08] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Encryption:</label>
                    <select
                      value={wifiEnc}
                      onChange={(e) => setWifiEnc(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-black/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="None">None (Open)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {tab === "vcard" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name:</label>
                  <input
                    type="text"
                    value={vcardName}
                    onChange={(e) => setVcardName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    value={vcardPhone}
                    onChange={(e) => setVcardPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email:</label>
                  <input
                    type="email"
                    value={vcardEmail}
                    onChange={(e) => setVcardEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Organization:</label>
                  <input
                    type="text"
                    value={vcardOrg}
                    onChange={(e) => setVcardOrg(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Design Customizations */}
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-5 sm:p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
              Style & Colors
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">QR Color:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorDark}
                    onChange={(e) => setColorDark(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-black/[0.1] p-0.5"
                  />
                  <span className="font-mono text-slate-600">{colorDark}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Background:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorLight}
                    onChange={(e) => setColorLight(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-black/[0.1] p-0.5"
                  />
                  <span className="font-mono text-slate-600">{colorLight}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Error Correction:</label>
                <select
                  value={ecLevel}
                  onChange={(e) => setEcLevel(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-black/[0.08] font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value={QRErrorCorrectLevel.L}>L (7%)</option>
                  <option value={QRErrorCorrectLevel.M}>M (15%)</option>
                  <option value={QRErrorCorrectLevel.Q}>Q (25%)</option>
                  <option value={QRErrorCorrectLevel.H}>H (30%)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Size (px):</label>
                <select
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-black/[0.08] font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value={200}>200 px</option>
                  <option value={280}>280 px</option>
                  <option value={360}>360 px</option>
                  <option value={500}>500 px</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview Box (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-6 sm:p-8 space-y-6 text-center">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4">
              Real-Time QR Code Preview
            </span>

            <div className="inline-block p-4 rounded-2xl border border-black/[0.06] shadow-subtle bg-white">
              {svgMarkup ? (
                <div
                  className="flex items-center justify-center overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: svgMarkup }}
                />
              ) : (
                <div className="w-[240px] h-[240px] flex items-center justify-center text-slate-400 text-xs italic">
                  Enter content to generate
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-3 truncate max-w-xs mx-auto">
              Scan with any iPhone or Android camera
            </p>
          </div>

          {/* Download Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={!svgMarkup}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-subtle active:scale-[0.985] disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                Download PNG
              </button>
              <button
                type="button"
                onClick={handleDownloadSvg}
                disabled={!svgMarkup}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                Download SVG
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopySvg}
              disabled={!svgMarkup}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "SVG Code Copied!" : "Copy Raw SVG"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
