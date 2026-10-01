import { projects } from "@/config/projects";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectFeature, type FeatureLayout } from "./project-feature";

const layouts: FeatureLayout[] = ["wide", "left", "right", "cinema"];

export function Work() {
  const clientCount = projects.filter((p) => p.kind === "client").length;
  const conceptCount = projects.length - clientCount;

  return (
    <section id="work" aria-labelledby="work-title" className="section-y relative">
      <div className="container-x">
        <SectionHeader
          id="work-title"
          index="02"
          label="Избранные работы"
          title="Работы, которые хочется *рассматривать.*"
          intro="Клиентские проекты и концепты студии. Концепты подписаны как концепты — нам важнее показать, как мы думаем, чем раздуть список."
          aside={
            <dl className="flex gap-10 font-mono text-xs text-fg-subtle">
              <div>
                <dt className="label">Клиенты</dt>
                <dd className="mt-2 font-serif text-3xl text-fg">{String(clientCount).padStart(2, "0")}</dd>
              </div>
              <div>
                <dt className="label">Концепты</dt>
                <dd className="mt-2 font-serif text-3xl text-fg">{String(conceptCount).padStart(2, "0")}</dd>
              </div>
            </dl>
          }
        />

        <div className="mt-20 space-y-24 md:mt-28 md:space-y-40">
          {projects.map((project, i) => (
            <ProjectFeature key={project.slug} project={project} layout={layouts[i % layouts.length]!} />
          ))}
        </div>
      </div>
    </section>
  );
}
