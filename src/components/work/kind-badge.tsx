import { kindLabel, type Project } from "@/config/projects";
import { cn } from "@/lib/utils";

/**
 * Says what a project is — everywhere it appears. Only confirmed client work gets the lit dot;
 * concepts and unconfirmed examples are outlined, so nothing reads as a client claim by default.
 */
export function KindBadge({ kind }: { kind: Project["kind"] }) {
  return (
    <span
      className={cn(
        "label inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-white/80 backdrop-blur-md",
        kind !== "client" && "outline outline-1 -outline-offset-1 outline-white/30",
        kind === "concept" && "outline-dashed",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", kind === "client" ? "bg-accent" : "border border-white/70")}
      />
      {kindLabel[kind]}
    </span>
  );
}
