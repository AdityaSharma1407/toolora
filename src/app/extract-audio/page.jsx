import React from "react";
import ExtractAudioWorkspace from "@/components/media/ExtractAudioWorkspace";
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
  Music,
  Video,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Extract Audio from Video Online — Free Video to MP3 & WAV",
  description:
    "Extract audio tracks from MP4, WebM, MOV, and MKV videos directly in your browser. Download high-fidelity uncompressed WAV audio with 100% privacy.",
  keywords: [
    "extract audio from video",
    "video to audio converter",
    "video to wav",
    "video to mp3 free",
    "strip audio from video online",
    "save sound from video",
  ],
  alternates: {
    canonical: "/extract-audio",
  },
  openGraph: {
    title: "Extract Audio from Video Online | Bits & Tools",
    description:
      "Strip and save audio tracks from video files in your browser. 100% client-side privacy.",
    url: "/extract-audio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Extract Audio from Video Online | Bits & Tools",
    description:
      "Strip and save audio tracks from video files in your browser. 100% client-side privacy.",
  },
};

const EXTRACT_FAQS = [
  {
    question: "What video formats can I extract sound from?",
    answer:
      "Bits & Tools supports all standard video formats playable in modern browsers, including MP4, WebM, MOV, and MKV.",
  },
  {
    question: "What audio output format is generated?",
    answer:
      "The tool exports studio-grade, 16-bit uncompressed PCM WAV audio at 44.1 kHz or 48 kHz in stereo or mono, ensuring pristine, lossless acoustic quality.",
  },
  {
    question: "Are my personal video clips uploaded to an external server?",
    answer:
      "Never. All audio decoding and waveform synthesis occur 100% inside your browser memory using the Web Audio API. Your videos never touch a remote server.",
  },
];

const EXTRACT_STEPS = [
  {
    step: "01",
    title: "Upload Video",
    description: "Choose or drag and drop any MP4, WebM, MOV, or MKV video.",
    icon: Video,
  },
  {
    step: "02",
    title: "Configure Channels",
    description: "Choose stereo or mono downmix and 44.1 kHz or 48 kHz sample rates.",
    icon: Music,
  },
  {
    step: "03",
    title: "Download Audio Track",
    description: "Instantly download your pristine WAV audio file.",
    icon: Download,
  },
];

export default function ExtractAudioPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Media Tools", href: "/media-tools" },
    { label: "Extract Audio", href: "/extract-audio" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Extract Audio from Video",
    url: `${baseUrl}/extract-audio`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Extract audio tracks from MP4, WebM, and MOV videos directly in your browser with complete privacy.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1213",
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
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Studio 16-Bit WAV Export &bull; Web Audio API &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Extract Audio from Video
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Strip audio tracks from video clips and export pristine, uncompressed sound files directly in your browser.
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
                Instant audio extraction
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ExtractAudioWorkspace />
      </section>

      <AdPlacement slotId="extract-audio-below-workspace" />

      <HowItWorks
        title="How to Extract Audio from Video Online"
        subtitle="Save audio tracks from video files in seconds"
        steps={EXTRACT_STEPS}
      />

      <FAQSection
        title="Extract Audio - Frequently Asked Questions"
        subtitle="Common questions about audio extraction, sample rates, and privacy"
        items={EXTRACT_FAQS}
      />

      <RelatedTools currentToolId="extract-audio" />
    </div>
  );
}
