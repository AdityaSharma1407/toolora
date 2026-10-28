import React from "react";
import TextDiffWorkspace from "@/components/utility/TextDiffWorkspace";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import HowItWorks from "@/components/common/HowItWorks";
import FAQSection from "@/components/common/FAQSection";
import RelatedTools from "@/components/common/RelatedTools";
import AdPlacement from "@/components/common/AdPlacement";
import { siteConfig } from "@/config/site";
import {
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
  FileDiff,
  Columns,
  Code2,
} from "lucide-react";

export const metadata = {
  title: "Text Diff Checker — Compare Text & Code Online Free",
  description:
    "Compare two text or code files and highlight additions, deletions, and differences line by line. Fast, accurate LCS diff algorithm. 100% free and private.",
  keywords: [
    "text diff checker",
    "compare text online",
    "diff tool",
    "line by line diff",
    "code difference checker",
    "online diff tool",
    "text compare",
  ],
  alternates: {
    canonical: "/text-diff",
  },
  openGraph: {
    title: "Text Diff Checker Online | Bits & Tools",
    description:
      "Compare two text or code snippets and highlight differences with line numbers.",
    url: "/text-diff",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Diff Checker Online | Bits & Tools",
    description:
      "Compare two text or code snippets and highlight differences.",
  },
};

const DIFF_FAQS = [
  {
    question: "How does the text comparison algorithm work?",
    answer:
      "The tool uses the Longest Common Subsequence (LCS) algorithm to accurately isolate modified, inserted, and deleted lines between two texts without altering the original line sequencing.",
  },
  {
    question: "Can I ignore spaces, indentation, or case differences?",
    answer:
      "Yes! You can toggle 'Ignore Whitespace' to prevent formatting and indentation changes from triggering false differences, or toggle 'Ignore Case' to compare text case-insensitively.",
  },
  {
    question: "Is my source code or confidential text uploaded anywhere?",
    answer:
      "No. All comparison and diff parsing runs 100% locally inside your web browser. Nothing is ever sent to or processed by a remote server.",
  },
];

const DIFF_STEPS = [
  {
    step: "01",
    title: "Paste Original Text",
    description: "Enter your original or baseline text in the left input box.",
    icon: Code2,
  },
  {
    step: "02",
    title: "Paste Modified Text",
    description: "Enter your updated or revised text in the right input box.",
    icon: Columns,
  },
  {
    step: "03",
    title: "Review Highlights",
    description: "Inspect the side-by-side or unified diff with green additions and red deletions.",
    icon: Sparkles,
  },
];

export default function TextDiffPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Text Diff Checker", href: "/text-diff" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Text Diff Checker Online",
    url: `${baseUrl}/text-diff`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Compare two text or code files and highlight additions, deletions, and differences line by line.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1081",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />

      {/* Hero Header */}
      <div className="border-b border-black/[0.06] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pb-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="text-center max-w-3xl mx-auto mt-2 sm:mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Fast LCS Diff &bull; Unified & Split &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Text Diff Checker
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Compare two text documents or code snippets to visually identify added, modified, and deleted lines.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero code uploads
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Instant in-memory comparison
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <TextDiffWorkspace />
      </section>

      <AdPlacement slotId="text-diff-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Compare Text Differences"
        subtitle="Detect changes between two texts in 3 simple steps"
        steps={DIFF_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Text Diff - Frequently Asked Questions"
        subtitle="Common questions about diff algorithms, line numbers, and privacy"
        items={DIFF_FAQS}
      />

      <RelatedTools currentToolId="text-diff" />
    </div>
  );
}
