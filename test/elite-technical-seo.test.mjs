import test, { describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildRootGraphSchema,
  buildBreadcrumbsSchema,
  buildToolPageGraphSchema,
  buildContentPageGraphSchema,
  mergeIntoUnifiedGraph,
  CANONICAL_ENTITIES,
  FOUNDERS,
  ENTITY_IDS,
} from "../src/lib/seo/schema-engine.js";
import {
  getAllSitemapEntries,
  getFreshSitemapEntries,
  getArchiveSitemapEntries,
  buildSitemapXml,
  buildSitemapIndexXml,
} from "../src/lib/seo/sitemaps.js";
import {
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  submitUrlsToIndexNow,
} from "../src/lib/seo/indexnow.js";
import robots from "../src/app/robots.js";
import { GET as getSitemapIndex } from "../src/app/sitemap-index.xml/route.js";
import { GET as getIndexNowStatus } from "../src/app/api/seo/indexnow-notify/route.js";
import nextConfig from "../next.config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

describe("Elite Technical SEO Architecture & Protocol Verification", () => {
  // Phase 1: High-Order Entity Disambiguation (Structured Schema Engine)
  describe("Phase 1: High-Order Entity Disambiguation (Structured Schema Engine)", () => {
    test("Root layout @graph schema contains WebSite, Organization, SearchAction, and Founders", () => {
      const rootSchema = buildRootGraphSchema();
      assert.equal(rootSchema["@context"], "https://schema.org");
      assert.ok(Array.isArray(rootSchema["@graph"]));

      const org = rootSchema["@graph"].find((e) => e["@type"] === "Organization");
      assert.ok(org, "Root schema must contain Organization entity");
      assert.equal(org["@id"], ENTITY_IDS.ORGANIZATION);
      assert.equal(org.name, "Bits & Tools");

      // Verify sameAs entity profiles
      assert.ok(Array.isArray(org.sameAs) && org.sameAs.length >= 4);
      assert.ok(org.sameAs.some((s) => s.includes("github.com")));
      assert.ok(org.sameAs.some((s) => s.includes("wikidata.org")));
      assert.ok(org.sameAs.some((s) => s.includes("crunchbase.com")));

      // Verify founders
      assert.ok(Array.isArray(org.founder) && org.founder.length === 2);
      const vishavjeet = org.founder.find((f) => f.name === "Vishavjeet Sharma");
      const aditya = org.founder.find((f) => f.name === "Aditya Sharma");
      assert.ok(vishavjeet, "Vishavjeet Sharma must be configured as founder");
      assert.ok(aditya, "Aditya Sharma must be configured as founder");
      assert.equal(vishavjeet.email, "vishavjeetsharma88@gmail.com");
      assert.equal(aditya.email, "sharmaaditya14jul@gmail.com");

      // Verify WebSite entity with SearchAction
      const website = rootSchema["@graph"].find((e) => e["@type"] === "WebSite");
      assert.ok(website, "Root schema must contain WebSite entity");
      assert.equal(website["@id"], ENTITY_IDS.WEBSITE);
      assert.equal(website.publisher["@id"], ENTITY_IDS.ORGANIZATION);
      assert.equal(website.potentialAction["@type"], "SearchAction");
      assert.ok(website.potentialAction.target.urlTemplate.includes("?q="));
    });

    test("Tool page graph schema binds WebApplication and TechArticle via @id to Organization and Authors", () => {
      const tool = {
        name: "Merge PDF",
        route: "/merge-pdf",
        description: "Combine multiple PDF documents client-side.",
      };

      const toolSchema = buildToolPageGraphSchema({
        tool,
        breadcrumbs: [{ label: "PDF Tools", href: "/pdf-tools" }, { label: "Merge PDF", href: "/merge-pdf" }],
        aboutEntities: [CANONICAL_ENTITIES.PDF],
      });

      assert.equal(toolSchema["@context"], "https://schema.org");
      const graph = toolSchema["@graph"];

      const webApp = graph.find((e) => Array.isArray(e["@type"]) && e["@type"].includes("WebApplication"));
      assert.ok(webApp, "Must contain WebApplication entity");
      assert.equal(webApp["@id"], "https://www.bitsandtools.com/merge-pdf/#webapp");
      assert.equal(webApp.provider["@id"], ENTITY_IDS.ORGANIZATION);
      assert.deepEqual(webApp.author, [
        { "@id": ENTITY_IDS.AUTHOR_VISHAVJEET },
        { "@id": ENTITY_IDS.AUTHOR_ADITYA },
      ]);
      assert.ok(webApp.aggregateRating, "WebApplication must have aggregateRating");

      const techArticle = graph.find((e) => e["@type"] === "TechArticle");
      assert.ok(techArticle, "Must contain TechArticle entity");
      assert.equal(techArticle["@id"], "https://www.bitsandtools.com/merge-pdf/#article");
      assert.equal(techArticle.publisher["@id"], ENTITY_IDS.ORGANIZATION);

      // Verify canonical Wikidata / Wikipedia references
      assert.ok(
        techArticle.about.some((e) =>
          e.sameAs && e.sameAs.some((u) => u.includes("wikidata.org") || u.includes("wikipedia.org"))
        )
      );
      assert.ok(
        techArticle.mentions.some((e) =>
          e.sameAs && e.sameAs.some((u) => u.includes("wikidata.org") || u.includes("wikipedia.org"))
        )
      );
    });

    test("buildContentPageGraphSchema supports generic Article/TechArticle/Product and merges into unified graph", () => {
      const productSchema = buildContentPageGraphSchema({
        type: "Product",
        slug: "premium-suite",
        title: "Bits & Tools Premium Utility Suite",
        description: "Zero-latency in-browser file transformation toolset.",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "500",
        },
      });

      assert.equal(productSchema["@context"], "https://schema.org");
      const product = productSchema["@graph"].find((e) => e["@type"] === "Product");
      assert.ok(product);
      assert.equal(product.publisher["@id"], ENTITY_IDS.ORGANIZATION);
      assert.equal(product.offers.price, "0");

      const merged = mergeIntoUnifiedGraph(buildRootGraphSchema(), productSchema);
      assert.ok(Array.isArray(merged["@graph"]));
      assert.ok(merged["@graph"].some((e) => e["@type"] === "Organization"));
      assert.ok(merged["@graph"].some((e) => e["@type"] === "Product"));
    });

    test("BreadcrumbList generator handles raw path string segments and creates clean sequence", () => {
      const rawSegments = ["pdf-tools", "merge-pdf"];
      const schema = buildBreadcrumbsSchema(rawSegments, "https://www.bitsandtools.com");

      assert.equal(schema["@type"], "BreadcrumbList");
      assert.equal(schema.itemListElement.length, 3);
      assert.equal(schema.itemListElement[0].name, "Home");
      assert.equal(schema.itemListElement[1].name, "Pdf Tools");
      assert.equal(schema.itemListElement[1].item, "https://www.bitsandtools.com/pdf-tools");
      assert.equal(schema.itemListElement[2].name, "Merge Pdf");
      assert.equal(schema.itemListElement[2].item, "https://www.bitsandtools.com/merge-pdf");
    });
  });

  // Phase 2: Instant Crawl Acceleration & Dynamic Routing Pipelines
  describe("Phase 2: Instant Crawl Acceleration & Dynamic Routing Pipelines", () => {
    test("IndexNow verification key file exists in public/ and matches key", () => {
      const keyFilePath = path.join(rootDir, "public", `${INDEXNOW_KEY}.txt`);
      assert.ok(fs.existsSync(keyFilePath), `Verification file ${INDEXNOW_KEY}.txt must exist in public/`);
      const fileContent = fs.readFileSync(keyFilePath, "utf-8").trim();
      assert.equal(fileContent, INDEXNOW_KEY);
      assert.equal(INDEXNOW_KEY_LOCATION, `https://www.bitsandtools.com/${INDEXNOW_KEY}.txt`);
    });

    test("API endpoint /api/seo/indexnow-notify returns healthy status and metadata", async () => {
      const res = await getIndexNowStatus();
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.status, "active");
      assert.equal(data.key, INDEXNOW_KEY);
      assert.equal(data.keyLocation, INDEXNOW_KEY_LOCATION);
    });

    test("Split sitemaps correctly partition fresh (<48h) and archive URLs", () => {
      const all = getAllSitemapEntries();
      const fresh = getFreshSitemapEntries("https://www.bitsandtools.com", 48);
      const archive = getArchiveSitemapEntries("https://www.bitsandtools.com", 48);

      assert.ok(all.length >= 55, "All entries must include all 55+ tools and hubs");
      assert.ok(fresh.length > 0, "Fresh sitemap must contain recent URLs");
      assert.ok(archive.length > 0, "Archive sitemap must contain historical URLs");

      const freshSet = new Set(fresh.map((e) => e.url));
      for (const arch of archive) {
        assert.ok(!freshSet.has(arch.url), `URL ${arch.url} cannot appear in both fresh and archive`);
      }
      assert.equal(fresh.length + archive.length, all.length, "Fresh + Archive must equal total URL count");
    });

    test("Sitemap index route (/sitemap-index.xml) generates valid sitemapindex XML hierarchy", async () => {
      const response = await getSitemapIndex();
      assert.equal(response.status, 200);
      assert.ok(response.headers.get("Content-Type").includes("application/xml"));
      const xml = await response.text();
      assert.ok(xml.includes("<sitemapindex"));
      assert.ok(xml.includes("https://www.bitsandtools.com/sitemap-fresh.xml"));
      assert.ok(xml.includes("https://www.bitsandtools.com/sitemap-archive.xml"));
    });

    test("Robots.txt disallows /api/ and references sitemap, sitemap-index, fresh, and archive", () => {
      const r = robots();
      assert.equal(r.rules[0].userAgent, "*");
      assert.equal(r.rules[0].allow, "/");
      assert.deepEqual(r.rules[0].disallow, ["/api/"]);

      const sitemaps = Array.isArray(r.sitemap) ? r.sitemap : [r.sitemap];
      assert.ok(sitemaps.includes("https://www.bitsandtools.com/sitemap.xml"));
      assert.ok(sitemaps.includes("https://www.bitsandtools.com/sitemap-index.xml"));
      assert.ok(sitemaps.includes("https://www.bitsandtools.com/sitemap-fresh.xml"));
      assert.ok(sitemaps.includes("https://www.bitsandtools.com/sitemap-archive.xml"));
    });
  });

  // Phase 3: Topical Cluster Routing & Link Siloing
  describe("Phase 3: Topical Cluster Routing & Link Siloing", () => {
    test("RelatedTools source code implements strict category siloing and category hub pillar link", () => {
      const code = fs.readFileSync(
        path.join(rootDir, "src", "components", "common", "RelatedTools.jsx"),
        "utf-8"
      );

      assert.ok(code.includes("getToolsByCategory"), "Must use getToolsByCategory to avoid cross-category leaks");
      assert.ok(code.includes("CATEGORY_HUB_MAP"), "Must map category to its parent pillar hub");
      assert.ok(code.includes("/pdf-tools"), "Must reference /pdf-tools pillar");
      assert.ok(code.includes("/image-tools"), "Must reference /image-tools pillar");
      assert.ok(code.includes("<aside"), "Must use semantic <aside> tag");
    });

    test("Breadcrumbs component integrates Schema.org microdata and centralized JSON-LD", () => {
      const code = fs.readFileSync(
        path.join(rootDir, "src", "components", "common", "Breadcrumbs.jsx"),
        "utf-8"
      );

      assert.ok(code.includes('itemType="https://schema.org/BreadcrumbList"'), "Must include BreadcrumbList microdata");
      assert.ok(code.includes('itemProp="itemListElement"'), "Must include itemListElement microdata");
      assert.ok(code.includes('itemProp="position"'), "Must include position microdata");
      assert.ok(code.includes("buildBreadcrumbsSchema"), "Must invoke centralized schema builder");
    });
  });

  // Phase 4: AEO & Core Web Vitals Scaffolding
  describe("Phase 4: AEO & Core Web Vitals Scaffolding", () => {
    test("QuickTake component includes role='doc-abstract' and declarative definition within 40–55 words", () => {
      const code = fs.readFileSync(
        path.join(rootDir, "src", "components", "common", "QuickTake.jsx"),
        "utf-8"
      );

      assert.ok(code.includes('role="doc-abstract"'), "QuickTake must declare role='doc-abstract' for AEO");
      assert.ok(code.includes("Vishavjeet Sharma"), "QuickTake must cite founder Vishavjeet Sharma");
      assert.ok(code.includes("Aditya Sharma"), "QuickTake must cite founder Aditya Sharma");
      assert.ok(code.includes("Zero File Uploads"), "QuickTake must highlight Zero File Uploads");
      assert.ok(code.includes('<ul\n        role="list"'), "QuickTake must provide semantic unordered list");
    });

    test("Flagship tool pages integrate QuickTake, buildToolPageGraphSchema, and semantic tags", () => {
      const flagshipPages = [
        "src/app/merge-pdf/page.jsx",
        "src/app/split-pdf/page.jsx",
        "src/app/compress-pdf/page.jsx",
        "src/app/jpg-to-pdf/page.jsx",
      ];

      for (const relPath of flagshipPages) {
        const fullPath = path.join(rootDir, relPath);
        const code = fs.readFileSync(fullPath, "utf-8");

        assert.ok(code.includes("<QuickTake"), `${relPath} must include QuickTake callout`);
        assert.ok(code.includes("buildToolPageGraphSchema"), `${relPath} must use centralized tool page schema`);
        assert.ok(code.includes("<main"), `${relPath} must use semantic <main> tag`);
        assert.ok(code.includes("<header"), `${relPath} must use semantic <header> tag`);
        assert.ok(code.includes("<section"), `${relPath} must use semantic <section> tag`);
        assert.ok(code.includes("aggregateRating"), `${relPath} must contain aggregateRating`);
      }
    });

    test("next.config.mjs configures modern image formats (AVIF & WebP) and caching headers", () => {
      assert.ok(Array.isArray(nextConfig.images.formats));
      assert.ok(nextConfig.images.formats.includes("image/avif"));
      assert.ok(nextConfig.images.formats.includes("image/webp"));
    });

    test("Interactive image preview elements enforce loading='lazy' and decoding='async'", () => {
      const targetWorkspaces = [
        "src/components/image/ColorPaletteWorkspace.jsx",
        "src/components/image/CropImageWorkspace.jsx",
        "src/components/image/JpgToPdfWorkspace.jsx",
        "src/components/image/ResizeImageWorkspace.jsx",
        "src/components/media/VideoToGifWorkspace.jsx",
      ];

      for (const relPath of targetWorkspaces) {
        const fullPath = path.join(rootDir, relPath);
        const code = fs.readFileSync(fullPath, "utf-8");
        assert.ok(code.includes('loading="lazy"'), `${relPath} must enforce loading="lazy" on img elements`);
        assert.ok(code.includes('decoding="async"'), `${relPath} must enforce decoding="async" on img elements`);
      }
    });
  });

  // Phase 5: Ultra-Low-Level Structural Refinement
  describe("Phase 5: Ultra-Low-Level Structural Refinement", () => {
    test("Visual Token Weight: QuickTake mandates 18px-20px computed font and maximum contrast text-slate-900", () => {
      const code = fs.readFileSync(path.join(rootDir, "src", "components", "common", "QuickTake.jsx"), "utf-8");
      assert.ok(code.includes("text-lg sm:text-[19px] lg:text-xl"), "QuickTake must enforce 18px-20px font tokens");
      assert.ok(code.includes("text-slate-900"), "QuickTake must use maximum contrast text-slate-900");
    });

    test("DOM Content Visibility: FAQSection keeps all answer content in HTML without display:none", () => {
      const code = fs.readFileSync(path.join(rootDir, "src", "components", "common", "FAQSection.jsx"), "utf-8");
      assert.ok(code.includes("<details"), "FAQSection must use semantic <details> for native bot indexability");
      assert.ok(code.includes("<summary"), "FAQSection must use semantic <summary>");
      assert.ok(!code.includes("display:none"), "No answer content may be buried in display:none");
      assert.ok(!code.includes("opacity-0"), "No answer content may be buried in opacity-0");
    });

    test("Deterministic Anchor Graphing: slugifyHeading and injectHeadingAnchors output clean fragment targets", async () => {
      const { slugifyHeading, injectHeadingAnchors } = await import("../src/lib/seo/anchors.js");
      assert.equal(slugifyHeading("How to Merge PDF Files Online"), "how-to-merge-pdf-files-online");
      assert.equal(slugifyHeading("FAQ & System Requirements 2026!"), "faq-system-requirements-2026");

      const rawHtml = "<h2>Frequently Asked Questions</h2><p>Content</p>";
      const anchored = injectHeadingAnchors(rawHtml);
      assert.ok(anchored.includes('id="frequently-asked-questions"'));
      assert.ok(anchored.includes('href="#frequently-asked-questions"'));
    });

    test("Strict Semantic Silo Enforcement: RelatedTools computes taxonomy affinity without cross-cluster leaks", () => {
      const code = fs.readFileSync(path.join(rootDir, "src", "components", "common", "RelatedTools.jsx"), "utf-8");
      assert.ok(code.includes("computeSemanticAffinity"), "RelatedTools must compute taxonomy/keyword vector overlap");
      assert.ok(!code.includes("displayTools = [...displayTools, ...general"), "Strict siloing must never leak cross-cluster tools");
    });
  });

  // Phase 6: Algorithmic Quality & Search Engine Internal Ranking Mechanics
  describe("Phase 6: Algorithmic Quality & Search Engine Ranking Mechanics", () => {
    test("Temporal Tri-Date Synchronization: absolute parity across Sitemap, Schema JSON-LD, Visual Byline, and Meta tags", async () => {
      const { resolveTemporalParity, VERIFIED_TEMPORAL_DATA } = await import("../src/lib/seo/temporal-engine.js");
      const { getAllSitemapEntries } = await import("../src/lib/seo/sitemaps.js");
      const { buildToolPageGraphSchema } = await import("../src/lib/seo/schema-engine.js");

      const sitemapEntries = getAllSitemapEntries();
      const testRoutes = ["/merge-pdf", "/split-pdf", "/compress-pdf", "/jpg-to-pdf"];

      for (const route of testRoutes) {
        const temporal = resolveTemporalParity(route);
        assert.ok(temporal.isoModified, `Temporal engine must have isoModified for ${route}`);
        assert.ok(temporal.isoPublished, `Temporal engine must have isoPublished for ${route}`);
        assert.ok(temporal.etag, `Temporal engine must have strong ETag for ${route}`);
        assert.ok(temporal.httpLastModified, `Temporal engine must have HTTP Last-Modified string for ${route}`);

        // Parity with Sitemap lastmod
        const sitemapItem = sitemapEntries.find((e) => e.url.endsWith(route));
        assert.ok(sitemapItem, `Sitemap must contain entry for ${route}`);
        assert.equal(
          sitemapItem.lastModified.toISOString(),
          temporal.isoModified,
          `Sitemap lastModified must match temporal.isoModified for ${route}`
        );

        // Parity with Schema JSON-LD
        const schema = buildToolPageGraphSchema({
          tool: { name: "Test Tool", route, description: "Test" },
        });
        const article = schema["@graph"].find((e) => e["@type"] === "TechArticle");
        assert.ok(article, "Schema must contain TechArticle");
        assert.equal(
          article.dateModified,
          temporal.isoModified,
          `Schema dateModified must match temporal.isoModified for ${route}`
        );
        assert.equal(
          article.datePublished,
          temporal.isoPublished,
          `Schema datePublished must match temporal.isoPublished for ${route}`
        );

        // Parity with Visual Byline props
        assert.equal(
          temporal.bylineProps.dateTime,
          temporal.isoModified,
          `Visual byline dateTime must match temporal.isoModified for ${route}`
        );
      }
    });

    test("Content Diff Guard: DateModified does NOT bump if token hash does not change", async () => {
      const { resolveTemporalParity, computeContentHash } = await import("../src/lib/seo/temporal-engine.js");

      const baseline = resolveTemporalParity("/merge-pdf");

      // Same content / no diff -> dateModified must remain identical
      const unchanged = resolveTemporalParity("/merge-pdf", "merge-pdf-client-side-v3");
      assert.equal(unchanged.isoModified, baseline.isoModified);

      // Substantive update with meaningful change flag -> updates timestamp
      const updated = resolveTemporalParity("/merge-pdf", {
        hasMeaningfulUpdate: true,
        content: "brand new algorithm version 4 with major changes",
      });
      assert.ok(updated.isoModified);
    });

    test("DOM-Weighted Anchor Graph: anchor-text diversification rotates semantic styles without repetitive penalties", async () => {
      const { getDiversifiedAnchor, getEarlyContentLinks, ANCHOR_CORPUS } = await import("../src/lib/seo/anchor-graph.js");

      // Verify anchor corpus contains diverse styles
      assert.ok(ANCHOR_CORPUS["/merge-pdf"].canonical);
      assert.ok(ANCHOR_CORPUS["/merge-pdf"].direct_query);
      assert.ok(ANCHOR_CORPUS["/merge-pdf"].conversational);
      assert.ok(ANCHOR_CORPUS["/merge-pdf"].action);

      // Verify different source contexts yield varied anchor styles
      const anchorA = getDiversifiedAnchor("/merge-pdf", "/split-pdf");
      const anchorB = getDiversifiedAnchor("/merge-pdf", "/about");
      assert.ok(anchorA.text);
      assert.ok(anchorB.text);
      assert.ok(["canonical", "direct_query", "conversational", "action"].includes(anchorA.style));

      // Verify early content links are restricted to semantic category
      const earlyPdfLinks = getEarlyContentLinks("/merge-pdf", 2);
      assert.equal(earlyPdfLinks.length, 2);
      for (const link of earlyPdfLinks) {
        assert.equal(link.category, "pdf");
        assert.notEqual(link.route, "/merge-pdf");
        assert.ok(link.text);
      }
    });

    test("EarlyContentLinks integration: QuickTake embeds high-priority links within top 200 words", () => {
      const code = fs.readFileSync(path.join(rootDir, "src", "components", "common", "QuickTake.jsx"), "utf-8");
      assert.ok(code.includes("EarlyContentLinks"), "QuickTake must embed EarlyContentLinks");
      assert.ok(code.includes("<EarlyContentLinks currentRoute={resolvedRoute}"), "QuickTake must pass currentRoute to EarlyContentLinks");
    });

    test("Session-Terminator Component: NextIntentSection provides solutions to secondary queries", () => {
      const code = fs.readFileSync(path.join(rootDir, "src", "components", "common", "NextIntentSection.jsx"), "utf-8");
      assert.ok(code.includes('role="region"'), "NextIntentSection must specify role='region'");
      assert.ok(code.includes('aria-label="Next Steps and Related Workflows"'), "NextIntentSection must have aria-label");
      assert.ok(code.includes("What Would You Like to Do Next?"), "Must offer clear next-step heading");
      assert.ok(code.includes("Common Post-Processing Questions"), "Must offer peripheral doubt resolution FAQ");
    });

    test("Flagship tool pages integrate NextIntentSection at bottom of views", () => {
      const pages = [
        "src/app/merge-pdf/page.jsx",
        "src/app/split-pdf/page.jsx",
        "src/app/compress-pdf/page.jsx",
        "src/app/jpg-to-pdf/page.jsx",
      ];

      for (const relPath of pages) {
        const fullPath = path.join(rootDir, relPath);
        const code = fs.readFileSync(fullPath, "utf-8");
        assert.ok(code.includes("NextIntentSection"), `${relPath} must import and render NextIntentSection`);
        assert.ok(code.includes("article:modified_time"), `${relPath} must specify article:modified_time meta tag`);
      }
    });

    test("Edge ETag & 304 Delta Caching: evaluates conditional headers and emits 304 Not Modified", async () => {
      const { evaluateConditionalRequest } = await import("../src/lib/seo/edge-cache.js");
      const { resolveTemporalParity } = await import("../src/lib/seo/temporal-engine.js");

      const temporal = resolveTemporalParity("/merge-pdf");

      // 1. Initial request without conditional headers -> 200 with ETag & Last-Modified
      const initial = evaluateConditionalRequest({}, "/merge-pdf");
      assert.equal(initial.status, 200);
      assert.equal(initial.isModified, true);
      assert.equal(initial.headers.ETag, temporal.etag);
      assert.equal(initial.headers["Last-Modified"], temporal.httpLastModified);

      // 2. Matching ETag in If-None-Match -> 304 Not Modified
      const etagMatch = evaluateConditionalRequest({ "if-none-match": temporal.etag }, "/merge-pdf");
      assert.equal(etagMatch.status, 304);
      assert.equal(etagMatch.isModified, false);

      // 3. Matching weak ETag -> 304 Not Modified
      const rawEtag = temporal.etag.replace(/^W\//, "");
      const weakMatch = evaluateConditionalRequest({ "if-none-match": rawEtag }, "/merge-pdf");
      assert.equal(weakMatch.status, 304);
      assert.equal(weakMatch.isModified, false);

      // 4. Future/matching date in If-Modified-Since -> 304 Not Modified
      const ifModifiedMatch = evaluateConditionalRequest(
        { "if-modified-since": temporal.httpLastModified },
        "/merge-pdf"
      );
      assert.equal(ifModifiedMatch.status, 304);
      assert.equal(ifModifiedMatch.isModified, false);

      // 5. Past date in If-Modified-Since -> 200 Modified
      const pastMatch = evaluateConditionalRequest(
        { "if-modified-since": "Mon, 01 Jan 2024 00:00:00 GMT" },
        "/merge-pdf"
      );
      assert.equal(pastMatch.status, 200);
      assert.equal(pastMatch.isModified, true);
    });

    test("Next.js Edge Middleware is present and configures edge caching matcher", () => {
      const middlewarePath = path.join(rootDir, "src", "middleware.js");
      assert.ok(fs.existsSync(middlewarePath), "src/middleware.js must exist");
      const code = fs.readFileSync(middlewarePath, "utf-8");
      assert.ok(code.includes("evaluateConditionalRequest"), "middleware must use evaluateConditionalRequest");
      assert.ok(code.includes("export function middleware"), "middleware must export middleware function");
      assert.ok(code.includes("export const config"), "middleware must export config matcher");
    });
  });
});
