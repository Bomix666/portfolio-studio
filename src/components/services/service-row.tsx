import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import type { services } from "@/config/content";
import { PrefillLink } from "@/components/contact/prefill-link";

type Service = (typeof services)[number];

/**
 * Typographic service row. Its top hairline draws in on reveal; on hover/focus a light wash
 * rises, the title slides, an accent hairline runs across and the arrow disc fills. The whole
 * row is a link that jumps to the contact form with the matching project type pre-selected.
 */
export function ServiceRow({ service, i }: { service: Service; i: number }) {
  return (
    <li
      data-reveal=""
      className="group relative"
      style={{ "--reveal-delay": `${(i % 4) * 50}ms`, "--reveal-y": "24px" } as CSSProperties}
    >
      <span
        aria-hidden="true"
        data-reveal="line"
        className="absolute inset-x-0 top-0 block h-px bg-line-strong"
        style={{ "--reveal-delay": `${(i % 4) * 50 + 100}ms` } as CSSProperties}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-linear-to-t from-white/[0.045] to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-y-100 group-has-[a:focus-visible]:scale-y-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[900ms] ease-out-expo group-hover:scale-x-100 group-has-[a:focus-visible]:scale-x-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-2 inset-y-1 rounded-sm opacity-0 ring-2 ring-accent transition-opacity group-has-[a:focus-visible]:opacity-100"
      />

      <div className="relative grid grid-cols-12 items-center gap-x-4 gap-y-4 py-7 md:gap-x-6 md:py-10">
        <h3 className="col-span-10 font-serif text-[clamp(2.1rem,1.3rem+2.9vw,4.25rem)] leading-[0.95] tracking-[-0.015em] text-fg md:col-span-6">
          <PrefillLink
            href="/#contact"
            projectType={service.projectType}
            className="inline-block transition-transform duration-700 ease-out-expo after:absolute after:inset-0 after:content-[''] group-hover:translate-x-3 focus-visible:outline-none"
            aria-label={`${service.title} — обсудить проект`}
          >
            {service.title}
          </PrefillLink>
        </h3>

        <span
          aria-hidden="true"
          className="col-span-2 grid size-11 shrink-0 place-items-center justify-self-end rounded-full border border-line-strong text-fg-muted transition-[background-color,border-color,color] duration-500 ease-out-expo group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink md:order-last md:col-span-1 md:size-12"
        >
          <ArrowRight className="size-4 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0" />
        </span>

        <div className="col-span-12 md:col-span-5">
          <p className="max-w-md text-fg-muted">{service.body}</p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1" aria-label="Что входит">
            {service.tags.map((tag) => (
              <li
                key={tag}
                className="text-[0.8125rem] text-fg-subtle transition-colors duration-300 group-hover:text-fg-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}
