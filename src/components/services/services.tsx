import { services } from "@/config/content";
import { SectionHeader } from "@/components/ui/section-header";
import { ServiceRow } from "./service-row";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y relative">
      <div className="container-x">
        <SectionHeader
          id="services-title"
          title="Всё, что нужно цифровому продукту, — *в одной команде.*"
          intro="Стратегия, дизайн, разработка и поддержка от одной команды. Выберите точку входа — остальное соберём вместе."
        />

        <ul className="mt-16 border-b border-line-strong md:mt-24">
          {services.map((service, i) => (
            <ServiceRow key={service.index} service={service} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
