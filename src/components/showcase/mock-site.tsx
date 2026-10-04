"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ModeId } from "./modes";

/**
 * «Kiln» — вымышленный магазин керамики, живой образец для демонстрации.
 * It is laid out at a real logical width and scaled into the device frame, so its
 * container queries (@container) respond exactly as a production page would.
 */

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function Annot({
  mode,
  hotspot,
  token,
  depth = 0,
  className,
  children,
  as: Tag = "div",
}: {
  mode: ModeId;
  hotspot?: number;
  token?: string;
  depth?: number;
  className?: string;
  children: ReactNode;
  as?: "div" | "header" | "section";
}) {
  const showToken = mode === "system" && token;
  const showHotspot = mode === "ux" && hotspot;
  return (
    <Tag
      className={cn("relative transition-[outline-color,transform] duration-700 ease-out-expo", className)}
      style={{
        outline: showToken ? "calc(1.2px / var(--s, 1)) dashed rgb(242 163 58 / 0.9)" : "calc(1px / var(--s, 1)) dashed transparent",
        outlineOffset: "calc(4px / var(--s, 1))",
        transform: mode === "spatial" ? `translateZ(${depth * 70}px)` : "translateZ(0)",
      }}
    >
      {children}
      {showToken && (
        <span
          className="absolute top-0 left-0 z-10 -translate-y-full bg-accent font-mono whitespace-nowrap text-accent-ink"
          style={{ fontSize: "calc(10px / var(--s, 1))", padding: "calc(2px / var(--s, 1)) calc(6px / var(--s, 1))" }}
        >
          {token}
        </span>
      )}
      {showHotspot && (
        <span
          className="absolute top-0 left-0 z-10 grid -translate-x-1/3 -translate-y-1/3 place-items-center rounded-full bg-accent font-mono font-medium text-accent-ink shadow-[0_0_0_6px_rgb(242_163_58/0.25)]"
          style={{ width: "calc(22px / var(--s, 1))", height: "calc(22px / var(--s, 1))", fontSize: "calc(11px / var(--s, 1))" }}
        >
          {hotspot}
        </span>
      )}
    </Tag>
  );
}

function Vase({ tone, shape = 0 }: { tone: string; shape?: number }) {
  const shapes = [
    "M50 8 C38 8 36 20 40 30 C22 44 20 80 32 96 L68 96 C80 80 78 44 60 30 C64 20 62 8 50 8Z",
    "M30 20 L70 20 C74 20 76 24 74 30 C70 60 76 80 70 96 L30 96 C24 80 30 60 26 30 C24 24 26 20 30 20Z",
    "M50 14 C20 14 16 50 22 74 C26 90 36 96 50 96 C64 96 74 90 78 74 C84 50 80 14 50 14Z",
  ];
  return (
    <svg viewBox="0 0 100 100" className="h-[70%] w-auto drop-shadow-[0_18px_18px_rgb(60_40_20/0.25)]" aria-hidden="true">
      <path d={shapes[shape % shapes.length]} fill={tone} />
      <path d={shapes[shape % shapes.length]} fill="url(#vase-light)" />
      <defs>
        <linearGradient id="vase-light" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const products = [
  { name: "Ваза «Прилив»", price: "4 800 ₽", bg: "#e4d9c8", tone: "#b86b45", shape: 0 },
  { name: "Низкая чаша", price: "3 600 ₽", bg: "#d9dccf", tone: "#56604f", shape: 2 },
  { name: "Сосуд-колонна", price: "6 200 ₽", bg: "#e9e2d6", tone: "#2f2b27", shape: 1 },
];

export function MockSite({
  mode,
  animateKey,
  demoEmail,
  demoValid,
  interactionState,
}: {
  mode: ModeId;
  animateKey: number;
  demoEmail: string;
  demoValid: boolean | null;
  interactionState: "default" | "hover" | "focus" | "pressed" | "loading" | "disabled";
}) {
  /** Entrance choreography props — only active in Motion mode (re-keyed to replay). */
  const anim = (ms: number, className = "") => ({
    className: cn(className, mode === "motion" && "hero-fade"),
    style: mode === "motion" ? d(ms) : undefined,
  });
  const cta = interactionState;

  return (
    <div
      key={mode === "motion" ? animateKey : "static"}
      className="@container min-h-full bg-[#f4f0e8] font-sans text-[#1d1a16] [transform-style:preserve-3d]"
    >
      <Annot mode={mode} as="header" hotspot={1} token="Nav / Primary" depth={1.2} className="flex items-center justify-between px-6 py-5 @[700px]:px-12 @[700px]:py-7">
        <div {...anim(0)}>
          <span className="font-serif text-[26px] tracking-[-0.02em] @[700px]:text-[30px]">Kiln</span>
        </div>
        <nav {...anim(60, "hidden items-center gap-9 text-[14px] text-[#1d1a16]/70 @[700px]:flex")}>
          <span>Магазин</span>
          <span>Журнал</span>
          <span>Мастерская</span>
        </nav>
        <div {...anim(120, "flex items-center gap-3")}>
          <span className="rounded-full border border-[#1d1a16]/15 px-4 py-2 text-[13px]">Корзина (2)</span>
          <span className="grid size-10 place-items-center rounded-full border border-[#1d1a16]/15 @[700px]:hidden" aria-hidden="true">
            <span className="block h-px w-4 bg-current shadow-[0_5px_0_currentColor]" />
          </span>
        </div>
      </Annot>

      <section className="grid gap-8 px-6 pt-4 pb-10 @[700px]:grid-cols-[1.05fr_1fr] @[700px]:items-center @[700px]:gap-12 @[700px]:px-12 @[700px]:pt-10 @[700px]:pb-16 [transform-style:preserve-3d]">
        <Annot mode={mode} hotspot={2} token="Type / Display" depth={1.6}>
          <h4
            {...anim(220, "font-serif text-[46px] leading-[0.95] tracking-[-0.02em] @[700px]:text-[64px] @[1100px]:text-[80px]")}
          >
            Предметы для
            <br />
            <em>неспешного утра.</em>
          </h4>
          <p {...anim(300, "mt-5 max-w-[34ch] text-[15px] leading-relaxed text-[#1d1a16]/70 @[700px]:text-[16px]")}>
            Керамика малыми партиями: формуем и глазуруем вручную. Чтобы пользоваться каждый день.
          </p>
          <Annot mode={mode} hotspot={3} token="Button / Primary" depth={2.2} className="mt-7 inline-flex flex-wrap gap-3">
            <span
              {...anim(380)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-medium transition-all duration-300",
                anim(380).className,
                cta === "hover" && "bg-[#3a342d] text-white",
                cta === "focus" && "bg-[#1d1a16] text-white outline-2 outline-offset-4 outline-[#b86b45]",
                cta === "pressed" && "scale-[0.96] bg-[#000] text-white",
                cta === "loading" && "bg-[#1d1a16] text-white/80",
                cta === "disabled" && "bg-[#1d1a16]/30 text-white/80",
                cta === "default" && "bg-[#1d1a16] text-white",
              )}
            >
              {cta === "loading" && <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              Смотреть коллекцию
            </span>
            <span {...anim(420, "rounded-full border border-[#1d1a16]/25 px-6 py-3.5 text-[14px]")}>
              Наш процесс
            </span>
          </Annot>
        </Annot>

        <Annot mode={mode} depth={0.8} token="Media / Hero" className="relative aspect-[4/3] overflow-hidden rounded-t-[999px] rounded-b-[18px] bg-[#e2d4c0] @[700px]:aspect-[5/5]">
          <div {...anim(260, "absolute inset-0 grid place-items-end justify-center pb-[6%]")}>
            <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[#d3c3ac]" />
            <div className="relative flex h-[78%] items-end gap-[4%]">
              <Vase tone="#b86b45" shape={0} />
              <Vase tone="#2f2b27" shape={1} />
            </div>
          </div>
        </Annot>
      </section>

      <Annot mode={mode} as="section" hotspot={4} token="Card / Product" depth={1} className="px-6 pb-12 @[700px]:px-12">
        <div className="mb-5 flex items-end justify-between">
          <p className="font-serif text-[28px] @[700px]:text-[34px]">Хиты продаж</p>
          <span className="text-[13px] text-[#1d1a16]/60 underline underline-offset-4">Смотреть все</span>
        </div>
        <div className="grid grid-cols-1 gap-5 @[520px]:grid-cols-2 @[1000px]:grid-cols-3">
          {products.map((p, i) => (
            <div key={p.name} className={cn(i === 2 && "@[520px]:hidden @[1000px]:block", anim(420 + i * 70).className)} style={anim(420 + i * 70).style}>
              <div className="grid aspect-[4/3] place-items-center rounded-[14px]" style={{ background: p.bg }}>
                <Vase tone={p.tone} shape={p.shape} />
              </div>
              <div className="mt-3 flex justify-between text-[15px]">
                <span>{p.name}</span>
                <span className="text-[#1d1a16]/60">{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </Annot>

      <Annot mode={mode} as="section" hotspot={5} token="Input / Email" depth={1.4} className="mx-6 mb-10 rounded-[20px] bg-[#1d1a16] p-7 text-[#f4f0e8] @[700px]:mx-12 @[700px]:flex @[700px]:items-center @[700px]:justify-between @[700px]:gap-10 @[700px]:p-10">
        <p className="font-serif text-[26px] leading-tight @[700px]:text-[32px]">Письма из мастерской.</p>
        <div className="mt-5 flex w-full max-w-[420px] items-center gap-2 rounded-full bg-white/10 p-1.5 @[700px]:mt-0">
          <span
            className={cn(
              "min-w-0 flex-1 truncate px-4 text-[14px]",
              demoEmail ? "text-white" : "text-white/45",
            )}
          >
            {demoEmail || "name@mail.ru"}
          </span>
          {demoValid !== null && (
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px]",
                demoValid ? "bg-[#8fe0b0] text-[#0c2a18]" : "bg-[#ff7a6b] text-[#2a0c08]",
              )}
            >
              {demoValid ? "верно" : "ошибка"}
            </span>
          )}
          <span className="shrink-0 rounded-full bg-[#f4f0e8] px-5 py-2.5 text-[13px] font-medium text-[#1d1a16]">Подписаться</span>
        </div>
      </Annot>
    </div>
  );
}
