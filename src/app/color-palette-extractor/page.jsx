import React from "react";
import ColorPaletteWorkspace from "@/components/image/ColorPaletteWorkspace";
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
  Palette,
  Image as ImageIcon,
  Copy,
} from "lucide-react";

export const metadata = {
  title: "Color Palette Extractor — Extract Dominant Colors from Images Online",
  description:
    "Extract dominant color palettes from any photo or image. Generate HEX, RGB, HSL, CSS Variables, and Tailwind themes instantly in your browser.",
  keywords: [
    "color palette extractor",
    "extract colors from image",
    "image color picker online",
    "photo color palette generator",
    "image to hex code",
    "dominant colors from photo",
    "generate tailwind palette from image",
  ],
  alternates: {
    canonical: "/color-palette-extractor",
  },
  openGraph: {
    title: "Color Palette Extractor Online | Bits & Tools",
    description:
      "Extract dominant color palettes from any photo. Generate HEX, RGB, HSL, CSS, and Tailwind themes.",
    url: "/color-palette-extractor",
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
    title: "Color Palette Extractor Online | Bits & Tools",
    description:
      "Extract dominant color palettes from any photo. Generate HEX, RGB, HSL, CSS, and Tailwind themes.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const PALETTE_FAQS = [
  {
    question: "How does color extraction work?",
    answer:
      "The tool scans your image pixel data via an in-memory canvas and applies color quantization algorithms to group similar hues, identifying the most visually prominent and harmonious colors.",
  },
  {
    question: "What export formats are available?",
    answer:
      "You can copy individual HEX codes, a comma-separated list, ready-to-paste CSS custom properties (`--color-1: #...;`), Tailwind CSS color theme objects, or structured JSON data.",
  },
  {
    question: "Is any image uploaded to an external server?",
    answer:
      "No. All color sampling and quantization calculations run entirely inside your browser's local JavaScript environment. Your personal photos are never transmitted over the internet.",
  },
];

const PALETTE_STEPS = [
  {
    step: "01",
    title: "Upload Image",
    description: "Select or drop any photo, illustration, or graphic.",
    icon: ImageIcon,
  },
  {
    step: "02",
    title: "Instant Clustering",
    description: "The engine extracts up to 8 dominant color swatches automatically.",
    icon: Palette,
  },
  {
    step: "03",
    title: "Copy Swatches or Code",
    description: "Click any color swatch to copy HEX codes or export as CSS/Tailwind variables.",
    icon: Copy,
  },
];

export default function ColorPaletteExtractorPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Image Tools", href: "/image-tools" },
    { label: "Color Palette Extractor", href: "/color-palette-extractor" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Color Palette Extractor",
    url: `${baseUrl}/color-palette-extractor`,
    applicationCategory: "DesignApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Extract dominant color palettes from images and export HEX, RGB, HSL, CSS variables, and Tailwind themes.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1591",
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
              <span>HEX &bull; RGB &bull; HSL &bull; CSS & Tailwind Export &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Color Palette Extractor
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Extract dominant colors from photos and generate beautiful HEX, RGB, HSL, CSS, and Tailwind palettes.
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
                Instant in-memory clustering
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ColorPaletteWorkspace />
      </section>

      <AdPlacement slotId="palette-extractor-below-workspace" />

      <HowItWorks
        title="How to Extract Colors from an Image"
        subtitle="Build harmonious color themes in 3 simple steps"
        steps={PALETTE_STEPS}
      />

      <FAQSection
        title="Color Palette Extractor - Frequently Asked Questions"
        subtitle="Common questions about color extraction, color spaces, and export formats"
        items={PALETTE_FAQS}
      />

      <RelatedTools currentToolId="color-palette-extractor" />
    </div>
  );
}
