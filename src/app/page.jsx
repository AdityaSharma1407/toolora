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
  Clock,
  Layers,
  Cpu,
} from "lucide-react";

export const metadata = {
  title: "Bits & Tools — Free, Fast & Private Online Tools Platform",
  description:
    "Fast, free, and privacy-focused online tools. Merge, split, compress PDFs, and convert images directly in your browser with zero server uploads.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Bits & Tools — Free, Fast & Private Online Tools Platform",
    description:
      "Fast, free, and privacy-focused online tools. Merge, split, compress PDFs, and convert images directly in your browser with zero server uploads.",
    url: "/",
    siteName: "Bits & Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bits & Tools — Free, Fast & Private Online Tools Platform",
    description:
      "Fast, free, and privacy-focused online tools. Merge, split, compress PDFs, and convert images directly in your browser with zero server uploads.",
  },
};

export default function HomePage() {
  const availableTools = getAvailableTools();
  const pdfTools = getToolsByCategory(CATEGORIES.PDF.id);
  const imageTools = getToolsByCategory(CATEGORIES.IMAGE.id);
  const convertTools = getToolsByCategory(CATEGORIES.CONVERT.id);
  const mediaTools = getToolsByCategory(CATEGORIES.MEDIA.id);
  const utilityTools = getToolsByCategory(CATEGORIES.UTILITY.id);

  const upcomingPdf = pdfTools.filter((t) => t.status !== "available");
  const upcomingImage = imageTools.filter((t) => t.status !== "available");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-canvas pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-5 border border-black/[0.04]">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Browser-Based PDF &amp; Image Utilities Active</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Every Online Tool You Need,{" "}
            <span className="text-brand-600">
              Private &amp; Free
            </span>
          </h1>

          <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Combine documents, split pages, compress PDFs, and convert images directly in your
            web browser. No software installation, no account creation, and zero server storage.
          </p>

          {/* Search Bar */}
          <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
            <ToolSearch />
          </div>

          {/* Quick Suggestions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="text-slate-400 font-medium">Quick Access:</span>
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
              href="/jpg-to-pdf"
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-slate-700 hover:text-brand-600 hover:border-brand-300 transition-colors"
            >
              JPG to PDF
            </Link>
          </div>

          {/* Ad Slot: Below Hero (Disabled by default) */}
          <AdSlot placement="home-top" format="horizontal" />

          {/* Value Highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Client-Side Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Zero File Uploads to Server</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Instant In-Memory Performance</span>
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
                <span>Ready to Use Now</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Live Online Tools
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Explore tools that are fully functional, thoroughly tested, and ready to execute locally right now.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/pdf-tools"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/70 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>PDF Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/image-tools"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-brand-600 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Image Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
                    4 live client-side tools for merging, splitting, compressing, and compiling PDF files.
                  </p>
                </div>
              </div>
              <Link
                href="/pdf-tools"
                className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
              >
                <span>Directory</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pdfTools
                .filter((t) => t.status === "available")
                .map((tool) => (
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
                    High-resolution picture conversion with custom page sizing, margins, and orientations.
                  </p>
                </div>
              </div>
              <Link
                href="/image-tools"
                className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
              >
                <span>Directory</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {imageTools
                .filter((t) => t.status === "available")
                .map((tool) => (
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

      {/* Planned Engineering Roadmap Section */}
      <section className="py-14 bg-slate-50 border-t border-slate-200/80" id="roadmap">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold mb-3">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              <span>Engineering Roadmap</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Planned Utilities &amp; Upcoming Features
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              We are expanding Bits &amp; Tools with additional client-side tools. Each utility undergoes strict browser memory, security,
              and cross-platform testing before release. Have a feature suggestion? Let us know on our{" "}
              <Link href="/contact" className="text-brand-600 underline">
                contact page
              </Link>
              .
            </p>
          </div>

          <div className="space-y-10">
            {/* Upcoming PDF Features */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>Upcoming PDF Tools</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {upcomingPdf.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* Upcoming Image Features */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-600" />
                <span>Upcoming Image Tools</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {upcomingImage.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* Planned Document Converters */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" />
                <span>Planned File Converters</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {convertTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* Planned Media Utilities */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Planned Media &amp; Audio Tools</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* Planned Everyday Utilities */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-600" />
                <span>Planned Developer &amp; Daily Utilities</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {utilityTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Slot: Bottom (Disabled by default) */}
      <AdSlot placement="home-bottom" format="horizontal" />
    </div>
  );
}
