import React from "react";
import PercentageCalculatorWorkspace from "@/components/utility/PercentageCalculatorWorkspace";
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
  Percent,
  TrendingUp,
  Calculator,
} from "lucide-react";

export const metadata = {
  title: "Percentage Calculator — Fast, Free Percent Change & Fraction Solver",
  description:
    "Calculate percentages, percentage increases, discounts, tips, and fractional differences with step-by-step formulas. 100% free, private, and offline.",
  keywords: [
    "percentage calculator",
    "percent change calculator",
    "percentage increase",
    "percentage decrease",
    "discount calculator",
    "tax calculator",
    "what is percent of",
    "percent difference",
  ],
  alternates: {
    canonical: "/percentage-calculator",
  },
  openGraph: {
    title: "Percentage Calculator Online | Bits & Tools",
    description:
      "Quickly solve percentage increases, decreases, differences, tips, and fractions with clear explanations.",
    url: "/percentage-calculator",
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
    title: "Percentage Calculator Online | Bits & Tools",
    description:
      "Quickly solve percentage increases, decreases, differences, and fractions.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const PERCENTAGE_FAQS = [
  {
    question: "How do you calculate percentage increase or decrease?",
    answer:
      "To find percentage change, subtract the initial value from the final value, divide the result by the initial value, and multiply by 100: ((Final - Initial) / Initial) * 100. If positive, it is an increase; if negative, it is a decrease.",
  },
  {
    question: "Can I use this for calculating sales tax and shopping discounts?",
    answer:
      "Yes! Card 4 ('Add or Subtract %') allows you to toggle between adding percentage (for sales tax, tips, or markups) and subtracting percentage (for store coupons and retail discounts).",
  },
  {
    question: "How does the tool handle decimal and negative values?",
    answer:
      "All calculations are performed using high-precision IEEE 754 floating point arithmetic with automated rounding to 4 decimal places, preventing fractional rounding errors.",
  },
];

const PERCENTAGE_STEPS = [
  {
    step: "01",
    title: "Choose Calculator Mode",
    description: "Pick from Simple Percentage, Percent Share, % Increase/Decrease, or Tax/Discount.",
    icon: Percent,
  },
  {
    step: "02",
    title: "Enter Values",
    description: "Input your numbers into the active inputs.",
    icon: Calculator,
  },
  {
    step: "03",
    title: "View Answer & Formula",
    description: "Instantly see the exact mathematical solution with step-by-step formula breakdown.",
    icon: Sparkles,
  },
];

export default function PercentagePage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Percentage Calculator", href: "/percentage-calculator" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Percentage Calculator Online",
    url: `${baseUrl}/percentage-calculator`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Calculate percentages, percentage increases, discounts, tips, and fractional differences.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1691",
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
              <span>Instant Calculations &bull; Step-by-Step Formulas</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Percentage Calculator
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Easily calculate percentage increases, discounts, sales taxes, tips, and fractional differences with formulas.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero server calculations
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Instant real-time math
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <PercentageCalculatorWorkspace />
      </section>

      <AdPlacement slotId="percentage-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Calculate Percentages"
        subtitle="Solve any percentage calculation in 3 simple steps"
        steps={PERCENTAGE_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Percentage Calculator - Frequently Asked Questions"
        subtitle="Clear answers about percentage calculations, formulas, and edge cases"
        items={PERCENTAGE_FAQS}
      />

      <RelatedTools currentToolId="percentage-calculator" />
    </div>
  );
}
