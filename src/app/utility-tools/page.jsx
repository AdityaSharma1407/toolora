import React from "react";
import Link from "next/link";
import { CATEGORIES, getToolsByCategory } from "@/data/toolsRegistry";
import ToolCard from "@/components/common/ToolCard";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdPlacement from "@/components/common/AdPlacement";
import { Wrench, Sparkles, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "Everyday & Developer Tools Directory — Free Online Utilities",
  description:
    "Explore Bits & Tools' suite of fast, private developer utilities. Word counter, JSON formatter, Base64 encoder, UUID generator, Hash calculator, and percentage tools.",
  alternates: {
    canonical: "/utility-tools",
  },
  openGraph: {
    title: "Everyday & Developer Tools Directory | Bits & Tools",
    description:
      "Explore fast, private utilities for text formatting, JSON validation, UUIDs, Base64, and calculations.",
    url: "/utility-tools",
    type: "website",
    images: [
      {
        url: "/images/og-bitsandtools.png",
        width: 1200,
        height: 630,
        alt: "Bits & Tools — Free Online In-Browser Tools",
      },
    ],
  },
  twitter: {
    site: "@bitsandtools",
    creator: "@bitsandtools",
    card: "summary_large_image",
    title: "Everyday & Developer Tools Directory | Bits & Tools",
    description:
      "Fast, private utilities for text, JSON, UUIDs, Base64, and calculations.",
    images: ["/images/og-bitsandtools.png"],
  },
};

export default function UtilityToolsPage() {
  const utilityTools = getToolsByCategory(CATEGORIES.UTILITY.id);
  const availableTools = utilityTools.filter((t) => t.status === "available");
  const upcomingTools = utilityTools.filter((t) => t.status !== "available");

  const breadcrumbs = [{ label: "Utility Tools", href: "/utility-tools" }];

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Hero Header */}
      <div className="bg-white border-b border-black/[0.06] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />

          <div className="max-w-3xl mt-3 sm:mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Wrench className="w-3.5 h-3.5 text-brand-600" />
              <span>Developer & Productivity Tools</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              All Utility Tools
            </h1>

            <p className="mt-2.5 sm:mt-4 text-sm sm:text-lg text-slate-600 leading-relaxed">
              Fast, private productivity and developer utilities designed to run 100% locally in your web browser. Zero server data transmission, maximum speed.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Server Uploads</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Instant In-Memory Computation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Available Tools */}
        <section>
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Developer &amp; Everyday Utilities ({availableTools.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Client-side productivity utilities running directly inside your browser.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Additional Tools */}
        {upcomingTools.length > 0 && (
          <section className="pt-6">
            <div className="pb-3 mb-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-700">More Utilities</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Additional utilities currently being added.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}
      </div>

      <AdPlacement slotId="utility-tools-directory-bottom" />
    </div>
  );
}
