import { siteConfig } from "../config/site.js";

export default function robots() {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/offline"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
