import React from "react";
import ReorderPdfPagesWorkspace from "@/components/pdf/ReorderPdfPagesWorkspace";
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
  ArrowUpDown,
  Move,
  CheckCircle2,
  FileCheck,
  Eye,
  RefreshCw,
  Layers,
} from "lucide-react";

export const metadata = {
  title: "Reorder PDF Pages Online — Rearrange & Sort Pages Free",
  description:
    "Rearrange, sort, and organize pages within your PDF document using drag-and-drop or directional arrow controls. Invert sequence or reset anytime. 100% private.",
  keywords: [
    "reorder pdf pages",
    "rearrange pdf pages",
    "sort pdf pages online",
    "change page order in pdf",
    "organize pdf pages",
    "reverse pdf page order",
    "drag and drop pdf reorder",
    "free pdf page sorter",
    "client side pdf reordering",
  ],
  alternates: {
    canonical: "/reorder-pdf-pages",
  },
  openGraph: {
    title: "Reorder PDF Pages Online — Rearrange & Sort Pages Free | Bits & Tools",
    description:
      "Rearrange and sort pages within your PDF document using drag-and-drop. Free, private, and preserves original vector quality.",
    url: "/reorder-pdf-pages",
    siteName: "Bits & Tools",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reorder PDF Pages Online — Rearrange & Sort Pages Free | Bits & Tools",
    description:
      "Rearrange and sort pages within your PDF document using drag-and-drop. 100% private and secure.",
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

const REORDER_PDF_FAQS = [
  {
    question: "How do I reorder pages in a PDF online for free?",
    answer:
      "Upload your PDF by dragging and dropping it into the workspace. Drag any page thumbnail and drop it into its new position, or use the accessible Left and Right arrow buttons underneath each page. When you are satisfied with the new page sequence, click 'Save Reordered PDF' to compile and download your document.",
  },
  {
    question: "Can I reorder PDF pages on a mobile phone or tablet?",
    answer:
      "Yes. In addition to standard drag-and-drop, every page thumbnail provides large touch-friendly Left and Right move buttons (compliant with WCAG 2.2 touch target standards). You can effortlessly shift pages forward or backward on smartphones and touchscreens without precision dragging.",
  },
  {
    question: "Can I invert or reverse the entire page sequence in one click?",
    answer:
      "Yes. Click the 'Reverse Order' button in the toolbar. Bits & Tools will instantly flip your page order (e.g. from 1-2-3-4 to 4-3-2-1), which is especially useful for scans that were processed in reverse order from an automatic feeder.",
  },
  {
    question: "Does reordering alter text, vector graphics, or hyperlinks?",
    answer:
      "No. Bits & Tools uses pdf-lib to duplicate and re-index native PDF page objects in your chosen order. All typography, vector paths, high-resolution imagery, form fields, and internal links remain 100% crisp, unaltered, and fully readable.",
  },
  {
    question: "Are my confidential files uploaded to a remote server?",
    answer:
      "Never. All document resequencing and file creation executes strictly inside your device's web browser RAM. Your confidential documents never leave your computer or phone, ensuring complete privacy.",
  },
  {
    question: "Can I reset the pages back to their original order?",
    answer:
      "Yes. If you make a mistake or want to start fresh, simply click 'Reset Order' in the toolbar to immediately restore the original sequence without needing to re-upload your document.",
  },
];

const REORDER_PDF_STEPS = [
  {
    step: "01",
    title: "Upload Your PDF",
    description: "Choose or drag and drop any PDF file into the secure workspace. Instant visual thumbnails appear with numbered badges.",
    icon: Move,
  },
  {
    step: "02",
    title: "Drag & Rearrange Pages",
    description: "Drag pages into your desired arrangement, or use the directional move arrows to shift pages left and right.",
    icon: ArrowUpDown,
  },
  {
    step: "03",
    title: "Download Reordered PDF",
    description: "Click Save Reordered PDF. Your document is compiled instantly in memory with original vector quality preserved.",
    icon: FileCheck,
  },
];

const FEATURES = [
  {
    title: "Drag-and-Drop & Arrow Controls",
    description: "Smooth drag-and-drop on desktop combined with accessible directional move buttons for phones and touchscreens.",
    icon: Move,
  },
  {
    title: "Reverse Order in One Click",
    description: "Quickly invert document sequences from back to front, ideal for reversing inverted scanner feeder outputs.",
    icon: RefreshCw,
  },
  {
    title: "100% Lossless Vector Output",
    description: "Operates purely on PDF page object pointers. No rasterization, no compression artifacts, and full font searchability.",
    icon: Sparkles,
  },
  {
    title: "Complete On-Device Privacy",
    description: "Executed 100% client-side in browser RAM. Zero files, page data, or logs are ever transmitted to a server.",
    icon: ShieldCheck,
  },
];

export default function ReorderPdfPagesPage() {
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "Reorder PDF Pages", href: "/reorder-pdf-pages" },
  ];

  const baseUrl = siteConfig.url.replace(/\/$/, "");

  // Schema.org Structured Data
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Reorder PDF Pages Online",
    url: `${baseUrl}/reorder-pdf-pages`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and modern web browser",
    description:
      "Rearrange and sort pages within your PDF document online for free with complete client-side privacy.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Drag-and-drop visual page sorting",
      "Accessible directional arrow controls for mobile devices",
      "Reverse order and reset sequence presets",
      "Preserves original vector fonts, bookmarks, and internal links",
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
        name: "Reorder PDF Pages",
        item: `${baseUrl}/reorder-pdf-pages`,
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Reorder PDF Pages Online",
    description: "Step-by-step guide to rearranging the sequence of pages within any PDF document online for free.",
    step: REORDER_PDF_STEPS.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.title,
      text: s.description,
      url: `${baseUrl}/reorder-pdf-pages#step-${idx + 1}`,
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
              <span>Drag-and-Drop &bull; Reverse &bull; Mobile Accessible</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Reorder PDF Pages Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Rearrange the sequence of pages within your PDF document with ease. Fast, free, drag-and-drop, and processed 100% locally in your browser.
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
                Instant in-memory reordering
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Tool Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        <ReorderPdfPagesWorkspace />

        {/* Ad Placement Below Workspace */}
        <AdPlacement slotId="reorder-pdf-pages-below-workspace" placement="tool-bottom" />

        {/* Key Features Grid */}
        <section className="py-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Intuitive, Effortless Page Sequencing
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
              Organize multi-page documents exactly as intended in a matter of seconds
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
              Why Reorder PDF Pages with Bits &amp; Tools?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When documents are scanned out of sequence, presentations are shuffled, or chapters in an eBook need reorganization, having the ability to easily swap page order is essential. Rather than re-printing or re-scanning the entire stack, Bits &amp; Tools gives you a clear visual drag-and-drop board to sort your PDF pages in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Fix Scrambled Scanner Feeder Outputs</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Automatic sheet feeders frequently ingest pages out of order or produce inverted sequences when scanned back-to-front. Use our one-click &apos;Reverse Order&apos; feature or drag pages into their proper numerical sequence effortlessly.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Perfect for Portfolios, Decks &amp; Reports</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Refine the narrative arc of pitch decks, resumes, portfolio samples, and business proposals. Move your strongest slides and executive summary pages directly to the front of your document.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Quality Loss or File Bloat</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Reordering creates no loss in visual sharpness. Bits &amp; Tools references the native PDF page streams and recombines them in memory, producing a clean, optimized output PDF with identical resolution and zero artifacts.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Private, Zero Server Uploads</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your files remain strictly on your local computer, phone, or tablet. No external server uploads, no cookies tracking document contents, and no risk of sensitive data exposure.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Steps */}
        <HowItWorks
          title="How to Reorder PDF Pages Online"
          subtitle="Three simple steps to rearrange and sort the pages in any PDF file."
          steps={REORDER_PDF_STEPS}
        />

        {/* Comprehensive FAQ Section */}
        <FAQSection
          title="Reorder PDF Pages — Frequently Asked Questions"
          subtitle="Answers about mobile reordering, reversing page sequences, file integrity, and privacy."
          items={REORDER_PDF_FAQS}
        />

        {/* Related Tools Cross-Linking */}
        <RelatedTools currentToolId="reorder-pdf-pages" />
      </div>
    </div>
  );
}
