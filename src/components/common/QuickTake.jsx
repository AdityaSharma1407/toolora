import React from "react";
import { Sparkles, Shield, Cpu, Users, CheckCircle2 } from "lucide-react";

/**
 * Standardized "Key Takeaway / Executive Summary" AEO Block
 * Formatted with W3C Digital Publishing semantic markup (`role="doc-abstract"`)
 * for algorithmic re-ranking, visual token weight optimization (18px-20px computed font, maximum contrast),
 * and zero-click AI citation extraction (Google AI Overviews, Perplexity, Gemini, ChatGPT).
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
      className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-brand-50/40 border border-slate-200/90 shadow-subtle text-left max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>Key Takeaway &bull; Executive Summary</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Client-Side In-Memory</span>
        </span>
      </div>

      {/* Visual Token Weight: Computed 18px-20px font with maximum contrast (text-slate-900) */}
      <p className="text-lg sm:text-[19px] lg:text-xl font-medium text-slate-900 leading-relaxed tracking-normal">
        {defaultSummary}
      </p>

      {/* Semantic Unordered List for Zero-Click Feature Extraction */}
      <ul
        role="list"
        aria-label="Core Technical Capabilities"
        className="mt-5 pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {highlights.map((h, i) => {
          const Icon = h.icon;
          return (
            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600 shrink-0 mt-0.5 border border-brand-100">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <strong className="font-semibold text-slate-900 block text-xs sm:text-sm">
                  {h.label}
                </strong>
                <span className="text-xs text-slate-700 leading-normal block mt-0.5 font-normal">
                  {h.text}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
