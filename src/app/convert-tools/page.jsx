import React from "react";
import Link from "next/link";
import { CATEGORIES, getToolsByCategory } from "@/data/toolsRegistry";
import ToolCard from "@/components/common/ToolCard";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlacement from "@/components/common/AdPlacement";
import { Repeat, Sparkles, ShieldCheck, ArrowRight, CheckCircle, Zap } from "lucide-react";

export const metadata = {
  title: "File Conversion Tools Directory — Free Office & Document Converters",
  description:
    "Convert Word, Excel, PowerPoint, HTML, and CSV documents to and from PDF directly in your browser. 100% private with zero server uploads.",
  alternates: {
    canonical: "/convert-tools",
  },
  openGraph: {
    title: "File Conversion Tools Directory | Bits & Tools",
    description:
      "Convert Word, Excel, PowerPoint, HTML, and CSV documents to and from PDF directly in your browser.",
    url: "/convert-tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "File Conversion Tools Directory | Bits & Tools",
    description:
      "Convert Word, Excel, PowerPoint, HTML, and CSV documents to and from PDF directly in your browser.",
  },
};

export default function ConvertToolsPage() {
  const convertTools = getToolsByCategory(CATEGORIES.CONVERT.id);
  const availableTools = convertTools.filter((t) => t.status === "available");
  const upcomingTools = convertTools.filter((t) => t.status !== "available");

  const breadcrumbs = [{ label: "File Conversion Tools", href: "/convert-tools" }];

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Hero Header */}
      <div className="bg-white border-b border-black/[0.06] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />

          <div className="max-w-3xl mt-3 sm:mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Repeat className="w-3.5 h-3.5 text-brand-600" />
              <span>Office & Document Conversion Directory</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              File Conversion Tools
            </h1>

            <p className="mt-2.5 sm:mt-4 text-sm sm:text-lg text-slate-600 leading-relaxed">
              Convert Word, Excel, PowerPoint, HTML, and CSV files to and from PDF directly in your web browser. 
              Zero server latency, zero cloud uploads, and 100% confidential in-memory processing.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{availableTools.length} Live Converters</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Server Uploads</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Client-Side Processing</span>
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
              Active Converters ({availableTools.length})
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

      <AdPlacement slotId="convert-tools-bottom" />
    </div>
  );
}
