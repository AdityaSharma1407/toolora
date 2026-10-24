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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  {siteConfig.name}
                  <span className="text-brand-600">.</span>
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
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    allToolsOpen
                      ? "text-brand-600 bg-brand-50"
                      : "text-slate-700 hover:text-brand-600 hover:bg-slate-50"
                  }`}
                >
                  <span>All Tools</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-150 ${
                      allToolsOpen ? "rotate-180 text-brand-600" : "text-slate-400"
                    }`}
                  />
                </button>

                {allToolsOpen && (
                  <div className="absolute left-0 mt-2 w-[580px] bg-white rounded-2xl shadow-xl border border-slate-200 p-4 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
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

              {/* File Converters Link */}
              <Link
                href="/#convert-tools"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-colors"
              >
                File Converters
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
          <div className="flex items-center gap-3">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              aria-label="Open search"
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors"
            >
              <SearchIcon className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Search tools...</span>
            </button>

            {/* Quick Action Link */}
            <Link
              href="/merge-pdf"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Merge PDF</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quick Tool Search
              </span>
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                aria-label="Close search modal"
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ToolSearch />
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-900 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              href="/merge-pdf"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-semibold text-brand-600 bg-brand-50"
            >
              <span>Merge PDF</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Ready
              </span>
            </Link>
            <Link
              href="/pdf-tools"
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              PDF Tools Directory
            </Link>
            <Link
              href="/image-tools"
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Image Tools Directory
            </Link>
            <Link
              href="/#convert-tools"
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              File Converters
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              About Toolora
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Contact Support
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
