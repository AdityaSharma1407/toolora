import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Layers, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800" id="about">
      {/* Top Banner: Local Processing Guarantee */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-900/50 text-brand-400 border border-brand-700/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Browser-Local Document Processing
              </p>
              <p className="text-xs text-slate-400">
                {siteConfig.displayName || "Bits & Tools"} processes your files locally on your device using client-side JavaScript. Your documents and data are never sent to any external server.
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            100% Free &bull; No Sign-Up &bull; Zero Server Storage
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand info (spans 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {siteConfig.displayName || siteConfig.name}
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>
            <div className="pt-2 text-xs text-slate-400">
              55 in-browser utilities designed for speed, privacy, and zero server storage.
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-emerald-400 text-xs font-semibold border border-slate-700/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Privacy</span>
            </div>
          </div>

          {/* PDF Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              PDF Tools
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/merge-pdf" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/split-pdf" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link href="/compress-pdf" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link href="/jpg-to-pdf" className="text-slate-300 hover:text-brand-400 transition-colors">
                  JPG to PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-jpg" className="text-slate-300 hover:text-brand-400 transition-colors">
                  PDF to JPG
                </Link>
              </li>
              <li>
                <Link href="/protect-pdf" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Protect PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf-tools" className="text-brand-400 hover:underline font-medium inline-block pt-1">
                  All 12 PDF Tools &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Image & Media Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Images &amp; Media
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/resize-image" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Resize Image
                </Link>
              </li>
              <li>
                <Link href="/compress-image" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Compress Image
                </Link>
              </li>
              <li>
                <Link href="/video-to-gif" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Video to GIF
                </Link>
              </li>
              <li>
                <Link href="/trim-video" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Trim Video
                </Link>
              </li>
              <li>
                <Link href="/extract-audio" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Extract Audio
                </Link>
              </li>
              <li>
                <Link href="/media-tools" className="text-brand-400 hover:underline font-medium inline-block pt-1">
                  All Media Tools &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* File Conversion Suite */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              File Conversion
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/html-to-pdf" className="text-slate-300 hover:text-brand-400 transition-colors">
                  HTML to PDF
                </Link>
              </li>
              <li>
                <Link href="/word-to-pdf" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Word to PDF
                </Link>
              </li>
              <li>
                <Link href="/excel-to-pdf" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Excel to PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-word" className="text-slate-300 hover:text-brand-400 transition-colors">
                  PDF to Word
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-excel" className="text-slate-300 hover:text-brand-400 transition-colors">
                  PDF to Excel
                </Link>
              </li>
              <li>
                <Link href="/convert-tools" className="text-brand-400 hover:underline font-medium inline-block pt-1">
                  All Convert Tools &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Tools & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Developer &amp; Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/word-counter" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Word Counter
                </Link>
              </li>
              <li>
                <Link href="/markdown-editor" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Markdown Editor
                </Link>
              </li>
              <li>
                <Link href="/regex-tester" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Regex Tester
                </Link>
              </li>
              <li>
                <Link href="/cron-generator" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Cron Generator
                </Link>
              </li>
              <li>
                <Link href="/code-minifier" className="text-slate-300 hover:text-brand-400 transition-colors">
                  Code Minifier
                </Link>
              </li>
              <li>
                <Link href="/utility-tools" className="text-brand-400 hover:underline font-medium inline-block pt-1">
                  All 22 Developer Tools &rarr;
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                  About
                </Link>
                {" · "}
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact
                </Link>
                {" · "}
                <Link href="/privacy-policy" className="text-slate-300 hover:text-white transition-colors">
                  Privacy
                </Link>
                {" · "}
                <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {currentYear} Bits &amp; Tools (BitsAndTools). Founded by Vishavjeet Sharma &amp; Aditya Sharma. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <span>Built for total privacy &bull; Zero server telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
