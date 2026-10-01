import { SectionHeader } from "@/components/ui/section-header";
import { SpecimenLazy } from "./specimen-lazy";

export function Showcase() {
  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="section-y relative">
      <div className="container-x">
        <SectionHeader
          id="capabilities-title"
          index="03"
          label="Возможности"
          title="Дизайн и разработка — *в одной комнате.*"
          intro="Мы не перебрасываем макеты через стену. Одна команда проектирует опыт и пишет код — поэтому в продакшн уходит ровно то, что вы утвердили. Изучите живой образец ниже."
        />
        <div className="mt-16 md:mt-24">
          <SpecimenLazy />
        </div>
      </div>
    </section>
  );
}
