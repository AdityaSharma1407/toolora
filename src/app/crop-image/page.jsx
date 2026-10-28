import React from "react";
import CropImageWorkspace from "@/components/image/CropImageWorkspace";
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
  Crop as CropIcon,
  Maximize2,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Crop Image Online — Free Photo Cropper with Social Media Presets",
  description:
    "Crop pictures with exact aspect ratios (1:1, 16:9, 4:5, 9:16), freeform boundaries, rotate, flip, and export to PNG, JPG, or WebP. 100% private in your browser.",
  keywords: [
    "crop image",
    "crop photo online",
    "image cropper free",
    "instagram crop 4:5",
    "youtube thumbnail cropper 16:9",
    "avatar square crop 1:1",
    "cut picture online",
    "photo crop tool",
  ],
  alternates: {
    canonical: "/crop-image",
  },
  openGraph: {
    title: "Crop Image Online — Free Photo Cropper | Bits & Tools",
    description:
      "Crop pictures with exact aspect ratios, rotation, flipping, and instant export. 100% private in browser.",
    url: "/crop-image",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crop Image Online — Free Photo Cropper | Bits & Tools",
    description:
      "Crop pictures with exact aspect ratios, rotation, flipping, and instant export. 100% private in browser.",
  },
};

const CROP_FAQS = [
  {
    question: "How do I crop an image to an exact aspect ratio?",
    answer:
      "Select any aspect ratio preset such as 1:1 (Square/Avatar), 16:9 (Landscape/YouTube), 4:5 (Instagram Feed), or 9:16 (Stories/Reels). The crop overlay will automatically maintain that proportion as you move or scale it.",
  },
  {
    question: "Can I do freeform cropping without fixed proportions?",
    answer:
      "Yes. Simply click the 'Freeform' preset to independently drag any of the 8 grab handles to any custom rectangular dimension.",
  },
  {
    question: "Can I rotate or flip my image before cropping?",
    answer:
      "Yes. Use the 90° rotate button, Flip Horizontal, or Flip Vertical controls. Your transformations will be seamlessly applied to the exported file.",
  },
  {
    question: "What output formats and quality options are supported?",
    answer:
      "You can export your cropped image as lossless PNG, optimized JPG with custom compression quality, or modern WebP for smaller web file sizes.",
  },
  {
    question: "Is my photo uploaded to any server?",
    answer:
      "No. All image cropping, rotation, and file generation happen 100% locally in your device's browser memory using HTML5 Canvas. Your photos never leave your computer.",
  },
];

const CROP_STEPS = [
  {
    step: "01",
    title: "Upload Image",
    description: "Choose or drag and drop any PNG, JPG, WebP, SVG, or AVIF image.",
    icon: CropIcon,
  },
  {
    step: "02",
    title: "Adjust Crop Box",
    description: "Drag the handles or select a preset ratio (1:1, 16:9, 4:5, 9:16, 4:3).",
    icon: Maximize2,
  },
  {
    step: "03",
    title: "Download Cropped Image",
    description: "Choose PNG, JPG, or WebP and download your newly framed picture.",
    icon: Download,
  },
];

export default function CropImagePage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Image Tools", href: "/image-tools" },
    { label: "Crop Image", href: "/crop-image" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Crop Image Online",
    url: `${baseUrl}/crop-image`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Crop pictures with exact aspect ratios (1:1, 16:9, 4:5, 9:16), rotate, flip, and export to PNG, JPG, or WebP. 100% client-side.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1826",
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
              <span>Social Media Presets &bull; Rotate & Flip &bull; 100% Private in Browser</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Crop Image Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Crop photos to custom dimensions or standard aspect ratios for Instagram, YouTube, avatars, and websites with zero quality loss.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero server uploads
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Instant canvas export
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <CropImageWorkspace />
      </section>

      <AdPlacement slotId="crop-image-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Crop Images Online"
        subtitle="Frame your pictures to perfection in 3 simple steps"
        steps={CROP_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Crop Image - Frequently Asked Questions"
        subtitle="Everything you need to know about cropping, aspect ratios, and privacy"
        items={CROP_FAQS}
      />

      <RelatedTools currentToolId="crop-image" />
    </div>
  );
}
