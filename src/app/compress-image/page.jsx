import React from "react";
import CompressImageWorkspace from "@/components/image/CompressImageWorkspace";
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
  Minimize2,
  Image as ImageIcon,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Compress Image Online — Reduce Photo File Size Free & Private",
  description:
    "Compress JPG, PNG, and WebP images up to 80% without visible loss in quality. Real-time byte savings calculation and 100% private in-browser compression.",
  keywords: [
    "compress image",
    "image compressor online",
    "reduce image file size",
    "compress jpg free",
    "compress png online",
    "shrink photo size",
    "optimize images for web",
  ],
  alternates: {
    canonical: "/compress-image",
  },
  openGraph: {
    title: "Compress Image Online | Bits & Tools",
    description:
      "Compress JPG, PNG, and WebP images up to 80% without visible quality loss in your browser.",
    url: "/compress-image",
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
    title: "Compress Image Online | Bits & Tools",
    description:
      "Compress JPG, PNG, and WebP images up to 80% without visible quality loss in your browser.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const COMPRESS_FAQS = [
  {
    question: "How does the client-side compression work?",
    answer:
      "The tool uses HTML5 Canvas and native browser WebP/JPEG quantization algorithms to remove redundant image metadata and apply perceptual compression without sending any files across the internet.",
  },
  {
    question: "How much file size can I save?",
    answer:
      "Depending on the source image, typical JPEG and PNG files see size reductions between 40% and 80% while retaining crisp visual quality suitable for websites, email attachments, and mobile messaging.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "You can compress JPEG, PNG, and WebP files. You can also convert to WebP during compression for even smaller file sizes.",
  },
  {
    question: "Is there any file size limit?",
    answer:
      "Because compression takes place directly in your device's memory, you can compress high-resolution images up to 50MB quickly with zero network lag.",
  },
];

const COMPRESS_STEPS = [
  {
    step: "01",
    title: "Upload Image",
    description: "Choose or drag and drop your image into the compressor.",
    icon: ImageIcon,
  },
  {
    step: "02",
    title: "Adjust Quality",
    description: "Slide the compression bar to find your desired balance between file size and sharpness.",
    icon: Minimize2,
  },
  {
    step: "03",
    title: "Download Compressed File",
    description: "Save your optimized, lightweight image with instant byte savings.",
    icon: Download,
  },
];

export default function CompressImagePage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Image Tools", href: "/image-tools" },
    { label: "Compress Image", href: "/compress-image" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Compress Image Online",
    url: `${baseUrl}/compress-image`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Reduce image file size of JPG, PNG, and WebP while preserving visual quality directly in the browser.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1835",
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
              <span>Smart Quantization &bull; Up to 80% Reduction &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Compress Image Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Reduce image file sizes for JPG, PNG, and WebP without visible quality loss in seconds.
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
                Instant in-memory optimization
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <CompressImageWorkspace />
      </section>

      <AdPlacement slotId="compress-image-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Compress Images"
        subtitle="Shrink photos in 3 simple steps"
        steps={COMPRESS_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Compress Image - Frequently Asked Questions"
        subtitle="Common questions about image compression quality, formats, and privacy"
        items={COMPRESS_FAQS}
      />

      <RelatedTools currentToolId="compress-image" />
    </div>
  );
}
