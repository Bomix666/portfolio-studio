import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/config/projects";
import { cn } from "@/lib/utils";
import { ProjectVisual } from "./covers";
import { KindBadge } from "./kind-badge";
import { MediaFrame } from "./media-frame";

export type FeatureLayout = "wide" | "left" | "right" | "cinema";

const frame: Record<FeatureLayout, string> = {
  wide: "md:col-span-12 aspect-[4/3] md:aspect-[16/8]",
  left: "md:col-span-8 aspect-[4/3]",
  right: "md:col-span-8 md:col-start-5 aspect-[4/3]",
  cinema: "md:col-span-12 aspect-[4/3] md:aspect-[21/9]",
};

const meta: Record<FeatureLayout, string> = {
  wide: "md:col-span-12 md:grid md:grid-cols-12 md:gap-6",
  left: "md:col-span-4 md:self-end",
  right: "md:col-span-4 md:col-start-1 md:row-start-1 md:self-end",
  cinema: "md:col-span-12 md:grid md:grid-cols-12 md:gap-6",
};

export function ProjectFeature({ project, layout }: { project: Project; layout: FeatureLayout }) {
  const titleId = `project-${project.slug}`;
  const spread = layout === "wide" || layout === "cinema";

  return (
    <article
      aria-labelledby={titleId}
      data-cursor-label={project.cursorLabel}
      className="group relative grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-6"
    >
      <MediaFrame
        className={frame[layout]}
        overlay={
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-6">
            <KindBadge kind={project.kind} />
            <span className="grid size-11 translate-y-2 place-items-center rounded-full bg-fg text-ink opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <ArrowUpRight aria-hidden="true" className="size-5" />
            </span>
          </div>
        }
      >
        <ProjectVisual project={project} />
      </MediaFrame>

      <div className={cn(meta[layout])}>
        <div className={cn("flex items-baseline gap-4", spread && "md:col-span-2")}>
          <span className="label text-accent">{project.index}</span>
          <span className="label text-fg-subtle md:hidden">{project.category}</span>
        </div>

        <div className={cn(spread ? "md:col-span-5" : "mt-3")}>
          <h3 id={titleId} className="font-serif text-display-s text-fg md:text-[clamp(2rem,1.2rem+2vw,3.25rem)] md:leading-none">
            <Link
              href={`/work/${project.slug}`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              <span className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                {project.title}
              </span>
            </Link>
          </h3>
          <p className="label mt-3 hidden text-fg-subtle md:block">{project.category}</p>
        </div>

        <div className={cn(spread ? "md:col-span-5" : "mt-5")}>
          <p className="max-w-md text-fg-muted">{project.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1" aria-label="Технологии">
            {project.stack.map((tech) => (
              <li key={tech} className="font-mono text-xs text-fg-subtle">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Visible focus ring for the stretched link */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 rounded-sm ring-2 ring-accent opacity-0 transition-opacity group-has-[a:focus-visible]:opacity-100"
      />
    </article>
  );
}
