# Bits & Tools — Fast, Private Online Tools Platform

**Bits & Tools** ([`https://www.bitsandtools.com`](https://www.bitsandtools.com)) is a modern, privacy-first web utilities platform crafted with Next.js 15 (App Router), React 19, Tailwind CSS, Lucide icons, and `pdf-lib`.

All document manipulation runs **100% locally in the user's browser** via client-side WebAssembly and JavaScript. Zero files or document bytes are transmitted to any external server.

---

## 🌟 Key Features & Tool Suite

### 1. Fully Functional Client-Side Tools
- **Merge PDF (`/merge-pdf`)**:
  - Combines two or more PDF documents in exact user-defined sequence.
  - Drag-and-drop file upload, file ordering (Move Up/Down), clear all, and removal.
  - Page counts and live summary before compiling.
- **Split PDF (`/split-pdf`)**:
  - **Mode A (Extract Pages)**: Supports custom ranges (`1-3, 5, 8-10`), presets (All, First, Last, Odd, Even), and an interactive page-toggle grid.
  - **Mode B (Split Every Page)**: Bursts each page into an individual PDF and packages them into a `.zip` archive via `jszip`.
- **Compress PDF (`/compress-pdf`)**:
  - Client-side structural optimization and object stream compaction.
  - Supports 3 modes: Basic (metadata cleaning), Recommended (XML metadata stripping & FlateDecode object streams), and Maximum (clean repackaging).
  - Exact mathematical percentage reduction and size comparisons with transparent notifications when files are already maximally compressed.
- **JPG to PDF Converter (`/jpg-to-pdf`)**:
  - Converts JPG, JPEG, and PNG images into a clean PDF document.
  - Multi-image selection, thumbnail preview, image dimensions, and order controls.
  - Custom page sizing: ISO A4, US Letter, or Fit to Image.
  - Configurable orientation (Portrait/Landscape), placement (Fit/Fill), and margins (None, Small, Medium, Large).

### 2. Apple HIG-Inspired Design System
- **Minimalist Aesthetic:** Neutral `#fbfbfd` canvas background replacing aggressive dark themes or noisy gradients.
- **Typography:** Native Apple system font stack (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui`).
- **Tactile Micro-Interactions:** Buttons with subtle elevation shadows, active press feedback (`active:scale-[0.985]`), and high-contrast borders (`border-black/[0.06]`).
- **Accessibility (WCAG 2.2 AA):**
  - Minimum `44×44px` touch targets for mobile accessibility.
  - High-contrast `2px` focus ring with `2px` offset (`focus-visible:ring-2 focus-visible:ring-blue-500`).
  - Screen reader progress announcements via `aria-live="polite"` and `role="status"`.
  - Global `prefers-reduced-motion` compliance.

### 3. Technical SEO & Rich Structured Data
- **Canonical Architecture:** Standardized on `https://www.bitsandtools.com` across canonical links, OpenGraph, Twitter cards, and sitemaps.
- **JSON-LD Schemas:** Google-compliant structured data for `WebSite`, `Organization`, `BreadcrumbList`, `FAQPage`, and `WebApplication` on all active tool pages (strictly zero fabricated ratings or fake user reviews).
- **Automated Sitemap & Robots:** Dynamic `/sitemap.xml` and `/robots.txt` generated using Next.js App Router conventions.

### 4. Apple Squircle Favicon & App Icon Suite
Complete, multi-format icon set matching the brand's isometric Layers emblem:
- `public/favicon.ico` (Multi-size ICO: 16×16, 32×32, 48×48)
- `public/icon.svg` (Lossless scalable vector icon)
- `public/apple-touch-icon.png` (180×180 for iOS Safari Home Screen)
- `public/icon-192.png` & `public/icon-512.png` (Android Chrome & PWA)
- `public/site.webmanifest` (Web App Manifest metadata)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+ or 20+ (tested on Node.js v22)
- npm or compatible package manager

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file from the example template:
```bash
cp .env.example .env.local
```
Set the canonical URL:
```env
NEXT_PUBLIC_SITE_URL=https://www.bitsandtools.com
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Tests
```bash
npm test
```
Executes **40 automated tests across 9 test suites** covering:
- PDF byte validation and header checks
- PDF merge logic, page sequencing, and reordering
- Split PDF (range parsing, extraction, and zip bursting)
- PDF stream compression and size difference math
- JPG/PNG to PDF layout conversion and options
- End-to-end tool execution pipeline
- Tool registry integrity and search filtering
- Monetization safe defaults and cookie consent storage keys
- Canonical SEO, sitemap, robots, and contact routing

### 5. Run Linter & Production Build
```bash
npm run lint
npm run build
npm run start
```

---

## 💰 Monetization & Advertising Architecture

Bits & Tools features a privacy-compliant monetization framework designed around **zero disruption to core utilities**:

- **Google AdSense Verification:**
  - `public/ads.txt`: Pre-configured publisher verification file (`pub-8022438675607325`).
  - Google AdSense verification meta tag and async script loader configured in root layout.
- **Dormant by Default:**
  - `NEXT_PUBLIC_ADS_ENABLED=false` by default to prevent layout shift (CLS) and ensure pure performance until ready.
- **Privacy & Consent Banner:**
  - User consent is managed via [`CookieConsentBanner.jsx`](src/components/common/CookieConsentBanner.jsx) stored under `bitsandtools_consent_preferences`.
  - Ad scripts respect GDPR, UK GDPR, and India DPDP standards.

---

## 📂 Project Architecture

```
BitsAndTools/
├── public/
│   ├── ads.txt                   # Google AdSense publisher verification
│   ├── apple-touch-icon.png      # 180x180 iOS home screen icon
│   ├── favicon.ico               # Multi-size 16/32/48 ICO
│   ├── icon.svg                  # Vector SVG favicon
│   ├── icon-192.png              # 192x192 Android icon
│   ├── icon-512.png              # 512x512 PWA splash icon
│   └── site.webmanifest          # PWA manifest
├── scripts/
│   └── generate-favicons.ps1     # Multi-resolution favicon generation script
├── src/
│   ├── app/
│   │   ├── globals.css           # Apple HIG typography, focus rings, reduced motion
│   │   ├── layout.jsx            # MetadataBase, JSON-LD schemas, Header, Footer
│   │   ├── page.jsx              # Homepage (Hero, Spotlight Search, Category grid)
│   │   ├── merge-pdf/page.jsx    # Merge PDF route & WebApplication schema
│   │   ├── split-pdf/page.jsx    # Split PDF route & WebApplication schema
│   │   ├── compress-pdf/page.jsx # Compress PDF route & WebApplication schema
│   │   ├── jpg-to-pdf/page.jsx   # JPG to PDF converter route
│   │   ├── pdf-tools/page.jsx    # PDF category hub
│   │   ├── image-tools/page.jsx  # Image category hub
│   │   ├── about/page.jsx        # About Bits & Tools
│   │   ├── contact/page.jsx      # Contact page & mailto form
│   │   ├── privacy-policy/page.jsx # Comprehensive privacy policy
│   │   ├── terms/page.jsx        # Terms of service
│   │   ├── not-found.jsx         # Custom 404 page
│   │   ├── robots.js             # Dynamic robots.txt
│   │   └── sitemap.js            # Dynamic canonical sitemap.xml
│   ├── components/
│   │   ├── ads/                  # AdSlot.jsx, AdSenseScript.jsx
│   │   ├── common/               # Header, Footer, CookieConsentBanner, ToolCard, ToolSearch, Breadcrumbs, PrimaryButton, RelatedTools
│   │   ├── contact/              # ContactForm.jsx
│   │   ├── image/                # JpgToPdfWorkspace.jsx
│   │   └── pdf/                  # Merge, Split, Compress workspaces, UploadZone, FileItem
│   ├── config/
│   │   └── site.js               # Central site configuration, limits, monetization & contact settings
│   ├── data/
│   │   └── toolsRegistry.js      # Central tools database with categories & coming soon status
│   ├── lib/
│   │   └── analytics.js          # Anonymized client event tracking utility
│   └── tools/
│       └── pdf/
│           ├── mergePdf.js       # Client-side PDF merger
│           ├── splitPdf.js       # Client-side PDF splitter & zip packager
│           ├── compressPdf.js    # Client-side structural PDF optimizer
│           ├── imagesToPdf.js    # Client-side JPG/PNG to PDF compiler
│           ├── validatePdf.js    # PDF header & magic bytes validator
│           ├── validateImage.js  # Image file validator
│           └── pdfUtils.js       # Download blob & ArrayBuffer utilities
├── test/
│   ├── contact-and-seo.test.mjs  # SEO, canonical, sitemap, robots, and email checks
│   ├── monetization.test.mjs     # Monetization, consent, and ad placement tests
│   ├── pdf-merge.test.mjs        # Merge PDF logic tests
│   ├── pdf-tools.test.mjs        # Split, compress, and image validation tests
│   └── tools-pipeline.test.mjs   # End-to-end file processing tests
├── .env.example
├── next.config.mjs
├── tailwind.config.js
└── package.json
```

---

## 🌐 Production Deployment (Vercel & Hostinger)

### 1. Vercel Settings
- **Environment Variable:** Set `NEXT_PUBLIC_SITE_URL=https://www.bitsandtools.com` in Project Settings > Environment Variables.
- **Domain Redirect:** Add both `bitsandtools.com` and `www.bitsandtools.com`. Configure `bitsandtools.com` to redirect to `www.bitsandtools.com` (HTTP 308 Permanent).

### 2. Hostinger DNS Records
- **Apex Domain (`@`):** Type `A`, points to `76.76.21.21` (or your assigned Vercel IP).
- **Subdomain (`www`):** Type `CNAME`, points to `cname.vercel-dns.com.`.
- *Note:* Preserve any existing MX and TXT records for your email service.

---

## 🔒 Privacy Guarantee

Bits & Tools executes all operations within browser memory using client-side WebAssembly and JavaScript. No user documents or sensitive images are ever uploaded to Bits & Tools servers.

---

## 📄 License
MIT License — Free and open for personal and commercial use.
