import React from "react";
import PdfToExcelWorkspace from "@/components/convert/PdfToExcelWorkspace";
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
  FileSpreadsheet,
  Table,
  Download,
} from "lucide-react";

export const metadata = {
  title: "PDF to Excel Converter Online — Free Extract PDF to XLSX & CSV",
  description:
    "Extract tables, financial sheets, and structured data from PDF documents into Microsoft Excel (.xlsx) and CSV files. 100% private in browser.",
  keywords: [
    "pdf to excel",
    "pdf to xlsx online",
    "extract table from pdf",
    "pdf to csv",
    "convert pdf table to excel",
    "free pdf to excel converter",
  ],
  alternates: {
    canonical: "/pdf-to-excel",
  },
  openGraph: {
    title: "PDF to Excel Converter Online | Bits & Tools",
    description:
      "Extract tables and data from PDF documents into Excel (.xlsx) and CSV files. 100% private in browser.",
    url: "/pdf-to-excel",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Excel Converter Online | Bits & Tools",
    description:
      "Extract tables and data from PDF documents into Excel (.xlsx) and CSV files. 100% private in browser.",
  },
};

const PDF_TO_EXCEL_FAQS = [
  {
    question: "How does table detection work?",
    answer:
      "The converter extracts text items along with their spatial coordinates (X, Y) from the PDF document, clustering items aligned along horizontal lines into rows and vertical positions into columns.",
  },
  {
    question: "Can I download both Excel (.xlsx) and CSV formats?",
    answer:
      "Yes. The workspace provides one-click downloads for both genuine OpenXML Microsoft Excel (.xlsx) workbooks and standard comma-separated value (.csv) files.",
  },
  {
    question: "Are numbers formatted as actual numeric values in Excel?",
    answer:
      "Yes. The engine inspects each cell value: numeric entries are stored as native numbers for Excel formulas, while text is stored cleanly without distortion.",
  },
  {
    question: "Is my financial or business data kept private?",
    answer:
      "Absolutely. All document parsing and Excel workbook creation execute 100% locally in your web browser. Nothing is ever sent to an external server.",
  },
];

const PDF_TO_EXCEL_STEPS = [
  {
    step: "01",
    title: "Upload PDF",
    description: "Choose or drag and drop your PDF with tabular data or financial reports.",
    icon: Table,
  },
  {
    step: "02",
    title: "Extract Table Rows",
    description: "Spatial clustering algorithms detect grid columns and tabular rows.",
    icon: FileSpreadsheet,
  },
  {
    step: "03",
    title: "Download Excel or CSV",
    description: "Export directly to a genuine .xlsx workbook or clean CSV file.",
    icon: Download,
  },
];

export default function PdfToExcelPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "File Conversion", href: "/convert-tools" },
    { label: "PDF to Excel", href: "/pdf-to-excel" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PDF to Excel Converter",
    url: `${baseUrl}/pdf-to-excel`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Extract tables and structured data from PDF files into Microsoft Excel (.xlsx) and CSV files.",
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
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Spatial Table Clustering &bull; XLSX & CSV Export &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              PDF to Excel Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Extract tables, spreadsheets, and columnar data from PDF documents into Microsoft Excel (.xlsx) and CSV files.
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
                Instant table extraction
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <PdfToExcelWorkspace />
      </section>

      <AdPlacement slotId="pdf-to-excel-below-workspace" />

      <HowItWorks
        title="How to Convert PDF to Excel Online"
        subtitle="Extract tables into spreadsheets in seconds"
        steps={PDF_TO_EXCEL_STEPS}
      />

      <FAQSection
        title="PDF to Excel - Frequently Asked Questions"
        subtitle="Common questions about tabular extraction, numeric formatting, and privacy"
        items={PDF_TO_EXCEL_FAQS}
      />

      <RelatedTools currentToolId="pdf-to-excel" />
    </div>
  );
}
