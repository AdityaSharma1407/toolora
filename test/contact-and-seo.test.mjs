import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { siteConfig } from "../src/config/site.js";
import sitemap from "../src/app/sitemap.js";
import robots from "../src/app/robots.js";

describe("Contact Email, Monetization & Technical SEO Verification", () => {
  test("5. Contact Page and Form use personal email sharmaaditya14jul@gmail.com", () => {
    assert.equal(siteConfig.contactEmail, "sharmaaditya14jul@gmail.com");
    assert.ok(!siteConfig.contactEmail.includes("bitsandtools.com"));
    assert.ok(siteConfig.contactEmail.includes("@gmail.com"));
  });

  test("6. Sitemap.xml produces clean canonical URLs without duplicates or broken pages", () => {
    const entries = sitemap();
    assert.ok(Array.isArray(entries));
    assert.equal(entries.length, 64);

    const urls = entries.map((e) => e.url);
    const expectedBase = "https://www.bitsandtools.com";

    assert.ok(urls.includes(expectedBase));
    // PDF Tools
    assert.ok(urls.includes(`${expectedBase}/merge-pdf`));
    assert.ok(urls.includes(`${expectedBase}/split-pdf`));
    assert.ok(urls.includes(`${expectedBase}/compress-pdf`));
    assert.ok(urls.includes(`${expectedBase}/jpg-to-pdf`));
    assert.ok(urls.includes(`${expectedBase}/pdf-to-jpg`));
    assert.ok(urls.includes(`${expectedBase}/rotate-pdf`));
    assert.ok(urls.includes(`${expectedBase}/delete-pdf-pages`));
    assert.ok(urls.includes(`${expectedBase}/reorder-pdf-pages`));
    assert.ok(urls.includes(`${expectedBase}/add-page-numbers`));
    assert.ok(urls.includes(`${expectedBase}/watermark-pdf`));
    assert.ok(urls.includes(`${expectedBase}/protect-pdf`));
    assert.ok(urls.includes(`${expectedBase}/unlock-pdf`));

    // Quick Wins & Developer Utilities
    assert.ok(urls.includes(`${expectedBase}/word-counter`));
    assert.ok(urls.includes(`${expectedBase}/case-converter`));
    assert.ok(urls.includes(`${expectedBase}/json-formatter`));
    assert.ok(urls.includes(`${expectedBase}/base64-encoder-decoder`));
    assert.ok(urls.includes(`${expectedBase}/url-encoder-decoder`));
    assert.ok(urls.includes(`${expectedBase}/percentage-calculator`));
    assert.ok(urls.includes(`${expectedBase}/age-calculator`));
    assert.ok(urls.includes(`${expectedBase}/uuid-generator`));
    assert.ok(urls.includes(`${expectedBase}/hash-generator`));
    assert.ok(urls.includes(`${expectedBase}/text-diff`));
    assert.ok(urls.includes(`${expectedBase}/slug-generator`));
    assert.ok(urls.includes(`${expectedBase}/qr-code-generator`));
    assert.ok(urls.includes(`${expectedBase}/json-to-csv`));
    assert.ok(urls.includes(`${expectedBase}/list-tools`));
    assert.ok(urls.includes(`${expectedBase}/jwt-decoder`));
    assert.ok(urls.includes(`${expectedBase}/timestamp-converter`));
    assert.ok(urls.includes(`${expectedBase}/password-generator`));
    assert.ok(urls.includes(`${expectedBase}/markdown-editor`));
    assert.ok(urls.includes(`${expectedBase}/regex-tester`));
    assert.ok(urls.includes(`${expectedBase}/cron-generator`));
    assert.ok(urls.includes(`${expectedBase}/curl-converter`));
    assert.ok(urls.includes(`${expectedBase}/code-minifier`));

    // Image Tools
    assert.ok(urls.includes(`${expectedBase}/resize-image`));
    assert.ok(urls.includes(`${expectedBase}/compress-image`));
    assert.ok(urls.includes(`${expectedBase}/image-converter`));
    assert.ok(urls.includes(`${expectedBase}/jpg-to-png`));
    assert.ok(urls.includes(`${expectedBase}/png-to-jpg`));
    assert.ok(urls.includes(`${expectedBase}/webp-converter`));
    assert.ok(urls.includes(`${expectedBase}/color-palette-extractor`));
    assert.ok(urls.includes(`${expectedBase}/svg-to-png`));
    assert.ok(urls.includes(`${expectedBase}/crop-image`));

    // File Conversion Tools
    assert.ok(urls.includes(`${expectedBase}/html-to-pdf`));
    assert.ok(urls.includes(`${expectedBase}/excel-to-pdf`));
    assert.ok(urls.includes(`${expectedBase}/word-to-pdf`));
    assert.ok(urls.includes(`${expectedBase}/pdf-to-word`));
    assert.ok(urls.includes(`${expectedBase}/pdf-to-excel`));
    assert.ok(urls.includes(`${expectedBase}/powerpoint-to-pdf`));

    // Video & Audio Tools
    assert.ok(urls.includes(`${expectedBase}/extract-audio`));
    assert.ok(urls.includes(`${expectedBase}/mp3-converter`));
    assert.ok(urls.includes(`${expectedBase}/video-to-gif`));
    assert.ok(urls.includes(`${expectedBase}/trim-video`));
    assert.ok(urls.includes(`${expectedBase}/compress-video`));
    assert.ok(urls.includes(`${expectedBase}/media-tools`));

    // Directory Hubs
    assert.ok(urls.includes(`${expectedBase}/convert-tools`));
    assert.ok(urls.includes(`${expectedBase}/pdf-tools`));
    assert.ok(urls.includes(`${expectedBase}/image-tools`));
    assert.ok(urls.includes(`${expectedBase}/utility-tools`));

    // Static Pages
    assert.ok(urls.includes(`${expectedBase}/about`));
    assert.ok(urls.includes(`${expectedBase}/contact`));
    assert.ok(urls.includes(`${expectedBase}/privacy-policy`));
    assert.ok(urls.includes(`${expectedBase}/terms`));

    // No trailing slashes or duplicate entries
    const set = new Set(urls);
    assert.equal(set.size, urls.length);
  });

  test("6. Robots.txt points to correct canonical sitemap", () => {
    const robotsObj = robots();
    assert.equal(robotsObj.rules[0].userAgent, "*");
    assert.equal(robotsObj.rules[0].allow, "/");
    assert.equal(
      robotsObj.sitemap,
      "https://www.bitsandtools.com/sitemap.xml"
    );
  });

  test("7. NEXT_PUBLIC_ADS_ENABLED remains strictly false", () => {
    assert.equal(siteConfig.monetization.enabled, false);
    assert.equal(siteConfig.ads.enabled, false);
    assert.equal(process.env.NEXT_PUBLIC_ADS_ENABLED, undefined);
  });
});
