import { siteConfig } from "../config/site.js";

export default function robots() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: [
          "GPTBot",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-Web",
          "Google-Extended",
          "OAI-SearchBot",
          "Amazonbot",
        ],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-index.xml`,
      `${baseUrl}/sitemap-fresh.xml`,
      `${baseUrl}/sitemap-archive.xml`,
    ],
    host: baseUrl,
  };
}
