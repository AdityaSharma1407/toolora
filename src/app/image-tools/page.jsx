import React from "react";
import Link from "next/link";
import { CATEGORIES, getToolsByCategory } from "@/data/toolsRegistry";
import ToolCard from "@/components/common/ToolCard";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlacement from "@/components/common/AdPlacement";
import { Image as ImageIcon, Sparkles, ShieldCheck, ArrowRight, Layers, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Image Tools Directory — Free Online Image Utilities | Bits & Tools",
  description:
    "Convert, manage, and process images directly in your browser. Convert JPG, JPEG, and PNG to high-quality PDF files with complete client-side privacy.",
  alternates: {
    canonical: "/image-tools",
  },
  openGraph: {
    title: "Image Tools Directory — Free Online Image Utilities | Bits & Tools",
    description:
      "Convert, manage, and process images directly in your browser. Convert JPG, JPEG, and PNG to high-quality PDF files with complete client-side privacy.",
    url: "/image-tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Tools Directory — Free Online Image Utilities | Bits & Tools",
    description:
      "Convert, manage, and process images directly in your browser. Convert JPG, JPEG, and PNG to high-quality PDF files with complete client-side privacy.",
  },
};

export default function ImageToolsPage() {
  const imageTools = getToolsByCategory(CATEGORIES.IMAGE.id);
  const availableTools = imageTools.filter((t) => t.status === "available");
  const upcomingTools = imageTools.filter((t) => t.status !== "available");

  const breadcrumbs = [{ label: "Image Tools", href: "/image-tools" }];

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Hero Header */}
      <div className="bg-white border-b border-black/[0.06] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />

          <div className="max-w-3xl mt-3 sm:mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <ImageIcon className="w-3.5 h-3.5 text-brand-600" />
              <span>Image Utility Directory</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              All Image Tools
            </h1>

            <p className="mt-2.5 sm:mt-4 text-sm sm:text-lg text-slate-600 leading-relaxed">
              Fast, high-quality image manipulation utilities designed to run directly on your device.
              Convert photos into documents without quality loss or privacy concerns.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Client-Side In-Memory Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Modern JPG, PNG &amp; PDF Export</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Available Live Image Tools */}
        {availableTools.length > 0 && (
          <section>
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Ready to Use Now</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  These image tools are fully functional and execute locally in your web browser.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Notice of Upcoming Utilities */}
        <div className="p-4 sm:p-5 rounded-2xl bg-brand-50/60 border border-brand-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-brand-100 text-brand-700 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Image Compression &amp; Format Tools In Development
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                We are finishing testing on our client-side image compressor, cropper, and WebP converter. Use our active JPG to PDF tool above today!
              </p>
            </div>
          </div>
          <Link
            href="/jpg-to-pdf"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
          >
            <span>Launch JPG to PDF</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Planned Image Utilities Roadmap */}
        <section>
          <div className="pb-3 mb-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">
              Upcoming Image Utilities Roadmap
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These utilities are currently scheduled for upcoming release cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {upcomingTools.map((tool) => (
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
            When Bits &amp; Tools&apos; upcoming image utilities launch, they will use HTML5 Canvas, Web Workers, and WebP compression algorithms directly inside your browser. That means zero server wait times, zero queue delays, and guaranteed privacy for your photos and graphics.
          </p>
        </section>
      </div>
    </div>
  );
}
