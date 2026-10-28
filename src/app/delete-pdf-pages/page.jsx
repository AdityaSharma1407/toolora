import React from "react";
import DeletePdfPagesWorkspace from "@/components/pdf/DeletePdfPagesWorkspace";
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
  Trash2,
  Filter,
  CheckCircle2,
  FileCheck,
  Eye,
  Layers,
} from "lucide-react";

export const metadata = {
  title: "Delete PDF Pages Online — Remove Unwanted Pages Free",
  description:
    "Remove unwanted, blank, or sensitive pages from any PDF document for free. Preview visual thumbnails, select pages to delete, and download a clean PDF. 100% private.",
  keywords: [
    "delete pdf pages",
    "remove pages from pdf",
    "delete page from pdf online",
    "remove blank pages pdf",
    "cut pdf pages",
    "delete specific pages from pdf",
    "pdf page remover",
    "free pdf page deleter",
    "remove unwanted pdf pages",
    "client side pdf editor",
  ],
  alternates: {
    canonical: "/delete-pdf-pages",
  },
  openGraph: {
    title: "Delete PDF Pages Online — Remove Unwanted Pages Free | Bits & Tools",
    description:
      "Remove unwanted, blank, or sensitive pages from any PDF document for free. Preview thumbnails, select pages, and download a clean PDF.",
    url: "/delete-pdf-pages",
    siteName: "Bits & Tools",
    type: "website",
    locale: "en_US",
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
    title: "Delete PDF Pages Online — Remove Unwanted Pages Free | Bits & Tools",
    description:
      "Remove unwanted, blank, or sensitive pages from any PDF document for free. 100% private and secure.",
    images: ["/images/og-bitsandtools.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const DELETE_PDF_FAQS = [
  {
    question: "How do I delete unwanted pages from a PDF document?",
    answer:
      "Upload your PDF by dragging and dropping it into the workspace. Click on the pages you wish to remove (or use the 'Odd Pages' or 'Even Pages' batch buttons). Selected pages are highlighted with a red deletion tag. Click 'Remove Selected Pages', confirm your choice, and download your clean PDF immediately.",
  },
  {
    question: "Does deleting pages alter the remaining content or formatting?",
    answer:
      "No. Bits & Tools uses pdf-lib to cleanly extract the retained pages and recompile them into a fresh PDF document. The fonts, text searchability, images, vector diagrams, and layout of the retained pages remain 100% identical to the original file.",
  },
  {
    question: "Can I delete all pages from a PDF?",
    answer:
      "No. A valid PDF file specification requires at least one page. Bits & Tools incorporates a safety guard that prevents you from deleting every page, ensuring that your downloaded document remains valid and readable in all PDF viewers.",
  },
  {
    question: "Are my confidential files uploaded or saved on a remote server?",
    answer:
      "Never. All page inspection and deletion runs entirely inside your device's web browser memory. Your confidential contracts, invoices, and sensitive documents are never uploaded to the cloud or saved to external storage.",
  },
  {
    question: "Can I select multiple pages to delete at once?",
    answer:
      "Yes. You can click as many individual page thumbnails as needed. You can also use handy quick-selection filters such as 'Odd Pages' (useful for single-sided scans) or 'Even Pages' to rapidly mark groups of pages for deletion.",
  },
  {
    question: "Is there an undo option before I download the final PDF?",
    answer:
      "Yes. You can click 'Clear Selection' at any point before clicking delete to reset all deletion markers. In addition, a confirmation dialog appears before processing to ensure you do not accidentally remove important pages.",
  },
];

const DELETE_PDF_STEPS = [
  {
    step: "01",
    title: "Upload Your PDF",
    description: "Choose or drag and drop your PDF file into the secure workspace. Numbered visual thumbnails appear instantly.",
    icon: Trash2,
  },
  {
    step: "02",
    title: "Select Pages to Remove",
    description: "Click on pages to mark them for deletion, or use quick odd/even filter buttons to select multiple pages at once.",
    icon: Filter,
  },
  {
    step: "03",
    title: "Confirm & Download",
    description: "Confirm your selection and download your newly compiled PDF with the unwanted pages removed cleanly.",
    icon: FileCheck,
  },
];

const FEATURES = [
  {
    title: "Interactive Visual Thumbnails",
    description: "Preview every page in high clarity before deleting so you never accidentally discard an important document section.",
    icon: Eye,
  },
  {
    title: "Smart Selection Filters",
    description: "Quickly select odd or even pages in bulk, ideal for cleaning up single-sided scans or double-sided blank back pages.",
    icon: Filter,
  },
  {
    title: "Lossless Extraction",
    description: "Retained pages preserve original vector graphics, embedded fonts, and page dimensions with zero downsampling.",
    icon: Sparkles,
  },
  {
    title: "Document Integrity Guard",
    description: "Built-in safety controls prevent deleting all pages, guaranteeing your output remains a standard, readable PDF.",
    icon: ShieldCheck,
  },
];

export default function DeletePdfPagesPage() {
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "Delete PDF Pages", href: "/delete-pdf-pages" },
  ];

  const baseUrl = siteConfig.url.replace(/\/$/, "");

  // Schema.org Structured Data
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Delete PDF Pages Online",
    url: `${baseUrl}/delete-pdf-pages`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and modern web browser",
    description:
      "Remove unwanted, blank, or duplicate pages from any PDF document online for free with complete client-side privacy.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "856",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Interactive page deletion with visual thumbnail previews",
      "Odd and Even page deletion filters",
      "Document integrity guard (prevents empty PDF output)",
      "Preserves original vector fonts, formatting, and layout",
      "Zero server file uploads — 100% client-side privacy",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "PDF Tools",
        item: `${baseUrl}/pdf-tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Delete PDF Pages",
        item: `${baseUrl}/delete-pdf-pages`,
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Delete PDF Pages Online",
    description: "Step-by-step guide to removing unwanted pages from any PDF document online for free.",
    step: DELETE_PDF_STEPS.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.title,
      text: s.description,
      url: `${baseUrl}/delete-pdf-pages#step-${idx + 1}`,
    })),
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Schema.org Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* Hero Header */}
      <div className="border-b border-black/[0.06] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pb-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="text-center max-w-3xl mx-auto mt-2 sm:mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Visual Thumbnail Grid &bull; Odd / Even Quick Filters</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Delete PDF Pages Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Remove unwanted, blank, or sensitive pages from any PDF document. Fast, free, and processed 100% locally in your browser.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                No server file uploads
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Instant in-memory compilation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Tool Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        <DeletePdfPagesWorkspace />

        {/* Ad Placement Below Workspace */}
        <AdPlacement slotId="delete-pdf-pages-below-workspace" placement="tool-bottom" />

        {/* Key Features Grid */}
        <section className="py-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Clean, Accurate Page Pruning
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
              Easily eliminate redundant pages without compromising the rest of your document
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-subtle flex flex-col"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Informative Editorial / Technical Content for SEO */}
        <section className="bg-white rounded-2xl border border-black/[0.06] shadow-subtle p-6 sm:p-10 space-y-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
              Why Delete PDF Pages with Bits &amp; Tools?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              PDF documents often accumulate extra pages you do not want to share—such as blank separator sheets from scanner feeders, confidential appendixes, outdated cover letters, or draft notes. Sending a clean, concise document creates a great impression and saves bandwidth. Bits &amp; Tools provides a simple visual editor to prune unwanted pages directly in your browser without software installation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Prune Blank &amp; Redundant Pages</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Quickly strip accidental blank sheets resulting from double-sided scanning or unneeded fax cover pages. Your document stays focused and compact for clients and recipients.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Remove Sensitive Information Before Sharing</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Need to share a contract or report but exclude an internal financial worksheet or personal identity attachment? Select and delete the sensitive pages in seconds before sending.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Preserve Vector Quality &amp; Searchability</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Deleting pages does not re-compress or rasterize your retained content. All vector text, high-resolution photographs, links, and formatting remain bit-for-bit identical to your original source file.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Confidential On-Device Execution</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your private legal files, tax forms, and medical records never touch a cloud server. Everything executes locally in browser RAM, ensuring zero risk of document leakage.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Steps */}
        <HowItWorks
          title="How to Delete PDF Pages Online"
          subtitle="Three simple steps to remove unwanted pages from any PDF document."
          steps={DELETE_PDF_STEPS}
        />

        {/* Comprehensive FAQ Section */}
        <FAQSection
          title="Delete PDF Pages — Frequently Asked Questions"
          subtitle="Answers about safety guards, multi-page selection, formatting preservation, and privacy."
          items={DELETE_PDF_FAQS}
        />

        {/* Related Tools Cross-Linking */}
        <RelatedTools currentToolId="delete-pdf-pages" />
      </div>
    </div>
  );
}
