"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getToolById, getToolsByCategory } from "@/data/toolsRegistry";
import AnchorHeading from "./AnchorHeading";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  FileCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

/**
 * Next-Intent Solutions Matrix for Anticipated Secondary User Queries
 */
const NEXT_INTENT_CONFIGS = {
  pdf: [
    {
      id: "compress",
      query: "Is this merged PDF file too large to email or upload?",
      recommendation: "Compress PDF",
      route: "/compress-pdf",
      description: "Optimize internal font and vector streams to drastically reduce byte size without degrading visual quality.",
      badge: "Save up to 80% size",
    },
    {
      id: "protect",
      query: "Need to secure confidential data before sending to a third party?",
      recommendation: "Protect PDF",
      route: "/protect-pdf",
      description: "Apply client-side AES-256 encryption with a master password so only authorized recipients can open it.",
      badge: "AES-256 Encryption",
    },
    {
      id: "delete",
      query: "Did extra cover pages or blank sheets get bundled by mistake?",
      recommendation: "Delete PDF Pages",
      route: "/delete-pdf-pages",
      description: "Preview pages in a visual thumbnail grid and remove unwanted leaves in a single click.",
      badge: "Instant Removal",
    },
    {
      id: "convert",
      query: "Need to edit the text in Microsoft Word or extract presentation images?",
      recommendation: "PDF to Word",
      route: "/pdf-to-word",
      description: "Extract text elements directly into formatted DOCX format right in your browser.",
      badge: "Editable DOCX",
    },
  ],
  image: [
    {
      id: "compress-img",
      query: "Need to reduce image megabytes for web publishing?",
      recommendation: "Compress Image",
      route: "/compress-image",
      description: "Shrink image payload with smart quantization while preserving crisp resolution.",
      badge: "Lossless Compression",
    },
    {
      id: "webp",
      query: "Want optimal Google PageSpeed scores with next-gen image formats?",
      recommendation: "WebP Converter",
      route: "/webp-converter",
      description: "Transcode legacy JPG and PNG images into modern WebP format for fast web delivery.",
      badge: "Google Recommended",
    },
    {
      id: "crop",
      query: "Need exact aspect ratios for social media cards or avatars?",
      recommendation: "Crop Image",
      route: "/crop-image",
      description: "Crop photos using pixel-perfect aspect ratio presets directly on HTML5 Canvas.",
      badge: "Preset Dimensions",
    },
  ],
  utility: [
    {
      id: "minify",
      query: "Need to strip whitespace and comments before deploying code?",
      recommendation: "Code Minifier",
      route: "/code-minifier",
      description: "Safely minify HTML, CSS, JS, and JSON data directly in browser memory.",
      badge: "Zero Latency",
    },
    {
      id: "json",
      query: "Need to validate or format API responses for clean reading?",
      recommendation: "JSON Formatter",
      route: "/json-formatter",
      description: "Prettify, sort keys, and validate nested JSON structures with zero server logging.",
      badge: "100% Private",
    },
  ],
};

/**
 * "Session-Terminator" Layout Component
 * 
 * Injected at the bottom of content views to resolve peripheral doubts,
 * solve anticipated secondary intents, and prevent users from bouncing back to search engines.
 */
export default function NextIntentSection({ currentToolId }) {
  const currentTool = currentToolId ? getToolById(currentToolId) : null;
  const category = currentTool?.category || "pdf";
  const intents = NEXT_INTENT_CONFIGS[category] || NEXT_INTENT_CONFIGS.pdf;

  // Filter out the current tool itself so we don't suggest repeating the same action
  const filteredIntents = intents.filter((i) => i.route !== currentTool?.route);

  return (
    <section
      role="region"
      aria-label="Next Steps and Related Workflows"
      className="py-14 bg-gradient-to-b from-slate-50/50 to-white border-t border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Workflow Completion & Next Steps</span>
          </div>
          <AnchorHeading
            as="h2"
            className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight justify-center"
          >
            What Would You Like to Do Next?
          </AnchorHeading>
          <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            Resolve follow-up tasks immediately without downloading heavy software or bouncing back to Google search.
          </p>
        </div>

        {/* Anticipated Intent Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {filteredIntents.map((item) => (
            <div
              key={item.id}
              className="group p-5 sm:p-6 rounded-2xl bg-white border border-black/[0.08] hover:border-brand-300 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>In-Browser</span>
                  </span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {item.query}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={item.route}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 group/link"
                >
                  <span>Launch {item.recommendation} free</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
                <span className="text-[11px] text-slate-400">Zero file uploads</span>
              </div>
            </div>
          ))}
        </div>

        {/* Peripheral Doubt Resolution Box */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
            <HelpCircle className="w-4 h-4 text-brand-600" />
            <span>Common Post-Processing Questions</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700 font-normal">
            <div className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
              <strong className="block text-slate-900 font-semibold mb-1">
                Are my files saved on servers?
              </strong>
              <span>
                Never. Processing occurs 100% in local device memory. Data is wiped upon tab closure.
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
              <strong className="block text-slate-900 font-semibold mb-1">
                Can I process unlimited files?
              </strong>
              <span>
                Yes. There are no hourly caps, trial limits, or account paywalls on Bits & Tools.
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
              <strong className="block text-slate-900 font-semibold mb-1">
                Can I chain tools in sequence?
              </strong>
              <span>
                Absolutely. Download output from one tool and immediately drop it into the next.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
