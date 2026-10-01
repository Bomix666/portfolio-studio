"use client";

import { useTransform, type MotionValue } from "motion/react";

/**
 * Scroll-linked interpolation computed in JS.
 *
 * Motion 13 can hand array-form `useTransform(scrollYProgress, [...], [...])` off to a native
 * ViewTimeline. For sticky, offset-based ranges that mapping is unreliable, so these hooks use
 * the function form, which always runs on Motion's own frame loop.
 */
export function useRange(
  value: MotionValue<number>,
  [inStart, inEnd]: readonly [number, number],
  [outStart, outEnd]: readonly [number, number],
) {
  return useTransform(value, (v) => {
    const t = Math.min(1, Math.max(0, (v - inStart) / (inEnd - inStart)));
    return outStart + (outEnd - outStart) * t;
  });
}

/** Same as useRange, but formats the output with a unit (e.g. "%", "px"). */
export function useRangeUnit(
  value: MotionValue<number>,
  input: readonly [number, number],
  output: readonly [number, number],
  unit: string,
) {
  const n = useRange(value, input, output);
  return useTransform(n, (v) => `${v}${unit}`);
}
