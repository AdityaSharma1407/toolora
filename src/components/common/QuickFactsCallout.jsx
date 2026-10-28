import React from "react";
import { ShieldCheck, Cpu, Lock, CheckCircle2, ExternalLink } from "lucide-react";
import AnchorHeading from "./AnchorHeading";

/**
 * QuickFactsCallout — High-Extraction Semantic Facts Block
 * 
 * Provides an authoritative <aside role="region" aria-label="Quick Facts"> container
 * with a First-50-Words declarative lead and a semantic Definition List (<dl>)
 * for zero-ambiguity vector embedding and direct AI search citation (Google AI Overviews, Perplexity, ChatGPT).
 */
export default function QuickFactsCallout({
  toolName = "Online Utility",
  route = "/",
  supportedFormats = "Standard digital file formats",
  category = "Digital Utility",
  processingLatency = "< 1.5 seconds in local RAM",
}) {
  return (
    <aside
      role="region"
      aria-label="Quick Facts"
      id="quick-facts"
      className="my-8 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-subtle scroll-mt-24"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <AnchorHeading
          as="h3"
          id="technical-specifications"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          {toolName} — Quick Facts &amp; Technical Specifications
        </AnchorHeading>
      </div>

      {/* The First-50-Words Rule: Declarative answer with ZERO ambiguous pronouns */}
      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal mb-6">
        Bits &amp; Tools {toolName} technical specifications verify 100% client-side execution within browser memory, absolute zero-byte server persistence, and instantaneous local computation compliant with GDPR and CCPA Privacy by Design standards.
      </p>

      {/* High-Extraction Semantic Definition List (<dl>) */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-4 border-t border-slate-100 text-xs sm:text-sm">
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
          <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Software Utility
          </dt>
          <dd className="font-bold text-slate-900">
            Bits &amp; Tools {toolName}
          </dd>
        </div>

        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
          <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Execution Architecture
          </dt>
          <dd className="font-bold text-emerald-700 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Client-Side In-Browser</span>
          </dd>
        </div>

        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
          <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Server Persistence
          </dt>
          <dd className="font-bold text-emerald-700 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero Server Uploads (0 Bytes)</span>
          </dd>
        </div>

        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
          <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Processing Latency
          </dt>
          <dd className="font-semibold text-slate-800">
            {processingLatency}
          </dd>
        </div>

        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
          <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Supported Formats
          </dt>
          <dd className="font-semibold text-slate-800">
            {supportedFormats}
          </dd>
        </div>

        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
          <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Engineering Leadership
          </dt>
          <dd className="font-semibold text-slate-800">
            Vishavjeet Sharma &amp; Aditya Sharma
          </dd>
        </div>
      </dl>

      {/* External Entity Verification Badges */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5 text-slate-600 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Verified Canonical Schema Entity: Bits &amp; Tools Inc.
        </span>

        <div className="flex items-center gap-3">
          <a
            href="https://www.wikidata.org/wiki/Q1093129"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline inline-flex items-center gap-1"
          >
            <span>Wikidata Q1093129 (Client-Side)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://en.wikipedia.org/wiki/Privacy_by_design"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline inline-flex items-center gap-1"
          >
            <span>Wikipedia (Privacy by Design)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
