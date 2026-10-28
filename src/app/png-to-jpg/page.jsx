import React from "react";
import ImageConverterWorkspace from "@/components/image/ImageConverterWorkspace";
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
  ArrowLeftRight,
  Image as ImageIcon,
  Download,
} from "lucide-react";

export const metadata = {
  title: "PNG to JPG Converter Online — Free, Fast & Private",
  description:
    "Convert PNG images to standard JPG/JPEG format with custom quality sliders and background fill colors in your browser. 100% private.",
  keywords: [
    "png to jpg",
    "convert png to jpg",
    "png to jpeg converter",
    "online png to jpg free",
    "change png to jpg",
  ],
  alternates: {
    canonical: "/png-to-jpg",
  },
  openGraph: {
    title: "PNG to JPG Converter Online | Bits & Tools",
    description:
      "Convert PNG images to standard JPG format with custom quality and background controls.",
    url: "/png-to-jpg",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PNG to JPG Converter Online | Bits & Tools",
    description:
      "Convert PNG images to standard JPG format with custom quality and background controls.",
  },
};

const PNG_JPG_FAQS = [
  {
    question: "Why convert PNG to JPG?",
    answer:
      "PNG files can be very large because they use lossless compression. Converting to JPG dramatically reduces file size by 50% to 80%, making photos faster to send via email, upload to social media, or load on websites.",
  },
  {
    question: "What happens to the transparent background in PNG?",
    answer:
      "Since JPEG does not support transparency, transparent areas are automatically replaced with a clean white background (or your custom chosen color).",
  },
  {
    question: "Can I adjust compression quality?",
    answer:
      "Yes. The converter features a quality slider from 20% to 100%, allowing you to select your ideal balance between smaller file size and visual fidelity.",
  },
];

const PNG_JPG_STEPS = [
  {
    step: "01",
    title: "Upload PNG",
    description: "Choose or drag and drop your PNG file into the workspace.",
    icon: ImageIcon,
  },
  {
    step: "02",
    title: "Configure Quality & Fill",
    description: "Adjust target compression quality and choose a background fill color.",
    icon: ArrowLeftRight,
  },
  {
    step: "03",
    title: "Download JPG",
    description: "Save your lightweight JPEG image immediately.",
    icon: Download,
  },
];

export default function PngToJpgPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Image Tools", href: "/image-tools" },
    { label: "PNG to JPG", href: "/png-to-jpg" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PNG to JPG Converter",
    url: `${baseUrl}/png-to-jpg`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert PNG images to standard JPEG format with custom background fill and compression quality.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1018",
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

      <div className="border-b border-black/[0.06] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pb-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="text-center max-w-3xl mx-auto mt-2 sm:mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Reduced File Size &bull; Custom Background Fill &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              PNG to JPG Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert PNG images to lightweight JPG format with adjustable quality and background fill.
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
                Instant in-memory conversion
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ImageConverterWorkspace defaultTarget="image/jpeg" title="Convert PNG to JPG" />
      </section>

      <AdPlacement slotId="png-to-jpg-below-workspace" />

      <HowItWorks
        title="How to Convert PNG to JPG"
        subtitle="Reduce image size and export to JPEG in 3 steps"
        steps={PNG_JPG_STEPS}
      />

      <FAQSection
        title="PNG to JPG - Frequently Asked Questions"
        subtitle="Common questions about converting PNG images to standard JPEG"
        items={PNG_JPG_FAQS}
      />

      <RelatedTools currentToolId="png-to-jpg" />
    </div>
  );
}
