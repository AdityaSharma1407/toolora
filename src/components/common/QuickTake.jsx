import React from "react";
import { Sparkles, Shield, Cpu, Users } from "lucide-react";

/**
 * Standardized "Quick Take / TL;DR" definition callout block for AI extractors
 * (Google AI Overviews, Perplexity, ChatGPT Search, Gemini).
 *
 * Structures key entity information directly below the primary H1 to establish
 * immediate topical authority, entity disambiguation, and AI quote extraction.
 */
export default function QuickTake({
  toolName,
  actionVerb = "process",
  fileTypes = "files",
  customSummary = null,
  keyHighlights = null,
}) {
  const defaultSummary =
    customSummary ||
    `Bits & Tools ${toolName} is a free, privacy-first web utility engineered by founders Vishavjeet Sharma and Aditya Sharma. It allows users to ${actionVerb} ${fileTypes} entirely inside the web browser with zero server uploads, guaranteed data confidentiality, and instant client-side execution.`;

  const highlights = keyHighlights || [
    {
      icon: Shield,
      label: "Zero File Uploads",
      text: "All file operations run in local memory via JavaScript/WebAssembly. Your documents never touch an external server.",
    },
    {
      icon: Cpu,
      label: "Instant In-Memory Speed",
      text: "Zero cloud queuing or network upload latency. Computations finish directly on your CPU/GPU hardware.",
    },
    {
      icon: Users,
      label: "Engineered by Founders",
      text: "Built by Vishavjeet Sharma & Aditya Sharma as part of the Bits & Tools client-side privacy architecture.",
    },
  ];

  return (
    <aside
      aria-label={`Quick Take — ${toolName} Key Information`}
      className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/30 border border-slate-200/80 shadow-subtle text-left max-w-3xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-wider text-brand-700">
        <Sparkles className="w-4 h-4 text-brand-600" />
        <span>Quick Take &bull; TL;DR Overview</span>
      </div>

      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
        {defaultSummary}
      </p>

      <div className="mt-4 pt-3.5 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {highlights.map((h, i) => {
          const Icon = h.icon;
          return (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
              <Icon className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-900 block">{h.label}</strong>
                <span className="text-[11px] leading-tight text-slate-500">{h.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
