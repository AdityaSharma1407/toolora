import React from "react";
import CronGeneratorWorkspace from "@/components/utility/CronGeneratorWorkspace";
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
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Cron Expression Generator & Explainer — Visual Cron Schedule Builder",
  description:
    "Generate, build, and explain standard 5-part cron expressions. View human-readable schedules and upcoming execution dates. 100% free and client-side.",
  keywords: [
    "cron expression generator",
    "cron schedule builder",
    "cron visualizer",
    "cron explainer",
    "crontab generator",
    "cron syntax tester",
    "cron next executions",
  ],
  alternates: {
    canonical: "/cron-generator",
  },
  openGraph: {
    title: "Cron Expression Generator & Explainer | Toolora",
    description:
      "Build, test, and explain cron expressions with real-time schedule descriptions and upcoming execution dates.",
    url: "/cron-generator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cron Expression Generator & Explainer | Toolora",
    description:
      "Visual cron schedule builder and human-readable translator running 100% in your browser.",
  },
};

const CRON_FAQS = [
  {
    question: "What is standard 5-part cron syntax?",
    answer:
      "Standard Unix cron expressions consist of 5 fields separated by spaces: [minute (0-59)] [hour (0-23)] [day-of-month (1-31)] [month (1-12)] [day-of-week (0-6, where 0 is Sunday)].",
  },
  {
    question: "How do step values (e.g. */15) work?",
    answer:
      "A slash indicates step values. For example, '*/15' in the minute field means 'every 15 minutes', while '0-30/5' means 'every 5 minutes between minute 0 and 30'.",
  },
  {
    question: "How are upcoming execution dates calculated?",
    answer:
      "Toolora projects forward minute-by-minute according to your cron parameters, checking valid matching sets for each field to give you the precise next 5 trigger timestamps in local time and UTC.",
  },
  {
    question: "Is any data sent to a server?",
    answer:
      "None. All cron validation, explanation parsing, and scheduling calculations run 100% inside your local browser memory.",
  },
];

const CRON_STEPS = [
  {
    step: "01",
    title: "Select Preset or Enter Syntax",
    description: "Choose a common schedule template or type a custom 5-field cron expression.",
    icon: Clock,
  },
  {
    step: "02",
    title: "Fine-tune Fields",
    description: "Adjust minute, hour, day, month, or weekday values visually in real time.",
    icon: Calendar,
  },
  {
    step: "03",
    title: "Copy & Verify Schedule",
    description: "Inspect the human-readable explanation and verified next 5 execution timestamps.",
    icon: CheckCircle2,
  },
];

export default function CronGeneratorPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Cron Generator", href: "/cron-generator" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Cron Expression Generator & Explainer Online",
    url: `${baseUrl}/cron-generator`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Build, test, and translate cron expressions with human-readable descriptions and next execution dates.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Standard 5-Field Cron Syntax Validation",
      "Human-Readable English Translation",
      "Next 5 Execution Timestamps Calculator",
      "Visual Field Tuning (Min, Hour, Dom, Month, Dow)",
      "Ready-to-Use Schedule Presets",
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
              <span>Cron Visualizer &bull; Human Explainer &bull; Next Run Dates</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Cron Expression Generator & Explainer
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Build and understand crontab schedule expressions with instant English translations and next execution times.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero server telemetry
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                100% Client-side privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Instant schedule resolution
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <CronGeneratorWorkspace />
      </section>

      <AdPlacement slotId="cron-generator-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Generate & Translate Cron Expressions"
        subtitle="Build reliable recurring schedules with complete confidence"
        steps={CRON_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Cron Generator - Frequently Asked Questions"
        subtitle="Common questions about crontab syntax, step ranges, and execution dates"
        items={CRON_FAQS}
      />

      <RelatedTools currentToolId="cron-generator" />
    </div>
  );
}
