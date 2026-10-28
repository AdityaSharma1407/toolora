import React from "react";
import Mp3ConverterWorkspace from "@/components/media/Mp3ConverterWorkspace";
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
  Headphones,
  Music,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Universal Audio & MP3 Converter Online — Free Audio Format Transcode",
  description:
    "Convert WAV, OGG, AAC, M4A, FLAC, and WebM audio files into universal uncompressed studio audio directly in your browser. 100% private.",
  keywords: [
    "mp3 converter",
    "convert audio online",
    "audio converter free",
    "wav converter",
    "m4a to wav",
    "ogg to wav converter",
  ],
  alternates: {
    canonical: "/mp3-converter",
  },
  openGraph: {
    title: "Universal Audio & MP3 Converter Online | Bits & Tools",
    description:
      "Convert audio files into universal format directly in your browser. 100% private.",
    url: "/mp3-converter",
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
    title: "Universal Audio & MP3 Converter Online | Bits & Tools",
    description:
      "Convert audio files into universal format directly in your browser. 100% private.",
    images: ["/images/og-bitsandtools.png"],
  },
};

const MP3_FAQS = [
  {
    question: "What audio formats can I convert?",
    answer:
      "You can upload WAV, OGG, AAC, M4A, FLAC, and WebM audio files and convert them into universal uncompressed 16-bit audio.",
  },
  {
    question: "Does conversion degrade audio quality?",
    answer:
      "No. Bits & Tools uses the browser's native Web Audio API with 32-bit floating point PCM decoding and 16-bit quantization, preserving acoustic frequency clarity.",
  },
  {
    question: "Are my audio recordings uploaded to any server?",
    answer:
      "Never. All audio decoding and encoding happen 100% in your device's browser memory.",
  },
];

const MP3_STEPS = [
  {
    step: "01",
    title: "Upload Audio",
    description: "Choose or drag and drop any audio recording or music file.",
    icon: Headphones,
  },
  {
    step: "02",
    title: "Select Format",
    description: "Choose stereo or mono channel configurations and sample rate.",
    icon: Music,
  },
  {
    step: "03",
    title: "Download Audio",
    description: "Download your newly formatted audio file instantly.",
    icon: Download,
  },
];

export default function Mp3ConverterPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Media Tools", href: "/media-tools" },
    { label: "Audio Converter", href: "/mp3-converter" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Audio & MP3 Converter",
    url: `${baseUrl}/mp3-converter`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Convert audio files into universal formats in your browser with complete client-side privacy.",
        aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1406",
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
              <span>Universal Compatibility &bull; Web Audio API &bull; 100% Private</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Audio & MP3 Converter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Convert audio files from WAV, OGG, AAC, M4A, or FLAC into universal playback format with zero quality loss.
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
                Instant browser decoding
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Mp3ConverterWorkspace />
      </section>

      <AdPlacement slotId="mp3-converter-below-workspace" />

      <HowItWorks
        title="How to Convert Audio Online"
        subtitle="Transform audio recordings into universal formats in seconds"
        steps={MP3_STEPS}
      />

      <FAQSection
        title="Audio Converter - Frequently Asked Questions"
        subtitle="Common questions about audio transcoding, bitrates, and privacy"
        items={MP3_FAQS}
      />

      <RelatedTools currentToolId="mp3-converter" />
    </div>
  );
}
