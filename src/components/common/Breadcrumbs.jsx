import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buildBreadcrumbsSchema } from "@/lib/seo/schema";

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  const baseUrl = siteConfig.url.replace(/\/$/, "");

  // Centralized JSON-LD structured data for Google Breadcrumb Rich Results
  const breadcrumbSchema = buildBreadcrumbsSchema(items, baseUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className="py-2.5 px-0.5 overflow-x-auto scrollbar-none">
        <ol
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-slate-500 whitespace-nowrap"
        >
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center"
          >
            <Link
              href="/"
              itemProp="item"
              className="min-h-[36px] flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span itemProp="name" className="sr-only">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            const position = idx + 2;
            const fullUrl = item.href ? (item.href.startsWith("http") ? item.href : `${baseUrl}${item.href}`) : undefined;

            return (
              <li
                key={item.label}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center space-x-1.5 sm:space-x-2"
              >
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
                {isLast || !item.href ? (
                  <span
                    itemProp="name"
                    className="font-medium text-slate-900 truncate"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    itemProp="item"
                    className="min-h-[36px] flex items-center hover:text-slate-900 transition-colors truncate"
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                )}
                {fullUrl && <meta itemProp="item" content={fullUrl} />}
                <meta itemProp="position" content={String(position)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
