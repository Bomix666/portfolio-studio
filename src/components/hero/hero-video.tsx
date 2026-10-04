"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

const FADE_MS = 500;
const FADE_OUT_BEFORE_END_S = 0.55;
const RESTART_DELAY_MS = 100;

/**
 * Framing shared by the poster and the film. The frame is pushed down so the subject sits
 * between the title above and the actions below — further on phones, where the offer line
 * also lives under the title (see hero.tsx).
 */
const FRAME = "absolute inset-0 h-full w-full translate-y-[27%] object-cover md:translate-y-[17%]";

type Variant = "large" | "small";

/**
 * Full-bleed looping hero film with a JS-driven crossfade to black at the loop point
 * (no CSS transitions, no `loop` attribute):
 *
 * - 500ms rAF fade-in on load and on every loop start.
 * - 500ms fade-out when 0.55s remain; `fadingOutRef` stops timeupdate from re-triggering it.
 * - On `ended`: opacity 0 → after 100ms reset to 0, play, fade back in.
 * - Each fade cancels any running frame and resumes from the current opacity.
 *
 * Extras for production: resolution picked per viewport, AV1 → H.264 fallback, paused
 * while off-screen or when the tab is hidden, poster-only for reduced motion / Save-Data.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const opacityRef = useRef(0);
  const fadingOutRef = useRef(false);
  const restartTimerRef = useRef<number | null>(null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [stillOnly, setStillOnly] = useState(false);
  const [posterRetired, setPosterRetired] = useState(false);

  const applyOpacity = (value: number) => {
    opacityRef.current = value;
    if (videoRef.current) videoRef.current.style.opacity = String(value);
  };

  const fadeTo = useCallback((target: number, duration = FADE_MS) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const from = opacityRef.current;
    const delta = target - from;
    if (delta === 0) return;
    // Resume proportionally from wherever the previous fade left off.
    const total = duration * Math.abs(delta);
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      applyOpacity(from + delta * t);
      rafRef.current = t < 1 ? requestAnimationFrame(step) : null;
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  // Choose source + decide whether to play at all (client-only decisions).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const wide = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2) > 1600;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStillOnly(reduce || saveData);
    setVariant(wide ? "large" : "small");
  }, []);

  // Pause once the page has covered the hero (one screen of scroll — it stays pinned underneath,
  // so an IntersectionObserver would never see it leave) or when the tab is hidden.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || stillOnly || !variant) return;

    let playing: boolean | null = null;
    const sync = () => {
      const visible = window.scrollY < window.innerHeight && !document.hidden;
      if (visible === playing) return;
      playing = visible;
      if (visible) video.play().catch(() => {});
      else video.pause();
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [stillOnly, variant]);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (restartTimerRef.current !== null) window.clearTimeout(restartTimerRef.current);
    },
    [],
  );

  const onLoadedData = () => {
    fadingOutRef.current = false;
    fadeTo(1);
    // Once the film is fully up, retire the poster so loop fades dip to true black.
    if (!posterRetired) window.setTimeout(() => setPosterRetired(true), FADE_MS + 50);
  };

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    const remaining = video.duration - video.currentTime;
    if (remaining <= FADE_OUT_BEFORE_END_S && !fadingOutRef.current) {
      fadingOutRef.current = true;
      fadeTo(0);
    }
  };

  const onEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    applyOpacity(0);
    restartTimerRef.current = window.setTimeout(() => {
      video.currentTime = 0;
      video
        .play()
        .then(() => {
          fadingOutRef.current = false;
          fadeTo(1);
        })
        .catch(() => {});
    }, RESTART_DELAY_MS);
  };

  const { video } = siteConfig.hero;

  /*
   * The poster is server-rendered and painted immediately (dimmed, like house lights before a
   * screening), which makes it the LCP element instead of the late-fading video. Reduced motion
   * and Save-Data keep it at full strength and never load the film.
   */
  const poster = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={video.poster}
      alt=""
      aria-hidden="true"
      fetchPriority="high"
      decoding="async"
      className={`${FRAME} transition-opacity duration-700`}
      style={{ opacity: stillOnly ? 1 : posterRetired ? 0 : 0.42 }}
    />
  );

  if (stillOnly) return poster;

  return (
    <>
      {!posterRetired && poster}
      <video
      ref={videoRef}
      className={FRAME}
      style={{ opacity: 0 }}
      muted
      playsInline
      autoPlay
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      onLoadedData={onLoadedData}
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
      key={variant ?? "pending"}
    >
      {variant && (
        <>
          <source src={video[variant].webm} type='video/webm; codecs="av01.0.08M.08"' />
          <source src={video[variant].mp4} type="video/mp4" />
        </>
      )}
      </video>
    </>
  );
}
