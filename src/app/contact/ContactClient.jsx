"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Wrench,
  FileCode,
  Bug,
  Lightbulb,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function ContactClient({ supportEmail }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(supportEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback if clipboard API is restricted
      setCopied(false);
    }
  };

  const contactCategories = [
    {
      icon: Wrench,
      title: "Technical problems with online tools",
      description:
        "Issues with browser performance, WebAssembly execution, memory limits, or unexpected processing errors.",
      subject: "Technical Issue - Bits & Tools",
    },
    {
      icon: FileCode,
      title: "PDF, image, and file-processing issues",
      description:
        "Problems merging, splitting, compressing, or converting specific PDF or image file formats.",
      subject: "File Processing Issue - Bits & Tools",
    },
    {
      icon: Bug,
      title: "Bug reports and suggestions",
      description:
        "Unexpected tool behavior, UI rendering defects, or suggestions for platform improvements.",
      subject: "Bug Report - Bits & Tools",
    },
    {
      icon: Lightbulb,
      title: "Feature requests",
      description:
        "Ideas for new utility tools, additional document options, or workflow enhancements you'd like to see.",
      subject: "Feature Request - Bits & Tools",
    },
    {
      icon: HelpCircle,
      title: "Questions about website functionality",
      description:
        "Inquiries about supported file sizes, browser compatibility, PWA installation, or offline operation.",
      subject: "Functionality Inquiry - Bits & Tools",
    },
    {
      icon: ShieldCheck,
      title: "Privacy or data-processing questions",
      description:
        "Questions regarding client-side processing, document confidentiality, cookie practices, or data protection.",
      subject: "Privacy Question - Bits & Tools",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Primary Support Email Card */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-200/60">
              <Mail className="w-3.5 h-3.5 text-brand-600" />
              <span>Direct Support Channel</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Email Support
            </h2>
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              Reach our support team directly. We read every message and do our best to provide timely, helpful assistance for all Bits &amp; Tools users.
            </p>
            <div className="pt-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                Official Support Address:
              </span>
              <a
                href={`mailto:${supportEmail}`}
                className="text-lg sm:text-2xl font-bold text-brand-600 hover:text-brand-700 underline decoration-2 underline-offset-4 transition-colors break-all"
              >
                {supportEmail}
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href={`mailto:${supportEmail}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-subtle transition-all active:scale-[0.98] min-h-[44px]"
            >
              <Mail className="w-4 h-4" />
              <span>Open Email Client</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label="Copy official support email address to clipboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-300/80 transition-all active:scale-[0.98] min-h-[44px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Copy Support Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Support Instructions Callout */}
      <section
        aria-label="Support Guidelines"
        className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Support Instructions &amp; Privacy Notice
            </h3>
            <p>
              When contacting us about a technical issue, please include the name of the tool you&apos;re using, a description of the problem, and any relevant error message. Please do not send passwords or sensitive personal information.
            </p>
            <p className="text-slate-600 text-xs">
              Please do not attach sensitive files unless necessary. Because Bits &amp; Tools executes all processing locally inside your web browser with zero server uploads, most file-processing errors stem from local browser memory limits, unsupported image formats, or corrupted input documents.
            </p>
          </div>
        </div>
      </section>

      {/* What Users Can Contact Us About */}
      <section aria-labelledby="topics-heading" className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Topics &amp; Inquiries</span>
          </div>
          <h2
            id="topics-heading"
            className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
          >
            What You Can Contact Us About
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Our support team welcomes inquiries across any of the following categories:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contactCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-300 transition-colors flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 w-fit border border-brand-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <a
                  href={`mailto:${supportEmail}?subject=${encodeURIComponent(cat.subject)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline pt-2 border-t border-slate-100"
                >
                  <span>Start email draft</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Browser-Local Security Assurance */}
      <section className="rounded-2xl bg-slate-900 text-slate-300 p-6 sm:p-8 space-y-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-900/60 text-brand-400 border border-brand-700/60">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Client-Side Privacy Guarantee
            </h3>
            <p className="text-xs text-slate-400">
              100% in-browser processing &bull; Zero server uploads &bull; No accounts required
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Bits &amp; Tools is engineered so your documents never travel to remote servers. If you encounter an error with a sensitive document, you do not need to share the file with us. Describing the file size, page count, and browser console messages is usually sufficient for our team to diagnose the problem.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
          <Link href="/about" className="text-brand-400 hover:underline">
            About Our Mission &rarr;
          </Link>
          <Link href="/privacy-policy" className="text-brand-400 hover:underline">
            Privacy Policy &rarr;
          </Link>
          <Link href="/terms" className="text-brand-400 hover:underline">
            Terms of Service &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
