import React from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Zap, Lock, Heart, Layers, ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "About Toolora | Free & Private Online Tools Platform",
  description:
    "Learn about Toolora's mission to provide fast, reliable, and 100% private digital utilities with zero file uploads to servers.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const breadcrumbs = [{ label: "About", href: "/about" }];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-brand-50/50 to-white border-b border-slate-100 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold mb-4 mt-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission &amp; Philosophy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About Toolora
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Fast, completely private, and free online utilities designed for people who care about document security and productivity.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Why Toolora */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Why We Built Toolora
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every day, millions of people need to combine PDF files, compress images, or convert documents.
            Traditional online utility sites force users to upload their personal contracts, tax forms, financial statements,
            and private photos to unknown remote cloud servers.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            We believed there was a better way. Modern web browsers are powerful operating environments capable of executing
            complex cryptographic and binary manipulations locally. <strong>Toolora</strong> was created to prove that document utilities
            can be fast, free, and uncompromisingly private — with <strong>zero server uploads</strong>.
          </p>
        </section>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col">
            <div className="p-3 rounded-xl bg-brand-50 text-brand-600 w-fit mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Privacy by Design
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed flex-1">
              Your confidential documents never travel across the internet. All merging, splitting, and compression happens inside your device&apos;s memory.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col">
            <div className="p-3 rounded-xl bg-brand-50 text-brand-600 w-fit mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Instant Speed
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed flex-1">
              No uploading gigabytes over slow broadband. No server processing queues. Tools compile directly in your browser within milliseconds.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col">
            <div className="p-3 rounded-xl bg-brand-50 text-brand-600 w-fit mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Free &amp; Accessible
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed flex-1">
              No mandatory accounts, no watermarks, and no monthly credit card charges. Useful tools should be accessible to everyone worldwide.
            </p>
          </div>
        </div>

        {/* Ethical Monetization */}
        <section className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl font-bold text-slate-900">
            Our Monetization Model
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Toolora is funded through ethical, non-intrusive display advertising (such as Google AdSense).
            Here is our advertising promise:
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
            <li>We never require users to click ads to access tools.</li>
            <li>We never place deceptive ads that mimic download or upload buttons.</li>
            <li>We respect your cookie and privacy consent choices at all times.</li>
            <li>We keep the tool interfaces clean, clear, and distraction-free.</li>
          </ul>
        </section>

        {/* Explore Tools CTA */}
        <div className="p-8 bg-brand-600 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md shadow-brand-500/20">
          <div>
            <h3 className="text-xl font-bold">Ready to try our private tools?</h3>
            <p className="text-xs text-brand-100 mt-1 max-w-md">
              Start with our popular PDF and Image tools. 100% free with instant browser processing.
            </p>
          </div>
          <Link
            href="/pdf-tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-white text-brand-600 hover:bg-brand-50 transition-colors shrink-0 shadow-sm"
          >
            <span>Explore All PDF Tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
