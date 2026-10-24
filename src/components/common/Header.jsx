"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { CATEGORIES, getAllTools } from "@/data/toolsRegistry";
import ToolSearch from "./ToolSearch";
import DynamicIcon from "./DynamicIcon";
import {
  Menu,
  X,
  ChevronDown,
  Layers,
  Sparkles,
  Search as SearchIcon,
} from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allToolsOpen, setAllToolsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const tools = getAllTools();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAllToolsOpen(false);
    setSearchModalOpen(false);
  }, [pathname]);

  // Click outside to close desktop dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAllToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-black/[0.06] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              aria-label="Bits & Tools Homepage"
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-subtle">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  {siteConfig.displayName || siteConfig.name}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {/* All Tools Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setAllToolsOpen(!allToolsOpen)}
                  aria-expanded={allToolsOpen}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    allToolsOpen
                      ? "text-brand-600 bg-brand-50/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <span>All Tools</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${
                      allToolsOpen ? "rotate-180 text-brand-600" : "text-slate-400"
                    }`}
                  />
                </button>

                {allToolsOpen && (
                  <div className="absolute left-0 mt-2 w-[580px] bg-white rounded-2xl shadow-modal border border-black/[0.08] p-4 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
                    {Object.values(CATEGORIES).map((cat) => {
                      const catTools = tools.filter((t) => t.category === cat.id);
                      return (
                        <div key={cat.id} className="space-y-2">
                          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                            <DynamicIcon name={cat.icon} className="w-4 h-4 text-brand-600" />
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                              {cat.name}
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {catTools.slice(0, 4).map((tool) => {
                              const isAvailable = tool.status === "available";
                              return (
                                <li key={tool.id}>
                                  {isAvailable ? (
                                    <Link
                                      href={tool.route}
                                      onClick={() => setAllToolsOpen(false)}
                                      className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-800 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                                    >
                                      <span>{tool.name}</span>
                                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                                        Ready
                                      </span>
                                    </Link>
                                  ) : (
                                    <div className="flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-400 select-none">
                                      <span>{tool.name}</span>
                                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                        Soon
                                      </span>
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* PDF Tools Link */}
              <Link
                href="/pdf-tools"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/pdf-tools"
                    ? "text-brand-600 bg-brand-50"
                    : "text-slate-700 hover:text-brand-600 hover:bg-slate-50"
                }`}
              >
                PDF Tools
              </Link>

              {/* Image Tools Link */}
              <Link
                href="/image-tools"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/image-tools"
                    ? "text-brand-600 bg-brand-50"
                    : "text-slate-700 hover:text-brand-600 hover:bg-slate-50"
                }`}
              >
                Image Tools
              </Link>

              {/* Roadmap Link */}
              <Link
                href="/#roadmap"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-colors"
              >
                Roadmap
              </Link>

              {/* About Link */}
              <Link
                href="/about"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/about"
                    ? "text-brand-600 bg-brand-50"
                    : "text-slate-700 hover:text-brand-600 hover:bg-slate-50"
                }`}
              >
                About
              </Link>

              {/* Contact Link */}
              <Link
                href="/contact"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/contact"
                    ? "text-brand-600 bg-brand-50"
                    : "text-slate-700 hover:text-brand-600 hover:bg-slate-50"
                }`}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              aria-label="Open search"
              className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-[36px] flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-slate-600 bg-slate-100/80 hover:bg-slate-200/70 rounded-xl border border-black/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <SearchIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Search tools...</span>
            </button>

            {/* Quick Action Link */}
            <Link
              href="/merge-pdf"
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl text-xs font-semibold shadow-subtle transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Merge PDF</span>
            </Link>

            {/* Mobile Menu Toggle Button (Strictly 44x44px touch target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100/80 active:bg-slate-200/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/30 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-modal p-4 border border-black/[0.08]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Quick Tool Search
              </span>
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                aria-label="Close search modal"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ToolSearch onSelect={() => setSearchModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-black/[0.06] bg-white/95 backdrop-blur-md px-4 pt-2 pb-5 space-y-1 animate-in slide-in-from-top-1">
          <Link
            href="/"
            className="min-h-[44px] flex items-center px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-900 hover:bg-slate-100/80 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/merge-pdf"
            className="min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-semibold text-brand-600 bg-brand-50/80 transition-colors"
          >
            <span>Merge PDF</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Ready
            </span>
          </Link>
          <Link
            href="/split-pdf"
            className="min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100/80 transition-colors"
          >
            <span>Split PDF</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Ready
            </span>
          </Link>
          <Link
            href="/compress-pdf"
            className="min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100/80 transition-colors"
          >
            <span>Compress PDF</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Ready
            </span>
          </Link>
          <Link
            href="/jpg-to-pdf"
            className="min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100/80 transition-colors"
          >
            <span>JPG to PDF</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Ready
            </span>
          </Link>
          <Link
            href="/pdf-tools"
            className="min-h-[44px] flex items-center px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100/80 transition-colors"
          >
            PDF Tools Directory
          </Link>
          <Link
            href="/image-tools"
            className="min-h-[44px] flex items-center px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100/80 transition-colors"
          >
            Image Tools Directory
          </Link>
          <Link
            href="/#roadmap"
            className="min-h-[44px] flex items-center px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100/80 transition-colors"
          >
            Planned Roadmap
          </Link>
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/about"
              className="min-h-[44px] flex items-center px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100/80 transition-colors"
            >
              About {siteConfig.displayName || "Bits & Tools"}
            </Link>
            <Link
              href="/contact"
              className="min-h-[44px] flex items-center px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100/80 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
