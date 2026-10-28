"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { getToolById } from "@/data/toolsRegistry";

/**
 * Exact Next-Step Scenarios Dictionary
 */
const EXACT_NEXT_STEPS = {
  "/merge-pdf": {
    heading: "Exact Next Step: Is Your Combined PDF Too Large for Email?",
    context:
      "Merged PDF documents containing multiple reports or images often exceed standard 20MB email attachment limits. Compress the file now to reduce byte size by up to 80% with zero quality loss.",
    targetRoute: "/compress-pdf",
    targetLabel: "Compress Merged PDF Free",
    statBadge: "Save up to 80% Byte Size",
  },
  "/split-pdf": {
    heading: "Exact Next Step: Need to Secure Extracted Pages Before Sending?",
    context:
      "When extracting specific tax, contract, or medical pages, apply client-side AES-256 encryption so only authorized recipients with the password can open them.",
    targetRoute: "/protect-pdf",
    targetLabel: "Protect Extracted PDF",
    statBadge: "AES-256 Security",
  },
  "/compress-pdf": {
    heading: "Exact Next Step: Need to Remove Extra or Blank Pages?",
    context:
      "Now that your document is compressed, clean up unwanted cover pages, duplicate sheets, or blank pages in a visual thumbnail layout.",
    targetRoute: "/delete-pdf-pages",
    targetLabel: "Remove Unwanted Pages",
    statBadge: "Visual Page Grid",
  },
  "/jpg-to-pdf": {
    heading: "Exact Next Step: Shrink Generated PDF for Instant Web Uploads?",
    context:
      "Compiling high-resolution camera photos into PDF can produce heavy files. Run our structural compressor to make your PDF light and portable.",
    targetRoute: "/compress-pdf",
    targetLabel: "Compress Photo PDF",
    statBadge: "Instant In-Memory",
  },
  "/pdf-to-jpg": {
    heading: "Exact Next Step: Need to Scale or Crop Extracted Photos?",
    context:
      "Now that your document pages are converted into images, resize or crop them to exact social media or presentation dimensions directly on Canvas.",
    targetRoute: "/resize-image",
    targetLabel: "Resize Extracted Images",
    statBadge: "Zero Quality Loss",
  },
};

/**
 * Algorithmic "Exact Next Step" Intent-Locking Card
 * 
 * Replaces generic navigation with a focused, high-relevance next action
 * resolving the single most common follow-up dilemma to prevent SERP bounce-backs.
 */
export default function ExactNextStepCard({ currentRoute, className = "" }) {
  const normalizedRoute = currentRoute?.startsWith("/") ? currentRoute : `/${currentRoute || "merge-pdf"}`;
  const scenario = EXACT_NEXT_STEPS[normalizedRoute] || {
    heading: "Exact Next Step: Complete Your Workflow in Browser",
    context: "Chain your output directly into our privacy-first toolchain with zero file uploads and zero cloud waiting times.",
    targetRoute: "/compress-pdf",
    targetLabel: "Launch Next Workflow",
    statBadge: "100% In-Browser",
  };

  return (
    <div
      role="region"
      aria-label="Recommended Exact Next Step"
      className={`my-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-brand-900 via-slate-900 to-indigo-950 text-white shadow-xl max-w-4xl mx-auto border border-brand-800/40 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-brand-300" />
          <span>Recommended Next Intent</span>
        </div>
        <span className="text-xs text-emerald-300 font-semibold bg-emerald-950/60 border border-emerald-700/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{scenario.statBadge}</span>
        </span>
      </div>

      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2">
        {scenario.heading}
      </h2>

      <p className="text-sm text-slate-300 leading-relaxed max-w-3xl font-normal mb-5">
        {scenario.context}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
        <Link
          href={scenario.targetRoute}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-brand-50 text-slate-900 font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{scenario.targetLabel}</span>
          <ArrowRight className="w-4 h-4 text-brand-600" />
        </Link>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Zero file uploads
          </span>
          <span className="inline-flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            No registration
          </span>
        </div>
      </div>
    </div>
  );
}
