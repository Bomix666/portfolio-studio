import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: `Как ${siteConfig.legalName} обрабатывает информацию, которую вы оставляете на сайте.`,
  alternates: { canonical: "/privacy" },
};

/**
 * ШАБЛОН — перед запуском проверьте с юристом под вашу юрисдикцию (для РФ — 152-ФЗ
 * «О персональных данных»; для ЕС — GDPR) и замените плейсхолдеры в квадратных скобках.
 */
const LAST_UPDATED = "[дата]"; // PLACEHOLDER

const sections: { title: string; body: string[] }[] = [
  {
    title: "Кто мы",
    body: [
      `Сайт принадлежит ${siteConfig.legalName} («мы»). По любым вопросам о персональных данных пишите на ${siteConfig.contact.email}. [Юридическое наименование, ИНН/ОГРН, адрес — PLACEHOLDER]`,
    ],
  },
  {
    title: "Какие данные мы получаем",
    body: [
      "Когда вы отправляете форму заявки, мы получаем то, что вы сами указали: имя, email, а также, по желанию, компанию, телефон, тип проекта, бюджет и сообщение.",
      "Мы не используем рекламные и аналитические cookies. Хостинг-провайдер может обрабатывать технические данные, например IP-адреса в серверных логах, — для безопасности и защиты от злоупотреблений.",
    ],
  },
  {
    title: "Зачем мы их используем",
    body: [
      "Только чтобы ответить на вашу заявку и, если мы начнём работать вместе, подготовить предложение. Основание — ваш запрос на обратную связь и ваше согласие, выраженное отправкой формы.",
      "Для защиты формы мы ограничиваем частоту запросов и фильтруем спам; эти проверки используют технические данные запроса и не применяются для профилирования.",
    ],
  },
  {
    title: "Кто их обрабатывает",
    body: [
      "Заявки доставляются к нам через почтовый или интеграционный сервис [укажите сервис, например Resend — PLACEHOLDER]. Мы не продаём ваши данные и не передаём их для маркетинга.",
    ],
  },
  {
    title: "Как долго мы их храним",
    body: [
      "Столько, сколько нужно, чтобы обработать заявку и выполнить возможный проект. Заявки, по которым работа не началась, удаляем в течение [12 месяцев — PLACEHOLDER].",
    ],
  },
  {
    title: "Ваши права",
    body: [
      `Вы можете в любой момент запросить доступ к своим данным, их исправление или удаление, а также отозвать согласие — напишите на ${siteConfig.contact.email}. Вы также вправе обратиться в уполномоченный орган по защите прав субъектов персональных данных.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="container-x pt-36 pb-24 md:pt-44">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <header className="lg:col-span-5">
          <h1 className="max-w-xl font-serif text-display-m break-words hyphens-auto text-fg">
            Политика конфиден{"­"}циальности
          </h1>
          <p className="label mt-6 text-fg-subtle">Обновлено — {LAST_UPDATED}</p>
          {process.env.NODE_ENV !== "production" && (
            <p className="mt-8 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm text-fg">
              Заметка для разработки: это шаблон политики. Проверьте его под свою юрисдикцию и замените
              плейсхолдеры в квадратных скобках перед запуском.
            </p>
          )}
        </header>
        <div className="space-y-12 lg:col-span-7 lg:col-start-6">
          {sections.map((s) => (
            <section key={s.title} className="border-t border-line pt-6">
              <h2 className="font-serif text-display-s text-fg">{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-4 max-w-[62ch] leading-relaxed text-fg-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
