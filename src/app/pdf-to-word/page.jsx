import React from "react";
import PdfToWordWorkspace from "@/components/convert/PdfToWordWorkspace";
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
  FileText,
  FileEdit,
  Download,
} from "lucide-react";

export const metadata = {
  title: "PDF to Word Converter Online — Free PDF to DOCX In Browser",
  description:
    "Convert PDF files into editable Microsoft Word documents (.docx) and extract raw text directly in your browser. 100% private.",
  keywords: [
    "pdf to word",
    "pdf to docx online",
    "convert pdf to word free",
    "editable pdf to docx",
    "extract text from pdf",
  ],
  alternates: {
    canonical: "/pdf-to-word",
  },
  openGraph: {
    title: "PDF to Word Converter Online | Bits & Tools",
    description:
      "Convert PDF files into editable Microsoft Word documents (.docx) directly in your browser. 100% private.",
    url: "/pdf-to-word",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Word Converter Online | Bits & Tools",
    description:
      "Convert PDF files into editable Microsoft Word documents (.docx) directly in your browser. 100% private.",
  },
};

const PDF_TO_WORD_FAQS = [
  {
    question: "Can I edit the converted file in Microsoft Word or Google Docs?",
    answer:
      "Yes. The output is a genuine OpenXML (.docx) file that opens seamlessly in Microsoft Word, Google Docs, Apple Pages, and LibreOffice.",
  },
  {
    question: "Does it extract headings and paragraphs?",
    answer:
      "Yes. The converter analyzes font metrics and vertical spacing to reconstruct headings, paragraphs, and page breaks from the original PDF document.",
  },
  {
    question: "Can I copy the extracted text directly?",
    answer:
      "Yes. The workspace includes a live text preview box with a one-click 'Copy Text' button for quick text extraction without downloading files.",
  },
  {
    question: "Is my PDF uploaded to any third-party server?",
    answer:
      "No. All text parsing and DOCX archive packaging execute 100% locally in your device's browser memory.",
  },
];

const PDF_TO_WORD_STEPS = [
  {
    step: "01",
    title: "Upload PDF",
    description: "Choose or drag and drop your PDF file into the workspace.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Extract Structure",
    description: "Our browser engine extracts headings, paragraphs, and body text.",
    icon: FileEdit,
  },
  {
    step: "03",
    title: "Download Word (.docx)",
    description: "Download your editable Word document or copy text to clipboard.",
    icon: Download,
  },
];

export default function PdfToWordPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "File Conversion", href: "/convert-tools" },
    { label: "PDF to Word", href: "/pdf-to-word" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PDF to Word Converter",
    url: `${baseUrl}/pdf-to-word`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert PDF files into editable Microsoft Word (.docx) documents in your browser.",
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
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Full OpenXML Packaging &bull; Text Preview &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              PDF to Word Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Extract text, paragraphs, and structure from PDF documents into editable Microsoft Word (.docx) files.
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
                Instant Word generation
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <PdfToWordWorkspace />
      </section>

      <AdPlacement slotId="pdf-to-word-below-workspace" />

      <HowItWorks
        title="How to Convert PDF to Word Online"
        subtitle="Extract and convert documents into editable Word files in seconds"
        steps={PDF_TO_WORD_STEPS}
      />

      <FAQSection
        title="PDF to Word - Frequently Asked Questions"
        subtitle="Common questions about PDF text extraction, formatting, and compatibility"
        items={PDF_TO_WORD_FAQS}
      />

      <RelatedTools currentToolId="pdf-to-word" />
    </div>
  );
}
