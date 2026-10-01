"use client";

import { AnimatePresence, m, useMotionValue, useSpring, useTransform } from "motion/react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useReducedMotionPref } from "@/hooks/use-media-query";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { contactSchema } from "@/lib/validation/contact";
import { Inspector, type InteractionState } from "./inspector";
import { MockSite } from "./mock-site";
import { LOGICAL_WIDTH, modes, type DeviceId, type ModeId } from "./modes";

const devices: { id: DeviceId; label: string; Icon: typeof Monitor }[] = [
  { id: "desktop", label: "Десктоп", Icon: Monitor },
  { id: "tablet", label: "Планшет", Icon: Tablet },
  { id: "mobile", label: "Телефон", Icon: Smartphone },
];

const RESPONSIVE_CYCLE: DeviceId[] = ["desktop", "tablet", "mobile"];

/**
 * Interactive specimen: a real, responsive page rendered at true logical width and scaled
 * into a device frame. Switching devices animates the logical width, so the layout reflows
 * live through its container-query breakpoints — not a swap between screenshots.
 */
export function Specimen() {
  const [mode, setMode] = useState<ModeId>("ui");
  const [device, setDevice] = useState<DeviceId>("desktop");
  const [autoCycle, setAutoCycle] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [demoEmail, setDemoEmail] = useState("");
  const [interaction, setInteraction] = useState<InteractionState>("hover");
  const reduced = useReducedMotionPref();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // --- stage measurement → scale ------------------------------------------------------------
  const stageRef = useRef<HTMLDivElement>(null);
  const stageW = useMotionValue(0);
  const stageH = useMotionValue(0);
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry!.contentRect;
      stageW.set(r.width);
      stageH.set(r.height);
      setMeasured(true);
      // Small stages start on the phone layout; it's the most legible there.
      if (r.width < 560) setDevice((d) => (d === "desktop" ? "mobile" : d));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [stageW, stageH]);

  const logicalW = useSpring(LOGICAL_WIDTH.desktop, { stiffness: 90, damping: 20, mass: 0.9 });
  useEffect(() => {
    if (reduced) logicalW.jump(LOGICAL_WIDTH[device]);
    else logicalW.set(LOGICAL_WIDTH[device]);
  }, [device, logicalW, reduced]);

  // Large stages share one scale (devices keep true relative size); small stages fit each device.
  const scale = useTransform([logicalW, stageW] as const, ([lw, sw]: number[]) => {
    const w = sw ?? 0;
    const l = lw ?? 1280;
    return w >= 560 ? w / LOGICAL_WIDTH.desktop : w / l;
  });
  const frameW = useTransform([logicalW, scale] as const, ([lw, s]: number[]) => (lw ?? 0) * (s ?? 0));
  const logicalH = useTransform([stageH, scale] as const, ([h, s]: number[]) => (h ?? 0) / Math.max(s ?? 1, 0.01));

  // --- responsive mode auto-cycles devices ----------------------------------------------------
  useEffect(() => {
    if (mode !== "responsive" || !autoCycle || reduced) return;
    const id = window.setInterval(() => {
      setDevice((d) => RESPONSIVE_CYCLE[(RESPONSIVE_CYCLE.indexOf(d) + 1) % RESPONSIVE_CYCLE.length]!);
    }, 2200);
    return () => window.clearInterval(id);
  }, [mode, autoCycle, reduced]);

  const selectMode = (id: ModeId) => {
    setMode(id);
    setAutoCycle(id === "responsive");
    if (id === "motion") setReplayKey((k) => k + 1);
  };

  const onTabKey = (e: KeyboardEvent, i: number) => {
    const horizontal = e.key === "ArrowRight" || e.key === "ArrowLeft";
    const vertical = e.key === "ArrowDown" || e.key === "ArrowUp";
    if (!horizontal && !vertical && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % modes.length;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + modes.length) % modes.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = modes.length - 1;
    tabRefs.current[next]?.focus();
    selectMode(modes[next]!.id);
  };

  const demoResult = useMemo(() => {
    if (!demoEmail.trim()) return null;
    const r = contactSchema.shape.email.safeParse(demoEmail);
    return r.success ? { valid: true } : { valid: false, message: r.error.issues[0]?.message };
  }, [demoEmail]);

  const active = modes.find((item) => item.id === mode)!;
  const spatial = mode === "spatial";

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
      {/* Disciplines */}
      <div className="min-w-0 lg:col-span-4">
        <div
          role="tablist"
          aria-label="Дисциплины"
          aria-orientation="vertical"
          className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-line lg:px-0"
        >
          {modes.map((item, i) => {
            const selected = item.id === mode;
            return (
              <button
                key={item.id}
                ref={(el) => void (tabRefs.current[i] = el)}
                role="tab"
                type="button"
                id={`tab-${item.id}`}
                aria-selected={selected}
                aria-controls="specimen-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => selectMode(item.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cn(
                  "group relative shrink-0 rounded-full border px-4 py-2.5 text-left text-sm whitespace-nowrap transition-colors duration-300",
                  "lg:flex lg:items-baseline lg:gap-4 lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:px-0 lg:py-4 lg:text-base",
                  selected
                    ? "border-fg bg-fg text-ink lg:bg-transparent lg:text-fg"
                    : "border-line-strong text-fg-muted hover:text-fg",
                )}
              >
                <span
                  className={cn(
                    "label hidden transition-colors lg:inline",
                    selected ? "text-accent" : "text-fg-subtle group-hover:text-fg-muted",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="lg:transition-transform lg:duration-500 lg:ease-out-expo lg:group-aria-selected:translate-x-1.5">
                  {item.label}
                </span>
                {selected && (
                  <m.span
                    layoutId="specimen-tab"
                    className="absolute top-0 bottom-0 -left-3 hidden w-px bg-accent lg:block"
                    transition={{ type: "spring", stiffness: 400, damping: 36 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Specimen */}
      <div id="specimen-panel" role="tabpanel" aria-labelledby={`tab-${mode}`} className="min-w-0 lg:col-span-8">
        <div className="overflow-hidden rounded-[1.75rem] border border-line bg-ink-2">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-5">
            <div className="flex items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              <span className="label text-fg-muted">Живой образец · kiln.demo</span>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-line p-1" role="group" aria-label="Ширина превью">
              {devices.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={device === id}
                  aria-label={`${label} — ${LOGICAL_WIDTH[id]}px`}
                  onClick={() => {
                    setAutoCycle(false);
                    setDevice(id);
                  }}
                  className={cn(
                    "grid size-9 place-items-center rounded-full transition-colors",
                    device === id ? "bg-fg text-ink" : "text-fg-muted hover:text-fg",
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Stage */}
          <div className="relative bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:18px_18px] p-4 md:p-6">
            <div
              ref={stageRef}
              className="relative mx-auto h-[26rem] sm:h-[30rem] lg:h-[34rem]"
              style={{ perspective: spatial ? "2200px" : undefined }}
            >
              {measured && (
                <m.div
                  className={cn(
                    "absolute top-0 left-1/2 h-full -translate-x-1/2 rounded-[14px] bg-[#f4f0e8] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/10",
                    spatial ? "overflow-visible" : "overflow-hidden",
                  )}
                  style={{ width: frameW, transformStyle: "preserve-3d" }}
                  animate={
                    spatial
                      ? { rotateX: 52, rotateZ: -24, scale: 0.72, y: -30 }
                      : { rotateX: 0, rotateZ: 0, scale: 1, y: 0 }
                  }
                  transition={{ duration: reduced ? 0 : 1.1, ease: ease.outExpo }}
                >
                  <m.div
                    inert
                    aria-hidden="true"
                    className={cn(
                      "no-scrollbar absolute top-0 left-0 origin-top-left",
                      spatial ? "overflow-visible" : "overflow-y-auto",
                    )}
                    style={{
                      width: logicalW,
                      height: logicalH,
                      scale,
                      transformStyle: "preserve-3d",
                      ["--s" as string]: scale,
                    }}
                  >
                    <MockSite
                      mode={mode}
                      animateKey={replayKey}
                      demoEmail={demoEmail}
                      demoValid={mode === "backend" && demoResult ? demoResult.valid : null}
                      interactionState={mode === "interaction" ? interaction : "default"}
                    />
                  </m.div>
                </m.div>
              )}
            </div>
          </div>

          {/* Inspector */}
          <div className="border-t border-line px-5 py-6 md:px-7 md:py-7">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: ease.outExpo }}
                className="min-h-[12rem]"
              >
                <p className="mb-6 max-w-xl text-fg">{active.caption}</p>
                <Inspector
                  mode={mode}
                  device={device}
                  demoEmail={demoEmail}
                  onDemoEmail={setDemoEmail}
                  demoResult={demoResult}
                  onReplay={() => setReplayKey((k) => k + 1)}
                  interactionState={interaction}
                  onInteractionState={setInteraction}
                />
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
