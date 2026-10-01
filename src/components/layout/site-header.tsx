"use client";

import { AnimatePresence, m } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSmoothScroll } from "@/components/providers/smooth-scroll";
import { Logo } from "@/components/ui/logo";
import { SmartLink } from "@/components/ui/smart-link";
import { Magnetic } from "@/components/ui/magnetic";
import { RollingLabel } from "@/components/ui/button";
import { navItems, siteConfig } from "@/config/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";

const SECTION_IDS = navItems.map((item) => item.href.split("#")[1]!);

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(SECTION_IDS);
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the overlay; unlocking happens synchronously in `close`.
  const lock = useCallback(
    (locked: boolean) => {
      const html = document.documentElement;
      html.style.overflow = locked ? "hidden" : "";
      for (const id of ["main", "site-footer"]) {
        const el = document.getElementById(id);
        if (el) el.inert = locked;
      }
      if (locked) stop();
      else start();
    },
    [stop, start],
  );

  const close = useCallback(
    (restoreFocus = true) => {
      lock(false);
      setOpen(false);
      if (restoreFocus) toggleRef.current?.focus();
    },
    [lock],
  );

  useEffect(() => {
    if (!open) return;
    lock(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lock, close]);

  // Close on route change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) close(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6 md:pt-6">
      <nav
        aria-label="Основная навигация"
        className={cn(
          "mx-auto flex max-w-5xl items-center justify-between rounded-full py-2.5 pr-2.5 pl-5 transition-[transform,background-color] duration-700 ease-out-expo md:pl-6",
          scrolled && !open ? "liquid-glass-strong -translate-y-1 scale-[0.97]" : "liquid-glass",
        )}
      >
        <div className="flex items-center gap-8">
          <SmartLink href="/#top" aria-label={`${siteConfig.name} — на главную`} className="rounded-full">
            <Logo />
          </SmartLink>
          <ul className="hidden items-center lg:flex">
            {navItems.map((item) => {
              const id = item.href.split("#")[1];
              const isActive = pathname === "/" && active === id;
              return (
                <li key={item.href} className="relative">
                  <SmartLink
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative block rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                      isActive ? "text-white" : "text-white/70 hover:text-white",
                    )}
                  >
                    {isActive && (
                      <m.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-white/[0.08]"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </SmartLink>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          {/* Главный CTA виден и на телефонах (≥360px) — это единственное действие, которое важно. */}
          <div className="hidden min-[360px]:block">
            <Magnetic>
              <SmartLink
                href="/#contact"
                className="group inline-flex items-center rounded-full bg-fg px-4 py-2 text-[13px] font-medium whitespace-nowrap text-ink transition-colors hover:bg-white active:scale-[0.97] md:px-5 md:py-2.5 md:text-sm"
              >
                <RollingLabel>Обсудить проект</RollingLabel>
              </SmartLink>
            </Magnetic>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="relative grid size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => (open ? close() : setOpen(true))}
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span
                className={cn(
                  "absolute left-0 h-px w-5 bg-current transition-transform duration-500 ease-out-expo",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-px w-5 bg-current transition-transform duration-500 ease-out-expo",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>{open && <MobileMenu onNavigate={() => close(false)} />}</AnimatePresence>
    </header>
  );
}
