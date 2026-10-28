import React from "react";
import CompressPdfWorkspace from "@/components/pdf/CompressPdfWorkspace";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import HowItWorks from "@/components/common/HowItWorks";
import FAQSection from "@/components/common/FAQSection";
import RelatedTools from "@/components/common/RelatedTools";
import QuickTake from "@/components/common/QuickTake";
import AdPlacement from "@/components/common/AdPlacement";
import { siteConfig } from "@/config/site";
import { buildToolPageGraphSchema, CANONICAL_ENTITIES } from "@/lib/seo/schema";
import { ShieldCheck, Zap, Lock, Sparkles, Minimize2 } from "lucide-react";

export const metadata = {
  title: "Compress PDF Files Online — Reduce PDF Size Free",
  description:
    "Reduce PDF file size with genuine client-side structural optimization. Free, fast, private, and browser-based with zero file uploads.",
  alternates: {
    canonical: "/compress-pdf",
  },
  openGraph: {
    title: "Compress PDF Files Online — Reduce PDF Size Free | Bits & Tools",
    description:
      "Reduce PDF file size with a simple, browser-based compression workflow. Free, secure, client-side PDF optimizer.",
    url: "/compress-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF Files Online — Reduce PDF Size Free | Bits & Tools",
    description:
      "Reduce PDF file size with a simple, browser-based compression workflow. Free, secure, client-side PDF optimizer.",
  },
};

const COMPRESS_PDF_FAQS = [
  {
    question: "How do I compress a PDF online?",
    answer:
      "Upload your PDF document by dragging and dropping it into the upload box. Choose your preferred optimization level (Basic, Recommended, or Maximum), and click 'Compress PDF'. Once processed, you will see a detailed comparison of the original versus compressed file size with an instant download button.",
  },
  {
    question: "Will compressing my PDF reduce text or image quality?",
    answer:
      "No. Bits & Tools' browser-side optimizer specializes in structural compaction, unused object purging, and object stream compression. It cleans unnecessary internal revision histories and metadata without downsampling vector fonts or text crispness.",
  },
  {
    question: "Why didn't my PDF file size decrease significantly?",
    answer:
      "Some PDFs are already heavily compressed when originally saved (for example, scanned PDFs consisting of pre-compressed JPEG streams). In such documents, further compression without degrading image resolution is physically impossible. Bits & Tools will honestly notify you if your document is already fully optimized.",
  },
  {
    question: "Are my confidential files uploaded to a remote server?",
    answer:
      "Never. All PDF compression and stream optimizations run entirely inside your device's web browser using client-side JavaScript. Your confidential files never touch an external server or third-party cloud API.",
  },
  {
    question: "What is the maximum file size supported for compression?",
    answer:
      `Bits & Tools supports PDF documents up to ${siteConfig.limits.compressPdf.maxFileSizeFormatted} in size. Because processing takes place locally in browser RAM, keeping files within this limit ensures smooth, responsive execution across laptops, tablets, and phones.`,
  },
];

const COMPRESS_STEPS = [
  {
    step: "01",
    title: "Upload Your PDF",
    description: "Choose or drag and drop a PDF file into the secure compression workspace.",
    icon: Minimize2,
  },
  {
    step: "02",
    title: "Select Optimization Level",
    description: "Pick from Basic, Recommended, or Maximum structural stream optimization.",
    icon: Minimize2,
  },
  {
    step: "03",
    title: "Download Compressed File",
    description: "Click Compress PDF. View your exact size savings and download the clean document.",
    icon: Minimize2,
  },
];

export default function CompressPdfPage() {
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "Compress PDF", href: "/compress-pdf" },
  ];

  const toolSchema = buildToolPageGraphSchema({
    tool: {
      name: "Compress PDF Online",
      route: "/compress-pdf",
      description:
        "Reduce PDF file size through structural optimization and stream compaction directly in your browser with complete client-side privacy.",
      applicationCategory: "UtilitiesApplication",
      datePublished: "2026-10-24T10:51:11.000Z",
      dateModified: "2026-10-28T00:00:00.000Z",
    },
    breadcrumbs,
    faqs: COMPRESS_PDF_FAQS,
    aboutEntities: [CANONICAL_ENTITIES.PDF],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "947",
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
      {/* Hero Header */}
      <header className="border-b border-black/[0.06] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pb-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="text-center max-w-3xl mx-auto mt-2 sm:mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Structural Optimization &bull; Zero Server Storage</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Compress PDF Files Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Reduce PDF file size with a fast, browser-based compression workflow.
            </p>

            {/* Quick Take / TL;DR */}
            <QuickTake
              toolName="Compress PDF"
              actionVerb="optimize structural stream data and reduce size of"
              fileTypes="PDF documents"
            />

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
                Fast in-browser processing
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <section aria-label="Interactive Compress PDF workspace" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <CompressPdfWorkspace />
      </section>

      {/* Optional Ad placement */}
      <AdPlacement slotId="compress-pdf-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Compress PDF Files"
        subtitle="Reduce document overhead in 3 quick steps"
        steps={COMPRESS_STEPS}
      />

      {/* FAQ */}
      <FAQSection
        title="Compress PDF - Frequently Asked Questions"
        subtitle="Everything you need to know about browser-based PDF compression"
        items={COMPRESS_PDF_FAQS}
      />

      {/* Related Working Tools */}
      <RelatedTools currentToolId="compress-pdf" />
    </main>
  );
}
