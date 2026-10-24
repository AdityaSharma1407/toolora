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
    assert.equal(entries.length, 11);

    const urls = entries.map((e) => e.url);
    const expectedBase = "https://www.bitsandtools.com";

    assert.ok(urls.includes(expectedBase));
    assert.ok(urls.includes(`${expectedBase}/merge-pdf`));
    assert.ok(urls.includes(`${expectedBase}/split-pdf`));
    assert.ok(urls.includes(`${expectedBase}/compress-pdf`));
    assert.ok(urls.includes(`${expectedBase}/jpg-to-pdf`));
    assert.ok(urls.includes(`${expectedBase}/pdf-tools`));
    assert.ok(urls.includes(`${expectedBase}/image-tools`));
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
