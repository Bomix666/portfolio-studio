"use client";

import { useMotionValueEvent, useScroll, useSpring, useVelocity } from "motion/react";
import { useEffect, useRef } from "react";
import { services } from "@/config/content";
import { cn } from "@/lib/utils";

const LOOP_MS = 52_000;

/**
 * A band of the studio's disciplines that drifts on its own and takes its speed and direction
 * from the scroll. The drift is a CSS animation (compositor-only, paused off-screen); scroll
 * velocity only retunes its playback rate, so nothing runs per frame in JS.
 * Decorative — the same list is the Services section right below.
 */
export function Disciplines() {
  const bandRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 40, stiffness: 300 });

  useEffect(() => {
    const band = bandRef.current;
    const animation = trackRef.current?.getAnimations()[0];
    if (!band || !animation) return;
    // Start deep into the timeline so the band can run backwards without hitting its start.
    animation.currentTime = LOOP_MS * 400;
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) animation.play();
      else animation.pause();
    });
    io.observe(band);
    return () => io.disconnect();
  }, []);

  useMotionValueEvent(velocity, "change", (v) => {
    const animation = trackRef.current?.getAnimations()[0];
    if (!animation) return;
    if (Math.abs(v) > 30) direction.current = v < 0 ? -1 : 1;
    animation.playbackRate = direction.current * (1 + Math.min(Math.abs(v) / 450, 6));
  });

  return (
    <div ref={bandRef} aria-hidden="true" className="relative overflow-hidden border-y border-line py-8 select-none md:py-12">
      <div ref={trackRef} className="marquee-track flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {services.map((service, i) => (
              <li key={service.index} className="flex items-center">
                <span
                  className={cn(
                    "font-serif text-[clamp(2.75rem,7vw,6rem)] leading-none whitespace-nowrap",
                    i % 2 ? "text-fg-muted italic" : "text-fg",
                  )}
                >
                  {service.title}
                </span>
                <span className="mx-8 size-2.5 shrink-0 rounded-full bg-accent md:mx-12 md:size-3" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
