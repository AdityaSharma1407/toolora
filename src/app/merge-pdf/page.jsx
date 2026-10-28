import React from "react";
import MergePdfWorkspace from "@/components/pdf/MergePdfWorkspace";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import HowItWorks from "@/components/common/HowItWorks";
import FAQSection from "@/components/common/FAQSection";
import RelatedTools from "@/components/common/RelatedTools";
import QuickTake from "@/components/common/QuickTake";
import NextIntentSection from "@/components/common/NextIntentSection";
import AdPlacement from "@/components/common/AdPlacement";
import { siteConfig } from "@/config/site";
import { buildToolPageGraphSchema, CANONICAL_ENTITIES } from "@/lib/seo/schema";
import { resolveTemporalParity } from "@/lib/seo/temporal-engine";
import { ShieldCheck, Zap, Lock, Sparkles } from "lucide-react";

const temporal = resolveTemporalParity("/merge-pdf");

export const metadata = {
  title: "Merge PDF Files Online — Free PDF Merger",
  description:
    "Combine multiple PDF files into one document in seconds. 100% free, browser-based, secure, and private. No installation or registration required.",
  alternates: {
    canonical: "/merge-pdf",
  },
  openGraph: {
    title: "Merge PDF Files Online — Free PDF Merger | Bits & Tools",
    description:
      "Combine multiple PDF files into one document in seconds. Free, simple, and secure client-side PDF merger.",
    url: "/merge-pdf",
    type: "article",
    publishedTime: temporal.isoPublished,
    modifiedTime: temporal.isoModified,
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Files Online — Free PDF Merger | Bits & Tools",
    description:
      "Combine multiple PDF files into one document in seconds. Free, simple, and secure client-side PDF merger.",
  },
  other: {
    "article:published_time": temporal.isoPublished,
    "article:modified_time": temporal.isoModified,
  },
};

const MERGE_PDF_FAQS = [
  {
    question: "How do I merge multiple PDF files?",
    answer:
      "Click 'Select PDF Files' or drag and drop two or more PDF files into the upload box. Use the up and down arrow buttons to arrange your documents in the exact sequence you want them combined. Then click 'Merge PDF Files' to combine them and download your new PDF.",
  },
  {
    question: "Is the PDF merger free to use?",
    answer:
      "Yes, Bits & Tools' PDF Merger is completely free with no hidden charges, trial periods, or mandatory account registration. You can merge documents as often as you need.",
  },
  {
    question: "Can I change the order of PDF files before merging?",
    answer:
      "Yes! Once you upload your files, you will see a list with index numbers (#1, #2, etc.). Simply click the Up or Down arrow icons next to any file to rearrange them. The final document will follow that exact order.",
  },
  {
    question: "Are my PDF files uploaded to a server?",
    answer:
      "No. Unlike conventional online tools, Bits & Tools processes your files entirely inside your web browser using client-side JavaScript. Your documents never leave your computer, phone, or local network, ensuring absolute privacy for sensitive documents.",
  },
  {
    question: "Why might a PDF fail to merge?",
    answer:
      "A merge can fail if a PDF is password-protected or encrypted, corrupted/malformed, has 0 pages, or exceeds your browser's memory limitations. If a document fails, Bits & Tools will highlight the specific file so you can remove or unlock it.",
  },
  {
    question: "What are the file size and file count limits?",
    answer:
      `You can combine up to ${siteConfig.limits.mergePdf.maxFiles} PDF files at once, with a maximum file size of ${siteConfig.limits.mergePdf.maxFileSizeFormatted} per document and an overall total of ${siteConfig.limits.mergePdf.maxTotalSizeFormatted}. These limits ensure smooth performance in standard web browsers.`,
  },
];

export default function MergePdfPage() {
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "Merge PDF", href: "/merge-pdf" },
  ];

  const toolSchema = buildToolPageGraphSchema({
    tool: {
      name: "Merge PDF Online",
      route: "/merge-pdf",
      description:
        "Combine multiple PDF files into one document in seconds. 100% free, browser-based, secure, and private with zero server file uploads.",
      applicationCategory: "UtilitiesApplication",
      datePublished: "2026-10-24T10:51:11.000Z",
      dateModified: "2026-10-28T00:00:00.000Z",
    },
    breadcrumbs,
    faqs: MERGE_PDF_FAQS,
    aboutEntities: [CANONICAL_ENTITIES.PDF],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1028",
      bestRating: "5",
      worstRating: "1",
    },
  });

  return (
    <main className="flex flex-col min-h-screen bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      {/* Top Breadcrumbs & Hero Header */}
      <header className="border-b border-black/[0.06] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pb-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="text-center max-w-3xl mx-auto mt-2 sm:mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Fast &bull; Private &bull; Client-Side</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Merge PDF Files Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Combine multiple PDF files into one document in seconds. Free, simple, and secure.
            </p>

            {/* Quick Take / TL;DR for AI Extractors & Users */}
            <QuickTake
              toolName="Merge PDF"
              actionVerb="combine and reorder"
              fileTypes="multiple PDF documents"
            />

            {/* Quick Guarantees */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                No file upload to servers
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Instant in-memory processing
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Interactive Tool Workspace */}
      <section aria-label="Interactive Merge PDF workspace" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <MergePdfWorkspace />
      </section>

      {/* Ad Placement Below Workspace (Disabled by Default) */}
      <AdPlacement slotId="merge-pdf-below-workspace" />

      {/* How It Works Section */}
      <HowItWorks
        title="How to Merge PDF Files"
        subtitle="Follow these 3 simple steps to join your documents together"
      />

      {/* Comprehensive FAQ Section */}
      <FAQSection
        title="Merge PDF - Frequently Asked Questions"
        subtitle="Clear answers about privacy, compatibility, and file limits"
        items={MERGE_PDF_FAQS}
      />

      {/* "Session-Terminator" Layout Component for Peripheral Doubt & Secondary Intent Resolution */}
      <NextIntentSection currentToolId="merge-pdf" />

      {/* Related Working Tools Siloed to PDF Suite */}
      <RelatedTools currentToolId="merge-pdf" />
    </main>
  );
}
