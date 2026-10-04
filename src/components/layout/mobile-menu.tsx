"use client";

import { m } from "motion/react";
import { useEffect, useRef } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { InstagramIcon, TelegramIcon } from "@/components/ui/brand-icons";
import { SmartLink } from "@/components/ui/smart-link";
import { navItems, siteConfig } from "@/config/site";
import { ease } from "@/lib/motion";

const ORIGIN = "calc(100% - 2.75rem) 2.75rem";

/** Full-screen navigation overlay — circular iris reveal from the menu button. */
export function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 250);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <m.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Меню сайта"
      className="fixed inset-0 -z-10 flex flex-col bg-ink px-6 pt-28 pb-10 md:px-10 lg:hidden"
      initial={{ clipPath: `circle(0% at ${ORIGIN})` }}
      animate={{ clipPath: `circle(150% at ${ORIGIN})`, transition: { duration: 0.9, ease: ease.inOutQuart } }}
      exit={{ clipPath: `circle(0% at ${ORIGIN})`, transition: { duration: 0.6, ease: ease.inOutQuart } }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_100%_0%,rgb(242_163_58/0.14),transparent_70%)]"
      />
      <nav aria-label="Мобильная навигация" className="relative flex-1">
        <ul>
          {navItems.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <m.div
                initial={{ y: "110%" }}
                animate={{ y: "0%", transition: { duration: 0.9, ease: ease.outExpo, delay: 0.25 + i * 0.06 } }}
                exit={{ y: "110%", transition: { duration: 0.35, ease: ease.inOutQuart } }}
              >
                <SmartLink
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={onNavigate}
                  className="group flex items-center justify-between gap-4 border-b border-line py-3"
                >
                  <span className="font-serif text-[clamp(2.75rem,12vw,4.5rem)] leading-none text-fg transition-transform duration-500 ease-out-expo group-active:translate-x-2">
                    {item.label}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-6 shrink-0 text-fg-subtle transition-[color,rotate] duration-500 ease-out-expo group-active:rotate-45 group-active:text-accent"
                  />
                </SmartLink>
              </m.div>
            </li>
          ))}
        </ul>
      </nav>

      <m.div
        className="relative space-y-6 pt-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8, ease: ease.outExpo } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <p className="label flex items-center gap-2 text-fg-muted">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          {siteConfig.availability}
        </p>
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="inline-flex min-w-0 items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm text-fg transition-colors active:border-accent"
          >
            <Mail aria-hidden="true" className="size-4" />
            {siteConfig.contact.email}
          </a>
          <a
            href={siteConfig.socials.telegram.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${siteConfig.socials.telegram.label} (откроется в новой вкладке)`}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-fg transition-colors active:border-accent"
          >
            <TelegramIcon size={18} />
          </a>
          <a
            href={siteConfig.socials.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${siteConfig.socials.instagram.label} (откроется в новой вкладке)`}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-fg transition-colors active:border-accent"
          >
            <InstagramIcon size={18} />
          </a>
        </div>
      </m.div>
    </m.div>
  );
}
