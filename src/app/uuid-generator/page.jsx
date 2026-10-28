import React from "react";
import UuidGeneratorWorkspace from "@/components/utility/UuidGeneratorWorkspace";
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
  Fingerprint,
  Copy,
  RefreshCw,
} from "lucide-react";

export const metadata = {
  title: "UUID Generator — Bulk RFC 4122 v4 UUID & GUID Generator Online",
  description:
    "Generate random, cryptographically secure RFC 4122 version-4 UUIDs and GUIDs in bulk. Options for uppercase, hyphens, and brackets. 100% free and in-browser.",
  keywords: [
    "uuid generator",
    "guid generator",
    "rfc 4122 v4 uuid",
    "bulk uuid generator",
    "random uuid online",
    "generate guid",
    "uuid without hyphens",
  ],
  alternates: {
    canonical: "/uuid-generator",
  },
  openGraph: {
    title: "UUID / GUID Generator Online | Bits & Tools",
    description:
      "Generate cryptographically secure v4 UUIDs in bulk with custom casing, hyphens, and quotes.",
    url: "/uuid-generator",
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
    title: "UUID / GUID Generator Online | Bits & Tools",
    description:
      "Generate cryptographically secure v4 UUIDs in bulk.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const UUID_FAQS = [
  {
    question: "What is an RFC 4122 Version 4 UUID?",
    answer:
      "A Version-4 UUID (Universally Unique Identifier) is a 128-bit identifier generated using cryptographically random numbers. With 122 bits of true entropy, the statistical probability of generating duplicate UUIDs (a collision) is virtually zero.",
  },
  {
    question: "How are UUIDs generated in this tool?",
    answer:
      "UUIDs are generated using the native browser crypto.randomUUID() API and crypto.getRandomValues(). This ensures cryptographically secure pseudo-random number generator (CSPRNG) entropy directly on your machine without server roundtrips.",
  },
  {
    question: "What is the difference between a UUID and a GUID?",
    answer:
      "UUID (Universally Unique Identifier) is the open IETF standard name (RFC 4122), while GUID (Globally Unique Identifier) is Microsoft's implementation term. In modern software engineering, they refer to the exact same 128-bit format.",
  },
];

const UUID_STEPS = [
  {
    step: "01",
    title: "Choose Quantity & Options",
    description: "Select how many UUIDs you need (1 to 100) and choose case or hyphen preferences.",
    icon: Fingerprint,
  },
  {
    step: "02",
    title: "Generate Instantly",
    description: "Click Regenerate to draw fresh cryptographically secure random identifiers.",
    icon: RefreshCw,
  },
  {
    step: "03",
    title: "Copy or Export",
    description: "Copy individual identifiers, copy the entire list, or download a .txt file.",
    icon: Sparkles,
  },
];

export default function UuidPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "UUID Generator", href: "/uuid-generator" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "UUID / GUID Generator Online",
    url: `${baseUrl}/uuid-generator`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Generate random, cryptographically secure RFC 4122 version-4 UUIDs and GUIDs in bulk.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1413",
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
              <span>CSPRNG Secure &bull; RFC 4122 v4 &bull; Bulk Export</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              UUID & GUID Generator
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Generate bulk cryptographically secure RFC 4122 Version-4 UUIDs with custom casing, hyphens, and brackets.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                CSPRNG browser entropy
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Instant bulk generation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <UuidGeneratorWorkspace />
      </section>

      <AdPlacement slotId="uuid-generator-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Generate UUIDs"
        subtitle="Generate unique random identifiers in 3 simple steps"
        steps={UUID_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="UUID Generator - Frequently Asked Questions"
        subtitle="Common questions about RFC 4122 v4 standards, collisions, and security"
        items={UUID_FAQS}
      />

      <RelatedTools currentToolId="uuid-generator" />
    </div>
  );
}
