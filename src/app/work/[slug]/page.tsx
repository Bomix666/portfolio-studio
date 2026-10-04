import type { Metadata } from "next";
import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CtaLink } from "@/components/ui/button";
import { Reveal, RevealText } from "@/components/ui/reveal";
import { SmartLink } from "@/components/ui/smart-link";
import { ProjectVisual } from "@/components/work/covers";
import { KindBadge } from "@/components/work/kind-badge";
import { getProject, kindLabel, projects, type ProjectKind } from "@/config/projects";
import { siteConfig } from "@/config/site";

export const dynamicParams = false;

const kindNote: Record<ProjectKind, string> = {
  client:
    "Полный кейс — процесс, ключевые решения и результаты — покажем по запросу. С удовольствием проведём вас по нему на созвоне.",
  concept:
    "Это собственный концепт студии, а не клиентский проект. Мы делаем концепты, чтобы проверять идеи до того, как они понадобятся клиентам.",
  example:
    "Проект показан как пример работы. Подробный кейс и статус публикации уточняются.",
};

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.title} — ${project.category}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: `${title} · ${siteConfig.name}`, description: project.summary, url: `/work/${project.slug}` },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length]!;

  return (
    <article className="pt-32 md:pt-40" aria-labelledby="case-title">
      <div className="container-x">
        <Reveal>
          <SmartLink
            href="/#work"
            className="group label inline-flex items-center gap-2 text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5 transition-transform group-hover:-translate-x-1" />
            Все работы
          </SmartLink>
        </Reveal>

        <div className="mt-10 md:mt-14">
          <RevealText as="h1" id="case-title" text={project.title} className="font-serif text-display-xl text-fg" />
          <Reveal variant="blur" delay={0.2} className="mt-8 grid gap-6 md:mt-10 md:grid-cols-12">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:col-span-5 md:self-start">
              <KindBadge kind={project.kind} />
              <p className="label text-fg-subtle">{project.category}</p>
            </div>
            <p className="max-w-2xl text-body-l text-fg-muted md:col-span-6 md:col-start-7">{project.summary}</p>
          </Reveal>
        </div>
      </div>

      {/* Shares its name with the plate on the home page: the cover travels here on navigation. */}
      <div className="container-x mt-14 md:mt-20">
        <ViewTransition name={`cover-${project.slug}`} share="cover" default="none">
          <div className="relative aspect-[4/3] overflow-hidden rounded-plate bg-ink-2 ring-1 ring-white/10 md:aspect-[16/8]">
            <ProjectVisual project={project} />
          </div>
        </ViewTransition>
      </div>

      <div className="container-x section-y grid gap-14 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-7">
          <Reveal>
            <p className="font-serif text-display-s text-fg">{project.overview}</p>
          </Reveal>

          <div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-6">
            {project.focus.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="border-t border-line-strong pt-5">
                  <h2 className="font-serif text-2xl text-fg">{f.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.15} className="md:col-span-4 md:col-start-9">
          <dl className="divide-y divide-line border-y border-line">
            <div className="grid grid-cols-3 gap-4 py-5">
              <dt className="label text-fg-subtle">Тип</dt>
              <dd className="col-span-2 text-fg">{kindLabel[project.kind]}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-5">
              <dt className="label text-fg-subtle">Задачи</dt>
              <dd className="col-span-2">
                <ul className="space-y-1 text-fg">
                  {project.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-5">
              <dt className="label text-fg-subtle">Стек</dt>
              <dd className="col-span-2 flex flex-wrap gap-x-4 gap-y-1">
                {project.stack.map((s) => (
                  <span key={s} className="font-mono text-xs text-fg-muted">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <div className="mt-10 rounded-plate bg-ink-2 p-6 ring-1 ring-white/10">
            <p className="text-sm leading-relaxed text-fg-muted">{kindNote[project.kind]}</p>
            <div className="mt-6">
              <CtaLink href="/#contact">Обсудить проект</CtaLink>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="border-t border-line">
        <Link
          href={`/work/${next.slug}`}
          data-cursor-label="ДАЛЕЕ"
          className="group container-x flex flex-col gap-6 py-16 md:flex-row md:items-end md:justify-between md:py-24"
        >
          <div>
            <p className="label text-fg-subtle">Следующий проект</p>
            <p className="mt-4 font-serif text-display-l text-fg transition-transform duration-700 ease-out-expo group-hover:translate-x-3">
              {next.title}
            </p>
          </div>
          <span className="grid size-16 shrink-0 place-items-center rounded-full border border-line-strong text-fg transition-[background-color,border-color,color] duration-500 ease-out-expo group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
            <ArrowUpRight aria-hidden="true" className="size-6 transition-transform duration-500 group-hover:rotate-45" />
          </span>
        </Link>
      </div>
    </article>
  );
}
