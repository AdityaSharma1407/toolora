"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";
import { searchTools } from "@/data/toolsRegistry";
import DynamicIcon from "./DynamicIcon";

const POPULAR_TOOLS = [
  {
    id: "merge-pdf",
    name: "Merge PDF",
    route: "/merge-pdf",
    icon: "Files",
    description: "Combine multiple PDF files into a single unified document.",
  },
  {
    id: "markdown-editor",
    name: "Markdown Live Editor",
    route: "/markdown-editor",
    icon: "FileText",
    description: "Live GFM editor with real-time preview and HTML/.md export.",
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    route: "/regex-tester",
    icon: "Search",
    description: "Test and debug regular expressions with real-time highlighting.",
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    route: "/json-formatter",
    icon: "Braces",
    description: "Prettify, minify, validate, and sort JSON keys in your browser.",
  },
  {
    id: "cron-generator",
    name: "Cron Generator",
    route: "/cron-generator",
    icon: "Clock",
    description: "Visually build and explain 5-part cron expressions in plain English.",
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    route: "/compress-pdf",
    icon: "Minimize2",
    description: "Reduce PDF file size without sacrificing readability.",
  },
];

export default function ToolSearch({
  placeholder = "Search 55 tools (e.g. merge, pdf, regex, json, markdown)...",
  onSelect = null,
  autoFocus = false,
  isModal = false,
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(isModal);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) {
      return isModal ? POPULAR_TOOLS : [];
    }
    return searchTools(query).slice(0, 8);
  }, [query, isModal]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Autofocus input if prop set
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle outside click and global modal escapes
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target) && !isModal) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModal]);

  const handleSelectTool = (route) => {
    setIsOpen(false);
    if (onSelect) onSelect();
    router.push(route);
  };

  // Keyboard navigation: ArrowUp, ArrowDown, Enter, Escape
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      if (results.length > 0 && results[selectedIndex]) {
        e.preventDefault();
        handleSelectTool(results[selectedIndex].route);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      if (onSelect) onSelect();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search tools"
          className="w-full min-h-[48px] pl-11 pr-11 py-3 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-black/[0.12] rounded-2xl shadow-subtle text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-all font-medium"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              if (!isModal) setIsOpen(false);
            }}
            aria-label="Clear search"
            className="absolute right-1 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {(isOpen && (query.trim().length > 0 || isModal)) && (
        <div
          className={`${
            isModal
              ? "mt-2 bg-transparent"
              : "absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-modal border border-black/[0.08]"
          } overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150`}
        >
          {/* Header indicator */}
          <div className="px-4 py-2 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              {query.trim().length === 0 ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Suggested Quick Staples</span>
                </>
              ) : (
                <span>Search Results ({results.length})</span>
              )}
            </span>
            <span className="hidden sm:inline text-[11px] text-slate-400 font-normal">
              Use &uarr;&darr; to navigate &bull; &crarr; to select
            </span>
          </div>

          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No tools found matching &quot;<span className="font-semibold text-slate-700">{query}</span>&quot;.
              <div className="mt-1 text-xs text-slate-400">
                Try searching for &quot;pdf&quot;, &quot;regex&quot;, &quot;json&quot;, &quot;image&quot;, or &quot;markdown&quot;.
              </div>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              {results.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <Link
                    key={tool.id}
                    href={tool.route}
                    onClick={() => {
                      setIsOpen(false);
                      if (onSelect) onSelect();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`min-h-[52px] flex items-center gap-3.5 px-4 py-3 transition-colors ${
                      isSelected ? "bg-brand-50/90 text-brand-900" : "hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-brand-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <DynamicIcon name={tool.icon} className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isSelected ? "text-brand-600" : "text-slate-900"
                          }`}
                        >
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

                    <div className="flex items-center gap-2 text-slate-400">
                      {isSelected ? (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-brand-600 font-medium bg-brand-100/60 px-1.5 py-0.5 rounded">
                          <CornerDownLeft className="w-3 h-3" />
                          <span>Enter</span>
                        </span>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Footer keyboard hint bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shadow-2xs font-semibold">&uarr;</kbd>
                {" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shadow-2xs font-semibold">&darr;</kbd>
                {" "}navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shadow-2xs font-semibold">&crarr;</kbd>
                {" "}select
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shadow-2xs font-semibold">esc</kbd>
                {" "}close
              </span>
            </div>
            <span className="hidden sm:inline text-slate-400 font-sans">
              Bits &amp; Tools Omnisearch
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
