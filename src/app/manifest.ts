import type { MetadataRoute } from "next";
import { asset, siteConfig } from "@/config/site";

// Нужно для статической выгрузки (GitHub Pages); на сервере поведение не меняется.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.legalName,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: asset("/"),
    display: "browser",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [{ src: asset("/icon.svg"), sizes: "any", type: "image/svg+xml" }],
  };
}
