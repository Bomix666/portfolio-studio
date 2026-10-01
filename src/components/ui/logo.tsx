import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Eclipse mark: a lit ring with an offset shadow disc — "umbra". */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("shrink-0", className)}>
      <defs>
        <linearGradient id="logo-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f2a33a" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="none" stroke="url(#logo-rim)" strokeWidth="1.6" />
      <circle cx="19" cy="13.5" r="10.2" fill="currentColor" className="text-ink" />
      <circle cx="16" cy="16" r="13" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="0.6" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-6" />
      <span className="text-lg font-semibold tracking-[-0.02em] text-white">{siteConfig.name}</span>
    </span>
  );
}
