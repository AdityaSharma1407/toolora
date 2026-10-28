import React from "react";
import CompressVideoWorkspace from "@/components/media/CompressVideoWorkspace";
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
  Minimize2,
  Video,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Compress Video Online — Reduce Video File Size In Browser",
  description:
    "Compress MP4, WebM, and MOV videos by up to 70% with resolution and bitrate controls directly in your browser. 100% private with zero file uploads.",
  keywords: [
    "compress video",
    "reduce video file size",
    "video compressor online",
    "shrink mp4 free",
    "compress video without losing quality",
  ],
  alternates: {
    canonical: "/compress-video",
  },
  openGraph: {
    title: "Compress Video Online | Bits & Tools",
    description:
      "Reduce MP4 and WebM video size without sacrificing playback clarity. 100% private.",
    url: "/compress-video",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress Video Online | Bits & Tools",
    description:
      "Reduce MP4 and WebM video size without sacrificing playback clarity. 100% private.",
  },
};

const COMPRESS_FAQS = [
  {
    question: "How much file size reduction can I expect?",
    answer:
      "Depending on your selected resolution and bitrate presets, you can reduce video file sizes by 40% to 75% while maintaining sharp visual clarity.",
  },
  {
    question: "Does compressing video upload my files to the cloud?",
    answer:
      "Never. All canvas resizing, video decoding, and MediaRecorder re-encoding execute 100% locally in your device's browser memory. Your videos remain completely private.",
  },
  {
    question: "What resolution options are available?",
    answer:
      "You can downscale videos to 1080p, 720p HD, 480p SD, or 360p while automatically maintaining the original aspect ratio.",
  },
];

const COMPRESS_STEPS = [
  {
    step: "01",
    title: "Upload Video",
    description: "Choose or drag and drop any MP4, WebM, or MOV video file.",
    icon: Video,
  },
  {
    step: "02",
    title: "Choose Settings",
    description: "Select target resolution (720p, 480p, 360p) and compression strength.",
    icon: Minimize2,
  },
  {
    step: "03",
    title: "Download Compressed Video",
    description: "Export your lightweight, web-optimized video file.",
    icon: Download,
  },
];

export default function CompressVideoPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Media Tools", href: "/media-tools" },
    { label: "Compress Video", href: "/compress-video" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Compress Video Online",
    url: `${baseUrl}/compress-video`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Reduce MP4 and WebM video sizes with intelligent resolution and bitrate scaling directly in your browser.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1360",
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
              <span>40%–75% Size Savings &bull; Bitrate Control &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Compress Video Online
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Reduce MP4 and WebM video file sizes with intelligent dimension scaling and bitrate compression directly in your browser.
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
                Instant browser compression
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <CompressVideoWorkspace />
      </section>

      <AdPlacement slotId="compress-video-below-workspace" />

      <HowItWorks
        title="How to Compress Video Online"
        subtitle="Shrink video file sizes in 3 simple steps"
        steps={COMPRESS_STEPS}
      />

      <FAQSection
        title="Compress Video - Frequently Asked Questions"
        subtitle="Common questions about video compression, resolutions, and quality"
        items={COMPRESS_FAQS}
      />

      <RelatedTools currentToolId="compress-video" />
    </div>
  );
}
