import type { Project } from "@/config/projects";
import { cn } from "@/lib/utils";

/** Distinguishes real client work from studio concepts — everywhere a project appears. */
export function KindBadge({ kind }: { kind: Project["kind"] }) {
  return (
    <span
      className={cn(
        "label inline-flex items-center gap-2 rounded-full px-3 py-1.5",
        kind === "client" ? "bg-white/[0.06] text-fg-muted" : "border border-dashed border-white/25 text-fg-muted",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", kind === "client" ? "bg-accent" : "border border-fg-muted")}
      />
      {kind === "client" ? "Клиентский проект" : "Концепт студии"}
    </span>
  );
}
