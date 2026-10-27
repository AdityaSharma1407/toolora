import React from "react";
import CsvConverterWorkspace from "@/components/utility/CsvConverterWorkspace";
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
  FileJson,
  ArrowLeftRight,
} from "lucide-react";

export const metadata = {
  title: "JSON to CSV & CSV to JSON Converter Online — Fast, Free & Private",
  description:
    "Convert JSON to CSV and CSV to JSON instantly in your browser. Supports nested object flattening, custom delimiters, auto-type casting, and CSV file export.",
  keywords: [
    "json to csv",
    "csv to json",
    "convert json to csv online",
    "csv to json converter",
    "json csv converter free",
    "flatten json to csv",
    "convert excel csv to json",
  ],
  alternates: {
    canonical: "/json-to-csv",
  },
  openGraph: {
    title: "JSON to CSV & CSV to JSON Converter | Bits & Tools",
    description:
      "Bi-directional JSON and CSV converter with automatic flattening, custom delimiters, and instant export.",
    url: "/json-to-csv",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to CSV & CSV to JSON Converter | Bits & Tools",
    description:
      "Bi-directional JSON and CSV converter with automatic flattening, custom delimiters, and instant export.",
  },
};

const CONVERTER_FAQS = [
  {
    question: "How does nested object flattening work in JSON to CSV?",
    answer:
      "When 'Flatten Objects' is enabled, nested JSON objects (e.g. { user: { name: 'Alex', city: 'NYC' } }) are automatically converted to dot-notation columns: 'user.name' and 'user.city'. This ensures no nested data is lost during tabular export.",
  },
  {
    question: "Does this converter handle quotes and commas inside cells?",
    answer:
      "Yes. The converter strictly adheres to RFC 4180 specifications. Values containing commas, quotation marks, or newlines are automatically wrapped in double quotes, and internal quotes are properly escaped with double quotes.",
  },
  {
    question: "Is my data uploaded to any server?",
    answer:
      "Never. All parsing, unflattening, and CSV/JSON transformations occur entirely client-side inside your browser's JavaScript engine. No proprietary data, logs, or customer lists ever leave your machine.",
  },
  {
    question: "What delimiters are supported?",
    answer:
      "You can choose between Comma (,), Semicolon (;), Tab (\\t for TSV files), or Pipe (|). This makes it easy to generate files ready for Microsoft Excel, Google Sheets, or custom database import scripts.",
  },
];

const CONVERTER_STEPS = [
  {
    step: "01",
    title: "Select Direction",
    description: "Choose JSON to CSV or CSV to JSON conversion mode.",
    icon: ArrowLeftRight,
  },
  {
    step: "02",
    title: "Paste or Upload",
    description: "Paste your data or upload a .json / .csv file from your computer.",
    icon: FileJson,
  },
  {
    step: "03",
    title: "Copy or Download",
    description: "Preview as a formatted table, copy output, or download the converted file.",
    icon: FileSpreadsheet,
  },
];

export default function JsonToCsvPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "JSON to CSV Converter", href: "/json-to-csv" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "JSON to CSV & CSV to JSON Converter",
    url: `${baseUrl}/json-to-csv`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert JSON arrays and objects to RFC 4180 compliant CSV and vice versa with custom delimiters and table preview.",
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
              <span>RFC 4180 &bull; Bi-Directional &bull; Table Preview</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              JSON to CSV Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert JSON to CSV or CSV to JSON instantly with dot-notation flattening, custom delimiters, and table preview.
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
                Instant browser conversion
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <CsvConverterWorkspace />
      </section>

      <AdPlacement slotId="json-to-csv-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Convert Between JSON and CSV"
        subtitle="Transform and export tabular datasets in seconds"
        steps={CONVERTER_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="JSON to CSV Converter - Frequently Asked Questions"
        subtitle="Common questions about data formatting, nested objects, and delimiter selection"
        items={CONVERTER_FAQS}
      />

      <RelatedTools currentToolId="json-to-csv" />
    </div>
  );
}
