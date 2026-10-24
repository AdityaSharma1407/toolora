import React from "react";
import Link from "next/link";
import { CATEGORIES, getToolsByCategory } from "@/data/toolsRegistry";
import ToolCard from "@/components/common/ToolCard";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlacement from "@/components/common/AdPlacement";
import { Image as ImageIcon, Sparkles, ShieldCheck, ArrowRight, Layers } from "lucide-react";

export const metadata = {
  title: "Image Tools - Free Online Photo Utilities",
  description:
    "Explore Toolora's upcoming image processing tools. Compress, resize, crop, and convert JPG, PNG, and WebP pictures locally in your browser.",
  alternates: {
    canonical: "/image-tools",
  },
};

export default function ImageToolsPage() {
  const imageTools = getToolsByCategory(CATEGORIES.IMAGE.id);
  const breadcrumbs = [{ label: "Image Tools", href: "/image-tools" }];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-brand-50/50 to-white border-b border-slate-100 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />

          <div className="max-w-3xl mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-4">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image Utility Directory</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              All Image Tools
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Fast, high-quality image manipulation utilities designed to run directly on your device.
              Compress, resize, and convert without quality loss or privacy concerns.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Client-Side Canvas Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Modern WebP &amp; PNG Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Notice of Current Release */}
        <div className="p-4 sm:p-5 rounded-2xl bg-brand-50/60 border border-brand-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-brand-100 text-brand-700 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Image Tools Roadmap In Progress
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                Our team is currently polishing the browser-side image processing engine. Check out our active, fully functional Merge PDF tool in the meantime!
              </p>
            </div>
          </div>
          <Link
            href="/merge-pdf"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
          >
            <span>Try Merge PDF</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tools Grid */}
        <section>
          <div className="pb-3 mb-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">
              Planned Image Utilities
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These tools are under active development and scheduled for upcoming releases.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Optional Ad placement */}
        <AdPlacement placement="category-content" />

        {/* Informational Card */}
        <section className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Local Browser Image Processing
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            When Toolora&apos;s image utilities launch, they will use HTML5 Canvas, Web Workers, and WebP compression algorithms directly inside your browser. That means zero server wait times, zero queue delays, and guaranteed privacy for your photos and graphics.
          </p>
        </section>
      </div>
    </div>
  );
}
