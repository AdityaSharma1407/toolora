import React from "react";
import JsonFormatterWorkspace from "@/components/utility/JsonFormatterWorkspace";
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
  Braces,
  CheckCircle2,
  Code2,
} from "lucide-react";

export const metadata = {
  title: "JSON Formatter & Validator — Beautify, Minify & Validate JSON",
  description:
    "Prettify, minify, validate, and sort JSON keys in your browser. Highlights syntax errors with exact line and column numbers. 100% free, private, and offline.",
  keywords: [
    "json formatter",
    "json validator",
    "beautify json",
    "json prettifier",
    "minify json",
    "sort json keys",
    "unescape json",
    "json syntax checker",
    "online json parser",
  ],
  alternates: {
    canonical: "/json-formatter",
  },
  openGraph: {
    title: "JSON Formatter & Validator — Clean & Beautify JSON | Bits & Tools",
    description:
      "Format, validate, minify, and inspect JSON in real time. Highlights syntax errors with line & column numbers.",
    url: "/json-formatter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Formatter & Validator — Clean & Beautify JSON | Bits & Tools",
    description:
      "Format, validate, minify, and inspect JSON in real time with 100% client-side privacy.",
  },
};

const JSON_FORMATTER_FAQS = [
  {
    question: "Does the JSON Formatter support minification and custom indentation?",
    answer:
      "Yes! You can format your JSON using 2 spaces, 4 spaces, or tab indentation. Alternatively, you can click 'Minify' to strip all whitespace, comments, and newlines for optimal transmission over APIs.",
  },
  {
    question: "How does syntax validation help me fix broken JSON?",
    answer:
      "When JSON parsing fails (e.g., due to trailing commas, single quotes, or missing brackets), the validator flags the exact line and column number where the parser encountered the error, highlighting the problematic code instantly.",
  },
  {
    question: "What does the 'Sort Keys' feature do?",
    answer:
      "Clicking 'Sort Keys' recursively alphabetizes all object keys from A to Z throughout your JSON document, including deeply nested objects and array elements. This makes comparing API payloads and diffing configurations much easier.",
  },
  {
    question: "Is my JSON data kept private?",
    answer:
      "Yes, completely. Unlike other online formatters that send your sensitive data, tokens, and payloads to remote cloud servers, Bits & Tools parses your JSON 100% in your device's browser memory using native JavaScript engines.",
  },
];

const JSON_FORMATTER_STEPS = [
  {
    step: "01",
    title: "Paste JSON Data",
    description: "Paste your raw, compressed, or unformatted JSON into the editor.",
    icon: Braces,
  },
  {
    step: "02",
    title: "Choose Action",
    description: "Click Prettify (2/4 spaces or tab), Minify, Sort Keys, or Unescape.",
    icon: Code2,
  },
  {
    step: "03",
    title: "Copy or Download",
    description: "Copy your verified clean JSON to clipboard or download it as a .json file.",
    icon: Sparkles,
  },
];

export default function JsonFormatterPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "JSON Formatter", href: "/json-formatter" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "JSON Formatter & Validator Online",
    url: `${baseUrl}/json-formatter`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Beautify, minify, validate, and sort JSON keys in your browser. Highlights syntax errors with line & column numbers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "JSON Beautifier (2 spaces, 4 spaces, tab)",
      "JSON Minifier and Whitespace Compressor",
      "Real-time Syntax Error Validator with Line & Column",
      "Recursive Alphabetical Key Sorter",
      "Backslash Escape Stripper",
      "100% Client-Side Privacy",
    ],
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
              <span>Validate &bull; Prettify &bull; Minify &bull; Sort Keys</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              JSON Formatter & Validator
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Beautify, compress, inspect, and validate JSON data with instant syntax error detection.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero server data transmission
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Instant in-memory validation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <JsonFormatterWorkspace />
      </section>

      <AdPlacement slotId="json-formatter-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Format & Validate JSON"
        subtitle="Clean up messy or minified JSON in 3 simple steps"
        steps={JSON_FORMATTER_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="JSON Formatter - Frequently Asked Questions"
        subtitle="Common questions about syntax validation, formatting options, and data privacy"
        items={JSON_FORMATTER_FAQS}
      />

      <RelatedTools currentToolId="json-formatter" />
    </div>
  );
}
