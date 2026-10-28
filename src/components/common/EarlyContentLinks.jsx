import React from "react";
import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";
import { getEarlyContentLinks } from "@/lib/seo/anchor-graph";

/**
 * Early Content Links Component
 * 
 * Injects high-priority semantic internal links strictly within the initial 200 words
 * of the primary content flow using anchor-text diversification to maximize PageRank flow
 * and eliminate over-optimization algorithmic penalties.
 */
export default function EarlyContentLinks({ currentRoute, className = "" }) {
  if (!currentRoute) return null;

  const links = getEarlyContentLinks(currentRoute, 2);
  if (links.length === 0) return null;

  return (
    <nav
      aria-label="Frequently paired workflow utilities"
      className={`mt-4 pt-3 border-t border-slate-200/60 max-w-2xl mx-auto ${className}`}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-700">
        <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
          <Compass className="w-3.5 h-3.5 text-brand-600" />
          <span>Related workflows:</span>
        </span>
        {links.map((link) => (
          <Link
            key={link.route}
            href={link.route}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-800 hover:text-brand-700 font-medium transition-colors border border-slate-200/80 hover:border-brand-200"
            title={`Jump directly to ${link.name}`}
          >
            <span>{link.text}</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-brand-600" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
