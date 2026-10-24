import React from "react";
import Link from "next/link";
import { CATEGORIES, getToolsByCategory } from "@/data/toolsRegistry";
import ToolCard from "@/components/common/ToolCard";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlacement from "@/components/common/AdPlacement";
import { FileText, ShieldCheck, Zap, ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "PDF Tools Directory — Free Online PDF Utilities | Bits & Tools",
  description:
    "Explore Bits & Tools' suite of free PDF tools. Merge, split, compress, convert, and manage your PDF documents directly in your web browser with complete privacy.",
  alternates: {
    canonical: "/pdf-tools",
  },
  openGraph: {
    title: "PDF Tools Directory — Free Online PDF Utilities | Bits & Tools",
    description:
      "Explore Bits & Tools' suite of free PDF tools. Merge, split, compress, convert, and manage your PDF documents directly in your web browser with complete privacy.",
    url: "/pdf-tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Tools Directory — Free Online PDF Utilities | Bits & Tools",
    description:
      "Explore Bits & Tools' suite of free PDF tools. Merge, split, compress, convert, and manage your PDF documents directly in your web browser with complete privacy.",
  },
};

export default function PdfToolsPage() {
  const pdfTools = getToolsByCategory(CATEGORIES.PDF.id);
  const availableTools = pdfTools.filter((t) => t.status === "available");
  const upcomingTools = pdfTools.filter((t) => t.status !== "available");

  const breadcrumbs = [{ label: "PDF Tools", href: "/pdf-tools" }];

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Hero Header */}
      <div className="bg-white border-b border-black/[0.06] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />

          <div className="max-w-3xl mt-3 sm:mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <FileText className="w-3.5 h-3.5 text-brand-600" />
              <span>PDF Utility Directory</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              All PDF Tools
            </h1>

            <p className="mt-2.5 sm:mt-4 text-sm sm:text-lg text-slate-600 leading-relaxed">
              Manage your PDF documents easily. All tools execute locally in your browser for absolute confidentiality and lightning speed.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Server Uploads</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Fast Browser Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Available Live Tools */}
        <section>
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Ready to Use Now</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These tools are fully functional and ready to run.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Optional Ad placement */}
        <AdPlacement placement="category-content" />

        {/* In-Development Roadmap Tools */}
        <section>
          <div className="pb-3 mb-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">
              Upcoming PDF Tools
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These utilities are currently scheduled for release in upcoming updates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {upcomingTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Helpful Info Section */}
        <section className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Why Browser-Based PDF Tools?
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            Most online PDF services upload your private contracts, financial statements, and personal forms to a distant cloud server.
            Bits &amp; Tools uses modern WebAssembly and JavaScript libraries to execute PDF manipulations right inside your browser memory.
            Your confidential files never leave your device.
          </p>
          <div className="mt-4">
            <Link
              href="/merge-pdf"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>Try Merge PDF now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
