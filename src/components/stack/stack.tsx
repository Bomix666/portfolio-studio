import { SectionHeader } from "@/components/ui/section-header";
import { StackDiagram } from "./stack-diagram";

export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="section-y relative">
      <div className="container-x">
        <SectionHeader
          id="stack-title"
          title="Выбираем под задачу, *а не под тренд.*"
          intro="Намеренно компактный проверенный стек — от интерфейса до инфраструктуры. Выберите любой элемент, чтобы увидеть, где он работает и с чем связан."
        />
        <div className="mt-16 md:mt-24">
          <StackDiagram />
        </div>
      </div>
    </section>
  );
}
