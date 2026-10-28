import React from "react";
import ExcelToPdfWorkspace from "@/components/convert/ExcelToPdfWorkspace";
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
  title: "Excel to PDF Converter Online — Free XLSX & CSV to PDF Tables",
  description:
    "Convert Excel workbooks (.xlsx, .xls) and CSV spreadsheets into formatted PDF tables with repeating headers and zebra rows. 100% private.",
  keywords: [
    "excel to pdf",
    "xlsx to pdf online",
    "convert spreadsheet to pdf",
    "csv to pdf",
    "excel to pdf table",
    "free excel to pdf converter",
  ],
  alternates: {
    canonical: "/excel-to-pdf",
  },
  openGraph: {
    title: "Excel to PDF Converter Online | Bits & Tools",
    description:
      "Convert Excel (.xlsx) and CSV spreadsheets into formatted PDF tables. 100% client-side privacy.",
    url: "/excel-to-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Excel to PDF Converter Online | Bits & Tools",
    description:
      "Convert Excel (.xlsx) and CSV spreadsheets into formatted PDF tables. 100% client-side privacy.",
  },
};

const EXCEL_FAQS = [
  {
    question: "What spreadsheet formats are supported?",
    answer:
      "You can upload Microsoft Excel OpenXML (.xlsx), older Excel formats, or comma-separated value (.csv) files. You can also paste raw CSV text directly.",
  },
  {
    question: "How does pagination work for large spreadsheets?",
    answer:
      "Toolora automatically computes row heights and page bounds, splitting large tables cleanly across multiple PDF pages while re-drawing the table header at the top of every subsequent page.",
  },
  {
    question: "Can I choose between Landscape and Portrait orientation?",
    answer:
      "Yes. Landscape is enabled by default to give columns maximum width, but you can toggle to Portrait at any time.",
  },
  {
    question: "Is any spreadsheet data sent to cloud servers?",
    answer:
      "Never. All spreadsheet parsing and PDF rendering happen 100% inside your browser RAM. Your confidential financial data never leaves your device.",
  },
];

const EXCEL_STEPS = [
  {
    step: "01",
    title: "Upload Spreadsheet",
    description: "Choose or drag and drop your .xlsx, .xls, or .csv file into the workspace.",
    icon: FileSpreadsheet,
  },
  {
    step: "02",
    title: "Set Orientation",
    description: "Select Landscape or Portrait mode and A4 or US Letter page sizing.",
    icon: Table,
  },
  {
    step: "03",
    title: "Download PDF Table",
    description: "Download your beautifully formatted, zebra-striped PDF document.",
    icon: Download,
  },
];

export default function ExcelToPdfPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "File Conversion", href: "/convert-tools" },
    { label: "Excel to PDF", href: "/excel-to-pdf" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Excel to PDF Converter",
    url: `${baseUrl}/excel-to-pdf`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert Excel workbooks (.xlsx) and CSV spreadsheets into formatted PDF tables in your browser.",
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
              <span>Automatic Column Fitting &bull; Repeating Headers &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Excel to PDF Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Turn Excel workbooks (XLSX, XLS) and CSV files into clean, printable PDF tables with zebra striping and custom orientations.
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
        <ExcelToPdfWorkspace />
      </section>

      <AdPlacement slotId="excel-to-pdf-below-workspace" />

      <HowItWorks
        title="How to Convert Excel to PDF Online"
        subtitle="Transform spreadsheets into professional PDF tables in seconds"
        steps={EXCEL_STEPS}
      />

      <FAQSection
        title="Excel to PDF - Frequently Asked Questions"
        subtitle="Common questions about spreadsheet conversions, pagination, and data security"
        items={EXCEL_FAQS}
      />

      <RelatedTools currentToolId="excel-to-pdf" />
    </div>
  );
}
