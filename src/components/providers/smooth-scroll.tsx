"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";

type ScrollTarget = string | number | HTMLElement;

interface SmoothScrollApi {
  scrollTo: (target: ScrollTarget, opts?: { offset?: number; immediate?: boolean }) => void;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollApi | null>(null);

const NAV_OFFSET = -24;

/**
 * Lenis smooth scrolling. Uses native scroll position (so sticky, IntersectionObserver
 * and motion's useScroll keep working). Disabled for reduced-motion users and touch
 * devices keep native momentum scrolling.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const setup = () => {
      lenis?.destroy();
      lenis = null;
      if (!reduce.matches) {
        lenis = new Lenis({ autoRaf: true, lerp: 0.11, wheelMultiplier: 0.95, anchors: false });
      }
      lenisRef.current = lenis;
    };

    setup();
    reduce.addEventListener("change", setup);
    return () => {
      reduce.removeEventListener("change", setup);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback<SmoothScrollApi["scrollTo"]>((target, opts) => {
    const offset = opts?.offset ?? NAV_OFFSET;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, {
        offset,
        immediate: opts?.immediate,
        duration: 1.5,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
      return;
    }
    // Reduced motion / no Lenis: jump.
    if (typeof target === "number") {
      window.scrollTo({ top: target });
      return;
    }
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
  }, []);

  const api = useMemo<SmoothScrollApi>(
    () => ({
      scrollTo,
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    }),
    [scrollTo],
  );

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll(): SmoothScrollApi {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside <SmoothScrollProvider>");
  return ctx;
}
