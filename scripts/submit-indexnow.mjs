#!/usr/bin/env node

/**
 * Automated IndexNow ping script.
 * Can be run post-build or in CI/CD pipelines to instantly notify search engines.
 */

const INDEXNOW_KEY = "e9b8f72a4d31481b89ef48873426b1c0";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const HOST = "www.bitsandtools.com";
const BASE_URL = `https://${HOST}`;

const urlsToPing = [
  `${BASE_URL}/`,
  `${BASE_URL}/about`,
  `${BASE_URL}/pdf-tools`,
  `${BASE_URL}/image-tools`,
  `${BASE_URL}/convert-tools`,
  `${BASE_URL}/media-tools`,
  `${BASE_URL}/utility-tools`,
  `${BASE_URL}/merge-pdf`,
  `${BASE_URL}/split-pdf`,
  `${BASE_URL}/compress-pdf`,
  `${BASE_URL}/markdown-editor`,
  `${BASE_URL}/regex-tester`,
  `${BASE_URL}/json-formatter`,
  `${BASE_URL}/crop-image`,
  `${BASE_URL}/resize-image`,
];

async function run() {
  console.log(`[IndexNow] Submitting ${urlsToPing.length} URLs to ${ENDPOINT}...`);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urlsToPing,
      }),
    });

    console.log(`[IndexNow] Result: HTTP ${res.status} ${res.statusText}`);
  } catch (err) {
    console.warn(`[IndexNow] Network submission failed (expected in offline/mock environment):`, err.message);
  }
}

run();
