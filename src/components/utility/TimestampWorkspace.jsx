"use client";

import React, { useState, useEffect, useId } from "react";
import {
  timestampToDate,
  dateToTimestamp,
} from "@/tools/utility/timestampConverter.js";
import {
  Clock,
  Calendar,
  Play,
  Pause,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function TimestampWorkspace() {
  // Live clock
  const [currentSec, setCurrentSec] = useState(() => Math.floor(Date.now() / 1000));
  const [currentMs, setCurrentMs] = useState(() => Date.now());
  const [isLive, setIsLive] = useState(true);

  // Timestamp to Date converter state
  const [tsInput, setTsInput] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [tsResult, setTsResult] = useState(() => timestampToDate(Math.floor(Date.now() / 1000)));

  // Date to Timestamp converter state
  const [dateInput, setDateInput] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [dateResult, setDateResult] = useState(() => dateToTimestamp(new Date().toISOString()));

  const [copiedKey, setCopiedKey] = useState(null);

  const tsInputId = useId();
  const dateInputId = useId();

  // Tick live clock every second
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentMs(now);
      setCurrentSec(Math.floor(now / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Update tsResult when tsInput changes
  useEffect(() => {
    if (!tsInput.trim()) {
      setTsResult(null);
      return;
    }
    setTsResult(timestampToDate(tsInput.trim()));
  }, [tsInput]);

  // Update dateResult when dateInput changes
  useEffect(() => {
    if (!dateInput) {
      setDateResult(null);
      return;
    }
    setDateResult(dateToTimestamp(dateInput));
  }, [dateInput]);

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(String(text));
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSetTsNow = () => {
    setTsInput(String(Math.floor(Date.now() / 1000)));
  };

  const handleAdjustTs = (deltaSec) => {
    const current = Number(tsInput) || Math.floor(Date.now() / 1000);
    setTsInput(String(current + deltaSec));
  };

  const handleSetDateNow = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setDateInput(d.toISOString().slice(0, 16));
  };

  const handleSetStartOfDay = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setDateInput(d.toISOString().slice(0, 16));
  };

  const handleSetEndOfDay = () => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setDateInput(d.toISOString().slice(0, 16));
  };

  return (
    <div className="w-full space-y-6">
      {/* Live Unix Epoch Ticker Banner */}
      <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl border border-black/[0.08] shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                {isLive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isLive ? "bg-emerald-500" : "bg-neutral-400"
                  }`}
                />
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
                Current Unix Epoch Time
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white">
                {currentSec}
              </div>
              <div className="text-sm font-mono text-slate-400">
                ({currentMs} ms)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLive(!isLive)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {isLive ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleCopy(currentSec, "currentSec")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-xs"
            >
              {copiedKey === "currentSec" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied Sec</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Seconds</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleCopy(currentMs, "currentMs")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {copiedKey === "currentMs" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied MS</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Milliseconds</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual Converters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Converter 1: Timestamp to Date */}
        <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-apple-blue" />
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Timestamp → Human Date
              </h2>
            </div>
            <button
              type="button"
              onClick={handleSetTsNow}
              className="text-xs text-apple-blue hover:underline font-medium"
            >
              Set Current Time
            </button>
          </div>

          <div>
            <label htmlFor={tsInputId} className="block text-xs font-medium text-neutral-500 mb-1.5">
              Enter Unix Epoch (seconds or milliseconds)
            </label>
            <div className="relative">
              <input
                id={tsInputId}
                type="text"
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                placeholder="e.g. 1704153600"
                className="w-full px-3.5 py-2.5 font-mono text-sm bg-neutral-50 dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.08] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-apple-blue/30 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          {/* Quick Adjust Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-neutral-400 mr-1">Quick Add:</span>
            <button
              type="button"
              onClick={() => handleAdjustTs(3600)}
              className="px-2 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] text-neutral-700 dark:text-neutral-300 rounded-lg"
            >
              +1 Hour
            </button>
            <button
              type="button"
              onClick={() => handleAdjustTs(86400)}
              className="px-2 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] text-neutral-700 dark:text-neutral-300 rounded-lg"
            >
              +1 Day
            </button>
            <button
              type="button"
              onClick={() => handleAdjustTs(604800)}
              className="px-2 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] text-neutral-700 dark:text-neutral-300 rounded-lg"
            >
              +1 Week
            </button>
            <button
              type="button"
              onClick={() => handleAdjustTs(2592000)}
              className="px-2 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] text-neutral-700 dark:text-neutral-300 rounded-lg"
            >
              +30 Days
            </button>
          </div>

          {/* Results Breakdown */}
          {tsResult && !tsResult.error ? (
            <div className="space-y-2.5 pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
              {/* UTC */}
              <div className="p-3 bg-neutral-50 dark:bg-[#27272a]/40 rounded-xl flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    UTC Time
                  </div>
                  <div className="font-mono text-xs text-neutral-900 dark:text-white truncate">
                    {tsResult.utc}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(tsResult.utc, "utc")}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  title="Copy UTC string"
                >
                  {copiedKey === "utc" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Local */}
              <div className="p-3 bg-neutral-50 dark:bg-[#27272a]/40 rounded-xl flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Your Local Time
                  </div>
                  <div className="font-mono text-xs text-neutral-900 dark:text-white truncate">
                    {tsResult.local}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(tsResult.local, "local")}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  title="Copy local string"
                >
                  {copiedKey === "local" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* ISO 8601 */}
              <div className="p-3 bg-neutral-50 dark:bg-[#27272a]/40 rounded-xl flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    ISO 8601
                  </div>
                  <div className="font-mono text-xs text-neutral-900 dark:text-white truncate">
                    {tsResult.iso}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(tsResult.iso, "iso")}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  title="Copy ISO string"
                >
                  {copiedKey === "iso" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Relative & Calendar Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-neutral-50 dark:bg-[#27272a]/40 rounded-xl">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                    Relative Time
                  </span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {tsResult.relative}
                  </span>
                </div>
                <div className="p-2.5 bg-neutral-50 dark:bg-[#27272a]/40 rounded-xl">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                    Day of Year
                  </span>
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">
                    Day {tsResult.dayOfYear} {tsResult.isLeapYear ? "(Leap Year)" : ""}
                  </span>
                </div>
              </div>
            </div>
          ) : tsResult?.error ? (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 text-xs">
              {tsResult.error}
            </div>
          ) : null}
        </div>

        {/* Converter 2: Date to Timestamp */}
        <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Human Date → Timestamp
              </h2>
            </div>
            <button
              type="button"
              onClick={handleSetDateNow}
              className="text-xs text-apple-blue hover:underline font-medium"
            >
              Current Date
            </button>
          </div>

          <div>
            <label htmlFor={dateInputId} className="block text-xs font-medium text-neutral-500 mb-1.5">
              Select Calendar Date & Time
            </label>
            <input
              id={dateInputId}
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-3.5 py-2.5 font-mono text-sm bg-neutral-50 dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.08] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-apple-blue/30 text-neutral-900 dark:text-white"
            />
          </div>

          {/* Quick Date Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-neutral-400 mr-1">Presets:</span>
            <button
              type="button"
              onClick={handleSetDateNow}
              className="px-2 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] text-neutral-700 dark:text-neutral-300 rounded-lg"
            >
              Now
            </button>
            <button
              type="button"
              onClick={handleSetStartOfDay}
              className="px-2 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] text-neutral-700 dark:text-neutral-300 rounded-lg"
            >
              Start of Today (00:00)
            </button>
            <button
              type="button"
              onClick={handleSetEndOfDay}
              className="px-2 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] text-neutral-700 dark:text-neutral-300 rounded-lg"
            >
              End of Today (23:59)
            </button>
          </div>

          {/* Computed Epochs */}
          {dateResult && !dateResult.error ? (
            <div className="space-y-3 pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
              {/* Epoch Seconds */}
              <div className="p-4 bg-neutral-50 dark:bg-[#27272a]/40 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Epoch Timestamp (Seconds)
                  </div>
                  <div className="text-xl font-mono font-bold text-neutral-900 dark:text-white mt-0.5">
                    {dateResult.epochSeconds}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(dateResult.epochSeconds, "resSec")}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-apple-blue hover:bg-apple-blue/90 text-white transition-colors"
                >
                  {copiedKey === "resSec" ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Epoch Milliseconds */}
              <div className="p-4 bg-neutral-50 dark:bg-[#27272a]/40 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Epoch Timestamp (Milliseconds)
                  </div>
                  <div className="text-xl font-mono font-bold text-neutral-900 dark:text-white mt-0.5">
                    {dateResult.epochMilliseconds}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(dateResult.epochMilliseconds, "resMs")}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-[#3f3f46] text-neutral-800 dark:text-neutral-100 transition-colors"
                >
                  {copiedKey === "resMs" ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#27272a]/40 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                <span>Equivalent UTC: {dateResult.utc}</span>
              </div>
            </div>
          ) : dateResult?.error ? (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 text-xs">
              {dateResult.error}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
