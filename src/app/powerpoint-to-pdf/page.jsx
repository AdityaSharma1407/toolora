import React from "react";
import PowerpointToPdfWorkspace from "@/components/convert/PowerpointToPdfWorkspace";
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
  Presentation,
  Download,
} from "lucide-react";

export const metadata = {
  title: "PowerPoint to PDF Converter Online — Free PPTX to PDF Slides",
  description:
    "Convert PowerPoint presentation files (.pptx) or markdown slide outlines into 16:9 widescreen landscape PDF presentations in your browser. 100% private.",
  keywords: [
    "powerpoint to pdf",
    "pptx to pdf online",
    "convert pptx to pdf free",
    "presentation to pdf",
    "slides to pdf",
  ],
  alternates: {
    canonical: "/powerpoint-to-pdf",
  },
  openGraph: {
    title: "PowerPoint to PDF Converter Online | Bits & Tools",
    description:
      "Convert PowerPoint (.pptx) or outline slides into widescreen 16:9 PDF presentations. 100% private in browser.",
    url: "/powerpoint-to-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PowerPoint to PDF Converter Online | Bits & Tools",
    description:
      "Convert PowerPoint (.pptx) or outline slides into widescreen 16:9 PDF presentations. 100% private in browser.",
  },
};

const PPT_FAQS = [
  {
    question: "What PowerPoint file types are supported?",
    answer:
      "You can upload Microsoft PowerPoint (.pptx) slide decks or paste a text/markdown slide outline using '---' slide separators.",
  },
  {
    question: "What slide aspect ratio is generated?",
    answer:
      "The tool generates modern 16:9 widescreen landscape slides (960 x 540 pt) with slide number badges, bold titles, and bullet lists.",
  },
  {
    question: "Can I choose between light and dark themes?",
    answer:
      "Yes. The workspace provides a toggle between a clean modern light theme and a high-contrast pro dark presentation theme.",
  },
  {
    question: "Are presentation files uploaded to external servers?",
    answer:
      "No. All parsing, text extraction, and PDF generation occur strictly in your device's browser memory. Your pitch decks and slides remain 100% confidential.",
  },
];

const PPT_STEPS = [
  {
    step: "01",
    title: "Upload Presentation",
    description: "Upload your .pptx file or write slide notes in the markdown outline editor.",
    icon: Presentation,
  },
  {
    step: "02",
    title: "Select Theme",
    description: "Choose between Modern Light or Pro Dark slide formatting styles.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Download PDF Slides",
    description: "Export high-resolution, widescreen 16:9 PDF slides ready for presenting.",
    icon: Download,
  },
];

export default function PowerpointToPdfPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "File Conversion", href: "/convert-tools" },
    { label: "PowerPoint to PDF", href: "/powerpoint-to-pdf" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PowerPoint to PDF Converter",
    url: `${baseUrl}/powerpoint-to-pdf`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert PowerPoint files (.pptx) or outline slides into 16:9 widescreen PDF presentations.",
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

      <div className="border-b border-black/[0.06] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pb-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="text-center max-w-3xl mx-auto mt-2 sm:mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>16:9 Widescreen Landscape &bull; Light & Dark Themes &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              PowerPoint to PDF Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert PPTX presentations and slide outlines into high-definition 16:9 widescreen PDF slide decks.
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
                Instant slide generation
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <PowerpointToPdfWorkspace />
      </section>

      <AdPlacement slotId="powerpoint-to-pdf-below-workspace" />

      <HowItWorks
        title="How to Convert PowerPoint to PDF Online"
        subtitle="Turn slide decks and outlines into formatted PDF presentations"
        steps={PPT_STEPS}
      />

      <FAQSection
        title="PowerPoint to PDF - Frequently Asked Questions"
        subtitle="Common questions about slide conversion, aspect ratios, and privacy"
        items={PPT_FAQS}
      />

      <RelatedTools currentToolId="powerpoint-to-pdf" />
    </div>
  );
}
