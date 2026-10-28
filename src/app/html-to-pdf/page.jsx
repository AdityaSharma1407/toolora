import React from "react";
import HtmlToPdfWorkspace from "@/components/convert/HtmlToPdfWorkspace";
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
  Code,
  FileText,
  Download,
} from "lucide-react";

export const metadata = {
  title: "HTML to PDF Converter Online — Free Webpage & Code to PDF",
  description:
    "Convert HTML markup, code snippets, or .html files into clean, paginated PDF documents directly in your browser. 100% private with custom page sizes.",
  keywords: [
    "html to pdf",
    "convert html to pdf online",
    "html code to pdf",
    "webpage to pdf",
    "save html as pdf",
    "html to pdf free",
  ],
  alternates: {
    canonical: "/html-to-pdf",
  },
  openGraph: {
    title: "HTML to PDF Converter Online | Bits & Tools",
    description:
      "Convert HTML markup or .html files into clean, formatted PDF documents in your browser. 100% client-side privacy.",
    url: "/html-to-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HTML to PDF Converter Online | Bits & Tools",
    description:
      "Convert HTML markup or .html files into clean, formatted PDF documents in your browser. 100% client-side privacy.",
  },
};

const HTML_FAQS = [
  {
    question: "Can I paste raw HTML markup directly?",
    answer:
      "Yes. You can switch between the live HTML code editor and file upload. Paste headings, paragraphs, lists, tables, and blockquotes to instantly generate a PDF.",
  },
  {
    question: "What page sizes and orientations are supported?",
    answer:
      "You can export to standard A4, US Letter, or Legal page sizes in either Portrait or Landscape orientation with automatic multi-page text wrapping.",
  },
  {
    question: "Are my HTML files uploaded to a remote server?",
    answer:
      "No. All parsing, font embedding, and PDF document generation occur 100% inside your browser memory. Your documents and data remain confidential.",
  },
  {
    question: "Does it support tables and code blocks?",
    answer:
      "Yes. The engine parses HTML <table> tags with borders and header shading, and <pre><code> blocks with monospace fonts and background containers.",
  },
];

const HTML_STEPS = [
  {
    step: "01",
    title: "Provide HTML",
    description: "Paste your HTML markup into the editor or upload an existing .html file.",
    icon: Code,
  },
  {
    step: "02",
    title: "Configure Layout",
    description: "Choose your preferred page format (A4 / Letter), orientation, and styling theme.",
    icon: FileText,
  },
  {
    step: "03",
    title: "Download PDF",
    description: "Instantly download your cleanly paginated, printable PDF document.",
    icon: Download,
  },
];

export default function HtmlToPdfPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "File Conversion", href: "/convert-tools" },
    { label: "HTML to PDF", href: "/html-to-pdf" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "HTML to PDF Converter",
    url: `${baseUrl}/html-to-pdf`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert HTML markup or .html files into formatted PDF documents in your browser.",
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
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Multi-Page Pagination &bull; Tables & Code &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              HTML to PDF Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert raw HTML code, web snippets, or uploaded .html files into beautifully formatted, printable PDF documents.
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
        <HtmlToPdfWorkspace />
      </section>

      <AdPlacement slotId="html-to-pdf-below-workspace" />

      <HowItWorks
        title="How to Convert HTML to PDF Online"
        subtitle="Turn code or documents into clean PDFs in seconds"
        steps={HTML_STEPS}
      />

      <FAQSection
        title="HTML to PDF - Frequently Asked Questions"
        subtitle="Common questions about HTML formatting, tables, and privacy"
        items={HTML_FAQS}
      />

      <RelatedTools currentToolId="html-to-pdf" />
    </div>
  );
}
