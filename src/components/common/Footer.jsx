import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Layers, ShieldCheck, Heart } from "lucide-react";

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
              <h4 className="text-sm font-semibold text-white">
                Browser-Local Document Processing
              </h4>
              <p className="text-xs text-slate-400">
                Toolora processes your PDF files locally on your device using client-side JavaScript. Your documents are never sent to any external server.
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-400">
            100% Free &bull; No Sign-Up &bull; Zero Server Storage
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Designed for speed, clarity, and uncompromising privacy.
            </div>
          </div>

          {/* PDF Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              PDF Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/merge-pdf"
                  className="text-slate-300 hover:text-brand-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Merge PDF</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-brand-950 text-brand-300 border border-brand-800">
                    Live
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/split-pdf"
                  className="text-slate-300 hover:text-brand-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Split PDF</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-brand-950 text-brand-300 border border-brand-800">
                    Live
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/compress-pdf"
                  className="text-slate-300 hover:text-brand-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Compress PDF</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-brand-950 text-brand-300 border border-brand-800">
                    Live
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/jpg-to-pdf"
                  className="text-slate-300 hover:text-brand-400 transition-colors flex items-center gap-1.5"
                >
                  <span>JPG to PDF</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-brand-950 text-brand-300 border border-brand-800">
                    Live
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/pdf-tools" className="text-brand-400 hover:underline">
                  View All PDF Tools &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Image Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Image Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/image-tools#compress-image" className="text-slate-400 hover:text-slate-200">
                  Compress Image
                </Link>
              </li>
              <li>
                <Link href="/image-tools#resize-image" className="text-slate-400 hover:text-slate-200">
                  Resize Image
                </Link>
              </li>
              <li>
                <Link href="/image-tools#crop-image" className="text-slate-400 hover:text-slate-200">
                  Crop Image
                </Link>
              </li>
              <li>
                <Link href="/image-tools" className="text-brand-400 hover:underline">
                  View All Image Tools &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Conversions & Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Conversions & Utilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/#convert-tools" className="hover:text-slate-200">
                  Office to PDF
                </Link>
              </li>
              <li>
                <Link href="/#utility-tools" className="hover:text-slate-200">
                  Developer Utilities
                </Link>
              </li>
              <li>
                <Link href="/#media-tools" className="hover:text-slate-200">
                  Video & Audio Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Company &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-slate-200 transition-colors">
                  About Toolora
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-200 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-slate-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-200 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-200 transition-colors"
                >
                  Open Source Updates
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & legal bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {currentYear} {siteConfig.name}. All rights reserved. Built with precision for the modern web.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-slate-400">
              Privacy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-slate-400">
              Terms
            </Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-slate-400">
              Contact
            </Link>
            <span>&bull;</span>
            <span>Client-side utility platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
