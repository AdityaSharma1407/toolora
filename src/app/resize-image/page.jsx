import React from "react";
import ResizeImageWorkspace from "@/components/image/ResizeImageWorkspace";
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
  Sliders,
  Image as ImageIcon,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Resize Image Online — Change Image Dimensions Free & Private",
  description:
    "Resize images by pixels or percentage with aspect ratio lock, format conversion (PNG, JPG, WebP), and high quality in your browser. 100% private.",
  keywords: [
    "resize image",
    "image resizer online",
    "change photo dimensions",
    "resize png online",
    "resize jpg without losing quality",
    "scale image percentage",
    "picture dimension changer",
  ],
  alternates: {
    canonical: "/resize-image",
  },
  openGraph: {
    title: "Resize Image Online | Bits & Tools",
    description:
      "Resize images by pixels or percentage with aspect ratio lock, format conversion, and high quality.",
    url: "/resize-image",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resize Image Online | Bits & Tools",
    description:
      "Resize images by pixels or percentage with aspect ratio lock, format conversion, and high quality.",
  },
};

const RESIZE_FAQS = [
  {
    question: "Does resizing reduce image quality?",
    answer:
      "Bits & Tools uses high-quality bicubic interpolation algorithms directly inside your browser canvas (`imageSmoothingQuality = 'high'`), preserving maximum sharpness and color fidelity.",
  },
  {
    question: "Can I lock the aspect ratio?",
    answer:
      "Yes. The aspect ratio lock is enabled by default. Entering a new width will automatically recalculate the height to prevent distortion.",
  },
  {
    question: "What image formats can I resize?",
    answer:
      "You can upload PNG, JPEG, WebP, GIF, or BMP files and export to PNG, JPEG, or WebP with customizable compression quality.",
  },
  {
    question: "Are my photos uploaded to an external server?",
    answer:
      "Never. All image scaling and rendering occur strictly in your device's browser memory. Your images remain 100% private.",
  },
];

const RESIZE_STEPS = [
  {
    step: "01",
    title: "Upload Image",
    description: "Choose or drag and drop any PNG, JPG, or WebP image into the workspace.",
    icon: ImageIcon,
  },
  {
    step: "02",
    title: "Set Dimensions",
    description: "Enter target width and height in pixels or select a quick scale percentage.",
    icon: Sliders,
  },
  {
    step: "03",
    title: "Download Resized Image",
    description: "Instantly export your scaled image in your preferred format.",
    icon: Download,
  },
];

export default function ResizeImagePage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Image Tools", href: "/image-tools" },
    { label: "Resize Image", href: "/resize-image" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Resize Image Online",
    url: `${baseUrl}/resize-image`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Resize images by pixels or percentage with aspect ratio locks and custom format export.",
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
              <span>Pixel & Percentage Scale &bull; Aspect Ratio Lock &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Resize Image Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Change image dimensions in pixels or percentage with high-quality smoothing and format conversion.
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
                Instant browser scaling
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ResizeImageWorkspace />
      </section>

      <AdPlacement slotId="resize-image-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Resize Images"
        subtitle="Scale your pictures to exact dimensions in seconds"
        steps={RESIZE_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Resize Image - Frequently Asked Questions"
        subtitle="Common questions about image scaling, aspect ratios, and export formats"
        items={RESIZE_FAQS}
      />

      <RelatedTools currentToolId="resize-image" />
    </div>
  );
}
