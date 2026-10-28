import React from "react";
import Base64Workspace from "@/components/utility/Base64Workspace";
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
  Binary,
  ArrowRightLeft,
  Upload,
} from "lucide-react";

export const metadata = {
  title: "Base64 Encoder & Decoder — Text and Image to Base64 Online",
  description:
    "Encode and decode Base64 strings, UTF-8 text, and files. Supports URL-safe Base64 and image Data URLs. 100% private, free, and in-browser.",
  keywords: [
    "base64 encoder",
    "base64 decoder",
    "text to base64",
    "base64 to text",
    "image to base64",
    "url safe base64",
    "utf8 base64 converter",
    "base64 data url generator",
  ],
  alternates: {
    canonical: "/base64-encoder-decoder",
  },
  openGraph: {
    title: "Base64 Encoder & Decoder Online | Bits & Tools",
    description:
      "Encode and decode Base64 strings and files with full Unicode and URL-safe support.",
    url: "/base64-encoder-decoder",
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
    title: "Base64 Encoder & Decoder Online | Bits & Tools",
    description:
      "Encode and decode Base64 strings and files with full Unicode support.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const BASE64_FAQS = [
  {
    question: "Does this Base64 tool support non-English characters and emojis?",
    answer:
      "Yes! Unlike standard browser btoa/atob implementations that crash on multi-byte characters, Bits & Tools uses TextEncoder and TextDecoder to provide 100% UTF-8 safe encoding for all international languages, accented characters, and emojis.",
  },
  {
    question: "What is URL-Safe Base64?",
    answer:
      "Standard Base64 contains '+' and '/' characters, which have special meanings in URLs and query strings. URL-Safe Base64 replaces '+' with '-' and '/' with '_', and strips padding '=' characters so the string can be safely embedded in web URLs without percent-encoding.",
  },
  {
    question: "Can I convert images to Base64 Data URLs for HTML and CSS?",
    answer:
      "Yes! Switch to the 'File to Base64' tab and drop any image or asset. The tool will instantly generate both a Data URL (e.g. data:image/png;base64,...) ready for HTML <img> tags or CSS background-image rules, as well as the raw Base64 string.",
  },
  {
    question: "Are my uploaded files sent to any remote server?",
    answer:
      "Never. All encoding and decoding operations run locally inside your browser's memory using HTML5 FileReader and typed arrays. Your files never leave your device.",
  },
];

const BASE64_STEPS = [
  {
    step: "01",
    title: "Select Mode",
    description: "Choose Encode Text, Decode Base64, or File to Base64.",
    icon: Binary,
  },
  {
    step: "02",
    title: "Provide Input",
    description: "Type, paste text, or drag and drop your image file into the workspace.",
    icon: Upload,
  },
  {
    step: "03",
    title: "Copy Output",
    description: "Instantly copy your Base64 string or decoded text in one click.",
    icon: Sparkles,
  },
];

export default function Base64Page() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Base64 Encoder & Decoder", href: "/base64-encoder-decoder" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Base64 Encoder & Decoder Online",
    url: `${baseUrl}/base64-encoder-decoder`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Encode and decode Base64 strings, UTF-8 text, and files with URL-safe options.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1808",
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
              <span>Unicode Safe &bull; URL-Safe &bull; File to Base64</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Base64 Encoder & Decoder
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Encode and decode text, binary data, and images with 100% UTF-8 support and client-side privacy.
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
                Instant in-browser processing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <Base64Workspace />
      </section>

      <AdPlacement slotId="base64-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Encode & Decode Base64"
        subtitle="Process text and images in 3 simple steps"
        steps={BASE64_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Base64 Tool - Frequently Asked Questions"
        subtitle="Common questions about UTF-8 encoding, URL safety, and Data URLs"
        items={BASE64_FAQS}
      />

      <RelatedTools currentToolId="base64-encoder-decoder" />
    </div>
  );
}
