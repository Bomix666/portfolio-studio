"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { useSmoothScroll } from "@/components/providers/smooth-scroll";

type SmartLinkProps = ComponentProps<typeof Link> & { href: string };

/**
 * Link that smooth-scrolls to in-page anchors ("/#work" on the home page, or "#work"),
 * and falls back to normal navigation everywhere else. Focus moves to the target
 * section so keyboard and screen-reader users land where sighted users do.
 */
export function SmartLink({ href, onClick, ...props }: SmartLinkProps) {
  const pathname = usePathname();
  const { scrollTo } = useSmoothScroll();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;
    const path = href.slice(0, hashIndex) || pathname;
    if (path !== pathname) return;

    const id = href.slice(hashIndex + 1);
    const target = id ? document.getElementById(id) : null;
    if (!target && id) return;

    e.preventDefault();
    if (target) {
      scrollTo(target);
      history.replaceState(null, "", `#${id}`);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    } else {
      scrollTo(0);
      history.replaceState(null, "", pathname);
    }
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
