"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotionPref } from "@/hooks/use-media-query";

/**
 * Custom cursor (desktop, fine pointer, motion allowed).
 *
 * - Dot tracks the pointer 1:1; the ring trails with interpolation and stretches with velocity.
 * - Links/buttons → "hover" state. `data-cursor-label="VIEW"` → filled label state.
 * - Form fields → native cursor returns (the custom one hides) so text editing feels normal.
 * - Pure DOM + rAF: no React re-renders on pointer move.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  if (!fine || reduced) return null;
  return <CursorImpl />;
}

const INTERACTIVE = "a[href], button, [role='button'], summary, label[for], [data-cursor]";
const NATIVE = "input, textarea, select, [contenteditable='true'], [data-cursor='native']";

function CursorImpl() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    const text = textRef.current!;

    const target = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let visible = false;
    let raf = 0;
    let running = false;

    const wake = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const setState = (el: Element | null) => {
      if (!el) {
        root.dataset.state = "default";
        return;
      }
      if (el.closest(NATIVE)) {
        root.dataset.state = "native";
        return;
      }
      const labelled = el.closest<HTMLElement>("[data-cursor-label]");
      if (labelled) {
        text.textContent = labelled.dataset.cursorLabel ?? "";
        root.dataset.state = "label";
        return;
      }
      root.dataset.state = el.closest(INTERACTIVE) ? "hover" : "default";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = target.x;
        ringPos.y = target.y;
        root.dataset.visible = "true";
        // Hide the native cursor only once ours is actually on screen (also keeps this
        // document-wide restyle out of the hydration task).
        document.documentElement.classList.add("has-custom-cursor");
      }
      wake();
    };

    const onOver = (e: PointerEvent) => setState(e.target as Element);
    const onDown = () => (root.dataset.pressed = "true");
    const onUp = () => (root.dataset.pressed = "false");
    const onLeave = () => {
      visible = false;
      root.dataset.visible = "false";
    };

    function tick() {
      const dx = target.x - ringPos.x;
      const dy = target.y - ringPos.y;
      ringPos.x += dx * 0.2;
      ringPos.y += dy * 0.2;

      // Subtle velocity stretch along the direction of travel.
      const speed = Math.min(Math.hypot(dx, dy), 120);
      const stretch = root.dataset.state === "label" ? 0 : speed / 600;
      const angle = Math.atan2(dy, dx);

      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.6})`;
      label.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;

      // Sleep once settled — no idle rAF loop.
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor-root" data-state="default" data-visible="false" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span />
      </div>
      <div ref={labelRef} className="cursor-label">
        <span ref={textRef} />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
