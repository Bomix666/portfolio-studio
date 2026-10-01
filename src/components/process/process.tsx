"use client";

import { AnimatePresence, m, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/config/content";
import { SectionHeader } from "@/components/ui/section-header";
import { useRange } from "@/hooks/use-range";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven process. A rail fills as you read; the step crossing the middle of the
 * viewport becomes active and drives the large sticky numeral on desktop.
 */
export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });
  const fill = useRange(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!items?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const step = processSteps[active]!;

  return (
    <section id="process" aria-labelledby="process-title" className="section-y relative">
      <div className="container-x">
        <SectionHeader
          id="process-title"
          index="05"
          label="Процесс"
          title="Шесть этапов. *Никаких чёрных ящиков.*"
          intro="Вы видите работу на каждом шаге — и каждый этап заканчивается тем, что можно посмотреть, протестировать или запустить."
        />

        <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-12">
          {/* Sticky numeral (desktop) */}
          <div className="hidden md:col-span-5 md:block">
            <div className="sticky top-32" aria-hidden="true">
              <div className="relative h-[clamp(9rem,17vw,15rem)] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <m.span
                    key={step.index}
                    className="absolute inset-0 font-serif text-[clamp(9rem,17vw,15rem)] leading-[0.85] text-fg"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: ease.outExpo }}
                  >
                    {step.index}
                  </m.span>
                </AnimatePresence>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <span className="label text-accent">{step.title}</span>
                <span className="h-px flex-1 bg-line" />
                <span className="label text-fg-subtle">
                  {step.index} / {String(processSteps.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          <ol ref={listRef} className="relative md:col-span-7">
            {/* Rail */}
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-line-strong" />
            <m.span
              aria-hidden="true"
              style={{ scaleY: fill }}
              className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-accent"
            />

            {processSteps.map((s, i) => {
              const isActive = i === active;
              const isDone = i < active;
              return (
                <li key={s.index} data-step={i} className="relative pb-16 pl-12 last:pb-0 md:pb-24 md:pl-16">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-2 left-0 size-[11px] rounded-full border transition-all duration-500",
                      isActive
                        ? "scale-125 border-accent bg-accent shadow-[0_0_0_6px_rgb(242_163_58/0.15)]"
                        : isDone
                          ? "border-accent bg-ink"
                          : "border-line-strong bg-ink",
                    )}
                  />
                  <div>
                    <p className="label text-fg-subtle md:hidden">{s.index}</p>
                    <h3
                      className={cn(
                        "mt-2 font-serif text-display-m transition-colors duration-700 md:mt-0",
                        isActive ? "text-fg" : "text-fg-muted",
                      )}
                    >
                      {s.title}
                    </h3>
                    <p className="mt-4 max-w-lg text-body-l text-fg-muted">{s.body}</p>
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${s.title} — результаты этапа`}>
                      {s.output.map((o) => (
                        <li key={o} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-fg-muted">
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
