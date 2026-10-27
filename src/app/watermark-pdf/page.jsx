import React from "react";
import WatermarkPdfWorkspace from "@/components/pdf/WatermarkPdfWorkspace";
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
  Stamp,
  FileText,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Watermark PDF Online — Add Text Watermarks Free & Private",
  description:
    "Stamp custom text watermarks onto PDF pages with full control over opacity, rotation (-45° diagonal or horizontal), typography, and colors without server uploads.",
  keywords: [
    "watermark pdf",
    "add watermark to pdf",
    "stamp pdf online",
    "confidential watermark pdf",
    "draft watermark",
    "free pdf watermarker",
    "protect pdf with watermark",
  ],
  alternates: {
    canonical: "/watermark-pdf",
  },
  openGraph: {
    title: "Watermark PDF Online | Bits & Tools",
    description:
      "Stamp custom text watermarks onto PDF pages with full control over opacity, rotation, typography, and colors.",
    url: "/watermark-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watermark PDF Online | Bits & Tools",
    description:
      "Stamp custom text watermarks onto PDF pages with full control over opacity, rotation, typography, and colors.",
  },
};

const WATERMARK_FAQS = [
  {
    question: "Can I adjust the transparency of the watermark?",
    answer:
      "Yes. You can fine-tune opacity between 10% (ultra-subtle background watermark) and 80% (prominent stamp) so your document content remains completely legible.",
  },
  {
    question: "Can I choose between diagonal and horizontal text?",
    answer:
      "Yes. You can rotate watermarks diagonally at -45° (traditional document security style), horizontally at 0°, or vertically at 90°.",
  },
  {
    question: "Are preset watermarks available?",
    answer:
      "Yes. Quick presets include 'CONFIDENTIAL', 'DRAFT', 'SAMPLE', 'DO NOT COPY', 'INTERNAL ONLY', and 'COPY', or you can type any custom text or company name.",
  },
  {
    question: "Is any file uploaded to an external server?",
    answer:
      "Never. All watermarking operations are performed locally in your browser's memory using client-side JavaScript. No documents or sensitive content leave your machine.",
  },
];

const WATERMARK_STEPS = [
  {
    step: "01",
    title: "Upload PDF",
    description: "Choose or drag and drop your PDF file into the secure workspace.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Customize Watermark",
    description: "Enter your watermark text, pick colors, adjust opacity, and choose orientation.",
    icon: Stamp,
  },
  {
    step: "03",
    title: "Download Stamped PDF",
    description: "Export your permanently watermarked PDF document with instant client-side rendering.",
    icon: Download,
  },
];

export default function WatermarkPdfPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "Watermark PDF", href: "/watermark-pdf" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Watermark PDF Online",
    url: `${baseUrl}/watermark-pdf`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Stamp custom text watermarks onto PDF pages with configurable opacity, rotation, and colors.",
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
              <span>Diagonal & Horizontal &bull; Custom Opacity &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Watermark PDF
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Stamp custom text watermarks onto PDF pages with full control over opacity, rotation, typography, and colors.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero server tracking
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
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <WatermarkPdfWorkspace />
      </section>

      <AdPlacement slotId="watermark-pdf-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Watermark a PDF"
        subtitle="Stamp your documents with customized security marks in 3 steps"
        steps={WATERMARK_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Watermark PDF - Frequently Asked Questions"
        subtitle="Common questions about document watermarking, transparency, and formatting"
        items={WATERMARK_FAQS}
      />

      <RelatedTools currentToolId="watermark-pdf" />
    </div>
  );
}
