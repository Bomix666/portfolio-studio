"use client";

import { m, useScroll, type MotionValue } from "motion/react";
import { useRef, type FocusEvent, type ReactNode } from "react";
import { useSmoothScroll } from "@/components/providers/smooth-scroll";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useRange } from "@/hooks/use-range";

/** Must match the `pin:` variant in globals.css. */
const PIN_QUERY = "(min-height: 601px) and (prefers-reduced-motion: no-preference)";

/**
 * The project stack: every plate pins, the next one slides over it, and the covered plate
 * steps back and dims. Each slot sticks a little lower than the one before, so the deck stays
 * readable as a deck. The plates themselves arrive as server-rendered children.
 * Without `pin:` (short viewport, reduced motion) this is a plain list.
 */
export function ProjectStack({ children }: { children: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const pinned = useMediaQuery(PIN_QUERY);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { scrollTo } = useSmoothScroll();

  // A covered plate is still in the tab order. When focus lands in one, bring the page to the
  // point where that plate is the one on top.
  const reveal = (e: FocusEvent<HTMLDivElement>, i: number) => {
    const deck = ref.current;
    if (!pinned || !deck || !(e.target as HTMLElement).matches(":focus-visible")) return;
    const top = deck.getBoundingClientRect().top + window.scrollY + i * window.innerHeight;
    scrollTo(top, { offset: 0, immediate: true });
  };

  return (
    <div ref={ref} className="relative">
      {children.map((child, i) => (
        <Slot key={i} i={i} count={children.length} progress={scrollYProgress} pinned={pinned} onFocus={reveal}>
          {child}
        </Slot>
      ))}
    </div>
  );
}

function Slot({
  i,
  count,
  progress,
  pinned,
  onFocus,
  children,
}: {
  i: number;
  count: number;
  progress: MotionValue<number>;
  pinned: boolean;
  onFocus: (e: FocusEvent<HTMLDivElement>, i: number) => void;
  children: ReactNode;
}) {
  // Deck progress runs over (count - 1) screens; plate i is covered during the i-th of them.
  const span = Math.max(1, count - 1);
  const range = [i / span, (i + 1) / span] as const;
  const scale = useRange(progress, range, [1, 0.93]);
  const dim = useRange(progress, range, [0, 0.66]);

  return (
    <div
      onFocus={(e) => onFocus(e, i)}
      // Top-aligned, not centred: plates differ in height on phones, and a shared top line keeps
      // the peeking edge of the covered plate a constant sliver that never cuts through its badge.
      className="py-3 pin:sticky pin:h-[100svh] pin:pt-[max(5.5rem,9svh)] pin:pb-0"
      style={{ top: `${i * 0.75}rem`, zIndex: i + 1 }}
    >
      <m.div className="relative w-full origin-top" style={pinned ? { scale } : undefined}>
        {children}
        {pinned && (
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-plate bg-ink"
            style={{ opacity: dim }}
          />
        )}
      </m.div>
    </div>
  );
}
