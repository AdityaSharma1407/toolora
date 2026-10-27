import React from "react";
import TimestampWorkspace from "@/components/utility/TimestampWorkspace";
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
  Clock,
  Calendar,
  History,
} from "lucide-react";

export const metadata = {
  title: "Unix Timestamp Converter — Epoch to Human Date & Vice Versa",
  description:
    "Convert Unix epoch timestamps to UTC, ISO 8601, and local human dates. Convert calendar dates to epoch seconds and milliseconds with a live ticking epoch clock.",
  keywords: [
    "unix timestamp converter",
    "epoch converter",
    "convert timestamp to date",
    "date to epoch",
    "epoch seconds to date",
    "current unix timestamp",
    "iso 8601 to timestamp",
  ],
  alternates: {
    canonical: "/timestamp-converter",
  },
  openGraph: {
    title: "Unix Timestamp Converter Online | Bits & Tools",
    description:
      "Bi-directional Unix epoch and date converter with live ticking clock, milliseconds support, and UTC formatting.",
    url: "/timestamp-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unix Timestamp Converter Online | Bits & Tools",
    description:
      "Bi-directional Unix epoch and date converter with live ticking clock, milliseconds support, and UTC formatting.",
  },
};

const TIMESTAMP_FAQS = [
  {
    question: "What is a Unix epoch timestamp?",
    answer:
      "A Unix timestamp (or POSIX time) is the total number of seconds that have elapsed since the Unix Epoch: January 1, 1970 at 00:00:00 UTC, not counting leap seconds. It is the universal standard for storing timestamps across databases and APIs.",
  },
  {
    question: "How do I tell if a timestamp is in seconds or milliseconds?",
    answer:
      "Timestamps in seconds currently have 10 digits (e.g. 1704153600 for the year 2024). Timestamps in milliseconds have 13 digits (e.g. 1704153600000), typical in JavaScript's Date.now(). This converter automatically auto-detects either format.",
  },
  {
    question: "What will happen during the Year 2038 problem (Y2K38)?",
    answer:
      "On January 19, 2038 at 03:14:07 UTC, signed 32-bit integers will overflow into negative values. Modern 64-bit systems and JavaScript numbers (64-bit floating point representing integers up to 2^53 - 1) do not have this limitation and will operate correctly for over 285 million years.",
  },
  {
    question: "Are timezone adjustments applied automatically?",
    answer:
      "Yes. The converter displays UTC time (universal standard) alongside your local computer's timezone (including daylight saving time offset) and standard ISO 8601 representation.",
  },
];

const TIMESTAMP_STEPS = [
  {
    step: "01",
    title: "Enter Epoch or Date",
    description: "Input an epoch timestamp in seconds/ms or pick a calendar date from the picker.",
    icon: Clock,
  },
  {
    step: "02",
    title: "Automatic Conversion",
    description: "Instantly view UTC, Local, ISO 8601, and relative duration formats.",
    icon: Calendar,
  },
  {
    step: "03",
    title: "Copy Result",
    description: "One-click copy timestamps or formatted date strings directly to your clipboard.",
    icon: History,
  },
];

export default function TimestampPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Unix Timestamp Converter", href: "/timestamp-converter" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Unix Timestamp & Epoch Converter",
    url: `${baseUrl}/timestamp-converter`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert Unix timestamps to human readable dates (UTC, Local, ISO 8601) and reverse convert dates to epoch seconds.",
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
              <span>Live Ticking Clock &bull; Seconds & Milliseconds &bull; ISO 8601</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Unix Timestamp Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert Unix epoch seconds and milliseconds to human-readable dates (UTC and local) or convert calendar dates to timestamps.
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
                Live epoch clock
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <TimestampWorkspace />
      </section>

      <AdPlacement slotId="timestamp-converter-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Convert Unix Timestamps"
        subtitle="Translate epoch seconds to human readable dates"
        steps={TIMESTAMP_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Unix Timestamp Converter - Frequently Asked Questions"
        subtitle="Common questions about POSIX timestamps, UTC time, and milliseconds"
        items={TIMESTAMP_FAQS}
      />

      <RelatedTools currentToolId="timestamp-converter" />
    </div>
  );
}
