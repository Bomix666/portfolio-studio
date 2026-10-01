"use client";

import { m, useScroll } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useRangeUnit } from "@/hooks/use-range";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The only client-side part of a project card: clip-path reveal on entry plus scroll parallax.
 * The cover itself arrives as server-rendered children, so its markup never ships as JS.
 */
export function MediaFrame({
  className,
  children,
  overlay,
}: {
  className?: string;
  children: ReactNode;
  overlay?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useRangeUnit(scrollYProgress, [0, 1], [-7, 7], "%");

  return (
    <m.div
      ref={ref}
      className={cn("relative overflow-hidden bg-ink-2", className)}
      initial={{ clipPath: "inset(18% 0% 0% 0%)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.4, ease: ease.outExpo }}
      data-motion-reveal
    >
      <m.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
        <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.035]">
          {children}
        </div>
      </m.div>
      {overlay}
    </m.div>
  );
}
