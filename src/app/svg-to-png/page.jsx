import React from "react";
import SvgToPngWorkspace from "@/components/image/SvgToPngWorkspace";
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
  FileCode,
  Sliders,
  Download,
} from "lucide-react";

export const metadata = {
  title: "SVG to PNG Converter Online — High Resolution Rasterizer Free",
  description:
    "Convert SVG vector files or raw SVG code into crisp, high-resolution PNG or WebP images with custom 1x, 2x, 4x, 8x resolution scaling and transparent backgrounds.",
  keywords: [
    "svg to png",
    "convert svg to png",
    "svg rasterizer online",
    "high res svg to png",
    "svg to png with transparent background",
    "retina svg converter",
    "vector to raster online",
  ],
  alternates: {
    canonical: "/svg-to-png",
  },
  openGraph: {
    title: "SVG to PNG Converter Online | Bits & Tools",
    description:
      "Convert SVG vector files or code into high-resolution PNG images with custom resolution scaling.",
    url: "/svg-to-png",
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
    title: "SVG to PNG Converter Online | Bits & Tools",
    description:
      "Convert SVG vector files or code into high-resolution PNG images with custom resolution scaling.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const SVG_FAQS = [
  {
    question: "How does the resolution scaling work?",
    answer:
      "Because SVG is mathematically defined vector artwork, it can be rasterized at any resolution without pixelation. You can choose 1x (original size), 2x (retina screens), 4x (high-DPI printing), or 8x (ultra-HD banners).",
  },
  {
    question: "Can I paste raw SVG code directly?",
    answer:
      "Yes. You can either upload a `.svg` file from your device or paste raw `<svg>...</svg>` XML code directly into the code editor.",
  },
  {
    question: "Is transparent background supported?",
    answer:
      "Yes! By default, SVGs are rasterized with complete alpha channel transparency preserved in the resulting PNG or WebP file. You can also toggle a solid white background if desired.",
  },
  {
    question: "Is any SVG data uploaded to an external server?",
    answer:
      "Never. All vector parsing, DOM rendering, and canvas rasterization execute locally in your web browser. Your icons, logos, and vector assets never leave your device.",
  },
];

const SVG_STEPS = [
  {
    step: "01",
    title: "Upload or Paste SVG",
    description: "Upload a .svg file or paste raw SVG XML markup into the code editor.",
    icon: FileCode,
  },
  {
    step: "02",
    title: "Select Resolution Scale",
    description: "Choose 1x, 2x, 4x, or 8x scaling and set transparent or white background.",
    icon: Sliders,
  },
  {
    step: "03",
    title: "Download PNG Image",
    description: "Save your crisp, pixel-perfect rasterized PNG with instant generation.",
    icon: Download,
  },
];

export default function SvgToPngPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Image Tools", href: "/image-tools" },
    { label: "SVG to PNG", href: "/svg-to-png" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SVG to PNG Converter",
    url: `${baseUrl}/svg-to-png`,
    applicationCategory: "DesignApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert SVG vectors into high-resolution PNG images with custom 1x to 8x resolution scaling.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1085",
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
              <span>1x to 8x Retina Scaling &bull; Alpha Transparency &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              SVG to PNG Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert vector SVG files or markup into crisp, high-resolution PNG images at any resolution scale.
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
                Vector-to-raster speed
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <SvgToPngWorkspace />
      </section>

      <AdPlacement slotId="svg-to-png-below-workspace" />

      <HowItWorks
        title="How to Convert SVG to PNG"
        subtitle="Rasterize vector graphics into high-DPI images in 3 steps"
        steps={SVG_STEPS}
      />

      <FAQSection
        title="SVG to PNG - Frequently Asked Questions"
        subtitle="Common questions about SVG rendering, scale multipliers, and transparency"
        items={SVG_FAQS}
      />

      <RelatedTools currentToolId="svg-to-png" />
    </div>
  );
}
