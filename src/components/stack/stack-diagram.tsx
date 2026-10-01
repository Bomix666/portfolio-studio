"use client";

import { AnimatePresence, m } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { stack, stackLayers, type Tech } from "@/config/content";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Point {
  x: number;
  y: number;
}

const byId = new Map(stack.map((t) => [t.id, t]));

/**
 * The stack as a system diagram: technologies sit in their layer; selecting one draws its
 * connections across layers and explains what we use it for. Works with mouse, touch
 * (tap) and keyboard (Tab / arrow keys), with a live region announcing the selection.
 */
export function StackDiagram() {
  const [activeId, setActiveId] = useState("nextjs");
  const [points, setPoints] = useState<Record<string, Point>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });
  const areaRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());

  const active = byId.get(activeId)!;
  const linked = new Set(active.links);

  const measure = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const box = area.getBoundingClientRect();
    const next: Record<string, Point> = {};
    chipRefs.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      next[id] = { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    });
    setPoints(next);
    setSize({ w: box.width, h: box.height });
  }, []);

  // Measure after paint (never inside the hydration commit) and again when size/fonts change.
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    let frame = requestAnimationFrame(measure);
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(area);
    document.fonts?.ready.then(schedule).catch(() => {});
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [measure]);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = stack[(index + delta + stack.length) % stack.length]!;
    chipRefs.current.get(next.id)?.focus();
    setActiveId(next.id);
  };

  const from = points[activeId];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
      <div ref={areaRef} className="relative min-w-0 lg:col-span-8">
        {/* Connection lines */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
        >
          <AnimatePresence>
            {from &&
              active.links.map((id) => {
                const to = points[id];
                if (!to) return null;
                const midY = (from.y + to.y) / 2;
                const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
                return (
                  <m.path
                    key={`${activeId}-${id}`}
                    d={d}
                    fill="none"
                    stroke="#f2a33a"
                    strokeOpacity={0.65}
                    strokeWidth={1.25}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.9, ease: ease.outExpo }}
                  />
                );
              })}
          </AnimatePresence>
        </svg>

        <div className="relative divide-y divide-line border-y border-line" role="group" aria-label="Технологический стек">
          {stackLayers.map((layer) => (
            <div key={layer} className="grid gap-4 py-6 sm:grid-cols-[8.5rem_1fr] sm:items-center md:py-8">
              <p className="label text-fg-subtle">{layer}</p>
              <div className="flex flex-wrap gap-2.5 md:gap-3">
                {stack
                  .filter((t) => t.layer === layer)
                  .map((tech) => {
                    const index = stack.indexOf(tech);
                    const isActive = tech.id === activeId;
                    const isLinked = linked.has(tech.id);
                    return (
                      <button
                        key={tech.id}
                        ref={(el) => {
                          if (el) chipRefs.current.set(tech.id, el);
                          else chipRefs.current.delete(tech.id);
                        }}
                        type="button"
                        aria-pressed={isActive}
                        onPointerEnter={(e) => e.pointerType === "mouse" && setActiveId(tech.id)}
                        onFocus={() => setActiveId(tech.id)}
                        onClick={() => setActiveId(tech.id)}
                        onKeyDown={(e) => onKeyDown(e, index)}
                        className={cn(
                          "relative rounded-full border px-4 py-2.5 text-sm transition-all duration-300 md:px-5 md:text-[0.95rem]",
                          isActive
                            ? "border-accent bg-accent text-accent-ink"
                            : isLinked
                              ? "border-fg/60 bg-ink-2 text-fg"
                              : "border-line-strong bg-ink text-fg-muted hover:border-fg/40 hover:text-fg",
                        )}
                      >
                        {tech.name}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="lg:col-span-4" aria-live="polite">
        <div className="lg:sticky lg:top-32">
          <AnimatePresence mode="wait">
            <m.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: ease.outExpo }}
              className="liquid-glass rounded-3xl p-7 md:p-8"
            >
              <TechDetail tech={active} />
            </m.div>
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}

function TechDetail({ tech }: { tech: Tech }) {
  return (
    <>
      <p className="label text-fg-subtle">{tech.layer}</p>
      <h3 className="mt-3 font-serif text-display-m text-fg">{tech.name}</h3>
      <p className="mt-4 text-fg-muted">{tech.use}</p>
      <p className="label mt-8 text-fg-subtle">Связан с</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {tech.links.map((id) => (
          <li key={id} className="rounded-full border border-line-strong px-3 py-1 font-mono text-[11px] text-fg-muted">
            {byId.get(id)?.name}
          </li>
        ))}
      </ul>
    </>
  );
}
