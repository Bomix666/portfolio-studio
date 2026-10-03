import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy.
 *
 * Pages are statically generated for performance, so a per-request nonce isn't possible
 * without forcing dynamic rendering. We therefore allow 'unsafe-inline' for Next's inline
 * bootstrap scripts, and lock everything else to our own origin. For a nonce-based strict
 * CSP, see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  ...(isDev
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

/**
 * GitHub Pages / любой статический хостинг: `npm run build:pages` задаёт NEXT_PUBLIC_STATIC_EXPORT.
 * Заголовки (CSP и т. д.) на статике недоступны — их нужно задавать на уровне хостинга/CDN;
 * серверный API формы в этой сборке исключается (см. scripts/build-pages.mjs).
 */
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  ...(isStaticExport
    ? {
        output: "export",
        // /privacy/ → privacy/index.html: так GitHub Pages отдаёт страницы без расширения.
        trailingSlash: true,
        ...(basePath ? { basePath } : {}),
      }
    : {
        async headers() {
          return [
            { source: "/:path*", headers: securityHeaders },
            {
              // Hero film encodes: long-lived cache. Rename the file when replacing it.
              source: "/media/:file*",
              headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
            },
          ];
        },
      }),
};

export default nextConfig;
