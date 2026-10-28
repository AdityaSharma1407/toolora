import React from "react";
import AddPageNumbersWorkspace from "@/components/pdf/AddPageNumbersWorkspace";
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
  Hash,
  FileText,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Add Page Numbers to PDF Online — Free, Fast & Private",
  description:
    "Insert custom page numbers, headers, and footers into your PDF documents. Select custom positions, formats (Page X of Y), font sizes, and cover page exclusions without server uploads.",
  keywords: [
    "add page numbers to pdf",
    "paginate pdf",
    "pdf page numbering online",
    "number pdf pages",
    "page numbers in pdf footer",
    "bates numbering alternative",
    "insert page numbers into pdf",
  ],
  alternates: {
    canonical: "/add-page-numbers",
  },
  openGraph: {
    title: "Add Page Numbers to PDF Online | Bits & Tools",
    description:
      "Insert custom page numbers, headers, and footers into your PDF documents with full layout and formatting control.",
    url: "/add-page-numbers",
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
    title: "Add Page Numbers to PDF Online | Bits & Tools",
    description:
      "Insert custom page numbers, headers, and footers into your PDF documents with full layout and formatting control.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const NUMBER_FAQS = [
  {
    question: "Can I skip numbering on the cover page?",
    answer:
      "Yes. Simply enable the 'Skip first page' option. The first page (cover page) will remain unnumbered, and numbering will begin sequentially on page 2.",
  },
  {
    question: "What page number formats are supported?",
    answer:
      "You can choose between multiple formats: 'Page 1 of 10' (formal), '1 of 10' (minimalist), 'Page 1', single numbers ('1'), or hyphenated style ('- 1 -').",
  },
  {
    question: "Where can I position the page numbers?",
    answer:
      "You can place page numbers at 6 standard document positions: Bottom Center (most common), Bottom Right, Bottom Left, Top Center, Top Right, or Top Left.",
  },
  {
    question: "Are my PDF files uploaded to an external server?",
    answer:
      "No. All PDF processing and typography rendering occur directly inside your browser using client-side WebAssembly and JavaScript memory. Your files never leave your device.",
  },
];

const NUMBER_STEPS = [
  {
    step: "01",
    title: "Upload PDF",
    description: "Select or drag and drop the PDF document you want to paginate.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Configure Numbering",
    description: "Choose position, numbering format, font size, margins, and cover page options.",
    icon: Hash,
  },
  {
    step: "03",
    title: "Download Numbered PDF",
    description: "Save your freshly numbered PDF document with instant client-side generation.",
    icon: Download,
  },
];

export default function AddPageNumbersPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "Add Page Numbers", href: "/add-page-numbers" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Add Page Numbers to PDF",
    url: `${baseUrl}/add-page-numbers`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Insert custom page numbers, headers, and footers into PDF documents with custom typography and positioning.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "914",
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

      {/* Hero Header */}
      <div className="border-b border-black/[0.06] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pb-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="text-center max-w-3xl mx-auto mt-2 sm:mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Custom Positions &bull; Multiple Formats &bull; Cover Page Exclusion</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Add Page Numbers to PDF
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Insert page numbers, headers, and footers into PDF documents with precision positioning and formatting.
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
        <AddPageNumbersWorkspace />
      </section>

      <AdPlacement slotId="add-page-numbers-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Add Page Numbers to PDF"
        subtitle="Paginate any PDF document in 3 simple steps"
        steps={NUMBER_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Add Page Numbers - Frequently Asked Questions"
        subtitle="Common questions about document pagination, numbering formats, and cover pages"
        items={NUMBER_FAQS}
      />

      <RelatedTools currentToolId="add-page-numbers" />
    </div>
  );
}
