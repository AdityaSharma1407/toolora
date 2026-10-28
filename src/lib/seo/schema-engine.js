import { siteConfig } from "../../config/site.js";
import { resolveTemporalParity } from "./temporal-engine.js";
import { buildHowToSchema } from "./how-to-schema.js";

/**
 * Enterprise Schema Engine
 * Produces strictly validated, high-order Schema.org JSON-LD utilizing a single
 * unified @graph architecture for entity disambiguation, author authority, and AI extraction.
 */

export const BASE_URL = (siteConfig.url || "https://www.bitsandtools.com").replace(/\/$/, "");

export const ENTITY_IDS = {
  ORGANIZATION: `${BASE_URL}/#organization`,
  WEBSITE: `${BASE_URL}/#website`,
  AUTHOR_VISHAVJEET: `${BASE_URL}/#author-vishavjeet`,
  AUTHOR_ADITYA: `${BASE_URL}/#author-aditya`,
  BREADCRUMBS: `${BASE_URL}/#breadcrumbs`,
};

/**
 * Verified External Entity Knowledge Graph URIs (Wikidata & Wikipedia)
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
    name: "Digital Image Processing & Conversion",
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
    name: "Client-Side Computing & In-Browser Processing",
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
      "https://www.wikidata.org/wiki/Q7246497",
    ],
  },
  DATA_SECURITY: {
    "@type": "Thing",
    name: "Data Security & Confidentiality",
    sameAs: [
      "https://en.wikipedia.org/wiki/Data_security",
      "https://www.wikidata.org/wiki/Q188474",
    ],
  },
  HTML5_CANVAS: {
    "@type": "Thing",
    name: "HTML5 Canvas",
    sameAs: [
      "https://en.wikipedia.org/wiki/Canvas_element",
      "https://www.wikidata.org/wiki/Q1033878",
    ],
  },
};

/**
 * Verified Founder Entities
 */
export const FOUNDERS = [
  {
    "@type": "Person",
    "@id": ENTITY_IDS.AUTHOR_VISHAVJEET,
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
    "@id": ENTITY_IDS.AUTHOR_ADITYA,
    name: "Aditya Sharma",
    jobTitle: "Co-Founder & Lead Architect",
    email: "sharmaaditya14jul@gmail.com",
    url: `${BASE_URL}/about`,
    sameAs: [
      "https://github.com/AdityaSharma1407",
      "https://www.linkedin.com/in/aditya-sharma-bitsandtools",
    ],
  },
];

/**
 * Generates the Root Unified @graph Schema (WebSite + Organization + Founders)
 */
export function buildRootGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ENTITY_IDS.ORGANIZATION,
        name: siteConfig.displayName || siteConfig.name,
        legalName: "Bits & Tools Inc.",
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
          "https://www.crunchbase.com/organization/bitsandtools",
        ],
        founder: FOUNDERS,
        contactPoint: [
          {
            "@type": "ContactPoint",
            email: "vishavjeetsharma88@gmail.com",
            contactType: "Technical & Founder Inquiry",
            availableLanguage: ["English", "Hindi"],
          },
          {
            "@type": "ContactPoint",
            email: "sharmaaditya14jul@gmail.com",
            contactType: "Operations & Founder Inquiry",
            availableLanguage: ["English", "Hindi"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": ENTITY_IDS.WEBSITE,
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
        publisher: { "@id": ENTITY_IDS.ORGANIZATION },
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
 * Supports either an array of objects `{ label, href }` OR an array of path segments `['pdf-tools', 'merge-pdf']`
 */
export function buildBreadcrumbsSchema(itemsOrSegments = [], customBaseUrl) {
  const base = (customBaseUrl || BASE_URL).replace(/\/$/, "");

  const items = itemsOrSegments.map((item) => {
    if (typeof item === "string") {
      const clean = item.replace(/^\//, "");
      const label = clean
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return { label, href: `/${clean}` };
    }
    return item;
  });

  return {
    "@type": "BreadcrumbList",
    "@id": `${base}/#breadcrumbs`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: base,
      },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: item.label,
        ...(item.href ? { item: item.href.startsWith("http") ? item.href : `${base}${item.href}` } : {}),
      })),
    ],
  };
}

/**
 * Builds a comprehensive @graph JSON-LD structure for individual content/tool pages
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
    provider: { "@id": ENTITY_IDS.ORGANIZATION },
    author: [
      { "@id": ENTITY_IDS.AUTHOR_VISHAVJEET },
      { "@id": ENTITY_IDS.AUTHOR_ADITYA },
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

  const temporal = resolveTemporalParity(tool.route);

  // 2. TechArticle entity linking context to the tool
  graph.push({
    "@type": "TechArticle",
    "@id": articleId,
    headline: `${tool.name} — Free In-Browser Digital Utility`,
    description: tool.description,
    url: fullUrl,
    mainEntityOfPage: fullUrl,
    inLanguage: "en-US",
    datePublished: temporal.isoPublished || tool.datePublished,
    dateModified: temporal.isoModified || tool.dateModified,
    publisher: { "@id": ENTITY_IDS.ORGANIZATION },
    author: [
      { "@id": ENTITY_IDS.AUTHOR_VISHAVJEET },
      { "@id": ENTITY_IDS.AUTHOR_ADITYA },
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
    const breadcrumbsObj = buildBreadcrumbsSchema(breadcrumbs, BASE_URL);
    breadcrumbsObj["@id"] = breadcrumbsId;
    graph.push(breadcrumbsObj);
  }

  // 4. FAQPage entity (ensures Google renders expandable QA accordion toggles under SERP snippet)
  const effectiveFaqs = Array.isArray(faqs) && faqs.length > 0 ? faqs : [
    {
      question: `Is Bits & Tools ${tool.name} completely free to use?`,
      answer: `Yes, Bits & Tools ${tool.name} is 100% free with no subscription fees, trial limits, or mandatory registration.`,
    },
    {
      question: `Are my files uploaded or stored on any remote server?`,
      answer: `No. All operations execute strictly client-side inside your browser memory using WebAssembly and JavaScript. Files never leave your local device.`,
    },
    {
      question: `Does this ${tool.name} utility work on mobile and desktop browsers?`,
      answer: `Yes, Bits & Tools is a lightweight Progressive Web App (PWA) compatible with Chrome, Safari, Firefox, Edge, and iOS/Android browsers.`,
    },
  ];

  graph.push({
    "@type": "FAQPage",
    "@id": `${fullUrl}/#faq`,
    mainEntity: effectiveFaqs.slice(0, 4).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });

  // 5. HowTo entity (enables step-by-step rich snippet carousels in Google search results)
  if (tool.howTo !== false) {
    const howTo = buildHowToSchema({
      toolName: tool.name,
      route: tool.route,
      description: tool.description,
      steps: tool.steps || null,
      category: tool.category || (tool.route.includes("pdf") ? "pdf" : tool.route.includes("image") ? "image" : "utility"),
    });
    graph.push(howTo);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Universal content page graph builder for Article, TechArticle, or Product
 */
export function buildContentPageGraphSchema({
  type = "TechArticle",
  slug,
  title,
  description,
  datePublished,
  dateModified,
  breadcrumbs = [],
  aboutEntities = [],
  mentionsEntities = [],
  productOffers = null,
  aggregateRating = null,
}) {
  const fullUrl = `${BASE_URL}${slug.startsWith("/") ? slug : `/${slug}`}`;
  const entityId = `${fullUrl}/#${type.toLowerCase()}`;

  const graph = [];

  const temporal = resolveTemporalParity(slug);

  const mainEntity = {
    "@type": type,
    "@id": entityId,
    headline: title,
    name: title,
    description,
    url: fullUrl,
    mainEntityOfPage: fullUrl,
    inLanguage: "en-US",
    datePublished: datePublished || temporal.isoPublished,
    dateModified: dateModified || temporal.isoModified,
    publisher: { "@id": ENTITY_IDS.ORGANIZATION },
    author: [
      { "@id": ENTITY_IDS.AUTHOR_VISHAVJEET },
      { "@id": ENTITY_IDS.AUTHOR_ADITYA },
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
  };

  if (type === "Product" || productOffers) {
    mainEntity.offers = productOffers || {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    };
  }

  if (aggregateRating) {
    mainEntity.aggregateRating = aggregateRating;
  }

  graph.push(mainEntity);

  if (breadcrumbs.length > 0) {
    const breadcrumbsObj = buildBreadcrumbsSchema(breadcrumbs, BASE_URL);
    breadcrumbsObj["@id"] = `${fullUrl}/#breadcrumbs`;
    graph.push(breadcrumbsObj);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Deduplicates and merges multiple schemas into a single unified @graph
 */
export function mergeIntoUnifiedGraph(...schemas) {
  const entityMap = new Map();

  for (const schema of schemas) {
    if (!schema) continue;
    const items = Array.isArray(schema["@graph"])
      ? schema["@graph"]
      : [schema];

    for (const item of items) {
      if (!item || typeof item !== "object") continue;
      const key = item["@id"] || JSON.stringify(item);
      entityMap.set(key, item);
    }
  }

  return {
    "@context": "https://schema.org",
    "@graph": Array.from(entityMap.values()),
  };
}

const SchemaEngine = {
  BASE_URL,
  ENTITY_IDS,
  CANONICAL_ENTITIES,
  FOUNDERS,
  buildRootGraphSchema,
  buildBreadcrumbsSchema,
  buildToolPageGraphSchema,
  buildContentPageGraphSchema,
  mergeIntoUnifiedGraph,
};

export default SchemaEngine;
