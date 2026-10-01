import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { SmartLink } from "@/components/ui/smart-link";
import { navItems, siteConfig } from "@/config/site";
import { BackToTop, FooterWordmark } from "./footer-interactive";

const socials = [siteConfig.socials.telegram, siteConfig.socials.instagram];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="relative overflow-hidden border-t border-line bg-ink">
      <div className="container-x pt-20 pb-8 md:pt-28">
        <div className="grid gap-12 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-fg-muted">
              Независимая digital-студия. Дизайн, разработка и моушн — вместе, от первого эскиза
              до продакшна.
            </p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="group mt-8 inline-flex items-center gap-2 font-serif text-3xl text-fg md:text-4xl"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1px]">
                {siteConfig.contact.email}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-6 text-fg-muted transition-transform duration-500 ease-out-expo group-hover:rotate-45 group-hover:text-fg"
              />
            </a>
          </div>

          <nav className="md:col-span-3 md:col-start-7" aria-label="Навигация в футере">
            <p className="label text-fg-subtle">Навигация</p>
            <ul className="mt-5 space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <SmartLink href={item.href} className="text-fg-muted transition-colors hover:text-fg">
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="label text-fg-subtle">Соцсети</p>
            <ul className="mt-5 space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg"
                  >
                    {s.label}
                    <ArrowUpRight aria-hidden="true" className="size-3.5 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="sr-only">(откроется в новой вкладке)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex md:col-span-1 md:col-start-12 md:justify-end">
            <BackToTop />
          </div>
        </div>

        <FooterWordmark text={siteConfig.name} />

        <div className="label mt-8 flex flex-col gap-4 border-t border-line pt-6 text-fg-subtle md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.legalName}
          </p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {siteConfig.availability}
          </p>
          <Link href="/privacy" className="transition-colors hover:text-fg">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}
