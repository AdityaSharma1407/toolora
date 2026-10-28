import React from "react";
import VideoToGifWorkspace from "@/components/media/VideoToGifWorkspace";
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
  Film,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Video to GIF Converter Online — Free Animated GIF Maker",
  description:
    "Convert MP4, WebM, and MOV video clips into animated looping GIFs directly in your browser. Customize FPS, duration, and resolution with 100% privacy.",
  keywords: [
    "video to gif",
    "mp4 to gif online",
    "convert video to gif",
    "create animated gif free",
    "video to gif converter",
    "make gif from video",
  ],
  alternates: {
    canonical: "/video-to-gif",
  },
  openGraph: {
    title: "Video to GIF Converter Online | Bits & Tools",
    description:
      "Convert video clips into lightweight, looping animated GIFs in your browser. 100% private.",
    url: "/video-to-gif",
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
    title: "Video to GIF Converter Online | Bits & Tools",
    description:
      "Convert video clips into lightweight, looping animated GIFs in your browser. 100% private.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const GIF_FAQS = [
  {
    question: "Can I choose the frame rate (FPS) and duration?",
    answer:
      "Yes. You can select between 5, 10, or 15 FPS and configure clip duration from 2 to 5 seconds to balance smoothness and compact file size.",
  },
  {
    question: "Does the output GIF loop infinitely?",
    answer:
      "Yes. All generated animated GIFs include the standard Netscape looping application extension for seamless infinite playback across all browsers, messaging apps, and social platforms.",
  },
  {
    question: "Are my video clips uploaded to an external server?",
    answer:
      "Never. All frame rendering, 3:3:2 color quantization, and LZW byte compression happen 100% locally in your device's browser memory.",
  },
];

const GIF_STEPS = [
  {
    step: "01",
    title: "Upload Video",
    description: "Choose or drag and drop any MP4, WebM, or MOV video clip.",
    icon: Film,
  },
  {
    step: "02",
    title: "Configure GIF",
    description: "Select target resolution (480p, 360p, 240p), frame rate, and start time.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Download GIF",
    description: "Instantly download your animated, looping GIF file.",
    icon: Download,
  },
];

export default function VideoToGifPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Media Tools", href: "/media-tools" },
    { label: "Video to GIF", href: "/video-to-gif" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Video to GIF Converter",
    url: `${baseUrl}/video-to-gif`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert video clips into looping animated GIFs directly in your browser with complete client-side privacy.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1682",
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
              <span>GIF89a Standard &bull; Infinite Looping &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Video to GIF Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Transform video clips into lightweight, animated looping GIFs with custom frame rates and dimensions.
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
                Instant browser encoding
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <VideoToGifWorkspace />
      </section>

      <AdPlacement slotId="video-to-gif-below-workspace" />

      <HowItWorks
        title="How to Convert Video to GIF Online"
        subtitle="Turn video clips into animated GIFs in 3 simple steps"
        steps={GIF_STEPS}
      />

      <FAQSection
        title="Video to GIF - Frequently Asked Questions"
        subtitle="Common questions about GIF conversion, frame rates, and looping"
        items={GIF_FAQS}
      />

      <RelatedTools currentToolId="video-to-gif" />
    </div>
  );
}
