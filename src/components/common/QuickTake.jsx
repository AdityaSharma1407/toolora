import React from "react";
import { Sparkles, Shield, Cpu, Users, CheckCircle2 } from "lucide-react";

/**
 * Standardized "Key Takeaway / Executive Summary" AEO Block
 * Formatted with W3C Digital Publishing semantic markup (`role="doc-abstract"`)
 * for algorithmic re-ranking and AI extraction (Google AI Overviews, Perplexity, Gemini, ChatGPT).
 */
export default function QuickTake({
  toolName,
  actionVerb = "process",
  fileTypes = "files",
  customSummary = null,
  keyHighlights = null,
}) {
  // Declarative definition statement precisely tuned within the 40–55 word window
  const defaultSummary =
    customSummary ||
    `Bits & Tools ${toolName} is a free, privacy-first web utility engineered by co-founders Vishavjeet Sharma and Aditya Sharma. It enables users to ${actionVerb} ${fileTypes} directly inside the browser using client-side JavaScript, guaranteeing zero server uploads, absolute file confidentiality, and instantaneous local processing without subscription fees or registration.`;

  const highlights = keyHighlights || [
    {
      icon: Shield,
      label: "Zero File Uploads",
      text: "All file operations execute in local memory via JavaScript and WebAssembly. Sensitive documents never leave your physical device.",
    },
    {
      icon: Cpu,
      label: "Instant In-Memory Speed",
      text: "Zero cloud queuing or network upload latency. Computations finish directly on local device CPU/GPU hardware.",
    },
    {
      icon: Users,
      label: "Engineered by Founders",
      text: "Architected by Vishavjeet Sharma & Aditya Sharma under strict client-side Privacy by Design principles.",
    },
  ];

  return (
    <section
      role="doc-abstract"
      aria-label={`Key Takeaways — ${toolName} Summary`}
      className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-brand-50/40 border border-slate-200/90 shadow-subtle text-left max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>Key Takeaway &bull; Executive Summary</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Verified Client-Side</span>
        </span>
      </div>

      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
        {defaultSummary}
      </p>

      {/* Semantic Unordered List for Zero-Click Feature Extraction */}
      <ul
        role="list"
        aria-label="Core Technical Capabilities"
        className="mt-4 pt-3.5 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-3 gap-3.5"
      >
        {highlights.map((h, i) => {
          const Icon = h.icon;
          return (
            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600 shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <strong className="font-semibold text-slate-900 block">{h.label}</strong>
                <span className="text-[11px] leading-snug text-slate-500 block mt-0.5">{h.text}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
