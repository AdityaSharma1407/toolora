import React from "react";
import MarkdownEditorWorkspace from "@/components/utility/MarkdownEditorWorkspace";
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
  FileText,
  Eye,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Markdown Live Editor & Preview — Export HTML & MD Online",
  description:
    "Write, preview, and format GitHub Flavored Markdown (GFM) in real-time. Export clean .md or standalone .html files with 100% client-side privacy.",
  keywords: [
    "markdown editor",
    "markdown live preview",
    "gfm editor online",
    "markdown to html",
    "online markdown previewer",
    "github flavored markdown",
    "markdown exporter",
  ],
  alternates: {
    canonical: "/markdown-editor",
  },
  openGraph: {
    title: "Markdown Live Editor & Preview | Bits & Tools",
    description:
      "Write, edit, and preview GitHub Flavored Markdown with real-time HTML rendering and instant export.",
    url: "/markdown-editor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Live Editor & Preview | Bits & Tools",
    description:
      "Real-time GFM markdown live editor and HTML exporter running 100% in your browser.",
  },
};

const MARKDOWN_FAQS = [
  {
    question: "What is GitHub Flavored Markdown (GFM)?",
    answer:
      "GFM is an extension of standard Markdown that adds support for tables, task lists (checkboxes), strikethrough, autolinks, and fenced code blocks.",
  },
  {
    question: "Can I download my rendered HTML document?",
    answer:
      "Yes! You can download your content as a clean .md Markdown file or as a standalone, styled .html document ready for web hosting or printing.",
  },
  {
    question: "Is my text uploaded to any server?",
    answer:
      "Never. All markdown parsing and HTML compilation runs 100% locally in your browser memory using client-side JavaScript. Zero bytes are ever sent to remote servers.",
  },
  {
    question: "Does it support real-time word and character counts?",
    answer:
      "Yes, the stats header calculates total words, characters, and estimated reading time dynamically as you type.",
  },
];

const MARKDOWN_STEPS = [
  {
    step: "01",
    title: "Write Markdown",
    description: "Type or paste your Markdown text into the editor pane, or use toolbar shortcuts.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Inspect Live Preview",
    description: "View real-time HTML formatting with rendered tables, lists, and code blocks.",
    icon: Eye,
  },
  {
    step: "03",
    title: "Export or Copy",
    description: "Copy HTML/Markdown to your clipboard or download as .md or .html files.",
    icon: Download,
  },
];

export default function MarkdownEditorPage() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const breadcrumbs = [
    { label: "Utility Tools", href: "/utility-tools" },
    { label: "Markdown Editor", href: "/markdown-editor" },
  ];

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Markdown Live Editor & Preview Online",
    url: `${baseUrl}/markdown-editor`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5 support",
    description:
      "Write, preview, and format GitHub Flavored Markdown in real-time. Export clean .md or standalone .html.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Real-Time Side-by-Side Live Preview",
      "GitHub Flavored Markdown (GFM) Parsing",
      "Table, Task List, and Code Block Rendering",
      "Live Word, Character & Reading Time Stats",
      "Export to .md or standalone .html",
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
              <span>Live Preview &bull; GFM Support &bull; HTML Export</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Markdown Live Editor & Exporter
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Write, edit, and preview GitHub Flavored Markdown with instant side-by-side HTML rendering.
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
                Instant in-memory compilation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <MarkdownEditorWorkspace />
      </section>

      <AdPlacement slotId="markdown-editor-below-workspace" />

      {/* How It Works */}
      <HowItWorks
        title="How to Use the Markdown Editor"
        subtitle="Write, inspect, and export your documentation in 3 simple steps"
        steps={MARKDOWN_STEPS}
      />

      {/* FAQs */}
      <FAQSection
        title="Markdown Editor - Frequently Asked Questions"
        subtitle="Common questions about GFM syntax, export formats, and data privacy"
        items={MARKDOWN_FAQS}
      />

      <RelatedTools currentToolId="markdown-editor" />
    </div>
  );
}
