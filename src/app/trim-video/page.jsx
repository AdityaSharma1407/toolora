import React from "react";
import TrimVideoWorkspace from "@/components/media/TrimVideoWorkspace";
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
  Scissors,
  Film,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Trim Video Online — Free Video Cutter & Clipper In Browser",
  description:
    "Cut and trim MP4, WebM, and MOV video clips with precise start and end controls directly in your browser. 100% private with zero file uploads.",
  keywords: [
    "trim video",
    "cut video online",
    "video trimmer free",
    "video cutter in browser",
    "clip video online",
    "split video clip",
  ],
  alternates: {
    canonical: "/trim-video",
  },
  openGraph: {
    title: "Trim Video Online — Free Video Cutter | Bits & Tools",
    description:
      "Cut out unwanted segments and adjust start and end points of videos directly in your browser.",
    url: "/trim-video",
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
    title: "Trim Video Online — Free Video Cutter | Bits & Tools",
    description:
      "Cut out unwanted segments and adjust start and end points of videos directly in your browser.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const TRIM_FAQS = [
  {
    question: "How accurate is the video trimmer?",
    answer:
      "Bits & Tools provides sub-second timeline sliders and exact timecode indicators, allowing you to isolate clips down to tenths of a second.",
  },
  {
    question: "What output format is generated after trimming?",
    answer:
      "The tool records the exact trimmed timeline slice into high-quality WebM video using browser-native MediaRecorder encoding.",
  },
  {
    question: "Are large video files uploaded to a remote server?",
    answer:
      "Never. All playback, frame extraction, and recording occur 100% locally in your device's browser memory. Your videos remain completely confidential.",
  },
];

const TRIM_STEPS = [
  {
    step: "01",
    title: "Upload Video",
    description: "Choose or drag and drop any MP4, WebM, or MOV video clip.",
    icon: Film,
  },
  {
    step: "02",
    title: "Set Start & End",
    description: "Adjust the interactive range sliders to isolate the exact clip segment.",
    icon: Scissors,
  },
  {
    step: "03",
    title: "Download Trimmed Video",
    description: "Instantly download your trimmed video clip.",
    icon: Download,
  },
];

export default function TrimVideoPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Media Tools", href: "/media-tools" },
    { label: "Trim Video", href: "/trim-video" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Trim Video Online",
    url: `${baseUrl}/trim-video`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Cut out unwanted segments and adjust start and end points of video clips directly in your browser.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1520",
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

      <div className="border-b border-black/[0.06] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pb-10">
          <Breadcrumbs items={breadcrumbs} />

          <div className="text-center max-w-3xl mx-auto mt-2 sm:mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3 border border-black/[0.04]">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Precise Timeline Sliders &bull; Zero Server Uploads &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Trim Video Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Cut out unwanted segments and adjust start and end points of videos directly in your browser.
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
                Instant browser trimming
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <TrimVideoWorkspace />
      </section>

      <AdPlacement slotId="trim-video-below-workspace" />

      <HowItWorks
        title="How to Trim Video Online"
        subtitle="Cut and isolate video clips in 3 simple steps"
        steps={TRIM_STEPS}
      />

      <FAQSection
        title="Trim Video - Frequently Asked Questions"
        subtitle="Common questions about video trimming, formats, and privacy"
        items={TRIM_FAQS}
      />

      <RelatedTools currentToolId="trim-video" />
    </div>
  );
}
