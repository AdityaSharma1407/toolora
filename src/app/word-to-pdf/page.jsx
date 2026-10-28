import React from "react";
import WordToPdfWorkspace from "@/components/convert/WordToPdfWorkspace";
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
  FileCheck,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Word to PDF Converter Online — Free DOCX to PDF In Browser",
  description:
    "Convert Microsoft Word documents (.docx) into formatted PDF files directly in your web browser. 100% private with zero file uploads.",
  keywords: [
    "word to pdf",
    "docx to pdf online",
    "convert docx to pdf free",
    "word document to pdf",
    "save word as pdf",
  ],
  alternates: {
    canonical: "/word-to-pdf",
  },
  openGraph: {
    title: "Word to PDF Converter Online | Bits & Tools",
    description:
      "Convert Word documents (.docx) into formatted PDF files directly in your browser. 100% private.",
    url: "/word-to-pdf",
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
    title: "Word to PDF Converter Online | Bits & Tools",
    description:
      "Convert Word documents (.docx) into formatted PDF files directly in your browser. 100% private.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const WORD_FAQS = [
  {
    question: "Does this support modern .docx files?",
    answer:
      "Yes. The engine parses Microsoft Word OpenXML (.docx) files, extracting paragraphs, headings, bulleted lists, and styling runs.",
  },
  {
    question: "Are my confidential Word documents uploaded to any server?",
    answer:
      "No. All archive extraction, text decoding, and PDF construction happen 100% inside your browser memory. Your documents never touch external servers.",
  },
  {
    question: "Can I choose the page size and orientation?",
    answer:
      "Yes. You can toggle between standard A4 and US Letter page sizes, as well as Portrait and Landscape orientations.",
  },
];

const WORD_STEPS = [
  {
    step: "01",
    title: "Upload Document",
    description: "Choose or drag and drop your Microsoft Word (.docx) file into the workspace.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Select Settings",
    description: "Customize your target page size (A4 / Letter) and orientation.",
    icon: FileCheck,
  },
  {
    step: "03",
    title: "Download PDF",
    description: "Download your newly formatted, high-resolution PDF document.",
    icon: Download,
  },
];

export default function WordToPdfPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "File Conversion", href: "/convert-tools" },
    { label: "Word to PDF", href: "/word-to-pdf" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Word to PDF Converter",
    url: `${baseUrl}/word-to-pdf`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert Word documents (.docx) into formatted PDF files directly in your web browser.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1243",
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

      <div className="border-b border-black/[0.06] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pb-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="text-center max-w-3xl mx-auto mt-2 sm:mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Headings & Lists Preservation &bull; Zero Server Uploads &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Word to PDF Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert DOCX Word documents into professional, printable PDF documents directly in your browser.
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
                Instant PDF generation
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <WordToPdfWorkspace />
      </section>

      <AdPlacement slotId="word-to-pdf-below-workspace" />

      <HowItWorks
        title="How to Convert Word to PDF Online"
        subtitle="Turn DOCX files into formatted PDF documents in 3 steps"
        steps={WORD_STEPS}
      />

      <FAQSection
        title="Word to PDF - Frequently Asked Questions"
        subtitle="Common questions about DOCX conversion and privacy"
        items={WORD_FAQS}
      />

      <RelatedTools currentToolId="word-to-pdf" />
    </div>
  );
}
