import React from "react";
import PdfToJpgWorkspace from "@/components/pdf/PdfToJpgWorkspace";
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
  Image as ImageIcon,
  FileDown,
  Layers,
  Sliders,
  Archive,
  CheckCircle2,
  FileText,
  Eye,
} from "lucide-react";

export const metadata = {
  title: "PDF to JPG Converter Online — Free & High Quality (300 DPI) | Bits & Tools",
  description:
    "Convert PDF pages into high-resolution JPG images online for free. Download individual pages or package all images into a single ZIP file. 100% private client-side processing.",
  keywords: [
    "pdf to jpg",
    "convert pdf to jpg",
    "pdf to image",
    "pdf to jpeg online",
    "extract images from pdf",
    "high resolution pdf to jpg",
    "save pdf as jpg",
    "pdf to zip images",
    "free pdf to jpg converter",
    "client side pdf converter",
    "300 dpi pdf to jpg",
  ],
  alternates: {
    canonical: "/pdf-to-jpg",
  },
  openGraph: {
    title: "PDF to JPG Converter Online — Free & High Quality (300 DPI) | Bits & Tools",
    description:
      "Convert PDF pages into high-resolution JPG images online for free. Download individual pages or package all images into a ZIP archive. 100% private in-browser rendering.",
    url: "/pdf-to-jpg",
    siteName: "Bits & Tools",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to JPG Converter Online — Free & High Quality (300 DPI) | Bits & Tools",
    description:
      "Convert PDF pages into high-resolution JPG images online for free. Download individual pages or package all images into a ZIP archive.",
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

const PDF_TO_JPG_FAQS = [
  {
    question: "How do I convert a PDF into JPG images for free?",
    answer:
      "Upload your PDF by clicking 'Select PDF File' or dragging and dropping your document into the workspace. Select your desired image quality (Standard 150 DPI, High 225 DPI, or Maximum 300 DPI) and choose whether to convert all pages or specific pages. Click 'Convert to JPG' to render the pages, then download individual pictures or click 'Download All as ZIP' to save the complete archive.",
  },
  {
    question: "What resolution presets are available and which should I choose?",
    answer:
      "Bits & Tools provides three resolution settings: Standard Quality (150 DPI) produces lightweight images ideal for web sharing, messaging, and emails; High Quality (225 DPI) delivers sharp text for presentations and reports; and Maximum Quality (300 DPI) provides print-grade resolution suitable for commercial publishing and fine-detail inspection.",
  },
  {
    question: "Can I convert only specific pages instead of the whole document?",
    answer:
      "Yes. In the configuration step, choose 'Select Specific Pages'. You can click individual page thumbnails to toggle selection or use quick filter buttons (Select All, Deselect All, Odd Pages, Even Pages). Only the pages you select will be rendered and downloaded.",
  },
  {
    question: "Can I download all converted pages at once?",
    answer:
      "Yes. Once processing completes, click the 'Download All as ZIP' button. Bits & Tools will instantly bundle all rendered JPG images into a single organized ZIP archive right inside your browser, without any waiting queues or server roundtrips.",
  },
  {
    question: "Are my confidential files uploaded or saved on external servers?",
    answer:
      "No. Bits & Tools executes all rendering locally within your device's web browser using client-side WebAssembly and HTML5 Canvas. Your PDF document, extracted images, and personal information never leave your computer, phone, or local network.",
  },
  {
    question: "Is there a watermark or page limitation on the converted images?",
    answer:
      "Never. All generated JPG images are 100% clean and free of watermarks, branding, or logos. You can convert documents with full fidelity as often as needed without paying or creating an account.",
  },
];

const PDF_TO_JPG_STEPS = [
  {
    step: "01",
    title: "Upload Your PDF",
    description: "Drag and drop or select any PDF file from your device. Files up to 50 MB are supported with zero server uploads.",
    icon: FileDown,
  },
  {
    step: "02",
    title: "Select Quality & Pages",
    description: "Choose 150, 225, or 300 DPI resolution and pick whether to convert the entire document or select pages.",
    icon: Sliders,
  },
  {
    step: "03",
    title: "Instant JPG & ZIP Download",
    description: "Save individual JPG pictures directly or download all pages bundled in a single organized ZIP archive.",
    icon: ImageIcon,
  },
];

const FEATURES = [
  {
    title: "High-Resolution 300 DPI",
    description: "Render ultra-sharp raster images suitable for professional presentations, portfolio publishing, and printing.",
    icon: Eye,
  },
  {
    title: "Batch ZIP Export",
    description: "Package multi-page conversions into a single compressed ZIP file in one click via in-memory JSZip processing.",
    icon: Archive,
  },
  {
    title: "Selective Page Extraction",
    description: "Convert only the specific pages you need with visual thumbnail selectors, odd/even filters, and page counters.",
    icon: Layers,
  },
  {
    title: "100% In-Browser Privacy",
    description: "Rendering occurs entirely on your device using WebAssembly and HTML5 Canvas. Zero bytes touch a remote cloud server.",
    icon: ShieldCheck,
  },
];

export default function PdfToJpgPage() {
  const breadcrumbs = [
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "PDF to JPG", href: "/pdf-to-jpg" },
  ];

  const baseUrl = siteConfig.url.replace(/\/$/, "");

  // Schema.org Structured Data
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PDF to JPG Converter Online",
    url: `${baseUrl}/pdf-to-jpg`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and modern web browser with HTML5 Canvas",
    description:
      "Convert PDF pages into high-resolution JPG images directly in your browser with complete client-side privacy.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Convert PDF to high-resolution JPG (150, 225, 300 DPI)",
      "Download individual images or batch ZIP archive",
      "Selective page conversion with thumbnail previews",
      "Zero server file uploads — 100% client-side privacy",
      "No watermarks and no registration required",
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
        name: "PDF to JPG",
        item: `${baseUrl}/pdf-to-jpg`,
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Convert PDF to JPG Online",
    description: "Step-by-step guide to converting PDF pages into crisp JPG images online for free.",
    step: PDF_TO_JPG_STEPS.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.title,
      text: s.description,
      url: `${baseUrl}/pdf-to-jpg#step-${idx + 1}`,
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
              <span>Up to 300 DPI Resolution &bull; Single &amp; ZIP Download</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Convert PDF to JPG Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Extract crisp, high-resolution JPG images from your PDF pages. Fast, free, watermark-free, and processed 100% locally in your browser.
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
                Instant browser rendering
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Tool Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        <PdfToJpgWorkspace />

        {/* Ad Placement Below Workspace */}
        <AdPlacement slotId="pdf-to-jpg-below-workspace" placement="tool-bottom" />

        {/* Key Features Grid */}
        <section className="py-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Professional PDF to Image Conversion
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
              Everything you need to turn static PDF documents into versatile picture formats
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
              Why Convert PDF Pages to JPG with Bits &amp; Tools?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              While PDF files are the gold standard for fixed-layout document distribution, sharing or embedding individual pages can be challenging. Many websites, web forms, social media platforms, and slide software (like PowerPoint or Google Slides) require standard image formats like JPG or JPEG. Bits &amp; Tools allows you to convert any page from your PDF document into an independent, high-resolution JPG image in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pixel-Perfect Vector Fidelity</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our rendering engine uses Mozilla&apos;s battle-tested PDF.js library with HTML5 Canvas. Typography, embedded curves, complex illustrations, and vector line work are rendered smoothly without blurriness, compression artifacts, or color shifts.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Server Uploads &amp; Absolute Privacy</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Traditional online converters send your sensitive contracts, tax receipts, and confidential scans to third-party cloud servers. Bits &amp; Tools processes your files completely in local browser RAM. No files are ever saved, tracked, or exposed.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Custom DPI Resolution Control</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tailor your output to your exact use case. Choose Standard 150 DPI for rapid web loading and email attachments, 225 DPI for crystal-clear slide presentations, or 300 DPI for high-end digital publishing and fine print reproduction.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>One-Click ZIP Packaging</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No need to click download twenty times for a multi-page PDF. With our built-in JSZip archiver, you can download all converted pages in a single cleanly organized archive file named after your original document.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Steps */}
        <HowItWorks
          title="How to Convert PDF to JPG Online"
          subtitle="Three simple steps to extract high-resolution pictures from any PDF document."
          steps={PDF_TO_JPG_STEPS}
        />

        {/* Comprehensive FAQ Section */}
        <FAQSection
          title="PDF to JPG — Frequently Asked Questions"
          subtitle="Everything you need to know about image quality, multi-page export, and privacy."
          items={PDF_TO_JPG_FAQS}
        />

        {/* Related Tools Cross-Linking */}
        <RelatedTools currentToolId="pdf-to-jpg" />
      </div>
    </div>
  );
}
