import React from "react";
import Link from "next/link";
import { CATEGORIES, getToolsByCategory } from "@/data/toolsRegistry";
import ToolCard from "@/components/common/ToolCard";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlacement from "@/components/common/AdPlacement";
import { Film, Sparkles, ShieldCheck, CheckCircle, Zap } from "lucide-react";

export const metadata = {
  title: "Video & Audio Media Tools Directory — Free Media Utilities",
  description:
    "Trim, compress, convert, and extract audio from video and media files directly in your web browser. 100% private with zero server uploads.",
  alternates: {
    canonical: "/media-tools",
  },
  openGraph: {
    title: "Video & Audio Media Tools Directory | Bits & Tools",
    description:
      "Trim, compress, convert, and extract audio from media files directly in your web browser.",
    url: "/media-tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video & Audio Media Tools Directory | Bits & Tools",
    description:
      "Trim, compress, convert, and extract audio from media files directly in your web browser.",
  },
};

export default function MediaToolsPage() {
  const mediaTools = getToolsByCategory(CATEGORIES.MEDIA.id);
  const availableTools = mediaTools.filter((t) => t.status === "available");
  const upcomingTools = mediaTools.filter((t) => t.status !== "available");

  const breadcrumbs = [{ label: "Media Tools", href: "/media-tools" }];

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Hero Header */}
      <div className="bg-white border-b border-black/[0.06] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />

          <div className="max-w-3xl mt-3 sm:mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Film className="w-3.5 h-3.5 text-brand-600" />
              <span>Video & Audio Utilities Directory</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Video & Audio Tools
            </h1>

            <p className="mt-2.5 sm:mt-4 text-sm sm:text-lg text-slate-600 leading-relaxed">
              Trim video clips, reduce file sizes, generate animated GIFs, and extract studio-quality audio directly on your device.
              100% private in-browser execution with zero cloud uploads.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{availableTools.length} Live Media Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Server Uploads</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Browser RAM Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-12">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Active Media Tools ({availableTools.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {upcomingTools.length > 0 && (
          <div className="pt-8 border-t border-black/[0.06]">
            <h2 className="text-base font-semibold text-slate-700 tracking-tight mb-4">
              Upcoming Tools ({upcomingTools.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
              {upcomingTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        )}
      </div>

      <AdPlacement slotId="media-tools-bottom" />
    </div>
  );
}
