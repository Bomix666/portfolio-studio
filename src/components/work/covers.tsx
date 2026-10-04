import type { CoverId, Project } from "@/config/projects";
import { cn } from "@/lib/utils";

/**
 * Project covers as typographic posters, built in HTML/CSS.
 *
 * No interface mock-ups: until real captures exist, a cover shows only what is true about the
 * project — its name and the work done — set at poster scale. They size with container-query
 * units (cqw) and drop their secondary copy in narrow containers, so nothing shrinks to
 * unreadable micro-text. Set `media` on a project to replace its poster with a real image or
 * video — see ProjectVisual.
 */

/** What was done, as a quiet caption. Hidden in narrow containers. */
function Facts({ items, inline, className }: { items: string[]; inline?: boolean; className?: string }) {
  return (
    <ul
      className={cn(
        "hidden text-[max(0.6875rem,1.05cqw)] leading-tight font-medium tracking-[0.08em] text-white/60 uppercase",
        inline ? "gap-x-[2.2cqw] @md:flex" : "space-y-[0.45cqw] @md:block",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Stage technology: the name under one warm wash of light. */
function GlobalEffectsPoster({ project }: { project: Project }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bg-[radial-gradient(75%_95%_at_72%_-10%,rgb(255_205_140/0.3),transparent_62%)] opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-[radial-gradient(45%_70%_at_12%_-5%,rgb(255_255_255/0.12),transparent_70%)]" />
      <p className="absolute bottom-[4.5cqw] left-[4cqw] font-sans text-[15.5cqw] leading-[0.8] font-semibold tracking-[-0.05em] text-white uppercase transition-transform duration-1000 ease-out-expo group-hover:translate-x-[0.6cqw]">
        {project.title.split(" ").map((word) => (
          <span key={word} className="block">
            {word}
          </span>
        ))}
      </p>
      <Facts items={project.services} className="absolute right-[4cqw] bottom-[5cqw] text-right" />
    </div>
  );
}

/** Streetwear: the wordmark as an outline that fills on hover. */
function Mrak8Poster({ project }: { project: Project }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_40%,#1c1c1c,#050505_75%)]" />
      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-y-[1.5] font-sans text-[25cqw] leading-none font-black tracking-[-0.07em] whitespace-nowrap text-transparent uppercase transition-[color,scale] duration-1000 ease-out-expo select-none [-webkit-text-stroke:0.2cqw_rgb(255_255_255/0.5)] group-hover:scale-x-[1.03] group-hover:text-white/[0.08]">
        {project.title}
      </p>
      {/* One line under the wordmark: a column would run into the outline's lower strokes. */}
      <Facts inline items={project.services} className="absolute bottom-[2.6cqw] left-[4cqw]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.1%22 numOctaves=%222%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
    </div>
  );
}

/** Product concept: the three things the concept is about, as a ruled table at poster scale. */
function BusinessPlatformPoster({ project }: { project: Project }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#06070a]">
      <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:4cqw_4cqw] [mask-image:radial-gradient(80%_80%_at_70%_40%,black,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_82%_15%,rgb(255_255_255/0.09),transparent_70%)]" />
      <ul className="absolute inset-x-[4cqw] bottom-[4.5cqw]">
        {project.focus.map((point, i) => (
          <li
            key={point.title}
            className="border-t border-white/15 py-[1.15cqw] font-serif text-[max(1.3rem,6cqw)] leading-none tracking-[-0.015em] text-white transition-transform duration-1000 ease-out-expo last:border-b group-hover:translate-x-[var(--shift)]"
            style={{ "--shift": `${(i + 1) * 0.5}cqw` } as React.CSSProperties}
          >
            {point.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

const covers: Record<CoverId, (props: { project: Project }) => React.JSX.Element> = {
  "global-effects": GlobalEffectsPoster,
  mrak8: Mrak8Poster,
  "business-platform": BusinessPlatformPoster,
};

/** Real media when provided, otherwise the typographic poster. */
export function ProjectVisual({ project, className }: { project: Project; className?: string }) {
  const Cover = project.cover ? covers[project.cover] : null;
  return (
    <div className={cn("@container absolute inset-0", className)}>
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
        Cover && (
          <div role="img" aria-label={`${project.title} — типографическая обложка`} className="absolute inset-0">
            <Cover project={project} />
          </div>
        )
      )}
    </div>
  );
}
