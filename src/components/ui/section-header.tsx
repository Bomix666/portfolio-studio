import { cn } from "@/lib/utils";
import { Reveal, RevealText } from "./reveal";

/**
 * Section header: the headline takes the width, the supporting copy answers it from the
 * right-hand column a step lower. Stacked on mobile.
 */
export function SectionHeader({
  title,
  intro,
  id,
  className,
}: {
  title: string;
  intro?: string;
  id?: string;
  className?: string;
}) {
  return (
    <header className={cn("grid grid-cols-1 gap-y-9 md:grid-cols-12 md:gap-x-6 md:gap-y-12", className)}>
      <RevealText id={id} text={title} className="font-serif text-display-l text-fg md:col-span-11 lg:col-span-10" />
      {intro && (
        <Reveal variant="blur" delay={0.15} className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <p className="text-body-l text-fg-muted">{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
