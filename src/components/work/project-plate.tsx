import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ViewTransition } from "react";
import type { Project } from "@/config/projects";
import { ProjectVisual } from "./covers";
import { KindBadge } from "./kind-badge";

/**
 * One project as a plate: cover on top, facts in the footer, the whole surface a link to the
 * case study. The cover shares a view-transition name with the case study's lead image, so it
 * travels there on navigation.
 */
export function ProjectPlate({ project, total }: { project: Project; total: number }) {
  const titleId = `project-${project.slug}`;

  return (
    <article
      aria-labelledby={titleId}
      data-cursor-label={project.cursorLabel}
      className="group relative flex flex-col overflow-hidden rounded-plate bg-ink-2 ring-1 ring-white/10 md:h-[min(82svh,48rem)] md:min-h-[34rem]"
    >
      <div className="relative overflow-hidden max-md:aspect-[4/3] md:min-h-0 md:flex-1">
        <ViewTransition name={`cover-${project.slug}`} share="cover" default="none">
          <div className="absolute inset-0">
            <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.03]">
              <ProjectVisual project={project} />
            </div>
          </div>
        </ViewTransition>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 md:p-6">
          <KindBadge kind={project.kind} />
          <span className="label rounded-full bg-black/45 px-3 py-1.5 text-white/80 tabular-nums backdrop-blur-md">
            {project.index} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-4 border-t border-line p-5 md:grid-cols-12 md:items-end md:p-7 lg:px-9 lg:py-8">
        <div className="md:col-span-6">
          <h3 id={titleId} className="font-serif text-display-m text-fg">
            <Link
              href={`/work/${project.slug}`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              <span className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                {project.title}
              </span>
            </Link>
          </h3>
          <p className="label mt-3 text-fg-subtle">{project.category}</p>
        </div>

        <div className="md:col-span-5">
          <p className="max-w-md text-fg-muted">{project.summary}</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1" aria-label="Технологии">
            {project.stack.map((tech) => (
              <li key={tech} className="font-mono text-xs text-fg-subtle">
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <span
          aria-hidden="true"
          className="hidden size-12 place-items-center justify-self-end rounded-full border border-line-strong text-fg transition-[background-color,border-color,color] duration-500 ease-out-expo group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink md:grid"
        >
          <ArrowUpRight className="size-5 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
        </span>
      </div>

      {/* Visible focus ring for the stretched link */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-plate opacity-0 ring-2 ring-accent transition-opacity ring-inset group-has-[a:focus-visible]:opacity-100"
      />
    </article>
  );
}
