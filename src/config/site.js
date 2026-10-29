export const siteConfig = {
  name: "BitsAndTools",
  displayName: "Bits & Tools",
  shortName: "Bits & Tools",
  tagline: "Free, Fast & Secure Online Tools",
  description:
    "Bits & Tools provides fast, free, and privacy-focused online utilities. Merge, split, compress PDFs, convert images, and use everyday developer tools locally in your browser with complete privacy.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.bitsandtools.com",
  themeColor: "#2563eb",
  ogImage: "/images/og-bitsandtools.png",
  // Founders data for SEO & structured schema metadata (not rendered in application view)
  founders: [
    {
      name: "Vishavjeet Sharma",
      role: "Co-Founder",
      email: "vishavjeetsharma88@gmail.com",
    },
    {
      name: "Aditya Sharma",
      role: "Co-Founder",
      email: "sharmaaditya14jul@gmail.com",
    },
  ],
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "bitsandtools2026@gmail.com",
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
  },
  limits: {
    mergePdf: {
      maxFiles: 20,
      maxFileSizeBytes: 50 * 1024 * 1024, // 50 MB
      maxFileSizeFormatted: "50 MB",
      maxTotalSizeBytes: 200 * 1024 * 1024, // 200 MB
      maxTotalSizeFormatted: "200 MB",
      minFilesToMerge: 2,
    },
    splitPdf: {
      maxFileSizeBytes: 50 * 1024 * 1024, // 50 MB
      maxFileSizeFormatted: "50 MB",
    },
    compressPdf: {
      maxFileSizeBytes: 50 * 1024 * 1024, // 50 MB
      maxFileSizeFormatted: "50 MB",
    },
    jpgToPdf: {
      maxImages: 30,
      maxImageSizeBytes: 20 * 1024 * 1024, // 20 MB per image
      maxImageSizeFormatted: "20 MB",
      supportedFormats: ["image/jpeg", "image/jpg", "image/png"],
    },
  },

  // --- Advertising & Monetization Architecture ---
  // Kept disabled by default; only active when explicitly configured via environment variables
  monetization: {
    enabled: String(process.env.NEXT_PUBLIC_ADS_ENABLED || "").trim().toLowerCase() === "true",
    provider: (process.env.NEXT_PUBLIC_AD_PROVIDER || "adsense").trim().toLowerCase(),
    adsense: {
      client: (process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-8022438675607325").trim(),
      slots: {
        "home-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP || "",
        "home-content": process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_CONTENT || "",
        "home-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_BOTTOM || "",
        "tool-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_TOP || "",
        "tool-content": process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_CONTENT || "",
        "tool-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_BOTTOM || "",
        "category-content": process.env.NEXT_PUBLIC_ADSENSE_SLOT_CATEGORY_CONTENT || "",
        "article-content": process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_CONTENT || "",
      },
    },
    placements: {
      "home-top": false,
      "home-content": true,
      "home-bottom": true,
      "tool-top": false,
      "tool-content": false,
      "tool-bottom": true,
      "category-content": true,
      "article-content": true,
    },
    debug: process.env.NEXT_PUBLIC_ADS_DEBUG === "true",
  },

  // Backward-compatible alias for existing references
  get ads() {
    return {
      enabled: this.monetization.enabled,
      client: this.monetization.adsense.client,
    };
  },

  // --- Analytics & Search Console Configuration ---
  analytics: {
    enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    searchConsoleVerification: process.env.NEXT_PUBLIC_SEARCH_CONSOLE_CODE || "",
  },

  // --- Privacy & Consent Management ---
  consent: {
    storageKey: "bitsandtools_consent_preferences",
    version: "1.0",
    requiredForAds: true,
  },

  navItems: [
    { label: "All Tools", href: "/#all-tools" },
    { label: "PDF Tools", href: "/pdf-tools" },
    { label: "Image Tools", href: "/image-tools" },
    { label: "Merge PDF", href: "/merge-pdf", badge: "Popular" },
    { label: "About", href: "/about" },
  ],
};
