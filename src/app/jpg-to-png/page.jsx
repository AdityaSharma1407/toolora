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
  title: "JPG to PNG Converter Online — Free, High Quality & Private",
  description:
    "Convert JPG/JPEG images to lossless PNG format in your browser. Clean, crisp, high-resolution output with zero server uploads.",
  keywords: [
    "jpg to png",
    "convert jpg to png",
    "jpeg to png converter",
    "online jpg to png",
    "lossless image converter",
  ],
  alternates: {
    canonical: "/jpg-to-png",
  },
  openGraph: {
    title: "JPG to PNG Converter Online | Bits & Tools",
    description:
      "Convert JPG and JPEG images to lossless PNG format in your browser.",
    url: "/jpg-to-png",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JPG to PNG Converter Online | Bits & Tools",
    description:
      "Convert JPG and JPEG images to lossless PNG format in your browser.",
  },
};

const JPG_PNG_FAQS = [
  {
    question: "Why should I convert JPG to PNG?",
    answer:
      "PNG uses lossless compression, meaning no image details or fine textures are discarded when saving. It is ideal for illustrations, text graphics, screenshots, and logos.",
  },
  {
    question: "Does converting JPG to PNG add a transparent background?",
    answer:
      "No. Standard JPG images already have a solid background. To remove a background, you would need an image segmentation tool. However, converting to PNG ensures no further compression artifacts are introduced.",
  },
  {
    question: "Is there any file limit?",
    answer:
      "Because conversion executes 100% locally in your browser memory, you can convert images of any resolution without waiting for server uploads.",
  },
];

const JPG_PNG_STEPS = [
  {
    step: "01",
    title: "Upload JPG",
    description: "Select or drag and drop your JPG or JPEG image.",
    icon: ImageIcon,
  },
  {
    step: "02",
    title: "Automatic Conversion",
    description: "The engine instantly converts your image to lossless PNG format.",
    icon: ArrowLeftRight,
  },
  {
    step: "03",
    title: "Download PNG",
    description: "Save your crystal-clear PNG image directly to your computer.",
    icon: Download,
  },
];

export default function JpgToPngPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Image Tools", href: "/image-tools" },
    { label: "JPG to PNG", href: "/jpg-to-png" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "JPG to PNG Converter",
    url: `${baseUrl}/jpg-to-png`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert JPG and JPEG images to lossless PNG format directly in the browser.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "888",
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
              <span>Lossless Output &bull; Full Color Fidelity &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              JPG to PNG Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert JPG and JPEG images to high-resolution lossless PNG format in seconds.
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
        <ImageConverterWorkspace defaultTarget="image/png" title="Convert JPG to PNG" />
      </section>

      <AdPlacement slotId="jpg-to-png-below-workspace" />

      <HowItWorks
        title="How to Convert JPG to PNG"
        subtitle="Transform compressed JPEGs to PNG in 3 easy steps"
        steps={JPG_PNG_STEPS}
      />

      <FAQSection
        title="JPG to PNG - Frequently Asked Questions"
        subtitle="Common questions about converting JPEG images to lossless PNG"
        items={JPG_PNG_FAQS}
      />

      <RelatedTools currentToolId="jpg-to-png" />
    </div>
  );
}
