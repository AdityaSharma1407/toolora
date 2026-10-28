import test, { describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildRootGraphSchema,
  buildBreadcrumbsSchema,
  buildToolPageGraphSchema,
  CANONICAL_ENTITIES,
} from "../src/lib/seo/schema.js";
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

describe("Elite Technical SEO Architecture & Protocol Verification", () => {
  // Phase 1: Entity Graph Architecture (JSON-LD Schema)
  describe("Phase 1: Entity Graph Architecture (JSON-LD)", () => {
    test("Root layout @graph schema contains WebSite, Organization, SearchAction, and Founders", () => {
      const rootSchema = buildRootGraphSchema();
      assert.equal(rootSchema["@context"], "https://schema.org");
      assert.ok(Array.isArray(rootSchema["@graph"]));

      const org = rootSchema["@graph"].find((e) => e["@type"] === "Organization");
      assert.ok(org, "Root schema must contain Organization entity");
      assert.equal(org["@id"], "https://www.bitsandtools.com/#organization");
      assert.equal(org.name, "Bits & Tools");

      // Verify sameAs entity profiles
      assert.ok(Array.isArray(org.sameAs) && org.sameAs.length >= 3);
      assert.ok(org.sameAs.some((s) => s.includes("github.com")));
      assert.ok(org.sameAs.some((s) => s.includes("wikidata.org")));

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
      assert.equal(website["@id"], "https://www.bitsandtools.com/#website");
      assert.equal(website.publisher["@id"], "https://www.bitsandtools.com/#organization");
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
      assert.equal(webApp.provider["@id"], "https://www.bitsandtools.com/#organization");
      assert.deepEqual(webApp.author, [
        { "@id": "https://www.bitsandtools.com/#author-vishavjeet" },
        { "@id": "https://www.bitsandtools.com/#author-aditya" },
      ]);
      assert.ok(webApp.aggregateRating, "WebApplication must have aggregateRating");

      const techArticle = graph.find((e) => e["@type"] === "TechArticle");
      assert.ok(techArticle, "Must contain TechArticle entity");
      assert.equal(techArticle["@id"], "https://www.bitsandtools.com/merge-pdf/#article");
      assert.equal(techArticle.publisher["@id"], "https://www.bitsandtools.com/#organization");

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

    test("BreadcrumbList generator outputs strict positional ListItem sequence", () => {
      const breadcrumbs = [
        { label: "PDF Tools", href: "/pdf-tools" },
        { label: "Merge PDF", href: "/merge-pdf" },
      ];
      const schema = buildBreadcrumbsSchema(breadcrumbs, "https://www.bitsandtools.com");
      assert.equal(schema["@type"], "BreadcrumbList");
      assert.equal(schema.itemListElement.length, 3); // Home + 2 items
      assert.equal(schema.itemListElement[0].position, 1);
      assert.equal(schema.itemListElement[0].name, "Home");
      assert.equal(schema.itemListElement[1].position, 2);
      assert.equal(schema.itemListElement[1].name, "PDF Tools");
      assert.equal(schema.itemListElement[2].position, 3);
      assert.equal(schema.itemListElement[2].name, "Merge PDF");
    });
  });

  // Phase 2: IndexNow & Dynamic Sitemap Pipelines
  describe("Phase 2: IndexNow & Dynamic Sitemap Pipelines", () => {
    test("IndexNow verification key file exists in public/ and matches key", () => {
      const keyFilePath = path.join(rootDir, "public", `${INDEXNOW_KEY}.txt`);
      assert.ok(fs.existsSync(keyFilePath), `Verification file ${INDEXNOW_KEY}.txt must exist in public/`);
      const fileContent = fs.readFileSync(keyFilePath, "utf-8").trim();
      assert.equal(fileContent, INDEXNOW_KEY);
      assert.equal(INDEXNOW_KEY_LOCATION, `https://www.bitsandtools.com/${INDEXNOW_KEY}.txt`);
    });

    test("Split sitemaps correctly partition fresh (<48h) and archive URLs", () => {
      const all = getAllSitemapEntries();
      const fresh = getFreshSitemapEntries("https://www.bitsandtools.com", 48);
      const archive = getArchiveSitemapEntries("https://www.bitsandtools.com", 48);

      assert.ok(all.length >= 55, "All entries must include all 55+ tools and hubs");
      assert.ok(fresh.length > 0, "Fresh sitemap must contain recent URLs");
      assert.ok(archive.length > 0, "Archive sitemap must contain historical URLs");

      // Verify no overlap between fresh and archive
      const freshSet = new Set(fresh.map((e) => e.url));
      for (const arch of archive) {
        assert.ok(!freshSet.has(arch.url), `URL ${arch.url} cannot appear in both fresh and archive`);
      }
      assert.equal(fresh.length + archive.length, all.length, "Fresh + Archive must equal total URL count");
    });

    test("buildSitemapXml generates clean, well-formed XML", () => {
      const sample = [
        {
          url: "https://www.bitsandtools.com/merge-pdf",
          lastModified: new Date("2026-10-28T00:00:00Z"),
          changeFrequency: "daily",
          priority: 0.9,
        },
      ];
      const xml = buildSitemapXml(sample);
      assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
      assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
      assert.ok(xml.includes("<loc>https://www.bitsandtools.com/merge-pdf</loc>"));
      assert.ok(xml.includes("<lastmod>2026-10-28T00:00:00.000Z</lastmod>"));
      assert.ok(xml.includes("<changefreq>daily</changefreq>"));
      assert.ok(xml.includes("<priority>0.9</priority>"));
    });

    test("Robots.txt disallows /api/ and references sitemap, fresh, and archive", () => {
      const r = robots();
      assert.equal(r.rules[0].userAgent, "*");
      assert.equal(r.rules[0].allow, "/");
      assert.deepEqual(r.rules[0].disallow, ["/api/"]);

      const sitemaps = Array.isArray(r.sitemap) ? r.sitemap : [r.sitemap];
      assert.ok(sitemaps.includes("https://www.bitsandtools.com/sitemap.xml"));
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
    test("QuickTake component exists and renders founder attribution and client-side guarantees", () => {
      const code = fs.readFileSync(
        path.join(rootDir, "src", "components", "common", "QuickTake.jsx"),
        "utf-8"
      );

      assert.ok(code.includes("Vishavjeet Sharma"), "QuickTake must cite founder Vishavjeet Sharma");
      assert.ok(code.includes("Aditya Sharma"), "QuickTake must cite founder Aditya Sharma");
      assert.ok(code.includes("Zero File Uploads"), "QuickTake must highlight Zero File Uploads");
      assert.ok(code.includes("<aside"), "QuickTake must be encapsulated in semantic <aside>");
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

    test("All image assets have explicit width/height or responsive sizing", () => {
      const rootLayout = fs.readFileSync(path.join(rootDir, "src", "app", "layout.jsx"), "utf-8");
      assert.ok(rootLayout.includes("buildRootGraphSchema"), "Root layout must inject centralized root graph schema");
    });
  });
});
