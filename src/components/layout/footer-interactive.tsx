"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, type PointerEvent } from "react";
import { useSmoothScroll } from "@/components/providers/smooth-scroll";
import { Magnetic } from "@/components/ui/magnetic";

/**
 * Giant outlined wordmark; a soft spotlight follows the cursor and "lights" the letters.
 * Without a cursor it stays an outline — the same mark at every width. Purely decorative
 * (the name is in the logo and © line).
 */
export function FooterWordmark({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Fit the wordmark edge-to-edge whatever the studio name is. Runs after paint — the footer is
  // far below the fold, so there's no visible adjustment and no forced layout during hydration.
  useEffect(() => {
    const box = ref.current;
    const probe = measureRef.current;
    if (!box || !probe) return;
    const fit = () => {
      const width = probe.getBoundingClientRect().width;
      if (!width) return;
      const current = parseFloat(getComputedStyle(probe).fontSize);
      box.style.setProperty("--fs", `${(current * box.clientWidth * 0.995) / width}px`);
    };
    const frame = requestAnimationFrame(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [text]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
    el.style.setProperty("--r", "22%");
  };

  const onLeave = () => ref.current?.style.setProperty("--r", "0%");

  const type = "font-serif leading-[0.8] tracking-[-0.04em] whitespace-nowrap text-[length:var(--fs,24vw)]";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mt-16 overflow-hidden select-none [--r:0%] [--x:50%] [--y:60%] md:mt-24"
    >
      <p className={`${type} text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.34)]`}>
        <span ref={measureRef}>{text}</span>
      </p>
      <p
        className={`${type} absolute inset-0 text-fg [mask-image:radial-gradient(circle_at_var(--x)_var(--y),black_0%,transparent_var(--r))]`}
      >
        {text}
      </p>
    </div>
  );
}

export function BackToTop() {
  const { scrollTo } = useSmoothScroll();
  return (
    <Magnetic strength={0.4}>
      <button
        type="button"
        onClick={() => {
          scrollTo(0, { offset: 0 });
          document.getElementById("main")?.focus({ preventScroll: true });
        }}
        className="group grid size-16 place-items-center rounded-full border border-line-strong text-fg transition-[background-color,border-color,color,scale] duration-500 ease-out-expo hover:border-accent hover:bg-accent hover:text-accent-ink active:scale-95"
        aria-label="Наверх"
      >
        <ArrowUp
          aria-hidden="true"
          className="size-5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1"
        />
      </button>
    </Magnetic>
  );
}
