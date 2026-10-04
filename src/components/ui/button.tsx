import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./magnetic";
import { SmartLink } from "./smart-link";

type Variant = "primary" | "glass";

const base =
  "group inline-flex items-center gap-3 rounded-full text-sm font-medium transition-[background-color,color,scale,box-shadow] duration-300 active:scale-[0.97]";

/**
 * Primary: on hover/focus the amber floods the pill from behind the arrow disc (.btn-flood).
 * Glass: only ever sits on imagery — the rim brightens and the fill lifts.
 */
export const buttonVariants: Record<Variant, string> = {
  primary: "btn-flood bg-fg text-ink pl-6 pr-1.5 py-1.5",
  glass:
    "liquid-glass bg-black/25! text-white px-6 py-3 hover:bg-white/10! hover:shadow-[inset_0_1px_1px_rgb(255_255_255/0.25),0_0_0_1px_rgb(255_255_255/0.12)]",
};

export const buttonBase = base;

/** Two stacked copies of the label that roll on hover. */
export function RollingLabel({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

/** The dark disc at the end of a primary button. */
export function ButtonDisc({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <span className={cn("grid size-9 place-items-center overflow-hidden rounded-full bg-ink text-fg", className)}>
      {children ?? (
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45 group-focus-visible:rotate-45"
        />
      )}
    </span>
  );
}

export function CtaLink({
  href,
  children,
  variant = "primary",
  magnetic = true,
  className,
  icon,
}: {
  href: string;
  children: string;
  variant?: Variant;
  magnetic?: boolean;
  className?: string;
  icon?: ReactNode;
}) {
  const link = (
    <SmartLink href={href} className={cn(base, buttonVariants[variant], className)}>
      <RollingLabel>{children}</RollingLabel>
      {variant === "primary" && <ButtonDisc>{icon}</ButtonDisc>}
    </SmartLink>
  );

  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}
