"use client";

import { m } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOGICAL_WIDTH, type DeviceId, type ModeId } from "./modes";

/** Поясняющая панель под образцом — отдельный вид для каждой дисциплины. */
export function Inspector({
  mode,
  device,
  demoEmail,
  onDemoEmail,
  demoResult,
  onReplay,
  interactionState,
  onInteractionState,
}: {
  mode: ModeId;
  device: DeviceId;
  demoEmail: string;
  onDemoEmail: (v: string) => void;
  demoResult: { valid: boolean; message?: string } | null;
  onReplay: () => void;
  interactionState: InteractionState;
  onInteractionState: (s: InteractionState) => void;
}) {
  switch (mode) {
    case "ui":
      return <UiPanel />;
    case "ux":
      return <UxPanel />;
    case "responsive":
      return <ResponsivePanel device={device} />;
    case "system":
      return <SystemPanel />;
    case "interaction":
      return <InteractionPanel state={interactionState} onState={onInteractionState} />;
    case "motion":
      return <MotionPanel onReplay={onReplay} />;
    case "spatial":
      return <SpatialPanel />;
    case "frontend":
      return <CodePanel />;
    case "backend":
      return <BackendPanel email={demoEmail} onEmail={onDemoEmail} result={demoResult} />;
  }
}

export type InteractionState = "default" | "hover" | "focus" | "pressed" | "loading" | "disabled";

function Heading({ children }: { children: React.ReactNode }) {
  return <p className="label mb-4 text-fg-subtle">{children}</p>;
}

function UiPanel() {
  const swatches = [
    { name: "Глина", hex: "#B86B45" },
    { name: "Графит", hex: "#1D1A16" },
    { name: "Бумага", hex: "#F4F0E8" },
    { name: "Шалфей", hex: "#56604F" },
    { name: "Песок", hex: "#E2D4C0" },
  ];
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <Heading>Палитра</Heading>
        <ul className="flex gap-3">
          {swatches.map((s) => (
            <li key={s.name} className="text-center">
              <span className="block size-11 rounded-full border border-white/10" style={{ background: s.hex }} />
              <span className="mt-2 block font-mono text-[10px] text-fg-subtle">{s.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Heading>Шрифтовая пара</Heading>
        <div className="flex items-baseline gap-5">
          <span className="font-serif text-5xl leading-none text-fg italic">Аа</span>
          <div className="space-y-1 font-mono text-[11px] text-fg-muted">
            <p>Заголовки — Serif 80/0.95</p>
            <p>Текст — Sans 16/1.6</p>
            <p>Подписи — 12 / +18% капс</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UxPanel() {
  const hierarchy = ["Навигация", "Ценностное предложение", "Главное действие", "Каталог товаров", "Удержание"];
  const flow = ["Главная", "Коллекция", "Товар", "Корзина", "Оформление"];
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <Heading>Порядок чтения</Heading>
        <ol className="space-y-1.5">
          {hierarchy.map((h, i) => (
            <li key={h} className="flex items-center gap-3 text-sm text-fg-muted">
              <span className="grid size-5 place-items-center rounded-full bg-accent font-mono text-[10px] text-accent-ink">{i + 1}</span>
              {h}
            </li>
          ))}
        </ol>
      </div>
      <div>
        <Heading>Основной сценарий</Heading>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {flow.map((f, i) => (
            <li key={f} className="flex items-center gap-2">
              <span className="rounded-full border border-line-strong px-3 py-1 text-xs text-fg">{f}</span>
              {i < flow.length - 1 && <ArrowRight aria-hidden="true" className="size-3 text-fg-subtle" />}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-fg-muted">Пять экранов от первого визита до покупки — ничего лишнего на пути.</p>
      </div>
    </div>
  );
}

function ResponsivePanel({ device }: { device: DeviceId }) {
  const widths: DeviceId[] = ["mobile", "tablet", "desktop"];
  const names: Record<DeviceId, string> = { mobile: "телефон", tablet: "планшет", desktop: "десктоп" };
  return (
    <div>
      <Heading>Брейкпоинты · текущая ширина {LOGICAL_WIDTH[device]}px</Heading>
      <div className="relative h-10">
        <div className="absolute inset-x-0 top-1/2 h-px bg-line-strong" />
        {widths.map((w) => {
          const left = (LOGICAL_WIDTH[w] / 1280) * 100;
          const on = w === device;
          return (
            <div key={w} className="absolute top-0 -translate-x-full text-right" style={{ left: `${left}%` }}>
              <span className={cn("block h-10 border-r", on ? "border-accent" : "border-line-strong")} />
              <span className={cn("absolute top-full right-0 mt-1 font-mono text-[10px] whitespace-nowrap", on ? "text-accent" : "text-fg-subtle")}>
                {names[w]} · {LOGICAL_WIDTH[w]}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-9 text-sm text-fg-muted">
        Навигация сворачивается, первый экран перестраивается в колонку, а сетка товаров переходит с трёх
        колонок на одну — по ширине контейнера, поэтому компоненты адаптируются, где бы они ни стояли.
      </p>
    </div>
  );
}

function SystemPanel() {
  const rows = [
    ["Button / Primary", "radius.pill · space.14/24 · ink"],
    ["Card / Product", "radius.14 · space.12 · type.body"],
    ["Input / Email", "radius.pill · surface.inverse"],
    ["Type / Display", "serif 80 / 0.95 · tracking −2%"],
  ];
  return (
    <div>
      <Heading>Компоненты → токены</Heading>
      <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line py-2">
            <dt className="text-sm text-fg">{k}</dt>
            <dd className="font-mono text-[10px] text-fg-subtle">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function InteractionPanel({ state, onState }: { state: InteractionState; onState: (s: InteractionState) => void }) {
  const states: InteractionState[] = ["default", "hover", "focus", "pressed", "loading", "disabled"];
  const names: Record<InteractionState, string> = {
    default: "обычное",
    hover: "наведение",
    focus: "фокус",
    pressed: "нажатие",
    loading: "загрузка",
    disabled: "недоступно",
  };
  return (
    <div>
      <Heading>Button / Primary — состояния (выберите для превью)</Heading>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Состояние кнопки">
        {states.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={state === s}
            onClick={() => onState(s)}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-[11px] transition-colors",
              state === s ? "border-accent bg-accent text-accent-ink" : "border-line-strong text-fg-muted hover:text-fg",
            )}
          >
            {names[s]}
          </button>
        ))}
      </div>
      <p className="mt-5 text-sm text-fg-muted">
        Каждое состояние проектируется до разработки — включая те, что люди видят, только когда что-то
        работает медленно или недоступно.
      </p>
    </div>
  );
}

function MotionPanel({ onReplay }: { onReplay: () => void }) {
  // cubic-bezier(0.16, 1, 0.3, 1) — наш «expo out».
  const path = "M 0 100 C 16 0, 30 0, 100 0";
  return (
    <div className="grid gap-8 sm:grid-cols-[10rem_1fr] sm:items-center">
      <svg viewBox="-6 -6 112 112" className="size-40" aria-hidden="true">
        <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgb(255 255 255 / 0.08)" />
        <path d={path} fill="none" stroke="#f2a33a" strokeWidth="1.5" />
        <m.circle
          r="3"
          fill="#f4f3ef"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 1.4, ease: "linear", repeat: 2, repeatDelay: 0.6 }}
          style={{ offsetPath: `path("${path}")` }}
        />
      </svg>
      <div>
        <Heading>Токены времени</Heading>
        <ul className="space-y-1 font-mono text-[11px] text-fg-muted">
          <li>ease.out-expo — cubic-bezier(.16, 1, .3, 1)</li>
          <li>появление — 1000ms · шаг 60ms</li>
          <li>наведение — 300ms · нажатие — scale .97</li>
        </ul>
        <button
          type="button"
          onClick={onReplay}
          className="mt-5 rounded-full border border-line-strong px-4 py-2 text-sm text-fg transition-colors hover:border-fg"
        >
          Повторить анимацию
        </button>
      </div>
    </div>
  );
}

function SpatialPanel() {
  const layers = [
    ["Z 150", "Главное действие"],
    ["Z 110", "Заголовок и текст"],
    ["Z 70", "Навигация · карточки"],
    ["Z 55", "Медиа первого экрана"],
    ["Z 0", "Холст"],
  ];
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <Heading>Карта глубины</Heading>
        <ul className="space-y-1.5">
          {layers.map(([z, name]) => (
            <li key={z} className="flex gap-4 text-sm">
              <span className="w-12 font-mono text-[11px] text-accent">{z}</span>
              <span className="text-fg-muted">{name}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-fg-muted">
        Интерфейс — это стопка слоёв. Мы так его и проектируем, поэтому переход к 3D в реальном времени
        (Three.js, WebGL) для нас продолжение, а не прыжок. Посмотрите на арт-объект в разделе «О студии».
      </p>
    </div>
  );
}

const code: [string, string][][] = [
  [["kw", "export function "], ["fn", "ProductCard"], ["p", "({ product }: "], ["ty", "Props"], ["p", ") {"]],
  [["kw", "  return "], ["p", "("]],
  [["p", "    <"], ["tag", "article"], ["at", " className"], ["p", "="], ["str", '"group rounded-[14px]"'], ["p", ">"]],
  [["p", "      <"], ["tag", "Image"], ["at", " src"], ["p", "={product.image} "], ["at", "alt"], ["p", "={product.name} />"]],
  [["p", "      <"], ["tag", "h3"], ["at", " className"], ["p", "="], ["str", '"text-body"'], ["p", ">{product.name}</"], ["tag", "h3"], ["p", ">"]],
  [["p", "      <"], ["tag", "Price"], ["at", " value"], ["p", "={product.price} "], ["at", "currency"], ["p", "="], ["str", '"RUB"'], ["p", " />"]],
  [["p", "    </"], ["tag", "article"], ["p", ">"]],
  [["p", "  );"]],
  [["p", "}"]],
];

const tone: Record<string, string> = {
  kw: "text-accent-soft",
  fn: "text-fg",
  ty: "text-[#9cc2ff]",
  tag: "text-[#9cc2ff]",
  at: "text-fg-muted",
  str: "text-success",
  p: "text-fg-subtle",
};

function CodePanel() {
  return (
    <div>
      <Heading>ProductCard.tsx — компонент, из которого собрана каждая карточка выше</Heading>
      <pre className="no-scrollbar overflow-x-auto rounded-2xl border border-line bg-ink p-4 font-mono text-[11.5px] leading-relaxed" data-lenis-prevent>
        <code>
          {code.map((line, i) => (
            <span key={i} className="block">
              <span className="mr-4 inline-block w-4 text-right text-fg-subtle/50 select-none">{i + 1}</span>
              {line.map(([t, text], j) => (
                <span key={j} className={tone[t]}>
                  {text}
                </span>
              ))}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function BackendPanel({
  email,
  onEmail,
  result,
}: {
  email: string;
  onEmail: (v: string) => void;
  result: { valid: boolean; message?: string } | null;
}) {
  const steps = ["Валидация (Zod)", "Лимит запросов", "Антиспам", "Доставка"];
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <label htmlFor="demo-email" className="label mb-3 block text-fg-subtle">
          Попробуйте — введите email
        </label>
        <div className="flex items-center gap-2 rounded-full border border-line-strong bg-ink px-4 py-2 focus-within:border-fg">
          <input
            id="demo-email"
            type="email"
            inputMode="email"
            autoComplete="off"
            spellCheck={false}
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            placeholder="name@company.ru"
            className="min-w-0 flex-1 bg-transparent py-1 text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
            aria-describedby="demo-email-result"
          />
          {result && (
            <span
              className={cn("grid size-6 place-items-center rounded-full", result.valid ? "bg-success text-ink" : "bg-danger text-ink")}
              aria-hidden="true"
            >
              {result.valid ? <Check className="size-3.5" /> : <X className="size-3.5" />}
            </span>
          )}
        </div>
        <p id="demo-email-result" className="mt-2 min-h-5 text-xs text-fg-muted" aria-live="polite">
          {result
            ? result.valid
              ? "Корректно — сервер это примет."
              : result.message
            : "Проверяется той же схемой, что и POST /api/contact."}
        </p>
      </div>
      <div>
        <Heading>Цепочка обработки запроса</Heading>
        <ol className="flex flex-wrap items-center gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="rounded-full border border-line-strong px-3 py-1 font-mono text-[10.5px] text-fg-muted">{s}</span>
              {i < steps.length - 1 && <ArrowRight aria-hidden="true" className="size-3 text-fg-subtle" />}
            </li>
          ))}
        </ol>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-line bg-ink p-3 font-mono text-[10.5px] leading-relaxed text-fg-muted">
{`// ожидаемый ответ сервера для этого поля
${result?.valid === false ? `422 { "fieldErrors": { "email": "${result.message ?? "Ошибка"}" } }` : `200 { "ok": true }`}`}
        </pre>
      </div>
    </div>
  );
}
