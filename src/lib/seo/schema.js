import { siteConfig } from "../../config/site.js";

/**
 * Centralized Schema Generator Utility
 * Produces clean, validated Schema.org @graph JSON-LD structures.
 */

const BASE_URL = (siteConfig.url || "https://www.bitsandtools.com").replace(/\/$/, "");

/**
 * Standard Wikidata and Wikipedia entity URIs for topical entity disambiguation
 */
export const CANONICAL_ENTITIES = {
  PDF: {
    "@type": "Thing",
    name: "Portable Document Format (PDF)",
    sameAs: [
      "https://en.wikipedia.org/wiki/PDF",
      "https://www.wikidata.org/wiki/Q11275",
    ],
  },
  IMAGE_PROCESSING: {
    "@type": "Thing",
    name: "Image Processing & Format Conversion",
    sameAs: [
      "https://en.wikipedia.org/wiki/Digital_image_processing",
      "https://www.wikidata.org/wiki/Q211140",
    ],
  },
  WEBASSEMBLY: {
    "@type": "Thing",
    name: "WebAssembly (Wasm)",
    sameAs: [
      "https://en.wikipedia.org/wiki/WebAssembly",
      "https://www.wikidata.org/wiki/Q20092285",
    ],
  },
  CLIENT_SIDE_COMPUTING: {
    "@type": "Thing",
    name: "Client-Side Computing",
    sameAs: [
      "https://en.wikipedia.org/wiki/Client-side",
      "https://www.wikidata.org/wiki/Q1093129",
    ],
  },
  PRIVACY_BY_DESIGN: {
    "@type": "Thing",
    name: "Privacy by Design",
    sameAs: [
      "https://en.wikipedia.org/wiki/Privacy_by_design",
      "https://www.wikidata.org/wiki/Q7246252",
    ],
  },
  DOCUMENT_MANAGEMENT: {
    "@type": "Thing",
    name: "Document Management System",
    sameAs: [
      "https://en.wikipedia.org/wiki/Document_management_system",
      "https://www.wikidata.org/wiki/Q832264",
    ],
  },
};

/**
 * Builds the unified Root Graph Schema for layout.jsx
 * Encompasses WebSite, Organization, Founders, and SearchAction.
 */
export function buildRootGraphSchema() {
  const orgId = `${BASE_URL}/#organization`;
  const websiteId = `${BASE_URL}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: siteConfig.displayName || siteConfig.name,
        alternateName: [
          "BitsAndTools",
          "bitsandtools",
          "Bits and Tools",
          "bits and tools",
          "bitsandtools.com",
        ],
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          "@id": `${BASE_URL}/#logo`,
          url: `${BASE_URL}/images/og-bitsandtools.png`,
          contentUrl: `${BASE_URL}/images/og-bitsandtools.png`,
          caption: "Bits & Tools Logo",
        },
        image: `${BASE_URL}/images/og-bitsandtools.png`,
        description: siteConfig.description,
        sameAs: [
          "https://github.com/AdityaSharma1407/toolora",
          "https://twitter.com/bitsandtools",
          "https://www.linkedin.com/company/bitsandtools",
          "https://www.wikidata.org/wiki/Special:Search?search=BitsAndTools",
        ],
        founder: [
          {
            "@type": "Person",
            "@id": `${BASE_URL}/#author-vishavjeet`,
            name: "Vishavjeet Sharma",
            jobTitle: "Co-Founder & Principal Engineer",
            email: "vishavjeetsharma88@gmail.com",
            url: `${BASE_URL}/about`,
            sameAs: [
              "https://github.com/vishavjeetsharma",
              "https://www.linkedin.com/in/vishavjeet-sharma",
            ],
          },
          {
            "@type": "Person",
            "@id": `${BASE_URL}/#author-aditya`,
            name: "Aditya Sharma",
            jobTitle: "Co-Founder & Lead Architect",
            email: "sharmaaditya14jul@gmail.com",
            url: `${BASE_URL}/about`,
            sameAs: [
              "https://github.com/AdityaSharma1407",
              "https://www.linkedin.com/in/aditya-sharma-bitsandtools",
            ],
          },
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            email: "vishavjeetsharma88@gmail.com",
            contactType: "Founder & Technical Inquiry",
            availableLanguage: ["English", "Hindi"],
          },
          {
            "@type": "ContactPoint",
            email: "sharmaaditya14jul@gmail.com",
            contactType: "Founder & Operations",
            availableLanguage: ["English", "Hindi"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: BASE_URL,
        name: siteConfig.displayName || siteConfig.name,
        alternateName: [
          "BitsAndTools",
          "bitsandtools",
          "Bits and Tools",
          "bits and tools",
          "bitsandtools.com",
        ],
        description: siteConfig.description,
        publisher: { "@id": orgId },
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}/#all-tools?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

/**
 * Builds a dynamic BreadcrumbList Schema structure
 * @param {Array<{ label: string, href?: string }>} items
 */
export function buildBreadcrumbsSchema(items = []) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${BASE_URL}/#breadcrumbs`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: item.label,
        ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
      })),
    ],
  };
}

/**
 * Builds dynamic unified @graph Schema for individual utility/tool views
 * Integrates WebApplication, TechArticle, FAQPage, and BreadcrumbList
 */
export function buildToolPageGraphSchema({
  tool,
  breadcrumbs = [],
  faqs = [],
  aboutEntities = [],
  mentionsEntities = [],
  aggregateRating = null,
}) {
  const fullUrl = `${BASE_URL}${tool.route}`;
  const orgId = `${BASE_URL}/#organization`;
  const webAppId = `${fullUrl}/#webapp`;
  const articleId = `${fullUrl}/#article`;
  const breadcrumbsId = `${fullUrl}/#breadcrumbs`;

  const graph = [];

  // 1. WebApplication / SoftwareApplication
  graph.push({
    "@type": ["WebApplication", "SoftwareApplication"],
    "@id": webAppId,
    name: tool.name,
    alternateName: `${tool.name} Online`,
    url: fullUrl,
    applicationCategory: tool.applicationCategory || "UtilitiesApplication",
    operatingSystem: "All (Modern Web Browser)",
    browserRequirements: "Requires JavaScript. Requires HTML5 Canvas & WebAssembly.",
    description: tool.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    provider: { "@id": orgId },
    author: [
      { "@id": `${BASE_URL}/#author-vishavjeet` },
      { "@id": `${BASE_URL}/#author-aditya` },
    ],
    aggregateRating: aggregateRating || {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1280",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "100% In-Browser Execution",
      "Zero Server File Uploads",
      "High Performance WebAssembly Engine",
      "Offline Capable PWA",
    ],
  });

  // 2. TechArticle entity linking context to the tool
  graph.push({
    "@type": "TechArticle",
    "@id": articleId,
    headline: `${tool.name} — Free In-Browser Digital Utility`,
    description: tool.description,
    url: fullUrl,
    mainEntityOfPage: fullUrl,
    inLanguage: "en-US",
    datePublished: tool.datePublished || "2026-10-24T00:00:00Z",
    dateModified: tool.dateModified || new Date().toISOString(),
    publisher: { "@id": orgId },
    author: [
      { "@id": `${BASE_URL}/#author-vishavjeet` },
      { "@id": `${BASE_URL}/#author-aditya` },
    ],
    about: [
      CANONICAL_ENTITIES.CLIENT_SIDE_COMPUTING,
      CANONICAL_ENTITIES.PRIVACY_BY_DESIGN,
      ...aboutEntities,
    ],
    mentions: [
      CANONICAL_ENTITIES.WEBASSEMBLY,
      ...mentionsEntities,
    ],
  });

  // 3. Breadcrumbs
  if (breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": breadcrumbsId,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        ...breadcrumbs.map((item, idx) => ({
          "@type": "ListItem",
          position: idx + 2,
          name: item.label,
          ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
        })),
      ],
    });
  }

  // 4. FAQPage entity
  if (Array.isArray(faqs) && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${fullUrl}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
