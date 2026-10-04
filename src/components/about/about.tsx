"use client";

import dynamic from "next/dynamic";
import { m, useScroll, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMediaQuery, useReducedMotionPref } from "@/hooks/use-media-query";
import { useRange } from "@/hooks/use-range";
import { cn } from "@/lib/utils";
import { ArtifactFallback } from "./artifact-fallback";

// Three.js + R3F (~250 KB gz) load only when this section approaches the viewport.
const ArtifactScene = dynamic(() => import("@/components/three/artifact-scene"), { ssr: false });

const STATEMENT =
  "Мы соединяем *дизайн,* *разработку* и *моушн,* чтобы создавать цифровые проекты, которые выглядят сделанными на заказ — потому что так и есть.";

const PILLARS = [
  { title: "Дизайн", body: "Системы, а не отдельные экраны. Каждое решение обосновано целью.", at: 0.46 },
  { title: "Разработка", body: "Быстро, доступно, поддерживаемо. Код, который не стыдно передать.", at: 0.6 },
  { title: "Моушн", body: "Движение, у которого есть задача: направлять, а не украшать.", at: 0.74 },
];

// Word highlighting runs across this slice of the section's scroll progress.
const TEXT_START = 0.3;
const TEXT_END = 0.8;

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reduced = useReducedMotionPref();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const coarse = useMediaQuery("(pointer: coarse)");
  const [mount, setMount] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(true);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end end"] });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(hasWebGL());
    const el = sectionRef.current;
    if (!el) return;

    // Three.js is only fetched once the visitor actually heads for this section: after their
    // first scroll, when the section is within ~1.5 viewports. Page load stays lean (LCP/TBT);
    // the CSS fallback covers the brief moment before the canvas fades in.
    let near = false;
    let scrolled = window.scrollY > 0;
    const tryMount = () => {
      if (near && scrolled) {
        setMount(true);
        cleanup();
      }
    };
    const onScroll = () => {
      scrolled = true;
      tryMount();
    };
    const nearObserver = new IntersectionObserver(
      ([e]) => {
        near = !!e?.isIntersecting;
        tryMount();
      },
      { rootMargin: "150% 0px" },
    );
    // Render loop runs only while some of the section is actually on screen
    // (edge-touching at load doesn't count).
    const visible = new IntersectionObserver(([e]) => setInView(!!e && e.intersectionRatio > 0), {
      threshold: [0, 0.01],
    });
    const cleanup = () => {
      nearObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    nearObserver.observe(el);
    visible.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cleanup();
      visible.disconnect();
    };
  }, []);

  useEffect(() => {
    if (coarse || reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [coarse, reduced]);

  const layout = desktop ? "side" : "center";
  const words = STATEMENT.split(" ");

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-title"
      className={cn("relative", reduced ? "min-h-[100svh]" : "h-[260vh] lg:h-[320vh]")}
    >
      <div className={cn("relative h-[100svh] overflow-hidden", !reduced && "sticky top-0")}>
        <ArtifactFallback
          layout={layout}
          className={cn("transition-opacity duration-700", ready && webgl ? "opacity-0" : "opacity-100")}
        />

        {mount && webgl && (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-[1400ms] ease-out-expo",
              ready ? "opacity-100" : "opacity-0",
            )}
          >
            <ArtifactScene
              progress={scrollYProgress}
              pointer={pointer}
              active={inView}
              lite={coarse || !desktop}
              still={reduced}
              layout={layout}
              onReady={() => setReady(true)}
            />
          </div>
        )}

        {/* Atmosphere */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-screen bg-[radial-gradient(55%_45%_at_72%_50%,rgb(120_150_210/0.10),transparent_70%),radial-gradient(35%_30%_at_78%_62%,rgb(242_163_58/0.08),transparent_70%)] max-lg:bg-[radial-gradient(70%_40%_at_50%_32%,rgb(120_150_210/0.12),transparent_70%)]"
        />

        {/* Copy */}
        <div className="container-x relative flex h-full flex-col justify-between pt-28 pb-10 md:pt-32 lg:pb-14">
          <div aria-hidden="true" className="max-lg:hidden" />

          <div className="max-lg:mt-auto lg:max-w-[46%]">
            <h2
              id="about-title"
              aria-label={STATEMENT.replace(/\*/g, "")}
              className="font-serif text-[clamp(1.85rem,1rem+2.9vw,4rem)] leading-[1.02] tracking-[-0.015em] text-fg"
            >
              <span aria-hidden="true">
                {words.map((word, i) => {
                  const italic = word.startsWith("*");
                  const clean = word.replace(/\*/g, "");
                  const start = TEXT_START + (i / words.length) * (TEXT_END - TEXT_START);
                  return (
                    <Word
                      key={i}
                      progress={scrollYProgress}
                      range={[start, start + 0.06]}
                      still={reduced}
                      italic={italic}
                    >
                      {clean}
                    </Word>
                  );
                })}
              </span>
            </h2>
          </div>

          <div className="mt-8 grid gap-6 lg:mt-0 lg:grid-cols-12 lg:items-end">
            <ul className="grid grid-cols-3 gap-3 sm:gap-6 lg:col-span-7">
              {PILLARS.map((pillar) => (
                <Pillar key={pillar.title} progress={scrollYProgress} at={pillar.at} still={reduced}>
                  <span className="block font-serif text-xl text-fg sm:text-2xl">{pillar.title}</span>
                  <span className="mt-1 hidden text-sm leading-relaxed text-fg-muted sm:block">{pillar.body}</span>
                </Pillar>
              ))}
            </ul>
            {!reduced && <ProgressRail progress={scrollYProgress} />}
          </div>
        </div>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  still,
  italic,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
  italic: boolean;
}) {
  const opacity = useRange(progress, range, [0.16, 1]);
  // Reduced motion: a plain element. Swapping the motion value for a static style on the same
  // m.span can leave the server-rendered dim opacity inline; a different element can't.
  if (still) {
    return (
      <>
        <span className={cn(italic && "italic")}>{children}</span>{" "}
      </>
    );
  }
  return (
    <>
      <m.span style={{ opacity }} className={cn(italic && "italic")}>
        {children}
      </m.span>{" "}
    </>
  );
}

function Pillar({
  children,
  progress,
  at,
  still,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  at: number;
  still: boolean;
}) {
  const opacity = useRange(progress, [at - 0.06, at], [0.25, 1]);
  const y = useRange(progress, [at - 0.06, at], [10, 0]);
  if (still) return <li className="border-t border-line-strong pt-4">{children}</li>;
  return (
    <m.li style={{ opacity, y }} className="border-t border-line-strong pt-4">
      {children}
    </m.li>
  );
}

function ProgressRail({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useRange(progress, [TEXT_START - 0.05, 0.98], [0, 1]);
  return (
    <div className="hidden items-center gap-4 lg:col-span-4 lg:col-start-9 lg:flex" aria-hidden="true">
      <span className="label text-fg-subtle">Слои</span>
      <div className="relative h-px flex-1 bg-line-strong">
        <m.div style={{ scaleX }} className="absolute inset-0 origin-left bg-fg" />
      </div>
      <span className="label text-fg-subtle">Продукт</span>
    </div>
  );
}
