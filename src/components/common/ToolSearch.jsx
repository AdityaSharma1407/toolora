"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Clock } from "lucide-react";
import { searchTools } from "@/data/toolsRegistry";
import DynamicIcon from "./DynamicIcon";

export default function ToolSearch({
  placeholder = "Search all tools (e.g., merge, pdf, compress, convert)...",
  onSelect = null,
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchTools(query).slice(0, 8);
  }, [query]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleSelect() {
    setIsOpen(false);
    if (onSelect) onSelect();
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          aria-label="Search tools"
          className="w-full min-h-[48px] pl-11 pr-11 py-3 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-black/[0.12] rounded-2xl shadow-subtle text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            aria-label="Clear search"
            className="absolute right-1 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && query.trim().length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-modal border border-black/[0.08] overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-4 py-2 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Search Results ({results.length})</span>
            {results.length > 0 && <span className="text-[11px] text-slate-400 font-normal">Select a tool below</span>}
          </div>

          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No tools found matching &quot;<span className="font-semibold text-slate-700">{query}</span>&quot;.
              <div className="mt-1 text-xs text-slate-400">
                Try searching for &quot;pdf&quot;, &quot;merge&quot;, &quot;image&quot;, or &quot;converter&quot;.
              </div>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              {results.map((tool) => {
                const isAvailable = tool.status === "available";

                if (isAvailable) {
                  return (
                    <Link
                      key={tool.id}
                      href={tool.route}
                      onClick={handleSelect}
                      className="min-h-[52px] flex items-center gap-3.5 px-4 py-3 hover:bg-brand-50/60 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-brand-50/80 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <DynamicIcon name={tool.icon} className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 group-hover:text-brand-600">
                            {tool.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            Ready
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                }

                return (
                  <div
                    key={tool.id}
                    className="min-h-[52px] flex items-center gap-3.5 px-4 py-3 bg-slate-50/40 opacity-75 cursor-not-allowed"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                      <DynamicIcon name={tool.icon} className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-600">
                          {tool.name}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200/60">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Coming Soon</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
