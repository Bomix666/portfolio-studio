import type { CoverId, Project } from "@/config/projects";
import { cn } from "@/lib/utils";

/**
 * Art-directed project covers, built in HTML/CSS/SVG.
 * They scale with container-query units (cqw), so every composition holds at any size.
 * Replace with real media by setting `media` on the project — see ProjectVisual.
 */

function BrowserFrame({ className, children, url }: { className?: string; children: React.ReactNode; url: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[0.9cqw] border border-white/15 bg-black/70 shadow-[0_3cqw_8cqw_-2cqw_rgb(0_0_0/0.8)] backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center gap-[0.6cqw] border-b border-white/10 px-[1.2cqw] py-[0.9cqw]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-[0.7cqw] rounded-full bg-white/20" />
        ))}
        <span className="mx-auto rounded-full bg-white/[0.06] px-[3cqw] py-[0.25cqw] font-mono text-[0.85cqw] text-white/45">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

function GlobalEffectsCover() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]">
      {/* Stage beams */}
      <div className="absolute inset-0 opacity-90 transition-opacity duration-700 group-hover:opacity-100">
        {[
          { left: "18%", rot: 14, hue: "255 244 225" },
          { left: "38%", rot: 5, hue: "255 255 255" },
          { left: "62%", rot: -6, hue: "242 163 58" },
          { left: "82%", rot: -15, hue: "255 244 225" },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute -top-[10%] h-[120%] w-[18cqw] origin-top blur-[1.2cqw]"
            style={{
              left: b.left,
              transform: `translateX(-50%) rotate(${b.rot}deg)`,
              background: `linear-gradient(180deg, rgb(${b.hue} / 0.55), rgb(${b.hue} / 0.08) 55%, transparent 80%)`,
              clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)",
            }}
          />
        ))}
        <div className="absolute inset-x-0 top-0 h-[8%] bg-[radial-gradient(40%_100%_at_50%_0%,rgb(255_255_255/0.35),transparent)]" />
      </div>
      {/* Floor grid */}
      <div className="absolute inset-x-[-20%] bottom-[-30%] h-[70%] [perspective:40cqw]">
        <div className="h-full w-full [transform:rotateX(62deg)] bg-[linear-gradient(rgb(255_255_255/0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.12)_1px,transparent_1px)] bg-[size:4cqw_4cqw] [mask-image:linear-gradient(to_top,black,transparent)]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgb(255_220_170/0.12),transparent_70%)]" />

      <BrowserFrame
        url="global-effects"
        className="absolute top-1/2 left-1/2 w-[62cqw] -translate-x-1/2 -translate-y-[46%] transition-transform duration-700 ease-out-expo group-hover:-translate-y-[49%]"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_70%_30%,rgb(242_163_58/0.28),transparent_60%),linear-gradient(180deg,#0e0e10,#050505)]" />
          <div className="absolute top-0 right-[22%] h-full w-[16cqw] origin-top rotate-[-12deg] bg-[linear-gradient(180deg,rgb(255_240_220/0.5),transparent_75%)] blur-[0.8cqw] [clip-path:polygon(45%_0,55%_0,100%_100%,0_100%)]" />
          <div className="absolute inset-x-[4%] top-[6%] flex items-center justify-between">
            <span className="font-sans text-[1.1cqw] font-semibold tracking-[0.2em] text-white/90">GLOBAL EFFECTS</span>
            <span className="flex gap-[1.4cqw]">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-[0.4cqw] w-[3cqw] rounded-full bg-white/35" />
              ))}
            </span>
          </div>
          <div className="absolute bottom-[14%] left-[4%]">
            <p className="font-sans text-[4.6cqw] leading-[0.9] font-semibold tracking-[-0.03em] text-white uppercase">
              Global
              <br />
              Effects
            </p>
            <div className="mt-[1.6cqw] flex gap-[0.8cqw]">
              <span className="h-[2.4cqw] w-[9cqw] rounded-full bg-white" />
              <span className="h-[2.4cqw] w-[9cqw] rounded-full border border-white/40" />
            </div>
          </div>
        </div>
      </BrowserFrame>
    </div>
  );
}

function Mrak8Cover() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_40%,#1c1c1c,#050505_75%)]" />
      <p
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-y-[1.45] font-sans text-[20cqw] leading-none font-black tracking-[-0.07em] text-transparent [-webkit-text-stroke:0.18cqw_rgb(255_255_255/0.28)] transition-transform duration-1000 ease-out-expo select-none group-hover:scale-x-[1.03]"
      >
        MRAK8
      </p>
      <p
        aria-hidden="true"
        className="absolute bottom-[13%] left-[5%] font-mono text-[1.1cqw] tracking-[0.3em] text-white/50"
      >
        ДРОП 01 / АРХИВ
      </p>

      {/* Lookbook card */}
      <div className="absolute top-[16%] left-[9%] w-[22cqw] rotate-[-4deg] border border-white/10 bg-[#111] p-[0.8cqw] transition-transform duration-700 ease-out-expo group-hover:rotate-[-6deg]">
        <div className="aspect-[3/4] overflow-hidden bg-[radial-gradient(40%_28%_at_50%_30%,#3a3a3a,transparent),radial-gradient(60%_60%_at_50%_85%,#2a2a2a,#141414)]">
          <div className="mx-auto h-full w-[46%] translate-y-[18%] rounded-t-[40%] bg-linear-to-b from-[#2e2e2e] to-[#1a1a1a]" />
        </div>
        <div className="mt-[0.8cqw] flex justify-between font-mono text-[0.9cqw] text-white/60">
          <span>ХУДИ — ЧЁРНОЕ</span>
          <span>01</span>
        </div>
      </div>

      {/* Phone product page */}
      <div className="absolute top-[8%] right-[10%] w-[21cqw] rounded-[2.2cqw] border border-white/20 bg-black p-[0.7cqw] shadow-[0_3cqw_6cqw_rgb(0_0_0/0.7)] transition-transform duration-700 ease-out-expo group-hover:-translate-y-[1.5%]">
        <div className="overflow-hidden rounded-[1.6cqw] bg-[#0d0d0d]">
          <div className="flex items-center justify-between px-[1.4cqw] py-[1.2cqw]">
            <span className="font-sans text-[1.3cqw] font-black tracking-[-0.04em] text-white">MRAK8</span>
            <span className="h-[0.35cqw] w-[2.4cqw] bg-white/70" />
          </div>
          <div className="relative aspect-[4/5] bg-[linear-gradient(180deg,#1d1d1d,#101010)]">
            <div className="absolute inset-x-[22%] top-[12%] bottom-0 rounded-t-[45%] bg-linear-to-b from-[#3b3b3b] to-[#171717]" />
            <span className="absolute top-[6%] left-[6%] bg-accent px-[0.8cqw] py-[0.3cqw] font-mono text-[0.8cqw] font-medium text-accent-ink">
              NEW
            </span>
          </div>
          <div className="space-y-[0.7cqw] p-[1.4cqw]">
            <span className="block h-[0.8cqw] w-[70%] bg-white/80" />
            <span className="block h-[0.6cqw] w-[30%] bg-white/35" />
            <span className="mt-[1cqw] block rounded-full bg-white py-[0.9cqw] text-center font-mono text-[0.85cqw] font-medium text-black">
              В КОРЗИНУ
            </span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.1%22 numOctaves=%222%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
    </div>
  );
}

function BusinessPlatformCover() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#07090c]">
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_65%_35%,rgb(120_150_210/0.22),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:3cqw_3cqw]" />

      <BrowserFrame
        url="app.platform"
        className="absolute top-[12%] left-[8%] w-[72cqw] transition-transform duration-700 ease-out-expo group-hover:-translate-y-[1%]"
      >
        <div className="grid aspect-[16/9] grid-cols-[14%_1fr] bg-[#0b0d11]">
          <aside className="space-y-[1.2cqw] border-r border-white/[0.07] p-[1.4cqw]">
            <span className="block size-[2cqw] rounded-[0.5cqw] bg-white/85" />
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={cn("block h-[0.6cqw] rounded-full", i === 1 ? "w-full bg-white/60" : "w-3/4 bg-white/20")}
              />
            ))}
          </aside>
          <div className="p-[1.6cqw]">
            <div className="flex items-center justify-between">
              <span className="block h-[1.1cqw] w-[16cqw] rounded-full bg-white/80" />
              <span className="block h-[2cqw] w-[8cqw] rounded-full bg-[#9cc2ff]/80" />
            </div>
            <div className="mt-[1.6cqw] grid grid-cols-3 gap-[1cqw]">
              {[62, 44, 78].map((w, i) => (
                <div key={i} className="rounded-[0.6cqw] border border-white/[0.08] bg-white/[0.03] p-[1cqw]">
                  <span className="block h-[0.5cqw] w-1/2 rounded-full bg-white/30" />
                  <span className="mt-[0.8cqw] block h-[1.4cqw] rounded-full bg-white/75" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-[1cqw] grid grid-cols-[1.6fr_1fr] gap-[1cqw]">
              <div className="rounded-[0.6cqw] border border-white/[0.08] bg-white/[0.02] p-[1cqw]">
                <svg viewBox="0 0 200 70" className="h-auto w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="bp-area" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#9cc2ff" stopOpacity="0.35" />
                      <stop offset="1" stopColor="#9cc2ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 55 C 20 50, 30 30, 50 34 S 80 50, 100 36 S 140 12, 160 18 S 190 8, 200 6 V70 H0Z" fill="url(#bp-area)" />
                  <path d="M0 55 C 20 50, 30 30, 50 34 S 80 50, 100 36 S 140 12, 160 18 S 190 8, 200 6" fill="none" stroke="#9cc2ff" strokeWidth="1.4" />
                  <path d="M0 62 C 30 60, 60 52, 90 54 S 150 44, 200 40" fill="none" stroke="rgb(255 255 255 / 0.3)" strokeWidth="1" strokeDasharray="3 3" />
                </svg>
              </div>
              <div className="space-y-[0.7cqw] rounded-[0.6cqw] border border-white/[0.08] bg-white/[0.02] p-[1cqw]">
                {[90, 70, 82, 55, 64].map((w, i) => (
                  <div key={i} className="flex items-center gap-[0.6cqw]">
                    <span className="size-[0.8cqw] rounded-full bg-white/25" />
                    <span className="block h-[0.5cqw] rounded-full bg-white/35" style={{ width: `${w}%` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-[1cqw] divide-y divide-white/[0.06] rounded-[0.6cqw] border border-white/[0.08]">
              {[
                [38, 18, "#8fe0b0"],
                [30, 24, "#9cc2ff"],
                [44, 14, "#f2a33a"],
                [26, 20, "#9cc2ff"],
              ].map(([a, b, c], i) => (
                <div key={i} className="flex items-center gap-[1.2cqw] px-[1cqw] py-[0.75cqw]">
                  <span className="size-[1.1cqw] rounded-full bg-white/15" />
                  <span className="block h-[0.5cqw] rounded-full bg-white/45" style={{ width: `${a}%` }} />
                  <span className="block h-[0.5cqw] rounded-full bg-white/20" style={{ width: `${b}%` }} />
                  <span className="ml-auto block h-[1.1cqw] w-[4cqw] rounded-full opacity-70" style={{ background: c as string }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </BrowserFrame>

      {/* Component tokens floating off the product */}
      <div className="absolute right-[6%] bottom-[12%] w-[24cqw] space-y-[0.8cqw] rounded-[1cqw] border border-white/15 bg-[#0e1116]/90 p-[1.4cqw] backdrop-blur transition-transform duration-700 ease-out-expo group-hover:translate-x-[-2%]">
        <span className="block font-mono text-[0.9cqw] tracking-[0.2em] text-white/50">КОМПОНЕНТЫ</span>
        <div className="flex gap-[0.6cqw]">
          <span className="h-[2.2cqw] flex-1 rounded-full bg-white" />
          <span className="h-[2.2cqw] flex-1 rounded-full border border-white/40" />
        </div>
        <div className="flex gap-[0.6cqw]">
          {["#9cc2ff", "#ffffff", "#5b6474", "#f2a33a"].map((c) => (
            <span key={c} className="size-[2cqw] rounded-full" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function WebGLCover() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 bg-[radial-gradient(40%_50%_at_50%_50%,rgb(156_194_255/0.16),transparent_70%)]" />
      <div className="absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.14)_1px,transparent_1px)] [background-size:2.2cqw_2.2cqw] [mask-image:radial-gradient(60%_70%_at_50%_50%,black,transparent)]" />
      <svg
        viewBox="-100 -60 200 120"
        className="absolute inset-0 h-full w-full transition-transform duration-[1400ms] ease-out-expo group-hover:rotate-[4deg] group-hover:scale-[1.04]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="orbit-a" x1="0" x2="1">
            <stop offset="0" stopColor="#9cc2ff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#f2a33a" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="core-glow">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.3" stopColor="#f7c77d" stopOpacity="0.9" />
            <stop offset="1" stopColor="#f2a33a" stopOpacity="0" />
          </radialGradient>
          <filter id="soft">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>
        {[
          [70, 16, -18],
          [58, 22, 24],
          [80, 10, 8],
          [46, 30, -48],
        ].map(([rx, ry, rot], i) => (
          <ellipse
            key={i}
            cx="0"
            cy="0"
            rx={rx}
            ry={ry}
            fill="none"
            stroke="url(#orbit-a)"
            strokeWidth={i === 0 ? 0.7 : 0.35}
            transform={`rotate(${rot})`}
            filter={i === 0 ? "url(#soft)" : undefined}
          />
        ))}
        <circle r="18" fill="url(#core-glow)" opacity="0.55" />
        <g transform="rotate(-18)">
          <rect x="-13" y="-9" width="26" height="18" rx="1.2" fill="rgb(255 255 255 / 0.04)" stroke="rgb(255 255 255 / 0.35)" strokeWidth="0.3" transform="skewX(-12) translate(-3 -3)" />
          <rect x="-13" y="-9" width="26" height="18" rx="1.2" fill="rgb(255 255 255 / 0.05)" stroke="rgb(255 255 255 / 0.5)" strokeWidth="0.3" transform="skewX(-12)" />
          <rect x="-13" y="-9" width="26" height="18" rx="1.2" fill="rgb(255 255 255 / 0.06)" stroke="rgb(255 255 255 / 0.7)" strokeWidth="0.3" transform="skewX(-12) translate(3 3)" />
          <rect x="-2" y="5" width="9" height="3" rx="1.5" fill="#f2a33a" transform="skewX(-12) translate(3 3)" />
        </g>
      </svg>
      <p className="absolute bottom-[13%] left-[4%] font-mono text-[1cqw] tracking-[0.3em] text-white/45">
        REAL-TIME · WEBGL · ЦЕЛЬ 60 FPS
      </p>
    </div>
  );
}

const covers: Record<CoverId, () => React.JSX.Element> = {
  "global-effects": GlobalEffectsCover,
  mrak8: Mrak8Cover,
  "business-platform": BusinessPlatformCover,
  webgl: WebGLCover,
};

/** Real media when provided, otherwise the generated cover. */
export function ProjectVisual({ project, className }: { project: Project; className?: string }) {
  const Cover = covers[project.cover];
  return (
    <div className={cn("absolute inset-0 [container-type:inline-size]", className)}>
      {project.media?.type === "video" ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={project.media.src}
          poster={project.media.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-label={project.media.alt}
        />
      ) : project.media?.type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={project.media.src}
          alt={project.media.alt}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div role="img" aria-label={`${project.title} — иллюстративная обложка`} className="absolute inset-0">
          <Cover />
        </div>
      )}
    </div>
  );
}
