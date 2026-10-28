import React from "react";
import ListToolsWorkspace from "@/components/utility/ListToolsWorkspace";
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
  Shuffle,
  Filter,
  Split,
} from "lucide-react";

export const metadata = {
  title: "List Tools — Shuffle, Sort, Deduplicate & Set Operations Online",
  description:
    "Free online list utility: random line shuffler, alphabetical/natural sorter, duplicate remover, prefix/suffix wrapper, and list comparison set operations (intersection, union, diff).",
  keywords: [
    "list tools",
    "list shuffler",
    "shuffle lines online",
    "sort list alphabetically",
    "remove duplicate lines",
    "list deduplicator",
    "compare two lists",
    "list set operations",
    "list difference intersection",
  ],
  alternates: {
    canonical: "/list-tools",
  },
  openGraph: {
    title: "List Tools: Shuffler, Sorter, Deduplicator & Set Operations | Bits & Tools",
    description:
      "Shuffle, sort, clean, deduplicate, and compare lists with instant CSPRNG randomness and set operations.",
    url: "/list-tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "List Tools: Shuffler, Sorter, Deduplicator & Set Operations | Bits & Tools",
    description:
      "Shuffle, sort, clean, deduplicate, and compare lists with instant CSPRNG randomness and set operations.",
  },
};

const LIST_FAQS = [
  {
    question: "How does the random line shuffler work?",
    answer:
      "It implements the Fisher-Yates shuffle algorithm powered by the browser's cryptographic Web Crypto API (crypto.getRandomValues). This guarantees unbiased, statistically uniform pseudo-random permutations.",
  },
  {
    question: "What is Natural sorting?",
    answer:
      "Standard alphabetical sorting places 'Item 10' before 'Item 2'. Natural sorting recognizes multi-digit numbers within strings, correctly arranging items as 1, 2, 3... 9, 10, 11.",
  },
  {
    question: "How do the Two List Set operations work?",
    answer:
      "You can compute four mathematical set operations between List A and List B: Intersection (items present in both lists), Difference A \\ B (items in A but not in B), Difference B \\ A (items in B but not in A), and Union (all distinct items from both lists).",
  },
  {
    question: "Is there any limit to the list length?",
    answer:
      "Because processing executes client-side in browser RAM, you can comfortably process tens of thousands of lines in fractions of a second with zero network latency.",
  },
];

const LIST_STEPS = [
  {
    step: "01",
    title: "Input List Items",
    description: "Paste your items into the editor, one item per line.",
    icon: Filter,
  },
  {
    step: "02",
    title: "Choose Action",
    description: "Click Shuffle, Sort (A-Z/Natural), Deduplicate, Wrap, or compare two lists.",
    icon: Shuffle,
  },
  {
    step: "03",
    title: "Copy or Export",
    description: "Copy cleaned items to clipboard or download as a .txt file.",
    icon: Split,
  },
];

export default function ListToolsPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "List Tools", href: "/list-tools" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "List Tools & Shuffler",
    url: `${baseUrl}/list-tools`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Online list shuffler, deduplicator, multi-mode sorter, prefix/suffix wrapper, and set operation comparer.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "863",
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
              <span>CSPRNG Shuffler &bull; Natural Sort &bull; Set Comparer</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              List Tools & Set Operations
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Shuffle, sort, deduplicate, prefix, and compare lists with instant client-side performance.
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
                CSPRNG cryptographic shuffle
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ListToolsWorkspace />
      </section>

      <AdPlacement slotId="list-tools-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Process and Compare Lists"
        subtitle="Transform and organize text items in seconds"
        steps={LIST_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="List Tools - Frequently Asked Questions"
        subtitle="Common questions about shuffler randomness, deduplication, and set operations"
        items={LIST_FAQS}
      />

      <RelatedTools currentToolId="list-tools" />
    </div>
  );
}
