import React from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Lock, Eye, Cookie, FileText, Globe } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Bits & Tools Client-Side Privacy Protection",
  description:
    "Learn how Bits & Tools protects your privacy with browser-local document processing, zero server uploads, and transparent cookie practices.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy — Bits & Tools Client-Side Privacy Protection",
    description:
      "Learn how Bits & Tools protects your privacy with browser-local document processing, zero server uploads, and transparent cookie practices.",
    url: "/privacy-policy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — Bits & Tools Client-Side Privacy Protection",
    description:
      "Learn how Bits & Tools protects your privacy with browser-local document processing, zero server uploads, and transparent cookie practices.",
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbs = [{ label: "Privacy Policy", href: "/privacy-policy" }];
  const lastUpdated = "October 24, 2026";

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Header */}
      <div className="bg-white border-b border-black/[0.06] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-3">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-8">
          {/* Key Guarantee Callout */}
          <div className="p-5 bg-brand-50/60 border border-brand-200 rounded-2xl flex items-start gap-3.5 not-prose">
            <ShieldCheck className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Core Privacy Guarantee: Client-Side Processing
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                When you use Bits &amp; Tools to merge, split, or compress PDFs, or convert images, your files are processed
                entirely in-memory inside your local web browser. Your document contents are never transmitted over the internet
                to Bits &amp; Tools servers or any third-party processing APIs.
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>{siteConfig.name}</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), available at{" "}
              <a href={siteConfig.url} className="text-brand-600 underline">
                {siteConfig.url}
              </a>
              . We are dedicated to providing fast, reliable utility tools while maintaining the highest privacy standards.
              This Privacy Policy explains what information is collected, how it is used, and how your privacy rights are respected.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-600" />
              2. Document &amp; File Data
            </h2>
            <p>
              Unlike conventional online conversion platforms that upload your sensitive documents to remote servers,
              Bits &amp; Tools is built on a <strong>privacy-by-design</strong> architecture:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Your uploaded PDFs, documents, and images remain in your device&apos;s RAM.</li>
              <li>No document contents, text, images, or metadata are transmitted to our servers.</li>
              <li>Temporary memory references (Object URLs) are explicitly revoked and discarded upon completion or navigation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Cookie className="w-4 h-4 text-brand-600" />
              3. Cookies and Local Browser Storage
            </h2>
            <p>
              We use browser <code>localStorage</code> solely to remember your essential user preferences (such as your cookie consent choice).
              We categorize cookies as follows:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>
                <strong>Essential Storage:</strong> Required for the basic technical operation of the website (e.g. recording whether you accepted our cookie banner).
              </li>
              <li>
                <strong>Optional Advertising Cookies:</strong> Third-party advertising partners may place cookies on your device to serve relevant advertisements, subject to your explicit consent where required by applicable laws.
              </li>
              <li>
                <strong>Optional Analytics:</strong> Aggregated, anonymized statistics (such as page visits and tool completion counts) to improve platform performance.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-600" />
              4. Google AdSense &amp; Advertising Disclosure
            </h2>
            <p>
              To keep our tools free for everyone without charging subscriptions, we may display display advertisements served by Google AdSense and other trusted advertising networks:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>
                Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.
              </li>
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline"
                >
                  Google Ads Settings
                </a>{" "}
                or{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline"
                >
                  www.aboutads.info
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-600" />
              5. Regional Privacy Rights
            </h2>
            <p>
              Depending on your location, you have statutory rights concerning your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>
                <strong>European Economic Area (GDPR) &amp; United Kingdom:</strong> You have the right to access, rectify, restrict, or erase any personal information we hold, and the right to object to processing. Advertising cookies are disabled unless explicitly consented to.
              </li>
              <li>
                <strong>India (Digital Personal Data Protection Act - DPDP):</strong> You have the right to information regarding your personal data, right to correction, and right to grievance redressal.
              </li>
              <li>
                <strong>California (CCPA / CPRA):</strong> You have the right to know what personal information is collected, request its deletion, and opt out of the sale or sharing of personal data.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              6. Contact Us
            </h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy or your personal data, please contact us directly:
            </p>
            <div className="mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
              <div>
                <strong>Direct Email:</strong>{" "}
                <a href={`mailto:${siteConfig.contactEmail}`} className="text-brand-600 underline hover:text-brand-700 font-medium">
                  {siteConfig.contactEmail}
                </a>
              </div>
              <div><strong>Platform:</strong> {siteConfig.displayName || siteConfig.name} Online Tools</div>
              <div>
                <strong>Online Contact:</strong>{" "}
                <Link href="/contact" className="text-brand-600 underline hover:text-brand-700">
                  {siteConfig.url.replace(/^https?:\/\//, "")}/contact
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
