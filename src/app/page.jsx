import React from "react";
import Link from "next/link";
import {
  CATEGORIES,
  getToolsByCategory,
  getAvailableTools,
} from "@/data/toolsRegistry";
import ToolSearch from "@/components/common/ToolSearch";
import CategorySection from "@/components/common/CategorySection";
import ToolCard from "@/components/common/ToolCard";
import AdSlot from "@/components/ads/AdSlot";
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Toolora - Free, Fast & Private Online Tools Platform",
  description:
    "Toolora provides fast, free, and privacy-focused online tools. Merge PDFs and access everyday utilities directly in your browser without uploading files to any server.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const availableTools = getAvailableTools();
  const pdfTools = getToolsByCategory(CATEGORIES.PDF.id);
  const imageTools = getToolsByCategory(CATEGORIES.IMAGE.id);
  const convertTools = getToolsByCategory(CATEGORIES.CONVERT.id);
  const mediaTools = getToolsByCategory(CATEGORIES.MEDIA.id);
  const utilityTools = getToolsByCategory(CATEGORIES.UTILITY.id);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/50 via-white to-white pt-14 pb-12 sm:pt-20 sm:pb-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Browser-Based PDF Tools Now Live</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Every Online Tool You Need,{" "}
            <span className="text-brand-600 underline decoration-brand-200 decoration-wavy decoration-from-font">
              Private &amp; Free
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Combine documents, process images, and convert files directly in your
            web browser. No software installation, no account creation, and zero server storage.
          </p>

          {/* Search Bar */}
          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
            <ToolSearch />
          </div>

          {/* Ad Slot: Below Hero (Disabled by default) */}
          <AdSlot placement="home-top" format="horizontal" />

          {/* Value Highlights */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600">
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
              <span>Instant Local Merging</span>
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
                <span>Ready to Use</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Available Tools
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Explore tools that are fully functional and ready to run locally right now.
              </p>
            </div>

            <Link
              href="/pdf-tools"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>Explore PDF Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Optional Ad Slot: Middle */}
      <AdSlot placement="home-content" format="horizontal" />

      {/* Categorized Tools Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {/* PDF Tools Category */}
        <CategorySection
          id="pdf-tools"
          category={CATEGORIES.PDF}
          tools={pdfTools}
        />

        {/* Image Tools Category */}
        <CategorySection
          id="image-tools"
          category={CATEGORIES.IMAGE}
          tools={imageTools}
        />

        {/* Ad Slot: Between Major Categories */}
        <AdSlot placement="home-content" format="responsive" />

        {/* File Conversion Category */}
        <CategorySection
          id="convert-tools"
          category={CATEGORIES.CONVERT}
          tools={convertTools}
        />

        {/* Video & Audio Category */}
        <CategorySection
          id="media-tools"
          category={CATEGORIES.MEDIA}
          tools={mediaTools}
        />

        {/* Everyday Utilities Category */}
        <CategorySection
          id="utility-tools"
          category={CATEGORIES.UTILITY}
          tools={utilityTools}
        />

        {/* Ad Slot: Lower Content */}
        <AdSlot placement="home-bottom" format="horizontal" />
      </div>

      {/* Privacy Architecture Notice Section */}
      <section className="mt-16 py-12 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-brand-100/70 text-brand-700 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Privacy By Design: Your Documents Never Leave Your Device
          </h2>
          <p className="mt-3 text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Unlike traditional cloud converters that upload your confidential files to remote servers,
            Toolora executes operations in memory using modern WebAssembly and JavaScript.
            Your confidential files remain completely private on your computer or phone.
          </p>
        </div>
      </section>
    </div>
  );
}
