import { cn } from "@/lib/utils";

/**
 * CSS-only stand-in for the WebGL artifact: the same five etched glass layers, arranged
 * in CSS 3D space. Shown before the canvas is ready, without WebGL, and never animated.
 */
export function ArtifactFallback({ className, layout }: { className?: string; layout: "side" | "center" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center [perspective:1400px]",
        layout === "side" ? "justify-end pr-[8vw]" : "justify-center pb-[30vh]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-[min(62vw,34rem)] [transform:rotateX(18deg)_rotateY(-32deg)] [transform-style:preserve-3d]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-md border border-white/20 bg-white/[0.03] shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]"
            style={{ transform: `translateZ(${(i - 2) * 46}px) translateX(${(i - 2) * 14}px)` }}
          >
            <div className="absolute inset-[6%] grid grid-cols-6 gap-2 opacity-60">
              {i === 1 && <div className="col-span-6 h-3 rounded-full border border-white/40" />}
              {i === 2 && <div className="col-span-4 h-5 bg-white/50" />}
              {i === 3 && <div className="col-span-2 h-5 rounded-full bg-white/80" />}
              {i === 4 && <div className="col-span-3 h-2 bg-accent" />}
            </div>
          </div>
        ))}
        <div
          className="absolute top-[62%] left-[58%] h-[8%] w-[26%] rounded-full bg-accent shadow-[0_0_40px_rgb(242_163_58/0.6)]"
          style={{ transform: "translateZ(20px)" }}
        />
      </div>
    </div>
  );
}
