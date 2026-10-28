import { siteConfig } from "../../config/site.js";

export const INDEXNOW_KEY = "e9b8f72a4d31481b89ef48873426b1c0";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const INDEXNOW_KEY_LOCATION = `${(siteConfig.url || "https://www.bitsandtools.com").replace(/\/$/, "")}/${INDEXNOW_KEY}.txt`;

/**
 * Submits an array of URLs to the IndexNow protocol
 * Immediately pings Bing, Yandex, Seznam, and Naver search engines.
 * 
 * @param {string[]} urls - Array of fully-qualified URLs to submit
 * @returns {Promise<{ success: boolean, status: number, message: string }>}
 */
export async function submitToIndexNow(urls = []) {
  const host = new URL(siteConfig.url || "https://www.bitsandtools.com").hostname;
  const baseUrl = (siteConfig.url || "https://www.bitsandtools.com").replace(/\/$/, "");
  const keyLocation = `${baseUrl}/${INDEXNOW_KEY}.txt`;

  if (!Array.isArray(urls) || urls.length === 0) {
    return {
      success: false,
      status: 400,
      message: "No URLs provided for IndexNow submission",
    };
  }

  // Ensure fully qualified URLs and deduplicate
  const normalizedUrls = [...new Set(urls.map((u) => (u.startsWith("http") ? u : `${baseUrl}${u}`)))];

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList: normalizedUrls,
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    // 200 (OK) or 202 (Accepted) indicates successful submission
    const success = response.status === 200 || response.status === 202;
    return {
      success,
      status: response.status,
      message: success
        ? `Successfully submitted ${normalizedUrls.length} URLs to IndexNow`
        : `IndexNow returned status ${response.status}`,
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: err.message || "Failed to reach IndexNow API",
    };
  }
}

export const submitUrlsToIndexNow = submitToIndexNow;
