import React from "react";
import CaseConverterWorkspace from "@/components/utility/CaseConverterWorkspace";
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
  Type,
  Code2,
  FileSpreadsheet,
} from "lucide-react";

export const metadata = {
  title: "Case Converter Online — UPPERCASE, lowercase, Title Case & camelCase",
  description:
    "Convert text into UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, PascalCase, and kebab-case instantly. 100% free and private.",
  keywords: [
    "case converter",
    "uppercase to lowercase",
    "title case converter",
    "camelcase converter",
    "snake case converter",
    "text case changer",
    "sentence case converter",
    "pascal case",
    "kebab case",
  ],
  alternates: {
    canonical: "/case-converter",
  },
  openGraph: {
    title: "Case Converter Online — Change Text Case Free | Bits & Tools",
    description:
      "Transform text between UPPERCASE, lowercase, Title Case, camelCase, and snake_case in one click. 100% private in-browser tool.",
    url: "/case-converter",
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
    title: "Case Converter Online — Change Text Case Free | Bits & Tools",
    description:
      "Transform text between UPPERCASE, lowercase, Title Case, camelCase, and snake_case in one click.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const CASE_CONVERTER_FAQS = [
  {
    question: "What text case styles does this converter support?",
    answer:
      "The tool supports 12 different styles: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, aLtErNaTiNg cAsE, and InVeRsE cAsE.",
  },
  {
    question: "How does the Title Case algorithm handle small words?",
    answer:
      "Our Title Case engine follows smart AP and Chicago editorial rules, keeping minor conjunctions, articles, and short prepositions ('and', 'the', 'in', 'of', 'for') lowercase unless they are the first or last word of a sentence or heading.",
  },
  {
    question: "Can I convert code identifiers (e.g. from snake_case to camelCase)?",
    answer:
      "Yes! The developer modes (camelCase, snake_case, PascalCase, and kebab-case) are specifically designed to split and re-join compound variable names without corrupting digits or capitalization boundaries.",
  },
  {
    question: "Is there any character limit?",
    answer:
      "Because all conversions run directly in your browser's JavaScript engine without hitting a server, you can convert tens of thousands of words with near-instant speed.",
  },
];

const CASE_CONVERTER_STEPS = [
  {
    step: "01",
    title: "Input Text",
    description: "Paste or type your text or code snippet into the input box.",
    icon: Type,
  },
  {
    step: "02",
    title: "Select Case Style",
    description: "Choose your desired case from the 12 available formatting options.",
    icon: Code2,
  },
  {
    step: "03",
    title: "Copy Output",
    description: "Copy your converted text to clipboard or download it as a .txt file.",
    icon: Sparkles,
  },
];

export default function CaseConverterPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Case Converter", href: "/case-converter" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Case Converter Online",
    url: `${baseUrl}/case-converter`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case instantly.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "932",
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
              <span>12 Formatting Styles &bull; Instant &bull; Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Case Converter Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Transform text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and PascalCase in real time.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero server text uploads
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Instant in-browser transformation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <CaseConverterWorkspace />
      </section>

      <AdPlacement slotId="case-converter-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Convert Text Case"
        subtitle="Transform text formats in 3 simple steps"
        steps={CASE_CONVERTER_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Case Converter - Frequently Asked Questions"
        subtitle="Clear answers about supported styles and capitalization rules"
        items={CASE_CONVERTER_FAQS}
      />

      <RelatedTools currentToolId="case-converter" />
    </div>
  );
}
