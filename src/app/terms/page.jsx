import React from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { siteConfig } from "@/config/site";
import { FileText, Shield, AlertTriangle, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Terms of Service — Bits & Tools Online Utilities",
  description:
    "Review the Terms of Service governing the use of Bits & Tools' free, browser-based online tools and services.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service — Bits & Tools Online Utilities",
    description:
      "Review the Terms of Service governing the use of Bits & Tools' free, browser-based online tools and services.",
    url: "/terms",
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
    title: "Terms of Service — Bits & Tools Online Utilities",
    description:
      "Review the Terms of Service governing the use of Bits & Tools' free, browser-based online tools and services.",
    images: ["/images/og-bitsandtools.png"],
  },
};

export default function TermsPage() {
  const breadcrumbs = [{ label: "Terms of Service", href: "/terms" }];
  const lastUpdated = "October 24, 2026";

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Header */}
      <div className="bg-white border-b border-black/[0.06] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-3">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-8">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using <strong>{siteConfig.displayName || siteConfig.name}</strong> (&quot;the Service&quot;), available at{" "}
              <a href={siteConfig.url} className="text-brand-600 underline">
                {siteConfig.url}
              </a>
              , you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-600" />
              2. Description of Service
            </h2>
            <p>
              Bits &amp; Tools provides free, web-based digital utilities (including PDF merging, splitting, compressing, and image conversion).
              All processing is executed locally in the user&apos;s browser using client-side JavaScript.
              We do not transmit, inspect, or store your documents on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-600" />
              3. Document Ownership &amp; User Rights
            </h2>
            <p>
              You retain full, exclusive ownership, intellectual property rights, and copyright in any files, documents, or images processed using Bits &amp; Tools.
              Because your documents never leave your local device, Bits &amp; Tools asserts zero ownership or licensing rights over your content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              4. User Conduct
            </h2>
            <p>
              You agree not to use the platform to process documents that violate applicable laws, infringe on third-party intellectual property,
              or contain malicious code intended to compromise browsers or users.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              5. Advertising &amp; Third-Party Services
            </h2>
            <p>
              Bits &amp; Tools is made available free of charge. To support ongoing development and server maintenance, the website may display display advertisements
              provided by Google AdSense and other advertising networks. Advertisements are clearly separated from functional tools and do not alter the
              integrity of your documents.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-brand-600" />
              6. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind.
              While we take extreme care to ensure high document fidelity, browser-based processing is subject to your device&apos;s local hardware, memory,
              and browser compatibility. We do not guarantee that every damaged, non-standard, or encrypted document can be successfully processed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, Bits &amp; Tools and its creators shall not be liable for any indirect, incidental, special, or
              consequential damages resulting from your use of or inability to use the Service. Users are encouraged to maintain original copies of their files.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              8. Governance
            </h2>
            <p>
              These Terms of Service are governed and interpreted in accordance with standard legal principles. Any updates or revisions are published directly on this page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
