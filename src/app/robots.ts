import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Нужно для статической выгрузки (GitHub Pages); на сервере поведение не меняется.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
