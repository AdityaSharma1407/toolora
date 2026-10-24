import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  const baseUrl = siteConfig.url;

  // JSON-LD structured data for Google Breadcrumb Rich Results
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: item.label,
        ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className="py-2.5 px-0.5 overflow-x-auto scrollbar-none">
        <ol className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-slate-500 whitespace-nowrap">
          <li>
            <Link
              href="/"
              className="min-h-[36px] flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.label} className="flex items-center space-x-1.5 sm:space-x-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
                {isLast || !item.href ? (
                  <span className="font-medium text-slate-900 truncate" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="min-h-[36px] flex items-center hover:text-slate-900 transition-colors truncate"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
