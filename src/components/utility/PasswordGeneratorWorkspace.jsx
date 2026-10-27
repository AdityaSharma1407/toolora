"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  generatePassword,
  calculateEntropy,
} from "@/tools/utility/passwordGenerator.js";
import {
  Key,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function PasswordGeneratorWorkspace() {
  const [mode, setMode] = useState("characters"); // 'characters' | 'passphrase'
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  
  // Passphrase options
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState("-");

  // Output state
  const [password, setPassword] = useState("");
  const [entropy, setEntropy] = useState({ bits: 0, score: "", color: "emerald", crackTime: "" });
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [bulkList, setBulkList] = useState([]);
  const [copiedBulkIndex, setCopiedBulkIndex] = useState(null);

  const regenerate = useCallback(() => {
    const res = generatePassword({
      length,
      uppercase,
      lowercase,
      numbers,
      symbols,
      excludeAmbiguous,
      mode,
      wordCount,
      separator,
    });
    setPassword(res.password);
    setEntropy(res.entropy);
  }, [length, uppercase, lowercase, numbers, symbols, excludeAmbiguous, mode, wordCount, separator]);

  const generateBulk = (count = 5) => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const res = generatePassword({
        length,
        uppercase,
        lowercase,
        numbers,
        symbols,
        excludeAmbiguous,
        mode,
        wordCount,
        separator,
      });
      list.push(res.password);
    }
    setBulkList(list);
  };

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyBulk = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBulkIndex(idx);
      setTimeout(() => setCopiedBulkIndex(null), 2000);
    } catch {
      // Fallback
    }
  };

  // Color classes for entropy meter
  const getMeterColor = () => {
    if (entropy.score === "Very Strong") return "bg-emerald-500";
    if (entropy.score === "Strong") return "bg-teal-500";
    if (entropy.score === "Reasonable") return "bg-amber-500";
    return "bg-rose-500";
  };

  const getMeterPercent = () => {
    return Math.min(100, Math.round((entropy.bits / 128) * 100));
  };

  return (
    <div className="w-full space-y-6">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#18181b] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-[#27272a] rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode("characters")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === "characters"
                ? "bg-white dark:bg-[#18181b] shadow-xs text-neutral-900 dark:text-white font-semibold"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-apple-blue" />
            Random Password
          </button>
          <button
            type="button"
            onClick={() => setMode("passphrase")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === "passphrase"
                ? "bg-white dark:bg-[#18181b] shadow-xs text-neutral-900 dark:text-white font-semibold"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            Memorable Passphrase
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">
            NIST Entropy: <strong className="text-neutral-800 dark:text-neutral-200 font-mono">{entropy.bits} bits</strong>
          </span>
        </div>
      </div>

      {/* Main Password Display Card */}
      <div className="p-6 bg-white dark:bg-[#18181b] rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                entropy.score === "Very Strong" || entropy.score === "Strong"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : entropy.score === "Reasonable"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
              }`}
            >
              {entropy.score}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              ~{entropy.crackTime} to crack
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-[#27272a] transition-colors"
              title={showPassword ? "Mask password" : "Show password"}
              aria-label={showPassword ? "Mask password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={regenerate}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] text-neutral-800 dark:text-neutral-200 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
            <button
              type="button"
              onClick={() => handleCopy(password)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-apple-blue hover:bg-apple-blue/90 text-white rounded-xl transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Password</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Display Box */}
        <div className="p-4 sm:p-5 bg-neutral-50 dark:bg-black/40 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] break-all select-all font-mono text-lg sm:text-2xl font-bold tracking-wider text-neutral-900 dark:text-white flex items-center justify-between min-h-[4rem]">
          {showPassword ? password : "•".repeat(password.length)}
        </div>

        {/* Entropy Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-[#27272a] overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getMeterColor()}`}
              style={{ width: `${getMeterPercent()}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-neutral-400">
            <span>Weak (0 bits)</span>
            <span>Reasonable (36)</span>
            <span>Strong (60)</span>
            <span>Cryptographic (128+ bits)</span>
          </div>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="p-6 bg-white dark:bg-[#18181b] rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs space-y-6">
        {mode === "characters" ? (
          /* CHARACTERS CONFIG */
          <div className="space-y-5">
            {/* Length Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Password Length: <span className="font-mono text-apple-blue">{length} characters</span>
                </label>
                <div className="flex items-center gap-1 text-xs">
                  {[12, 16, 20, 24, 32].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setLength(preset)}
                      className={`px-2 py-0.5 rounded-md font-mono ${
                        length === preset
                          ? "bg-apple-blue text-white"
                          : "bg-neutral-100 dark:bg-[#27272a] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-apple-blue cursor-pointer"
              />
            </div>

            {/* Character Set Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
              <label className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-[#27272a]/40 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded-sm border-neutral-300 text-apple-blue focus:ring-apple-blue/30"
                />
                <div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-white">Uppercase (A-Z)</div>
                  <div className="text-[11px] text-neutral-400 font-mono">ABCDEF...</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-[#27272a]/40 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                <input
                  type="checkbox"
                  checked={lowercase}
                  onChange={(e) => setLowercase(e.target.checked)}
                  className="rounded-sm border-neutral-300 text-apple-blue focus:ring-apple-blue/30"
                />
                <div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-white">Lowercase (a-z)</div>
                  <div className="text-[11px] text-neutral-400 font-mono">abcdef...</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-[#27272a]/40 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                <input
                  type="checkbox"
                  checked={numbers}
                  onChange={(e) => setNumbers(e.target.checked)}
                  className="rounded-sm border-neutral-300 text-apple-blue focus:ring-apple-blue/30"
                />
                <div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-white">Numbers (0-9)</div>
                  <div className="text-[11px] text-neutral-400 font-mono">0123456789</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-[#27272a]/40 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                <input
                  type="checkbox"
                  checked={symbols}
                  onChange={(e) => setSymbols(e.target.checked)}
                  className="rounded-sm border-neutral-300 text-apple-blue focus:ring-apple-blue/30"
                />
                <div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-white">Special Symbols</div>
                  <div className="text-[11px] text-neutral-400 font-mono">!@#$%^&*...</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-[#27272a]/40 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  className="rounded-sm border-neutral-300 text-apple-blue focus:ring-apple-blue/30"
                />
                <div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-white">Avoid Ambiguous</div>
                  <div className="text-[11px] text-neutral-400 font-mono">Excludes: l, 1, I, O, 0</div>
                </div>
              </label>
            </div>
          </div>
        ) : (
          /* PASSPHRASE CONFIG */
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Word Count: <span className="font-mono text-purple-600">{wordCount} words</span>
                </label>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
              <span className="text-xs text-neutral-500">Separator:</span>
              {[
                { label: "Hyphen (-)", val: "-" },
                { label: "Underscore (_)", val: "_" },
                { label: "Period (.)", val: "." },
                { label: "Space ( )", val: " " },
              ].map((sep) => (
                <button
                  key={sep.val}
                  type="button"
                  onClick={() => setSeparator(sep.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    separator === sep.val
                      ? "bg-purple-600 text-white"
                      : "bg-neutral-100 dark:bg-[#27272a] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                  }`}
                >
                  {sep.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bulk Generation Option */}
        <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Need multiple options for team accounts or batch setups?
          </span>
          <button
            type="button"
            onClick={() => generateBulk(5)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            Generate Batch of 5
          </button>
        </div>

        {bulkList.length > 0 && (
          <div className="p-4 bg-neutral-50 dark:bg-black/30 rounded-2xl border border-black/[0.04] dark:border-white/[0.04] space-y-2">
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Batch Generated Options
            </h4>
            {bulkList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-white dark:bg-[#18181b] rounded-xl border border-black/[0.04] dark:border-white/[0.04] text-xs font-mono"
              >
                <span className="truncate mr-2">{item}</span>
                <button
                  type="button"
                  onClick={() => handleCopyBulk(item, idx)}
                  className="px-2 py-1 text-xs text-neutral-500 hover:text-apple-blue shrink-0"
                >
                  {copiedBulkIndex === idx ? "Copied" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Client-Side Security Assurance */}
      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#27272a]/40 border border-black/[0.04] dark:border-white/[0.04] flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">
            Cryptographically Secure Client-Side Execution
          </p>
          <p>
            Entropy is sourced directly from your operating system&apos;s hardware random number generator via Web Crypto <code className="font-mono text-apple-blue">crypto.getRandomValues</code>. Your passwords are never transmitted over a network or stored anywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
