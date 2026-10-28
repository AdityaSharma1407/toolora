import React from "react";
import JpgToPdfWorkspace from "@/components/image/JpgToPdfWorkspace";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import HowItWorks from "@/components/common/HowItWorks";
import FAQSection from "@/components/common/FAQSection";
import RelatedTools from "@/components/common/RelatedTools";
import QuickTake from "@/components/common/QuickTake";
import NextIntentSection from "@/components/common/NextIntentSection";
import MicroInteractionBar from "@/components/common/MicroInteractionBar";
import ExactNextStepCard from "@/components/common/ExactNextStepCard";
import QuickJumpToc from "@/components/common/QuickJumpToc";
import AdPlacement from "@/components/common/AdPlacement";
import { siteConfig } from "@/config/site";
import { buildToolPageGraphSchema, CANONICAL_ENTITIES } from "@/lib/seo/schema";
import { resolveTemporalParity } from "@/lib/seo/temporal-engine";
import { getSitelinkMetadata, getSerpVariantMetadata } from "@/lib/seo/ab-meta-engine";
import { ShieldCheck, Zap, Lock, Sparkles, Image as ImageIcon } from "lucide-react";

const temporal = resolveTemporalParity("/jpg-to-pdf");
const sitelinkMeta = getSitelinkMetadata("/jpg-to-pdf");

export const metadata = {
  title: sitelinkMeta.title,
  description: sitelinkMeta.description,
  alternates: {
    canonical: "/jpg-to-pdf",
  },
  openGraph: {
    title: `${sitelinkMeta.title} — Fast, Free & Private`,
    description: sitelinkMeta.description,
    url: "/jpg-to-pdf",
    type: "article",
    publishedTime: temporal.isoPublished,
    modifiedTime: temporal.isoModified,
  },
  twitter: {
    card: "summary_large_image",
    title: `${sitelinkMeta.title} — Fast, Free & Private`,
    description: sitelinkMeta.description,
  },
  other: {
    "article:published_time": temporal.isoPublished,
    "article:modified_time": temporal.isoModified,
  },
};

const JPG_TO_PDF_FAQS = [
  {
    question: "How do I convert JPG images to a PDF?",
    answer:
      "Drag and drop or select one or more JPG, JPEG, or PNG images into the upload area. Rearrange the image sequence if needed, customize your layout preferences (A4, Letter, or Fit to Image, Margins, and Orientation), and click 'Convert to PDF' to download your compiled document.",
  },
  {
    question: "Can I combine multiple pictures into one PDF?",
    answer:
      "Yes! You can upload up to 30 images at once. Bits & Tools compiles each photo as a distinct page within a single unified PDF file following the exact order you specify.",
  },
  {
    question: "Are PNG graphics and photos supported?",
    answer:
      "Yes. In addition to standard JPG and JPEG files, Bits & Tools supports PNG images with transparency and high-resolution color depth.",
  },
  {
    question: "Are my photos uploaded to a cloud server?",
    answer:
      "No. All image reading, decoding, and PDF embedding happens entirely inside your web browser on your computer, tablet, or phone. Your personal photographs and graphics are never sent over the internet or stored on our servers.",
  },
  {
    question: "What page sizes and layout options are available?",
    answer:
      "You can choose standard ISO A4, US Letter, or Fit to Image (which sizes each page to the exact dimensions of your graphic). You can also configure Portrait or Landscape orientation, Fit vs Fill placement, and Small, Medium, Large, or Zero margins.",
  },
];

const JPG_STEPS = [
  {
    step: "01",
    title: "Select Images",
    description: "Upload single or multiple JPG, JPEG, or PNG photos from your computer or phone.",
    icon: ImageIcon,
  },
  {
    step: "02",
    title: "Customize Layout",
    description: "Rearrange image order, choose page dimensions (A4, Letter, Fit), orientation, and margins.",
    icon: ImageIcon,
  },
  {
    step: "03",
    title: "Download PDF",
    description: "Click Convert to PDF. Your high-resolution compiled document is ready in seconds.",
    icon: ImageIcon,
  },
];

export default function JpgToPdfPage() {
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "JPG to PDF", href: "/jpg-to-pdf" },
  ];

  const toolSchema = buildToolPageGraphSchema({
    tool: {
      name: "JPG to PDF Converter Online",
      route: "/jpg-to-pdf",
      description:
        "Convert JPG, JPEG, and PNG images into a single unified PDF document directly inside your browser with complete client-side privacy.",
      applicationCategory: "UtilitiesApplication",
      datePublished: "2026-10-24T10:51:11.000Z",
      dateModified: "2026-10-28T00:00:00.000Z",
    },
    breadcrumbs,
    faqs: JPG_TO_PDF_FAQS,
    aboutEntities: [CANONICAL_ENTITIES.IMAGE_PROCESSING, CANONICAL_ENTITIES.PDF],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1756",
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
              <span>Multi-Image Compilation &bull; Custom Page Sizing</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              JPG to PDF Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert JPG, JPEG, and PNG images into a single PDF document with custom page sizes and orientations.
            </p>

            {/* Quick Take / TL;DR */}
            <QuickTake
              toolName="JPG to PDF Converter"
              actionVerb="compile and convert"
              fileTypes="JPG, PNG, and WebP images into formatted PDF documents"
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
                Fast in-browser conversion
              </span>
            </div>

            {/* Inline Interactive Micro-Utility */}
            <MicroInteractionBar toolName="JPG to PDF" defaultMegabytes={10} />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <section aria-label="Interactive JPG to PDF workspace" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <JpgToPdfWorkspace />
      </section>

      {/* Algorithmic "Exact Next Step" Intent-Locking Card */}
      <div className="px-4 sm:px-6 lg:px-8">
        <ExactNextStepCard currentRoute="/jpg-to-pdf" />
      </div>

      {/* Optional Ad placement */}
      <AdPlacement slotId="jpg-to-pdf-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Convert Images to PDF"
        subtitle="Turn pictures into documents in 3 simple steps"
        steps={JPG_STEPS}
      />

      {/* FAQ */}
      <FAQSection
        title="JPG to PDF - Frequently Asked Questions"
        subtitle="Answers regarding formats, page dimensions, and compression"
        items={JPG_TO_PDF_FAQS}
      />

      {/* "Session-Terminator" Layout Component for Peripheral Doubt & Secondary Intent Resolution */}
      <NextIntentSection currentToolId="jpg-to-pdf" />

      {/* Related Working Tools */}
      <RelatedTools currentToolId="jpg-to-pdf" />
      {/* Contextual Quick-Jump Table of Contents Drawer */}
      <QuickJumpToc />
    </main>
  );
}
