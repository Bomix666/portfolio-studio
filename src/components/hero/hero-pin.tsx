"use client";

import { m, useScroll } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useFinePointer, useMediaQuery, useReducedMotionPref } from "@/hooks/use-media-query";
import { useRange, useRangeUnit } from "@/hooks/use-range";

/** Must match the `pin:` variant in globals.css. */
const PIN_QUERY = "(min-height: 601px) and (prefers-reduced-motion: no-preference)";

/**
 * Pins the first screen while the rest of the page slides over it as a sheet (see page.tsx).
 * During the cover the camera pushes into the film, the room dims and the copy drifts up.
 * The track is two screens tall so the hero is released the moment it's fully covered.
 * Short viewports and reduced motion get a plain, unpinned first screen.
 *
 * With a mouse, the cursor carries a pool of warm light across the film (.hero-light).
 */
export function HeroPin({ film, children }: { film: ReactNode; children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const pinned = useMediaQuery(PIN_QUERY);
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end start"] });

  // The sheet finishes covering at 0.5 of the two-screen track.
  const scale = useRange(scrollYProgress, [0, 0.5], [1, 1.14]);
  const dim = useRange(scrollYProgress, [0, 0.5], [0, 0.72]);
  const y = useRangeUnit(scrollYProgress, [0, 0.5], [0, -16], "%");
  const fade = useRange(scrollYProgress, [0.04, 0.34], [1, 0]);

  useEffect(() => {
    const light = lightRef.current;
    const stage = light?.parentElement;
    if (!light || !stage || !fine || reduced) return;

    const pos = { x: 0.5, y: 0.45 };
    const target = { ...pos };
    let raf = 0;
    let running = false;

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.09;
      pos.y += (target.y - pos.y) * 0.09;
      light.style.setProperty("--lx", `${(pos.x * 100).toFixed(2)}%`);
      light.style.setProperty("--ly", `${(pos.y * 100).toFixed(2)}%`);
      // Sleep once settled — no idle rAF loop.
      if (Math.abs(target.x - pos.x) < 0.0006 && Math.abs(target.y - pos.y) < 0.0006) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = stage.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = (e.clientY - r.top) / r.height;
      light.dataset.on = "true";
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onLeave = () => (light.dataset.on = "false");

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [fine, reduced]);

  return (
    <div ref={trackRef} id="top" className="relative pin:h-[200svh]">
      <section
        aria-labelledby="hero-title"
        className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black pin:sticky pin:top-0 pin:h-[100svh]"
      >
        <m.div className="hero-film absolute inset-0" style={pinned ? { scale } : undefined}>
          {film}
        </m.div>
        <div ref={lightRef} aria-hidden="true" className="hero-light" data-on="false" />
        <span aria-hidden="true" className="hero-shutter-edge [--travel:-50svh]" />
        <span aria-hidden="true" className="hero-shutter-edge [--travel:50svh]" />
        {pinned && (
          <m.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />
        )}
        <m.div className="relative z-10 flex flex-1 flex-col" style={pinned ? { y, opacity: fade } : undefined}>
          {children}
        </m.div>
      </section>
    </div>
  );
}
