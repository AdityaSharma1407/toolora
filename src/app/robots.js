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
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-fresh.xml`,
      `${baseUrl}/sitemap-archive.xml`,
    ],
  };
}
