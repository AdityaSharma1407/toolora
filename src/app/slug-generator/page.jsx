import React from "react";
import SlugGeneratorWorkspace from "@/components/utility/SlugGeneratorWorkspace";
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
  Link as LinkIcon,
  Settings,
  Copy,
} from "lucide-react";

export const metadata = {
  title: "Slug Generator — SEO-Friendly URL Slug Generator Online",
  description:
    "Generate clean, SEO-friendly URL slugs from any title or text. Handles unicode transliteration, accents, and custom separators. 100% free and in-browser.",
  keywords: [
    "slug generator",
    "url slug generator",
    "seo friendly url",
    "slugify online",
    "title to slug",
    "url slug creator",
    "transliterate slug",
  ],
  alternates: {
    canonical: "/slug-generator",
  },
  openGraph: {
    title: "SEO Slug Generator Online | Bits & Tools",
    description:
      "Convert any title or text into a clean, search engine-optimized URL slug.",
    url: "/slug-generator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Slug Generator Online | Bits & Tools",
    description:
      "Convert any title or text into a clean URL slug.",
  },
};

const SLUG_FAQS = [
  {
    question: "How does the slug generator handle accented characters?",
    answer:
      "The tool uses Unicode NFD normalization to automatically strip accents and diacritics (e.g. converting 'é' to 'e', 'ü' to 'u', and 'ñ' to 'n'), producing universally accessible ASCII web addresses.",
  },
  {
    question: "Why should I remove stop words from URL slugs?",
    answer:
      "Search engines like Google recommend keeping URL slugs short and descriptive. Removing filler words ('the', 'a', 'and', 'in') keeps URLs concise and readable on search engine results pages (SERPs).",
  },
  {
    question: "Which separator is best for SEO?",
    answer:
      "Google's official search quality guidelines recommend using hyphens (-) rather than underscores (_) or dots, as search engine spiders treat hyphens as natural word separators.",
  },
];

const SLUG_STEPS = [
  {
    step: "01",
    title: "Enter Title",
    description: "Type or paste your article, product, or page title into the input box.",
    icon: LinkIcon,
  },
  {
    step: "02",
    title: "Customize Options",
    description: "Choose your separator (hyphen, underscore), casing, and stop-word rules.",
    icon: Settings,
  },
  {
    step: "03",
    title: "Copy Slug",
    description: "Instantly copy your SEO-ready URL slug to your clipboard.",
    icon: Sparkles,
  },
];

export default function SlugPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Slug Generator", href: "/slug-generator" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SEO URL Slug Generator Online",
    url: `${baseUrl}/slug-generator`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Generate clean, SEO-friendly URL slugs from any title or text.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1196",
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
              <span>SEO Optimized &bull; Accent Normalization &bull; Instant</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              SEO URL Slug Generator
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert any page title, article headline, or text into a clean, search engine-optimized URL slug.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero data sent to servers
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Live real-time slug preview
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <SlugGeneratorWorkspace />
      </section>

      <AdPlacement slotId="slug-generator-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Generate an SEO Slug"
        subtitle="Create clean URLs in 3 simple steps"
        steps={SLUG_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Slug Generator - Frequently Asked Questions"
        subtitle="Common questions about SEO-friendly slugs, separators, and character normalization"
        items={SLUG_FAQS}
      />

      <RelatedTools currentToolId="slug-generator" />
    </div>
  );
}
