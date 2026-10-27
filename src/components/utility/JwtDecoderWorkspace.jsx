"use client";

import React, { useState, useId, useEffect } from "react";
import { decodeJwt } from "@/tools/utility/jwtDecoder.js";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Key,
  Clock,
  Calendar,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Info,
  CheckCircle2,
} from "lucide-react";

// Pre-generated sample tokens for quick testing
// Sample 1: Active token expiring far into future (2030)
const SAMPLE_ACTIVE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfOTA4MjEzNCIsIm5hbWUiOiJBbGV4IENoZW4iLCJlbWFpbCI6ImFsZXhAdG9vbG9yYS5kZXYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDQxNTM2MDAsImV4cCI6MTg5MzQ1NjAwMCwiaXNzIjoidG9vbG9yYS1hdXRoIiwiYXVkIjoidG9vbG9yYS1hcGkifQ.7F1oM_n-e_Z0TkmZ4oW6R8B3p6F6z0QyJ1E2Q4U_example";

// Sample 2: Expired token (2020)
const SAMPLE_EXPIRED_JWT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOmZhbHNlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTU3NzgzNjgwMCwiaXNzIjoiZXhhbXBsZS1pZHAifQ.kJ9_dE1EXAMPLE_EXPIRED_SIGNATURE";

export default function JwtDecoderWorkspace() {
  const [token, setToken] = useState(SAMPLE_ACTIVE_JWT);
  const [result, setResult] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);
  const inputId = useId();

  useEffect(() => {
    if (!token.trim()) {
      setResult(null);
      return;
    }
    const decoded = decodeJwt(token);
    setResult(decoded);
  }, [token]);

  const handleCopy = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleClear = () => {
    setToken("");
    setResult(null);
  };

  // Colored token parts helper
  const tokenParts = token.trim().split(".");

  return (
    <div className="w-full space-y-6">
      {/* Top Banner & Sample Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#18181b] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-apple-blue" />
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            JWT Token Inspector
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium">
            100% Client-Side
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setToken(SAMPLE_ACTIVE_JWT)}
            className="px-2.5 py-1 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-neutral-700 dark:text-neutral-200 rounded-lg transition-colors"
          >
            Active Sample
          </button>
          <button
            type="button"
            onClick={() => setToken(SAMPLE_EXPIRED_JWT)}
            className="px-2.5 py-1 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-neutral-700 dark:text-neutral-200 rounded-lg transition-colors"
          >
            Expired Sample
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#27272a] transition-colors"
            title="Clear input"
            aria-label="Clear input"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Token Input Box */}
      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#18181b] overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06] bg-neutral-50/60 dark:bg-black/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Encoded Token (Paste your JWT string)
            </span>
            {tokenParts.length === 3 && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono">
                <span className="text-rose-500 font-semibold">Header</span>
                <span className="text-neutral-400">.</span>
                <span className="text-purple-500 font-semibold">Payload</span>
                <span className="text-neutral-400">.</span>
                <span className="text-cyan-600 font-semibold">Signature</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleCopy(token, "token")}
            disabled={!token}
            className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 disabled:opacity-40 transition-colors"
          >
            {copiedSection === "token" ? "Copied!" : "Copy Token"}
          </button>
        </div>

        <div className="p-3">
          <textarea
            id={inputId}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your JWT token here (eyJhbGciOi...)..."
            className="w-full h-28 sm:h-32 p-3 font-mono text-xs md:text-sm bg-neutral-50/50 dark:bg-black/30 border border-black/[0.06] dark:border-white/[0.06] rounded-xl resize-none focus:outline-hidden focus:ring-2 focus:ring-apple-blue/30 text-neutral-900 dark:text-neutral-100 break-all"
            spellCheck="false"
          />
        </div>
      </div>

      {/* Error View */}
      {result && !result.success && (
        <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">Invalid Token</h3>
            <p className="text-xs font-mono">{result.error}</p>
          </div>
        </div>
      )}

      {/* Decoded Inspection Sections */}
      {result && result.success && (
        <div className="space-y-6">
          {/* Expiration & Claims Status Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Card */}
            <div className="p-4 bg-white dark:bg-[#18181b] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs flex items-center gap-3">
              {result.claims.expirationTimestamp ? (
                result.claims.isExpired ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        Token Expired
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
                        {result.claims.expirationRelative}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Token Active
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
                        Expires {result.claims.expirationRelative}
                      </div>
                    </div>
                  </>
                )
              ) : (
                <>
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      No Expiration Claim
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Token never expires (no &apos;exp&apos;)
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Algorithm & Type */}
            <div className="p-4 bg-white dark:bg-[#18181b] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-apple-blue dark:bg-blue-950/40 dark:text-blue-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Algorithm & Type
                </div>
                <div className="text-xs font-mono font-bold text-neutral-900 dark:text-white mt-0.5">
                  {result.claims.algorithm} &bull; {result.claims.type}
                </div>
              </div>
            </div>

            {/* Subject / Identity */}
            <div className="p-4 bg-white dark:bg-[#18181b] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                <Clock className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Subject (sub)
                </div>
                <div className="text-xs font-mono font-medium text-neutral-900 dark:text-white truncate mt-0.5">
                  {result.claims.subject || "Not specified"}
                </div>
              </div>
            </div>
          </div>

          {/* Dual JSON Breakdown: Header & Payload */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Header Box */}
            <div className="flex flex-col rounded-2xl border border-rose-200/70 dark:border-rose-900/40 bg-white dark:bg-[#18181b] overflow-hidden shadow-xs">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-rose-100 dark:border-rose-950/50 bg-rose-50/40 dark:bg-rose-950/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    Header (Algorithm & Token Type)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(result.header, null, 2), "header")}
                  className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors"
                >
                  {copiedSection === "header" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 grow">
                <pre className="p-3 bg-neutral-50 dark:bg-black/30 border border-black/[0.04] dark:border-white/[0.04] rounded-xl font-mono text-xs text-rose-900 dark:text-rose-200 overflow-x-auto">
                  {JSON.stringify(result.header, null, 2)}
                </pre>
              </div>
            </div>

            {/* Payload Box */}
            <div className="flex flex-col rounded-2xl border border-purple-200/70 dark:border-purple-900/40 bg-white dark:bg-[#18181b] overflow-hidden shadow-xs">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-purple-100 dark:border-purple-950/50 bg-purple-50/40 dark:bg-purple-950/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    Payload (Claims & Data)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(result.payload, null, 2), "payload")}
                  className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors"
                >
                  {copiedSection === "payload" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 grow">
                <pre className="p-3 bg-neutral-50 dark:bg-black/30 border border-black/[0.04] dark:border-white/[0.04] rounded-xl font-mono text-xs text-purple-900 dark:text-purple-200 overflow-x-auto">
                  {JSON.stringify(result.payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Signature Segment Card */}
          <div className="rounded-2xl border border-cyan-200/70 dark:border-cyan-900/40 bg-white dark:bg-[#18181b] p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-400">
                  Signature Segment
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(result.signature, "signature")}
                className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white flex items-center gap-1"
              >
                {copiedSection === "signature" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="font-mono text-xs text-neutral-600 dark:text-neutral-300 break-all bg-neutral-50 dark:bg-black/30 p-2.5 rounded-lg border border-black/[0.04] dark:border-white/[0.04]">
              {result.signature}
            </p>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#27272a]/40 border border-black/[0.04] dark:border-white/[0.04] flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">
            Client-Side Privacy Guarantee
          </p>
          <p>
            JWT strings are parsed in your browser using local Base64URL and JSON parsing. No tokens, secrets, authentication bearer headers, or claims are ever sent across a network.
          </p>
        </div>
      </div>
    </div>
  );
}
