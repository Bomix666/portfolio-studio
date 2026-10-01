import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./magnetic";
import { SmartLink } from "./smart-link";

type Variant = "primary" | "glass";

const base =
  "group relative inline-flex items-center gap-3 rounded-full text-sm font-medium transition-[background-color,color,transform] duration-300 active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary: "bg-fg text-ink pl-6 pr-1.5 py-1.5 hover:bg-white",
  glass: "liquid-glass bg-black/25! text-white px-6 py-3 hover:bg-white/10!",
};

/** Two stacked copies of the label that roll on hover. */
export function RollingLabel({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
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
    <SmartLink href={href} className={cn(base, variants[variant], className)}>
      <RollingLabel>{children}</RollingLabel>
      {variant === "primary" && (
        <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-ink text-fg">
          {icon ?? (
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45"
            />
          )}
        </span>
      )}
    </SmartLink>
  );

  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}
