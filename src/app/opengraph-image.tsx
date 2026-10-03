import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Нужно для статической выгрузки (GitHub Pages); на сервере поведение не меняется.
export const dynamic = "force-static";

/**
 * Loads a subset of the display serif (only the glyphs we render, Cyrillic included) at build time.
 * Falls back to the default font if the network is unavailable, so builds never fail on it.
 */
async function loadSerif(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wdth,wght@72,350&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** The OG renderer's built-in font has no Cyrillic, so labels need a Cyrillic sans too. */
async function loadSans(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Geist+Mono&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const headline = "Цифровые впечатления, которые запоминаются.";
  const font = await loadSerif(`${headline}${siteConfig.name}`);
  const labels = "ДИЗАЙН · РАЗРАБОТКА · МОУШН";
  const sans = await loadSans(labels);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(60% 70% at 78% 100%, rgba(242,163,58,0.28), rgba(5,5,5,0) 70%), radial-gradient(50% 60% at 15% 0%, rgba(156,194,255,0.12), rgba(5,5,5,0) 70%), #050505",
          color: "#f4f3ef",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              border: "3px solid #f4f3ef",
              display: "flex",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 36,
                height: 36,
                borderRadius: 999,
                background: "#050505",
                left: 7,
                top: -2,
              }}
            />
          </div>
          <div style={{ fontSize: 34, letterSpacing: -1, fontFamily: font ? "Serif" : undefined }}>{siteConfig.name}</div>
        </div>
        <div
          style={{
            fontSize: 96,
            lineHeight: 0.95,
            letterSpacing: -2,
            maxWidth: 980,
            fontFamily: font ? "Serif" : undefined,
          }}
        >
          {headline}
        </div>
        <div
          style={{ display: "flex", gap: 28, fontSize: 22, color: "#a6a5a0", letterSpacing: 4, fontFamily: sans ? "Sans" : undefined }}
        >
          <span>ДИЗАЙН</span>
          <span>·</span>
          <span>РАЗРАБОТКА</span>
          <span>·</span>
          <span>МОУШН</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        ...(font ? [{ name: "Serif", data: font, style: "normal" as const, weight: 400 as const }] : []),
        ...(sans ? [{ name: "Sans", data: sans, style: "normal" as const, weight: 400 as const }] : []),
      ],
    },
  );
}
