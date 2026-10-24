"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Clock } from "lucide-react";
import { searchTools } from "@/data/toolsRegistry";
import DynamicIcon from "./DynamicIcon";

export default function ToolSearch({ placeholder = "Search all tools (e.g., merge, pdf, compress, convert)..." }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchTools(query).slice(0, 8);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
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
          className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-300 rounded-xl shadow-xs text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-600 focus:ring-3 focus:ring-brand-100 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            aria-label="Clear search"
            className="absolute right-3.5 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && query.trim().length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
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
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3.5 px-4 py-3 hover:bg-brand-50/70 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <DynamicIcon name={tool.icon} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 group-hover:text-brand-600">
                            {tool.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                            Active
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
                    className="flex items-center gap-3.5 px-4 py-3 bg-slate-50/40 opacity-75 cursor-not-allowed"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-400">
                      <DynamicIcon name={tool.icon} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-600">
                          {tool.name}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-200 text-slate-600">
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
