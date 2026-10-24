import React from "react";
import SplitPdfWorkspace from "@/components/pdf/SplitPdfWorkspace";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import HowItWorks from "@/components/common/HowItWorks";
import FAQSection from "@/components/common/FAQSection";
import RelatedTools from "@/components/common/RelatedTools";
import AdPlacement from "@/components/common/AdPlacement";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Zap, Lock, Sparkles, Scissors } from "lucide-react";

export const metadata = {
  title: "Split PDF Files Online — Separate & Extract PDF Pages | Bits & Tools",
  description:
    "Separate PDF pages into individual files or extract custom page ranges. Free, fast, browser-based, and 100% private. No sign-up required.",
  alternates: {
    canonical: "/split-pdf",
  },
  openGraph: {
    title: "Split PDF Files Online — Separate & Extract PDF Pages | Bits & Tools",
    description:
      "Separate PDF pages into individual files or extract custom page ranges. Fast, free, and secure client-side PDF splitter.",
    url: "/split-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF Files Online — Separate & Extract PDF Pages | Bits & Tools",
    description:
      "Separate PDF pages into individual files or extract custom page ranges. Fast, free, and secure client-side PDF splitter.",
  },
};

const SPLIT_PDF_FAQS = [
  {
    question: "How do I extract specific pages from my PDF?",
    answer:
      "Upload your PDF document, select 'Extract Selected Pages', and enter the page numbers or ranges you want (for example: 1-3, 5, 8). You can also click individual page buttons in the visual preview grid. Then click 'Split PDF' to generate your new document.",
  },
  {
    question: "How does splitting into individual files work?",
    answer:
      "Select 'Split Every Page (ZIP)' mode. Bits & Tools extracts every page of your document as an independent single-page PDF file and packages all of them into a single convenient ZIP archive for download.",
  },
  {
    question: "What page range formats are supported?",
    answer:
      "You can enter single page numbers separated by commas (e.g. 1, 3, 5) or page ranges separated by hyphens (e.g. 1-4, 8-12), or combine both formats (e.g. 1-3, 5, 7-10). Quick preset buttons are also available for All, First, Last, Odd, and Even pages.",
  },
  {
    question: "Are my confidential PDF documents uploaded to a server?",
    answer:
      "No. All page separation and extraction runs 100% locally in your web browser using client-side JavaScript. Your confidential files never leave your device.",
  },
  {
    question: "Why might a PDF fail to split?",
    answer:
      "A PDF will fail to split if it is password-protected or encrypted, corrupted, or has 0 pages. Please unlock password-protected documents before uploading them.",
  },
];

const SPLIT_STEPS = [
  {
    step: "01",
    title: "Upload Your PDF",
    description: "Select or drag and drop a PDF file from your device into the secure upload area.",
    icon: Scissors,
  },
  {
    step: "02",
    title: "Select Split Mode",
    description: "Choose to extract custom page ranges into one PDF, or split all pages into separate files.",
    icon: Scissors,
  },
  {
    step: "03",
    title: "Download Instantly",
    description: "Click Split PDF. Download your extracted document or ZIP archive immediately.",
    icon: Scissors,
  },
];

export default function SplitPdfPage() {
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "Split PDF", href: "/split-pdf" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Split PDF Online",
    url: `${siteConfig.url}/split-pdf`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Separate PDF pages into individual files or extract custom page ranges directly in your browser with complete client-side privacy.",
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
              <span>Page Range Extraction &bull; ZIP Bundling</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Split PDF Files Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Separate PDF pages into individual files or extract the pages you need with zero server uploads.
            </p>

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
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <SplitPdfWorkspace />
      </section>

      {/* Optional Ad placement */}
      <AdPlacement slotId="split-pdf-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Split PDF Files"
        subtitle="Extract or divide pages in 3 simple steps"
        steps={SPLIT_STEPS}
      />

      {/* FAQ */}
      <FAQSection
        title="Split PDF - Frequently Asked Questions"
        subtitle="Helpful answers about page ranges, ZIP packaging, and limits"
        items={SPLIT_PDF_FAQS}
      />

      {/* Related Working Tools */}
      <RelatedTools currentToolId="split-pdf" />
    </div>
  );
}
