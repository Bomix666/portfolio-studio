import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Serif_Display } from "next/font/google";
import { Cursor } from "@/components/cursor/cursor";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers/providers";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin", "cyrillic"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "cyrillic"], display: "swap" });
// Display serif with Cyrillic. Narrowed via the `wdth` axis (see .font-serif in globals.css) to keep
// the condensed, editorial feel of the original Instrument Serif, which has no Cyrillic glyphs.
const displaySerif = Noto_Serif_Display({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s — ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.legalName,
  url: siteConfig.url,
  description: siteConfig.description,
  email: siteConfig.contact.email,
  sameAs: [siteConfig.socials.instagram.href, siteConfig.socials.telegram.href],
  knowsAbout: ["Веб-разработка", "UI/UX-дизайн", "Интернет-магазины", "WebGL", "Three.js", "Next.js"],
  inLanguage: "ru",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geist.variable} ${geistMono.variable} ${displaySerif.variable}`}>
      <body className="min-h-screen bg-ink text-fg">
        <noscript>
          <style>{`[data-reveal],[data-motion-reveal],.rw>span{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="label fixed top-4 left-4 z-[80] -translate-y-24 rounded-full bg-fg px-4 py-3 text-ink transition-transform focus-visible:translate-y-0"
        >
          Перейти к содержимому
        </a>
        <Providers>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
          <Cursor />
          <RevealObserver />
        </Providers>
        <div className="grain" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
