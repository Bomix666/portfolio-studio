import { ArrowUpRight, Mail } from "lucide-react";
import { InstagramIcon, TelegramIcon } from "@/components/ui/brand-icons";
import { Reveal, RevealText } from "@/components/ui/reveal";
import { siteConfig } from "@/config/site";
import { ContactForm } from "./contact-form";

const methods = [
  {
    label: "Почта",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    Icon: Mail,
    external: false,
  },
  {
    label: "Telegram",
    value: siteConfig.socials.telegram.handle,
    href: siteConfig.socials.telegram.href,
    Icon: TelegramIcon,
    external: true,
  },
  {
    label: "Instagram",
    value: siteConfig.socials.instagram.handle,
    href: siteConfig.socials.instagram.href,
    Icon: InstagramIcon,
    external: true,
  },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y relative overflow-hidden">
      {/* Final-chapter light: warm horizon glow + faint grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_60%_at_30%_100%,rgb(242_163_58/0.14),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.025)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.025)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(70%_60%_at_40%_60%,black,transparent)]" />
      </div>

      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-5">
          <RevealText
            id="contact-title"
            text={"Есть идея,\nкоторую *стоит воплотить?*"}
            className="font-serif text-[clamp(2.6rem,1.2rem+3.9vw,4.75rem)] leading-[0.98] tracking-[-0.02em] text-fg"
          />
          <Reveal variant="blur" delay={0.2}>
            <p className="mt-8 text-body-l text-fg">Расскажите, над чем вы работаете.</p>
            <p className="mt-3 max-w-sm text-fg-muted">
              Достаточно даже черновой идеи. Каждое сообщение читают те, кто потом будет делать работу.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <ul className="mt-12 border-t border-line" aria-label="Другие способы связаться">
              {methods.map(({ label, value, href, Icon, external }) => (
                <li key={label} className="border-b border-line">
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 py-5"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-fg-muted transition-all duration-500 ease-out-expo group-hover:border-fg group-hover:bg-fg group-hover:text-ink">
                      <Icon aria-hidden="true" size={18} className="size-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="label block text-fg-subtle">{label}</span>
                      <span className="mt-1 block truncate text-fg transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                        {value}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 shrink-0 text-fg-subtle transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:text-fg"
                    />
                    {external && <span className="sr-only">(откроется в новой вкладке)</span>}
                  </a>
                </li>
              ))}
            </ul>
            {siteConfig.placeholderContacts && (
              <p className="mt-4 text-sm text-fg-subtle">
                Контакты на этой странице временные: настоящие появятся перед запуском.
              </p>
            )}
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
