import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import type { services } from "@/config/content";
import { PrefillLink } from "@/components/contact/prefill-link";

type Service = (typeof services)[number];

/**
 * Typographic service row. Hover/focus: a light wash rises, the title slides, an accent
 * hairline draws across, and a "discuss" affordance appears. The whole row is a link that
 * jumps to the contact form with the matching project type pre-selected.
 */
export function ServiceRow({ service, i }: { service: Service; i: number }) {
  return (
    <li
      data-reveal=""
      className="group relative border-b border-line"
      style={{ "--reveal-delay": `${(i % 4) * 50}ms`, "--reveal-y": "24px" } as CSSProperties}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-linear-to-t from-white/[0.045] to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-y-100 group-has-[a:focus-visible]:scale-y-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-[900ms] ease-out-expo group-hover:scale-x-100 group-has-[a:focus-visible]:scale-x-100"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-2 inset-y-1 rounded-sm opacity-0 ring-2 ring-accent transition-opacity group-has-[a:focus-visible]:opacity-100"
      />

      <div className="relative grid grid-cols-12 items-baseline gap-x-4 gap-y-3 py-7 md:gap-x-6 md:py-9">
        <span className="label col-span-2 text-fg-subtle transition-colors duration-300 group-hover:text-accent md:col-span-1">
          {service.index}
        </span>

        <h3 className="col-span-10 font-serif text-[clamp(2.1rem,1.3rem+2.9vw,4.25rem)] leading-[0.95] tracking-[-0.015em] text-fg md:col-span-5">
          <PrefillLink
            href="/#contact"
            projectType={service.projectType}
            className="inline-block transition-transform duration-700 ease-out-expo after:absolute after:inset-0 after:content-[''] group-hover:translate-x-3 focus-visible:outline-none"
            aria-label={`${service.title} — обсудить проект`}
          >
            {service.title}
          </PrefillLink>
        </h3>

        <p className="col-span-12 max-w-md text-fg-muted md:col-span-4 md:col-start-8">{service.body}</p>

        <div className="col-span-12 flex items-center justify-between gap-4 md:col-span-1 md:col-start-12 md:justify-end">
          <ul className="flex flex-wrap gap-x-3 gap-y-1 md:hidden" aria-label="Что входит">
            {service.tags.map((tag) => (
              <li key={tag} className="font-mono text-xs text-fg-subtle">
                {tag}
              </li>
            ))}
          </ul>
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-fg-muted transition-all duration-500 ease-out-expo group-hover:border-fg group-hover:bg-fg group-hover:text-ink"
          >
            <ArrowRight className="size-4 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0" />
          </span>
        </div>

        <ul className="col-span-12 hidden flex-wrap gap-2 md:col-span-4 md:col-start-8 md:flex" aria-label="Что входит">
          {service.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-fg-subtle transition-colors duration-300 group-hover:border-line-strong group-hover:text-fg-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
