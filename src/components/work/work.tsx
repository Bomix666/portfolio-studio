import { projects } from "@/config/projects";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectPlate } from "./project-plate";
import { ProjectStack } from "./project-stack";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative pt-[clamp(6rem,12vw,11rem)] pb-10 md:pb-16">
      <div className="container-x">
        <SectionHeader
          id="work-title"
          title="Работы, которые хочется *рассматривать.*"
          intro="Проекты и концепты студии. Каждый подписан тем, чем он является, — нам важнее показать, как мы думаем, чем раздуть список."
        />

        <div className="mt-12 md:mt-16">
          <ProjectStack>
            {projects.map((project) => (
              <ProjectPlate key={project.slug} project={project} total={projects.length} />
            ))}
          </ProjectStack>
        </div>
      </div>
    </section>
  );
}
