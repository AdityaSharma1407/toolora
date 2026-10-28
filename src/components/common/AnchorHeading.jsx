"use client";

import React, { useState } from "react";
import { Link2, Check } from "lucide-react";
import { slugifyHeading } from "@/lib/seo/anchors";

/**
 * Deterministic Anchor Heading Component (H2 / H3)
 * Provides deterministic slugified HTML IDs and an accessible copy-link-to-section
 * button for deep-linking, fragment scroll-to-text, and citation indexing.
 */
export default function AnchorHeading({
  as = "h2",
  id,
  children,
  className = "",
  showAnchor = true,
}) {
  const [copied, setCopied] = useState(false);

  // Extract raw text from children for slug generation
  const textContent =
    typeof children === "string"
      ? children
      : React.Children.toArray(children)
          .map((c) => (typeof c === "string" ? c : c?.props?.children || ""))
          .join(" ");

  const slug = id || slugifyHeading(textContent);
  const Component = as;

  const handleCopyLink = async (e) => {
    e.preventDefault();
    if (typeof window === "undefined") return;

    const fullUrl = `${window.location.origin}${window.location.pathname}#${slug}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      window.history.pushState(null, "", `#${slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.hash = slug;
    }
  };

  return (
    <Component
      id={slug}
      className={`group relative inline-flex items-center gap-2 scroll-mt-24 ${className}`}
    >
      <span>{children}</span>
      {showAnchor && (
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label={`Copy direct link to section: ${textContent}`}
          title="Copy direct link to this section"
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-slate-400 hover:text-brand-600 focus:text-brand-600 transition-opacity rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in-50" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
          <span className="sr-only">
            {copied ? "Link copied to clipboard" : "Copy link"}
          </span>
        </button>
      )}
    </Component>
  );
}
