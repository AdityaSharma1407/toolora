import React from "react";
import WordCounterWorkspace from "@/components/utility/WordCounterWorkspace";
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
  AlignLeft,
  Clock,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Word Counter Online — Free Word, Character & Reading Time Analyzer",
  description:
    "Count words, characters, sentences, paragraphs, and estimate reading time in real time. 100% free, browser-based, private, and instant text statistics.",
  keywords: [
    "word counter",
    "character counter",
    "reading time calculator",
    "word count tool",
    "count words online",
    "paragraph counter",
    "sentence counter",
    "keyword density checker",
    "character count without spaces",
  ],
  alternates: {
    canonical: "/word-counter",
  },
  openGraph: {
    title: "Word Counter Online — Free Text Analyzer | Bits & Tools",
    description:
      "Count words, characters, sentences, paragraphs, and calculate reading time in real time. 100% private in-browser text tool.",
    url: "/word-counter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Word Counter Online — Free Text Analyzer | Bits & Tools",
    description:
      "Count words, characters, sentences, paragraphs, and reading time in real time.",
  },
};

const WORD_COUNTER_FAQS = [
  {
    question: "How does the Word Counter calculate word count?",
    answer:
      "The tool identifies word tokens by scanning Unicode word boundaries, hyphens, and apostrophes while disregarding punctuation and excessive whitespace. This ensures accurate word counts across standard English, technical prose, and international languages.",
  },
  {
    question: "How is the estimated reading and speaking time calculated?",
    answer:
      "Estimated reading time is calculated using the industry standard average reading speed of 200 words per minute (WPM). Speaking time is estimated at a standard conversational pace of 130 words per minute.",
  },
  {
    question: "Is my pasted text saved or sent to any server?",
    answer:
      "No. All word counting and text analysis is calculated 100% locally in your web browser memory. Your text is never transmitted over the internet, stored in databases, or logged anywhere.",
  },
  {
    question: "What is the difference between character count with and without spaces?",
    answer:
      "Character count with spaces counts every single keystroke, including spacebars, tabs, and newlines (useful for tweet or character limit constraints). Character count without spaces strips all whitespace to reflect pure alphanumeric and punctuation length.",
  },
  {
    question: "Can I check keyword frequency with this tool?",
    answer:
      "Yes! The tool automatically parses top keywords, removes common stop words ('the', 'and', 'is'), and generates a keyword density summary with occurrences and percentages.",
  },
];

const WORD_COUNTER_STEPS = [
  {
    step: "01",
    title: "Paste or Type Text",
    description:
      "Type or paste your article, essay, social post, or notes into the editor. No sign-up required.",
    icon: AlignLeft,
  },
  {
    step: "02",
    title: "View Live Metrics",
    description:
      "Instantly view words, characters, sentences, paragraphs, reading time, and keyword frequency.",
    icon: Clock,
  },
  {
    step: "03",
    title: "Copy or Download",
    description:
      "Copy your formatted statistics summary or export your text as a clean .txt file in one click.",
    icon: Sparkles,
  },
];

export default function WordCounterPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Word Counter", href: "/word-counter" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Word Counter Online",
    url: `${baseUrl}/word-counter`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Count words, characters, sentences, paragraphs, and estimate reading time in real time with 100% browser-based privacy.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Real-time word and character counts",
      "Character count with and without spaces",
      "Sentence and paragraph calculation",
      "Estimated reading and speaking time",
      "Keyword density and frequency analysis",
      "100% client-side privacy",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Utility Tools",
        item: `${baseUrl}/utility-tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Word Counter",
        item: `${baseUrl}/word-counter`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Header */}
      <div className="border-b border-black/[0.06] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pb-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="text-center max-w-3xl mx-auto mt-2 sm:mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Real-Time &bull; Private &bull; 100% Client-Side</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Word Counter Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Analyze words, characters, sentences, paragraphs, and reading duration instantly as you type.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero server text transmission
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Instant live metrics
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Tool Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <WordCounterWorkspace />
      </section>

      <AdPlacement slotId="word-counter-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Use Word Counter"
        subtitle="Get instant text statistics in 3 simple steps"
        steps={WORD_COUNTER_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Word Counter - Frequently Asked Questions"
        subtitle="Common questions about counting rules, reading metrics, and privacy"
        items={WORD_COUNTER_FAQS}
      />

      <RelatedTools currentToolId="word-counter" />
    </div>
  );
}
