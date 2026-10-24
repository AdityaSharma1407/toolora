# Toolora — Modern, SEO-Friendly Online Tools Platform

Toolora is a fast, modern, and privacy-focused online tools platform built with Next.js (App Router), React, Tailwind CSS, Lucide icons, and `pdf-lib`.

All document manipulation runs **locally in the user's browser**. Documents are never transmitted to any external server.

---

## 🌟 Key Features

- **Merge PDF Files (`/merge-pdf`)**: Fully functional, client-side PDF merger powered by `pdf-lib`.
  - Combines 2 or more PDF documents in exact user-defined sequence.
  - Drag-and-drop file upload, file ordering (Move Up/Down), clear all, and removal.
- **Split PDF Files (`/split-pdf`)**: Fully functional client-side document splitting.
  - **Mode A (Extract Pages)**: Supports custom ranges (`1-3, 5, 8-10`), presets (All, First, Last, Odd, Even), and an interactive page-toggle grid.
  - **Mode B (Split Every Page)**: Generates one PDF per page and packages them into a single `.zip` archive via `jszip`.
- **Compress PDF Files (`/compress-pdf`)**: Genuine client-side structural optimization and stream compaction.
  - Supports 3 modes: Basic (metadata cleaning), Recommended (XML metadata stripping & FlateDecode object streams), and Maximum (clean repackaging).
  - Exact mathematical percentage reduction and size comparisons.
  - Transparent notifications when an input document is already maximally compressed.
- **JPG to PDF Converter (`/jpg-to-pdf`)**: Converts JPG, JPEG, and PNG images into a unified PDF.
  - Multi-image selection, thumbnail preview, image dimensions, and order controls.
  - Custom page sizing: ISO A4, US Letter, or Fit to Image.
  - Configurable orientation (Portrait/Landscape), placement (Fit/Fill), and margins (None, Small, Medium, Large).
- **Central Tool Registry**: Single source of truth in `src/data/toolsRegistry.js` supporting categorized expansion across PDF, Image, Document Conversion, Video & Audio, and Developer utilities.
- **Instant Search**: Client-side search across tool names, categories, descriptions, and keywords.
- **Complete SEO Architecture**:
  - Semantic HTML with valid heading hierarchy (`h1`, `h2`, `h3`).
  - OpenGraph, Twitter Cards, Canonical links, and meta descriptions.
  - Auto-generated `sitemap.xml` and `robots.txt` using Next.js App Router conventions.
  - Schema.org `FAQPage` JSON-LD structured data for Google Rich Results.
- **Monetization Architecture**: Reusable `AdSlot` and `AdPlacement` components with standard AdSense support, named placements (`home-top`, `home-content`, `home-bottom`, `tool-bottom`, `category-content`), and provider abstraction.
- **Privacy & Consent System**: Configurable cookie and privacy consent banner (`CookieConsentBanner.jsx`) adhering to GDPR, UK GDPR, and India DPDP guidelines.
- **Essential Legal Pages**: Complete, original informational pages at `/privacy-policy`, `/terms`, `/about`, and `/contact`.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+ or 20+ (tested on Node.js v22)
- npm or compatible package manager

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Tests
```bash
npm test
```
Executes 30 automated unit tests covering PDF validation, merging, splitting, compressing, JPG-to-PDF conversion, registry integrity, and monetization safe defaults.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 💰 Advertising & Monetization Architecture

Toolora includes a production-ready advertising and monetization architecture designed around **zero disruption to user tools and maximum privacy compliance**.

### 1. Kept Disabled by Default
Advertising is **disabled by default** in the code and `.env.example`. When disabled:
- Zero external ad scripts are downloaded or injected.
- No network requests are made to third-party ad networks.
- Ad slots render `null` and leave the page layout clean and compact.

### 2. How to Obtain and Configure an AdSense Publisher ID
1. Apply and receive approval for your domain at [Google AdSense](https://adsense.google.com).
2. Locate your publisher ID in the AdSense dashboard under **Account > Settings > Account information** (format: `ca-pub-XXXXXXXXXXXXXXXX`).
3. Add your publisher ID to your `.env.local` (or your production hosting platform's environment variables):
   ```env
   NEXT_PUBLIC_ADS_ENABLED=true
   NEXT_PUBLIC_AD_PROVIDER=adsense
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
   ```

### 3. How to Obtain and Configure Individual Ad-Slot IDs
1. In your Google AdSense console, navigate to **Ads > By ad unit**.
2. Create display ad units for the desired placements (e.g. "Horizontal Banner", "Responsive Display").
3. Copy the numeric `data-ad-slot` ID from the generated code snippet.
4. Set the corresponding environment variables:
   ```env
   NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP=1234567890
   NEXT_PUBLIC_ADSENSE_SLOT_HOME_CONTENT=2345678901
   NEXT_PUBLIC_ADSENSE_SLOT_HOME_BOTTOM=3456789012
   NEXT_PUBLIC_ADSENSE_SLOT_TOOL_BOTTOM=4567890123
   NEXT_PUBLIC_ADSENSE_SLOT_CATEGORY_CONTENT=5678901234
   ```

### 4. Keeping Ads Disabled During Local Development
Leave `NEXT_PUBLIC_ADS_ENABLED=false` in your `.env.local`.
To test ad slot spacing and responsiveness without calling AdSense APIs, set:
```env
NEXT_PUBLIC_ADS_DEBUG=true
```
This renders a non-intrusive wireframe box indicating the placement name and slot ID without downloading third-party scripts.

### 5. Configuring Alternative Advertising Providers Later
The architecture uses a provider abstraction in [`src/config/site.js`](src/config/site.js) and [`src/components/ads/AdSlot.jsx`](src/components/ads/AdSlot.jsx).
To add another provider (such as Ezoic or a direct display network):
1. Set `NEXT_PUBLIC_AD_PROVIDER=ezoic` (or custom provider).
2. Update the script loader in [`src/components/ads/AdSenseScript.jsx`](src/components/ads/AdSenseScript.jsx) or create a provider-specific loader.
3. The existing `AdSlot` components throughout the site automatically route through the configured provider without touching individual pages.

### 6. Privacy & Consent Management
- **Local Storage:** The user's consent choice is stored under `toolora_consent_preferences`.
- **EU / UK GDPR & India DPDP:** If a user chooses "Essential Only", advertising cookies and third-party scripts are completely blocked.
- **Opt-Out:** Users can change their consent preferences anytime or opt out of personalized Google advertising via [Google Ads Settings](https://www.google.com/settings/ads) and [AboutAds](https://www.aboutads.info/choices/).

### 7. How to Verify Ad Scripts Are Not Loaded When Disabled
Run our built-in probe test or inspect the network tab in your browser:
```bash
npm test
```
The test verifies that with default settings, `siteConfig.monetization.enabled` is `false`, `analytics.enabled` is `false`, and no `pagead2.googlesyndication.com` script tags are emitted.

---

## 📂 Project Architecture

```
Toolora/
├── src/
│   ├── app/
│   │   ├── globals.css           # Tailwind base styles and theme
│   │   ├── layout.jsx            # Global metadata, layout, Header, Footer, AdSenseScript, CookieConsentBanner
│   │   ├── page.jsx              # Homepage (Hero, Search, Categories, AdSlots)
│   │   ├── merge-pdf/page.jsx    # Live Merge PDF tool
│   │   ├── split-pdf/page.jsx    # Live Split PDF tool
│   │   ├── compress-pdf/page.jsx # Live Compress PDF tool
│   │   ├── jpg-to-pdf/page.jsx   # Live JPG to PDF converter
│   │   ├── pdf-tools/page.jsx    # PDF utility directory
│   │   ├── image-tools/page.jsx  # Image utility directory
│   │   ├── about/page.jsx        # About page
│   │   ├── contact/page.jsx      # Contact page
│   │   ├── privacy-policy/page.jsx # Comprehensive Privacy Policy
│   │   ├── terms/page.jsx        # Terms of Service
│   │   ├── not-found.jsx         # Custom 404 handler
│   │   ├── robots.js             # Dynamic robots.txt
│   │   └── sitemap.js            # Dynamic sitemap.xml
│   ├── components/
│   │   ├── ads/                  # AdSlot.jsx, AdSenseScript.jsx
│   │   ├── common/               # Header, Footer, CookieConsentBanner, ToolCard, ToolSearch, Breadcrumbs, etc.
│   │   ├── contact/              # ContactForm.jsx
│   │   ├── image/                # JpgToPdfWorkspace.jsx
│   │   └── pdf/                  # Merge, Split, Compress Workspaces and Upload Zone
│   ├── config/
│   │   └── site.js               # Central site configuration, limits, monetization & consent settings
│   ├── data/
│   │   └── toolsRegistry.js      # Central tools database with categories & status
│   ├── lib/
│   │   └── analytics.js          # Anonymized event and tool usage tracking utility
│   └── tools/
│       └── pdf/
│           ├── mergePdf.js       # Local PDF merger
│           ├── splitPdf.js       # Local PDF splitter & ZIP packager
│           ├── compressPdf.js    # Local PDF structural stream optimizer
│           ├── imagesToPdf.js    # Local JPG/PNG to PDF compiler
│           ├── validatePdf.js    # PDF header & signature validator
│           ├── validateImage.js  # Image format validator
│           └── pdfUtils.js       # Blob download & array helpers
├── test/
│   ├── pdf-merge.test.mjs        # Merge PDF tests
│   ├── pdf-tools.test.mjs        # Split, Compress, JPG to PDF tests
│   └── monetization.test.mjs     # Monetization, consent, and analytics tests
├── .env.example
├── next.config.mjs
├── tailwind.config.js
└── package.json
```

---

## 🔒 Privacy & Security

Toolora executes document manipulation in-memory using WebAssembly and client-side JavaScript. No file data is transmitted to Toolora servers.

---

## 📄 License
MIT
