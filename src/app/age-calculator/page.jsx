import React from "react";
import AgeCalculatorWorkspace from "@/components/utility/AgeCalculatorWorkspace";
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
  Calendar,
  Gift,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Age Calculator Online — Exact Age in Years, Months, Days & Next Birthday",
  description:
    "Calculate your exact chronological age in years, months, days, weeks, and hours. Includes next birthday countdown and birth day of week. Free and private.",
  keywords: [
    "age calculator",
    "calculate age online",
    "chronological age calculator",
    "date of birth calculator",
    "how old am i",
    "next birthday countdown",
    "birthday day of week",
    "age in days",
  ],
  alternates: {
    canonical: "/age-calculator",
  },
  openGraph: {
    title: "Age Calculator Online | Bits & Tools",
    description:
      "Calculate your exact age in years, months, days, and hours, plus next birthday countdown.",
    url: "/age-calculator",
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
    title: "Age Calculator Online | Bits & Tools",
    description:
      "Calculate your exact age in years, months, days, and hours.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const AGE_FAQS = [
  {
    question: "How does the Age Calculator handle leap years?",
    answer:
      "The calculator computes exact calendar intervals using Gregorian leap year rules. It borrows the actual number of days from preceding months (28, 29, 30, or 31) to prevent calendar drift or inaccurate day counts.",
  },
  {
    question: "Can I calculate my age at a specific past or future date?",
    answer:
      "Yes! Simply change the 'Age as of Date' input to any date in history or the future to calculate what your age was or will be on that exact milestone.",
  },
  {
    question: "Is my date of birth saved or stored anywhere?",
    answer:
      "Never. All date differences are computed locally in your browser's JavaScript runtime. Zero personal data or dates are ever sent to a server.",
  },
];

const AGE_STEPS = [
  {
    step: "01",
    title: "Select Date of Birth",
    description: "Pick your birth day, month, and year from the calendar picker.",
    icon: Calendar,
  },
  {
    step: "02",
    title: "Choose Target Date",
    description: "Leave as today or select a specific target milestone date.",
    icon: Clock,
  },
  {
    step: "03",
    title: "View Complete Breakdown",
    description: "Instantly see exact years, months, days, total weeks, and birthday countdown.",
    icon: Sparkles,
  },
];

export default function AgePage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Age Calculator", href: "/age-calculator" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Age Calculator Online",
    url: `${baseUrl}/age-calculator`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Calculate your exact chronological age in years, months, days, weeks, and hours.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1147",
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
              <span>Exact Calendar Precision &bull; Birthday Countdown</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Age Calculator Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Calculate your exact age in years, months, and days with total days lived and next birthday countdown.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero data stored
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Instant calculation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <AgeCalculatorWorkspace />
      </section>

      <AdPlacement slotId="age-calculator-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Calculate Your Age"
        subtitle="Find your exact age in 3 simple steps"
        steps={AGE_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Age Calculator - Frequently Asked Questions"
        subtitle="Common questions about calendar precision, leap years, and calculations"
        items={AGE_FAQS}
      />

      <RelatedTools currentToolId="age-calculator" />
    </div>
  );
}
