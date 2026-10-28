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
  title: "Image Converter Online — Convert PNG, JPG, and WebP Free",
  description:
    "Convert images between PNG, JPG, and WebP formats instantly in your browser. Maintain transparency or apply custom background fills with zero quality loss.",
  keywords: [
    "image converter",
    "convert image online",
    "png to jpg",
    "jpg to png",
    "webp to png",
    "png to webp",
    "free image format converter",
  ],
  alternates: {
    canonical: "/image-converter",
  },
  openGraph: {
    title: "Image Converter Online | Bits & Tools",
    description:
      "Convert images between PNG, JPG, and WebP formats instantly with client-side privacy.",
    url: "/image-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Converter Online | Bits & Tools",
    description:
      "Convert images between PNG, JPG, and WebP formats instantly with client-side privacy.",
  },
};

const CONVERTER_FAQS = [
  {
    question: "What happens to transparency when converting PNG to JPG?",
    answer:
      "Because the JPEG format does not support alpha transparency, any transparent areas in your PNG will be filled with a solid background color (white by default, or your chosen custom color).",
  },
  {
    question: "Why should I convert images to WebP?",
    answer:
      "WebP is a modern image format created by Google that provides 25% to 35% smaller file sizes than comparable JPEGs and PNGs while retaining full alpha transparency and rich colors. All modern web browsers natively support WebP.",
  },
  {
    question: "Is there any quality loss during conversion?",
    answer:
      "Converting to PNG is completely lossless. When converting to JPEG or WebP, you can use the quality slider (up to 100%) to preserve pristine visual details.",
  },
  {
    question: "Are my photos uploaded to any server?",
    answer:
      "Never. All conversion is processed in your device's browser memory using client-side HTML5 Canvas. Your files never leave your computer.",
  },
];

const CONVERTER_STEPS = [
  {
    step: "01",
    title: "Upload Image",
    description: "Choose or drag and drop any image file (PNG, JPG, WebP, etc.).",
    icon: ImageIcon,
  },
  {
    step: "02",
    title: "Choose Target Format",
    description: "Select PNG, JPEG, or WebP and adjust quality or background options.",
    icon: ArrowLeftRight,
  },
  {
    step: "03",
    title: "Download Converted File",
    description: "Save your converted image immediately with full client-side privacy.",
    icon: Download,
  },
];

export default function ImageConverterPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Image Tools", href: "/image-tools" },
    { label: "Image Converter", href: "/image-converter" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Image Converter Online",
    url: `${baseUrl}/image-converter`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Universal image converter for PNG, JPG, and WebP files with quality controls and transparency preservation.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1694",
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
              <span>PNG &bull; JPG &bull; WebP &bull; Transparency Support</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Image Converter Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert between PNG, JPEG, and WebP formats instantly with custom quality and background controls.
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

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ImageConverterWorkspace />
      </section>

      <AdPlacement slotId="image-converter-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Convert Image Formats"
        subtitle="Translate pictures into any format in 3 simple steps"
        steps={CONVERTER_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Image Converter - Frequently Asked Questions"
        subtitle="Common questions about image format conversion, WebP, and transparency"
        items={CONVERTER_FAQS}
      />

      <RelatedTools currentToolId="image-converter" />
    </div>
  );
}
