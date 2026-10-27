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
  title: "WebP Converter Online — Convert Images to and from WebP Free",
  description:
    "Convert JPG and PNG to modern WebP format for 30%+ smaller file sizes with transparency support, or convert WebP back to JPG/PNG. 100% private in browser.",
  keywords: [
    "webp converter",
    "convert to webp",
    "png to webp",
    "jpg to webp",
    "webp to jpg",
    "webp to png",
    "modern web image converter",
  ],
  alternates: {
    canonical: "/webp-converter",
  },
  openGraph: {
    title: "WebP Converter Online | Bits & Tools",
    description:
      "Convert images to and from modern WebP format for smaller file sizes and transparency.",
    url: "/webp-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebP Converter Online | Bits & Tools",
    description:
      "Convert images to and from modern WebP format for smaller file sizes and transparency.",
  },
};

const WEBP_FAQS = [
  {
    question: "What are the benefits of WebP?",
    answer:
      "Developed by Google, WebP provides superior lossless and lossy compression. WebP images are typically 26% smaller than PNGs and 25-34% smaller than JPEGs while supporting full transparency, speeding up page load speeds.",
  },
  {
    question: "Can I convert WebP files back to JPG or PNG?",
    answer:
      "Yes. If you have a WebP image that won't open in an older graphic editor, you can upload it here and convert it into a universal PNG or JPG immediately.",
  },
  {
    question: "Does WebP support transparency?",
    answer:
      "Yes! Unlike JPEG, WebP fully supports 8-bit alpha channel transparency (just like PNG) while achieving a much smaller file footprint.",
  },
];

const WEBP_STEPS = [
  {
    step: "01",
    title: "Upload Image",
    description: "Choose any PNG, JPG, or WebP image to convert.",
    icon: ImageIcon,
  },
  {
    step: "02",
    title: "Select Format & Quality",
    description: "Choose WebP for compact files or PNG/JPG for legacy compatibility.",
    icon: ArrowLeftRight,
  },
  {
    step: "03",
    title: "Download Converted File",
    description: "Save your optimized modern image with full client-side privacy.",
    icon: Download,
  },
];

export default function WebpConverterPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Image Tools", href: "/image-tools" },
    { label: "WebP Converter", href: "/webp-converter" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "WebP Image Converter",
    url: `${baseUrl}/webp-converter`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert JPG and PNG to modern WebP format and convert WebP back to JPG and PNG directly in the browser.",
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
              <span>Next-Gen Web Format &bull; Alpha Transparency &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              WebP Converter Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert PNG and JPG images to modern WebP format for lightweight web performance, or convert WebP back to JPG/PNG.
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
        <ImageConverterWorkspace defaultTarget="image/webp" title="Convert to WebP" />
      </section>

      <AdPlacement slotId="webp-converter-below-workspace" />

      <HowItWorks
        title="How to Convert to and from WebP"
        subtitle="Modernize your images in 3 easy steps"
        steps={WEBP_STEPS}
      />

      <FAQSection
        title="WebP Converter - Frequently Asked Questions"
        subtitle="Common questions about WebP compression, transparency, and browser compatibility"
        items={WEBP_FAQS}
      />

      <RelatedTools currentToolId="webp-converter" />
    </div>
  );
}
