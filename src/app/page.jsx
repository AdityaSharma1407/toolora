import React from "react";
import Link from "next/link";
import {
  CATEGORIES,
  getToolsByCategory,
  getAvailableTools,
} from "@/data/toolsRegistry";
import ToolSearch from "@/components/common/ToolSearch";
import ToolCard from "@/components/common/ToolCard";
import AdSlot from "@/components/ads/AdSlot";
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Layers,
  Cpu,
  Repeat,
  Film,
  Wrench,
} from "lucide-react";

export const metadata = {
  title: "Bits & Tools — 55 Free, Fast & Private Online Tools",
  description:
    "Fast, free, and privacy-focused online tools platform. Merge, split, compress PDFs, convert images, documents, audio, video, and developer utilities directly in your browser with zero server uploads.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Bits & Tools — 55 Free, Fast & Private Online Tools",
    description:
      "Fast, free, and privacy-focused online tools platform. 55 client-side utilities running in-browser with zero server uploads.",
    url: "/",
    siteName: "Bits & Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bits & Tools — 55 Free, Fast & Private Online Tools",
    description:
      "55 client-side utilities running in-browser with zero server uploads.",
  },
};

export default function HomePage() {
  const availableTools = getAvailableTools().filter(
    (tool, idx, arr) => idx === arr.findIndex((t) => t.route === tool.route)
  );
  const pdfTools = getToolsByCategory(CATEGORIES.PDF.id);
  const imageTools = getToolsByCategory(CATEGORIES.IMAGE.id);
  const convertTools = getToolsByCategory(CATEGORIES.CONVERT.id);
  const mediaTools = getToolsByCategory(CATEGORIES.MEDIA.id);
  const utilityTools = getToolsByCategory(CATEGORIES.UTILITY.id);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-canvas pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-5 border border-black/[0.04]">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>55 In-Browser Tools &bull; 100% Free &amp; Private</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Every Online Tool You Need{" "}
            <span className="text-brand-600">
              Private &amp; Free
            </span>
          </h1>

          <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Merge PDFs, convert images, transcode audio, trim video, and access 20+ developer utilities directly in your
            web browser. No accounts, no waiting, and zero server storage.
          </p>

          {/* Search Bar */}
          <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
            <ToolSearch />
          </div>

          {/* Quick Suggestions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="text-slate-400 font-medium">Popular Tools:</span>
            <Link
              href="/merge-pdf"
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-slate-700 hover:text-brand-600 hover:border-brand-300 transition-colors"
            >
              Merge PDF
            </Link>
            <Link
              href="/split-pdf"
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-slate-700 hover:text-brand-600 hover:border-brand-300 transition-colors"
            >
              Split PDF
            </Link>
            <Link
              href="/compress-pdf"
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-slate-700 hover:text-brand-600 hover:border-brand-300 transition-colors"
            >
              Compress PDF
            </Link>
            <Link
              href="/html-to-pdf"
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-slate-700 hover:text-brand-600 hover:border-brand-300 transition-colors"
            >
              HTML to PDF
            </Link>
            <Link
              href="/markdown-editor"
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-slate-700 hover:text-brand-600 hover:border-brand-300 transition-colors"
            >
              Markdown Editor
            </Link>
          </div>

          {/* Value Props */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% In-Browser Execution</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero Server Telemetry</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero Upload Latency</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Ready Tools Section */}
      <section className="py-12 bg-white" id="all-tools">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>All 55 Tools Active &amp; Ready</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Live Online Tools
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Explore all 55 tools that are fully functional, thoroughly tested, and ready to execute locally right now.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/pdf-tools"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/70 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>PDF (12)</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/image-tools"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-brand-600 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Images (10)</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/convert-tools"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-brand-600 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Convert (6)</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/media-tools"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-brand-600 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Media (5)</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/utility-tools"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-brand-600 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Utilities (22)</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Optional Ad Slot: Middle */}
      <AdSlot placement="home-content" format="horizontal" />

      {/* Active Suites Detail Section */}
      <section className="py-12 bg-slate-50/60 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* PDF Tools Suite Overview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-100 text-brand-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    PDF Productivity Suite
                  </h3>
                  <p className="text-xs text-slate-500">
                    12 live client-side tools for merging, splitting, compressing, converting, rotating, protecting, and numbering PDF files.
                  </p>
                </div>
              </div>
              <Link
                href="/pdf-tools"
                className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
              >
                <span>View All 12 PDF Tools</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pdfTools.slice(0, 4).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>

          {/* Image Tools Suite Overview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Image Conversion Suite
                  </h3>
                  <p className="text-xs text-slate-500">
                    10 tools for resizing, compressing, converting (JPG, PNG, WebP, SVG), cropping, and extracting color palettes.
                  </p>
                </div>
              </div>
              <Link
                href="/image-tools"
                className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
              >
                <span>View All 10 Image Tools</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {imageTools.slice(0, 4).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>

          {/* File Conversion Suite Overview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                  <Repeat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    File Conversion Suite
                  </h3>
                  <p className="text-xs text-slate-500">
                    6 in-browser tools to convert HTML, Excel, Word, and PowerPoint to and from clean PDF documents.
                  </p>
                </div>
              </div>
              <Link
                href="/convert-tools"
                className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
              >
                <span>View All 6 Convert Tools</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {convertTools.slice(0, 4).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>

          {/* Video & Audio Suite Overview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Video &amp; Audio Suite
                  </h3>
                  <p className="text-xs text-slate-500">
                    5 in-browser utilities to trim clips, generate GIFs, compress video bitrate, and convert high-fidelity MP3/WAV audio.
                  </p>
                </div>
              </div>
              <Link
                href="/media-tools"
                className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
              >
                <span>View All 5 Media Tools</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mediaTools.slice(0, 4).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>

          {/* Developer & Everyday Tools Suite Overview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Everyday &amp; Developer Suite
                  </h3>
                  <p className="text-xs text-slate-500">
                    22 productivity utilities: Markdown live editor, Regex tester, Cron generator, cURL converter, Code minifier, QR code maker, and JSON tools.
                  </p>
                </div>
              </div>
              <Link
                href="/utility-tools"
                className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
              >
                <span>View All 22 Developer Tools</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {utilityTools.slice(0, 4).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Architecture Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-brand-100/70 text-brand-700 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy By Design: Your Documents Never Leave Your Device
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Unlike traditional cloud converters that upload your confidential contracts, tax forms, and financial statements to remote third-party servers,
            Bits &amp; Tools executes all binary operations locally in browser memory.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Zero Server Storage
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Files are never uploaded, logged, or cached on external disks. Document memory is discarded once complete.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Client-Side Engine
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Powered by modern JavaScript and WebAssembly compiled to run right inside your browser window.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Zero Bandwidth Delay
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Skip uploading gigabytes over slow internet connections. Processing finishes in seconds regardless of connection speed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 100% Engineering Milestone Section */}
      <section className="py-14 bg-slate-50 border-t border-slate-200/80" id="roadmap">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200/60">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Delivery Milestone Achieved</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              All 55 Planned In-Browser Utilities Are Live!
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Every planned utility across all 5 engineering suites has been released and verified. Have a suggestion for an additional tool? Let us know on our{" "}
              <Link href="/contact" className="text-brand-600 underline font-semibold">
                contact page
              </Link>
              .
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link
              href="/pdf-tools"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-500 hover:shadow-subtle transition-all text-center space-y-1 group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-900">PDF Suite</div>
              <div className="text-xs text-emerald-600 font-semibold">12 of 12 Live</div>
            </Link>

            <Link
              href="/image-tools"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-500 hover:shadow-subtle transition-all text-center space-y-1 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-900">Image Suite</div>
              <div className="text-xs text-emerald-600 font-semibold">10 of 10 Live</div>
            </Link>

            <Link
              href="/convert-tools"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-500 hover:shadow-subtle transition-all text-center space-y-1 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <Repeat className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-900">File Conversion</div>
              <div className="text-xs text-emerald-600 font-semibold">6 of 6 Live</div>
            </Link>

            <Link
              href="/media-tools"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-500 hover:shadow-subtle transition-all text-center space-y-1 group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-900">Media Suite</div>
              <div className="text-xs text-emerald-600 font-semibold">5 of 5 Live</div>
            </Link>

            <Link
              href="/utility-tools"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-500 hover:shadow-subtle transition-all text-center space-y-1 group col-span-2 sm:col-span-1"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-900">Developer Suite</div>
              <div className="text-xs text-emerald-600 font-semibold">22 of 22 Live</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Slot: Bottom (Disabled by default) */}
      <AdSlot placement="home-bottom" format="horizontal" />
    </div>
  );
}
