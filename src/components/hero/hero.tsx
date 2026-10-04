import type { CSSProperties } from "react";
import { Mail } from "lucide-react";
import { CtaLink } from "@/components/ui/button";
import { InstagramIcon, TelegramIcon } from "@/components/ui/brand-icons";
import { siteConfig } from "@/config/site";
import { HeroPin } from "./hero-pin";
import { HeroVideo } from "./hero-video";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const OFFER =
  "Проектируем и разрабатываем сайты, цифровые продукты и интерактивные проекты — для брендов, которые не хотят выглядеть как все.";

const socials = [
  { href: siteConfig.socials.instagram.href, label: "Instagram", Icon: InstagramIcon, external: true },
  { href: siteConfig.socials.telegram.href, label: "Telegram", Icon: TelegramIcon, external: true },
  { href: `mailto:${siteConfig.contact.email}`, label: "Почта", Icon: Mail, external: false },
];

/**
 * Hero — full-bleed film behind glass controls and a serif headline (adapted from the
 * liquid-glass "Motion AI" reference). Composed like a film poster: the title sits in the dark
 * upper band, the actions in the lower band, and the middle of the frame is left to the film's
 * subject — nothing is set over her face. The offer line joins the actions on desktop and sits
 * under the title on phones, where the lower band is too short for it.
 *
 * The film opens through a shutter and the headline rises in CSS only, so the first paint
 * doesn't wait for hydration. HeroPin then keeps the screen pinned while the next section
 * covers it.
 */
export function Hero() {
  return (
    <HeroPin
      film={
        <>
          <HeroVideo />
          {/* Legibility: a scrim behind the title, a deeper one behind the actions */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-[56%] bg-linear-to-b from-black via-black/75 to-transparent md:h-[52%] md:via-black/70" />
            <div className="absolute inset-x-0 bottom-0 h-[40%] bg-linear-to-t from-black via-black/75 to-transparent md:h-[42%]" />
            <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_55%,rgb(0_0_0/0.5)_100%)]" />
          </div>
        </>
      }
    >
      <div className="flex flex-1 flex-col items-center px-5 pt-28 text-center md:px-6 md:pt-32">
        <h1
          id="hero-title"
          className="font-serif text-[min(var(--text-display-xl),15.5svh)] leading-[0.92] tracking-[-0.025em] text-white"
        >
          <span className="hero-line">
            <span style={delay(420)}>Цифровые впечатления,</span>
          </span>
          <span className="hero-line">
            <span style={delay(540)}>
              которые <em className="italic text-white/90">запоминаются.</em>
            </span>
          </span>
        </h1>
        <p className="hero-fade mt-5 max-w-[21.5rem] text-[0.95rem] leading-normal text-white/80 md:hidden" style={delay(850)}>
          {OFFER}
        </p>
      </div>

      <div className="grid items-end gap-x-8 gap-y-6 px-5 pb-7 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:px-10 md:pb-10">
        <div className="hero-fade md:max-w-[27rem]" style={delay(1000)}>
          <p className="hidden text-[1.0625rem] leading-relaxed text-white/80 md:block">{OFFER}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:mt-6 md:justify-start">
            <CtaLink href="/#contact">Обсудить проект</CtaLink>
            <CtaLink href="/#work" variant="glass">
              Смотреть работы
            </CtaLink>
          </div>
        </div>

        <div className="fade-in hidden flex-col items-center gap-3 md:flex" style={delay(1300)}>
          <span className="label text-white/60">Листайте</span>
          <span className="scroll-cue relative block h-10 w-px overflow-hidden bg-white/15" aria-hidden="true" />
        </div>

        {/* Desktop only: on phones the frame has no room for it beside the subject, and the same
            channels are one tap away in the menu. */}
        <div className="fade-in hidden flex-col items-end gap-4 md:flex" style={delay(1300)}>
          <ul className="flex gap-3" aria-label="Каналы связи студии">
            {socials.map(({ href, label, Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={external ? `${label} (откроется в новой вкладке)` : label}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="liquid-glass grid size-12 place-items-center rounded-full text-white/80 transition-[background-color,color,translate,scale] duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white active:scale-95"
                >
                  <Icon size={20} className="size-5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className="label flex items-center gap-2 text-white/60">
            <span
              className="size-1.5 shrink-0 rounded-full bg-accent shadow-[0_2px_10px_rgb(242_163_58/0.7)]"
              aria-hidden="true"
            />
            {siteConfig.availability}
          </p>
        </div>
      </div>
    </HeroPin>
  );
}
