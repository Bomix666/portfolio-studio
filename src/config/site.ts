/**
 * Глобальные настройки студии.
 *
 * Всё, что помечено PLACEHOLDER, нужно заменить перед запуском.
 * Публичные контакты хранятся здесь (это не секреты). Секреты — только в переменных окружения,
 * см. `.env.example`.
 */

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * Статическая выгрузка (GitHub Pages): `npm run build:pages`.
 * Там нет сервера, поэтому API формы недоступно (форма переключается на письмо через mailto),
 * а сайт живёт под подпутём `/<repo>` (basePath).
 */
export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Путь к файлу из `public/` с учётом basePath (Next добавляет его сам только к ссылкам и маршрутам). */
export const asset = (path: string) => `${basePath}${path}`;

export const siteConfig = {
  /** PLACEHOLDER — название студии: логотип, мета-данные, футер. */
  name: "Umbra",
  legalName: "Umbra Studio", // PLACEHOLDER
  descriptor: "Digital-студия",
  url: siteUrl,
  locale: "ru_RU",

  title: "Umbra — цифровые впечатления, которые запоминаются",
  description:
    "Независимая digital-студия: проектируем и разрабатываем сайты, цифровые продукты и интерактивные 3D-проекты для брендов, которые не хотят выглядеть как все.",

  /** Показывается в первом экране и футере. Держите актуальным. */
  availability: "Открыты для новых проектов",

  contact: {
    /** PLACEHOLDER — публичная почта на сайте. */
    email: "hello@example.com",
  },

  socials: {
    /** PLACEHOLDER — замените ник и ссылку. */
    telegram: { label: "Telegram", handle: "@your_handle", href: "https://t.me/your_handle" },
    /** PLACEHOLDER — замените ник и ссылку. */
    instagram: {
      label: "Instagram",
      handle: "@your_handle",
      href: "https://www.instagram.com/your_handle/",
    },
  },

  hero: {
    /**
     * Оптимизированные для веба версии присланного ролика (оригинал: 20 МБ / 16 Мбит/с).
     * Сначала отдаётся AV1/WebM, H.264/MP4 — универсальный запасной вариант.
     */
    video: {
      poster: asset("/media/hero-poster.webp"),
      large: { webm: asset("/media/hero-1920.webm"), mp4: asset("/media/hero-1920.mp4") },
      small: { webm: asset("/media/hero-1280.webm"), mp4: asset("/media/hero-1280.mp4") },
    },
  },
} as const;

export const navItems = [
  { label: "Работы", href: "/#work" },
  { label: "Услуги", href: "/#services" },
  { label: "Процесс", href: "/#process" },
  { label: "О студии", href: "/#about" },
  { label: "Контакты", href: "/#contact" },
] as const;

export type NavItem = (typeof navItems)[number];
