import React from "react";
import RotatePdfWorkspace from "@/components/pdf/RotatePdfWorkspace";
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
  RotateCw,
  RotateCcw,
  RefreshCw,
  Eye,
  CheckCircle2,
  Smartphone,
  Layers,
} from "lucide-react";

export const metadata = {
  title: "Rotate PDF Pages Online — Free & Permanent PDF Rotation",
  description:
    "Rotate PDF pages clockwise (+90°), counterclockwise (-90°), or upside down (180°) permanently. Rotate individual pages or all pages at once with zero quality loss.",
  keywords: [
    "rotate pdf",
    "rotate pdf online",
    "rotate pdf pages",
    "turn pdf sideways",
    "fix upside down pdf",
    "rotate single page in pdf",
    "permanent pdf rotation",
    "rotate pdf 90 degrees",
    "rotate pdf 180 degrees",
    "free pdf rotator",
    "client side pdf rotation",
  ],
  alternates: {
    canonical: "/rotate-pdf",
  },
  openGraph: {
    title: "Rotate PDF Pages Online — Free & Permanent PDF Rotation | Bits & Tools",
    description:
      "Rotate individual pages or entire documents permanently. Free, private, and preserves original vector quality and searchable text.",
    url: "/rotate-pdf",
    siteName: "Bits & Tools",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotate PDF Pages Online — Free & Permanent PDF Rotation | Bits & Tools",
    description:
      "Rotate individual pages or entire documents permanently. Free, private, and preserves original vector quality.",
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

const ROTATE_PDF_FAQS = [
  {
    question: "How do I rotate PDF pages online for free?",
    answer:
      "Drag and drop your PDF into the upload box. Use the quick batch buttons ('All -90°', 'All +90°', or 'All 180°') to rotate every page, or click the individual turn buttons on any page thumbnail to rotate specific pages. When you are satisfied with the orientation, click 'Apply Rotation' to generate and download your permanently rotated PDF.",
  },
  {
    question: "Does rotating a PDF degrade text or image quality?",
    answer:
      "No. Bits & Tools performs genuine vector-level rotation by modifying the native `/Rotate` dictionary in the PDF page specification using pdf-lib. Because pages are not converted to images (rasterized), your fonts, searchable text, bookmarks, form fields, and vector graphics remain 100% crisp and intact.",
  },
  {
    question: "Is the rotation permanent or just a temporary preview?",
    answer:
      "The rotation is 100% permanent. When you download your modified PDF, the rotation metadata is written directly into the document structure. When opened in Adobe Acrobat, Apple Preview, Google Chrome, or printed, the document will always display in your chosen orientation.",
  },
  {
    question: "Can I rotate only a single page in a multi-page document?",
    answer:
      "Yes! You can rotate any single page (or combination of pages) independently. For example, if you scanned a document where page 3 is upside-down and page 5 is landscape, you can turn just those two pages without affecting the rest of the document.",
  },
  {
    question: "Are my confidential contracts or tax documents uploaded to a server?",
    answer:
      "Never. All PDF rotation logic executes locally in your device's web browser memory. Your confidential documents never leave your computer or phone, ensuring full compliance with GDPR, HIPAA, and internal corporate data privacy policies.",
  },
  {
    question: "Can I reset or undo rotations before downloading?",
    answer:
      "Yes. The workspace features an 'Undo All' button that immediately restores every page to its original imported orientation, allowing you to experiment freely before saving.",
  },
];

const ROTATE_PDF_STEPS = [
  {
    step: "01",
    title: "Upload Your PDF",
    description: "Choose or drag and drop any PDF file into the secure workspace. Multi-page documents load instant visual thumbnails.",
    icon: RotateCw,
  },
  {
    step: "02",
    title: "Adjust Orientations",
    description: "Click rotation buttons on individual pages or use batch controls to rotate all pages clockwise (+90°), counterclockwise (-90°), or upside down (180°).",
    icon: RotateCcw,
  },
  {
    step: "03",
    title: "Download Permanently",
    description: "Click Apply Rotation. Your new document is compiled in memory and ready for immediate download with original vectors preserved.",
    icon: RefreshCw,
  },
];

const FEATURES = [
  {
    title: "Lossless Vector Rotation",
    description: "Modifies native PDF rotation dictionaries without rasterizing pages. Preserves crisp typography and searchable text.",
    icon: Sparkles,
  },
  {
    title: "Individual & Global Controls",
    description: "Rotate every page simultaneously with batch buttons, or fine-tune individual landscape and portrait pages independently.",
    icon: Layers,
  },
  {
    title: "Live Thumbnail Previews",
    description: "See the exact orientation of every page in real time with visual degree badges before applying changes.",
    icon: Eye,
  },
  {
    title: "Zero Server Uploads",
    description: "Executed 100% client-side in browser RAM. Perfect for confidential contracts, legal filings, and financial records.",
    icon: ShieldCheck,
  },
];

export default function RotatePdfPage() {
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "Rotate PDF", href: "/rotate-pdf" },
  ];

  const baseUrl = siteConfig.url.replace(/\/$/, "");

  // Schema.org Structured Data
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Rotate PDF Pages Online",
    url: `${baseUrl}/rotate-pdf`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and a modern web browser",
    description:
      "Rotate PDF pages permanently online for free. Adjust individual or all pages with zero quality loss and complete client-side privacy.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Vector-level page rotation (no rasterization or quality loss)",
      "Rotate individual pages (+90°, -90°, 180°)",
      "Rotate all pages in one click",
      "Permanent rotation saved directly into PDF structure",
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
        name: "Rotate PDF",
        item: `${baseUrl}/rotate-pdf`,
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Rotate PDF Pages Online",
    description: "Step-by-step guide to permanently rotating individual or all pages in a PDF document.",
    step: ROTATE_PDF_STEPS.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.title,
      text: s.description,
      url: `${baseUrl}/rotate-pdf#step-${idx + 1}`,
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
              <span>Lossless Vector Rotation &bull; Single &amp; All Pages</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Rotate PDF Pages Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Permanently rotate pages in your PDF document. Fix sideways or upside-down scans in seconds with complete client-side privacy.
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
                Instant permanent save
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Tool Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        <RotatePdfWorkspace />

        {/* Ad Placement Below Workspace */}
        <AdPlacement slotId="rotate-pdf-below-workspace" placement="tool-bottom" />

        {/* Key Features Grid */}
        <section className="py-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Engineered for Precision &amp; Document Quality
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
              Reliable rotation that keeps your PDF crystal clear and fully searchable
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
              Why Rotate PDF Pages with Bits &amp; Tools?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When scanning paper documents with an automatic document feeder (ADF) or capturing receipts with a mobile camera, pages often end up rotated sideways (90 degrees) or inverted upside down (180 degrees). Reading or sharing improperly oriented documents looks unprofessional and frustrates clients, reviewers, and colleagues. Bits &amp; Tools provides a fast, permanent solution directly in your web browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>True Vector Preservation (No Rasterization)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Many online tools convert your PDF pages into lossy images before rotating them, resulting in fuzzy text and lost searchability. Bits &amp; Tools modifies the internal PDF `/Rotate` dictionary natively, preserving 100% of your original vector curves, fonts, bookmarks, and selectable text.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Fix Scanned Invoices, Blueprints &amp; Contracts</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Whether you have an architectural drawing that needs landscape viewing, a double-sided scan with inverted even pages, or a multi-page legal agreement, you can selectively rotate only the affected pages or flip everything in one batch click.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Private, On-Device Processing</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Unlike third-party converters that store your uploads on cloud servers, all rotation operations happen directly in your browser RAM. Your confidential documents are never transmitted over the internet or logged.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Permanent Across All PDF Viewers</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Some desktop viewers allow temporary rotation that reverts when the window is closed. Bits &amp; Tools writes the orientation changes permanently into the output PDF file so it stays correctly oriented on every device, printer, and operating system.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Steps */}
        <HowItWorks
          title="How to Rotate PDF Pages Online"
          subtitle="Three simple steps to permanently fix the orientation of your PDF document."
          steps={ROTATE_PDF_STEPS}
        />

        {/* Comprehensive FAQ Section */}
        <FAQSection
          title="Rotate PDF — Frequently Asked Questions"
          subtitle="Clear answers about permanent rotation, vector quality, and selective page orientation."
          items={ROTATE_PDF_FAQS}
        />

        {/* Related Tools Cross-Linking */}
        <RelatedTools currentToolId="rotate-pdf" />
      </div>
    </div>
  );
}
