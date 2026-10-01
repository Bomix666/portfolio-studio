import type { ProjectTypeValue } from "./contact";

/** Тексты секций, кроме проектов. Меняйте свободно — компоненты выводят то, что здесь. */

export const services = [
  {
    index: "01",
    title: "Сайты",
    projectType: "website" as ProjectTypeValue,
    body: "Имиджевые сайты и бренд-платформы, которые быстро загружаются и узнаются с первого взгляда.",
    tags: ["Бренд-сайты", "CMS", "SEO"],
  },
  {
    index: "02",
    title: "Интернет-магазины",
    projectType: "ecommerce" as ProjectTypeValue,
    body: "Магазины, в которых товар, история бренда и оформление заказа складываются в единый опыт.",
    tags: ["Headless", "UX каталога", "Платежи"],
  },
  {
    index: "03",
    title: "Цифровые продукты",
    projectType: "web-app" as ProjectTypeValue,
    body: "Платформы, дашборды и инструменты — от первого сценария до готового продукта.",
    tags: ["Веб-приложения", "SaaS", "Внутренние сервисы"],
  },
  {
    index: "04",
    title: "UI/UX-дизайн",
    projectType: "ui-ux" as ProjectTypeValue,
    body: "Сценарии, прототипы и интерфейсные системы — решения, которые можно проверить до разработки.",
    tags: ["UX-архитектура", "Прототипирование", "Дизайн-системы"],
  },
  {
    index: "05",
    title: "3D / WebGL",
    projectType: "3d-webgl" as ProjectTypeValue,
    body: "Сцены в реальном времени, 3D-витрины товаров и интерактивные моменты прямо в браузере.",
    tags: ["Three.js", "R3F", "Шейдеры"],
  },
  {
    index: "06",
    title: "Креативная разработка",
    projectType: "other" as ProjectTypeValue,
    body: "Моушн, микровзаимодействия и детали, которые запоминаются.",
    tags: ["Моушн", "Скролл-истории", "Прототипы"],
  },
  {
    index: "07",
    title: "Бэкенд и интеграции",
    projectType: "web-app" as ProjectTypeValue,
    body: "API, базы данных, CMS и внешние сервисы — подключены правильно и задокументированы.",
    tags: ["Node.js", "Django", "PostgreSQL"],
  },
  {
    index: "08",
    title: "Техподдержка",
    projectType: "other" as ProjectTypeValue,
    body: "Мониторинг, обновления и развитие после запуска. Мы не исчезаем.",
    tags: ["Сопровождение", "Скорость", "Безопасность"],
  },
] as const;

export const processSteps = [
  {
    index: "01",
    title: "Исследование",
    body: "Разбираемся в бизнесе, аудитории и в том, что на самом деле значит успех. Сначала цели, потом пиксели.",
    output: ["Бриф", "Цели и ограничения", "Объём работ"],
  },
  {
    index: "02",
    title: "UX / Архитектура",
    body: "Структура раньше стиля: карта сайта, пользовательские сценарии и иерархия контента, проверенные на прототипах.",
    output: ["Карта сайта", "Сценарии", "Прототипы"],
  },
  {
    index: "03",
    title: "Визуальный дизайн",
    body: "Визуальная система вашего бренда — типографика, цвет, движение и компоненты, а не разрозненные экраны.",
    output: ["Дизайн-система", "Ключевые экраны", "Прототип"],
  },
  {
    index: "04",
    title: "Разработка",
    body: "Продакшн-фронтенд и бэкенд: быстрые, доступные и удобные в редактировании.",
    output: ["Фронтенд", "Бэкенд и CMS", "Интеграции"],
  },
  {
    index: "05",
    title: "Тестирование",
    body: "Скорость, адаптивность, доступность и безопасность — проверяем на реальных устройствах.",
    output: ["QA", "Core Web Vitals", "Аудит доступности"],
  },
  {
    index: "06",
    title: "Запуск",
    body: "Деплой, мониторинг, развитие. С запуска всё только начинается — дальше мы измеряем.",
    output: ["Деплой", "Мониторинг", "Передача проекта"],
  },
] as const;

export type StackLayer = "Интерфейс" | "Графика" | "Сервер" | "Данные" | "Инфраструктура";

export interface Tech {
  id: string;
  name: string;
  layer: StackLayer;
  use: string;
  links: string[];
}

/** Технологии, сгруппированные по слоям продукта. `links` рисует линии связей. */
export const stack: Tech[] = [
  { id: "react", name: "React", layer: "Интерфейс", use: "Компонентная архитектура каждого интерфейса, который мы выпускаем.", links: ["nextjs", "typescript", "threejs"] },
  { id: "nextjs", name: "Next.js", layer: "Интерфейс", use: "Наш выбор по умолчанию для сайтов и продуктов: статика — где можно, сервер — где нужно.", links: ["react", "typescript", "tailwind", "node", "cloudflare"] },
  { id: "typescript", name: "TypeScript", layer: "Интерфейс", use: "Типы от начала до конца — от контрактов API до пропсов интерфейса.", links: ["react", "nextjs", "node", "rest"] },
  { id: "tailwind", name: "Tailwind CSS", layer: "Интерфейс", use: "Дизайн-токены, выраженные прямо в коде.", links: ["nextjs"] },
  { id: "threejs", name: "Three.js", layer: "Графика", use: "3D-сцены в реальном времени, 3D-витрины и генеративная графика.", links: ["webgl", "react"] },
  { id: "webgl", name: "WebGL", layer: "Графика", use: "Шейдеры и рендеринг на GPU, когда возможностей DOM уже не хватает.", links: ["threejs"] },
  { id: "node", name: "Node.js", layer: "Сервер", use: "API, серверный рендеринг и интеграции на том же языке, что и фронтенд.", links: ["nextjs", "typescript", "rest", "postgres", "docker"] },
  { id: "python", name: "Python", layer: "Сервер", use: "Обработка данных, автоматизация и бэкенд-сервисы.", links: ["django"] },
  { id: "django", name: "Django", layer: "Сервер", use: "Надёжные бэкенды с админкой и контентные платформы.", links: ["python", "postgres", "rest", "docker"] },
  { id: "rest", name: "REST API", layer: "Сервер", use: "Понятные задокументированные контракты между системами.", links: ["node", "django", "typescript"] },
  { id: "postgres", name: "PostgreSQL", layer: "Данные", use: "База, которой мы доверяем критичные для бизнеса данные.", links: ["node", "django", "docker"] },
  { id: "docker", name: "Docker", layer: "Инфраструктура", use: "Воспроизводимые окружения — от ноутбука до продакшна.", links: ["node", "django", "postgres", "github"] },
  { id: "cloudflare", name: "Cloudflare", layer: "Инфраструктура", use: "Кеширование на edge, DNS и защита перед всем остальным.", links: ["nextjs", "github"] },
  { id: "github", name: "GitHub", layer: "Инфраструктура", use: "Код-ревью, CI и пайплайны деплоя.", links: ["docker", "cloudflare"] },
];

export const stackLayers: StackLayer[] = ["Интерфейс", "Графика", "Сервер", "Данные", "Инфраструктура"];
