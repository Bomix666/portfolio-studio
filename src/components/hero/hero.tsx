import type { CSSProperties } from "react";
import { Mail } from "lucide-react";
import { CtaLink } from "@/components/ui/button";
import { InstagramIcon, TelegramIcon } from "@/components/ui/brand-icons";
import { siteConfig } from "@/config/site";
import { HeroVideo } from "./hero-video";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const socials = [
  { href: siteConfig.socials.instagram.href, label: "Instagram", Icon: InstagramIcon, external: true },
  { href: siteConfig.socials.telegram.href, label: "Telegram", Icon: TelegramIcon, external: true },
  { href: `mailto:${siteConfig.contact.email}`, label: "Почта", Icon: Mail, external: false },
];

/**
 * Hero — adapted from the liquid-glass "Motion AI" reference: full-bleed film, glass
 * controls, serif headline. The entrance is CSS-only so the headline (the LCP element)
 * paints before hydration.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black"
    >
      <HeroVideo />

      {/* Legibility: top scrim for nav + headline, bottom fade into the page */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[55%] bg-linear-to-b from-black via-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-ink to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_55%,rgb(0_0_0/0.55)_100%)]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pt-32 pb-10 text-center md:px-6 md:pt-28 [@media(min-height:860px)]:md:-translate-y-[9%]">
        <p className="label hero-fade mb-7 inline-flex items-center gap-2.5 text-white/65 md:mb-9" style={delay(150)}>
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_12px_rgb(242_163_58/0.8)]" aria-hidden="true" />
          Дизайн · Разработка · Моушн
        </p>

        <h1 id="hero-title" className="font-serif text-[min(var(--text-display-xl),15.5svh)] leading-[0.92] tracking-[-0.025em] text-white">
          <span className="hero-line">
            <span style={delay(220)}>Цифровые впечатления,</span>
          </span>
          <span className="hero-line">
            <span style={delay(340)}>
              которые <em className="italic text-white/90">запоминаются.</em>
            </span>
          </span>
        </h1>

        <p
          className="hero-fade mt-7 max-w-[34rem] px-2 text-[0.975rem] leading-relaxed text-white/75 md:mt-9 md:text-body-l"
          style={delay(650)}
        >
          Проектируем и разрабатываем сайты, цифровые продукты и интерактивные проекты — для брендов,
          которые не хотят выглядеть как все.
        </p>

        <div className="hero-fade mt-9 flex flex-wrap items-center justify-center gap-3 md:mt-11" style={delay(800)}>
          <CtaLink href="/#contact">Обсудить проект</CtaLink>
          <CtaLink href="/#work" variant="glass">
            Смотреть работы
          </CtaLink>
        </div>
      </div>

      <div
        className="fade-in relative z-10 grid grid-cols-3 items-end gap-4 px-5 pb-8 md:px-10 md:pb-10"
        style={delay(1100)}
      >
        <div className="hidden items-center gap-3 md:flex">
          <span className="scroll-cue relative block h-10 w-px overflow-hidden bg-white/15" aria-hidden="true" />
          <span className="label text-white/55">Листайте</span>
        </div>

        <ul className="col-span-3 flex justify-center gap-3 md:col-span-1 md:gap-4" aria-label="Каналы связи студии">
          {socials.map(({ href, label, Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={external ? `${label} (откроется в новой вкладке)` : label}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="liquid-glass grid size-12 place-items-center rounded-full text-white/80 transition-all duration-300 hover:bg-white/5 hover:text-white md:size-14"
              >
                <Icon size={20} className="size-5" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        <p className="label hidden items-center justify-end gap-2 text-right text-white/55 md:flex">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          {siteConfig.availability}
        </p>
      </div>
    </section>
  );
}
