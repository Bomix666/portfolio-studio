import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal, RevealText } from "./reveal";

/**
 * Editorial section header: numbered label on the left, display headline on the right,
 * optional supporting copy. Asymmetric on desktop, stacked on mobile.
 */
export function SectionHeader({
  index,
  label,
  title,
  intro,
  id,
  className,
  aside,
}: {
  index: string;
  label: string;
  title: string;
  intro?: string;
  id?: string;
  className?: string;
  aside?: ReactNode;
}) {
  return (
    <header className={cn("grid grid-cols-4 gap-x-4 gap-y-8 md:grid-cols-12 md:gap-x-6", className)}>
      <Reveal className="col-span-4 md:col-span-3">
        <p className="label flex items-center gap-3 text-fg-subtle">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          <span>{label}</span>
        </p>
      </Reveal>
      <div className="col-span-4 md:col-span-9">
        <RevealText id={id} text={title} className="font-serif text-display-l text-fg" />
        {(intro || aside) && (
          <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-9 md:gap-6">
            {intro && (
              <Reveal delay={0.15} className="md:col-span-5">
                <p className="text-body-l text-fg-muted">{intro}</p>
              </Reveal>
            )}
            {aside && (
              <Reveal delay={0.25} className="md:col-span-4 md:justify-self-end">
                {aside}
              </Reveal>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
