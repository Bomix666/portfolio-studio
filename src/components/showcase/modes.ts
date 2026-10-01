export type ModeId =
  | "ui"
  | "ux"
  | "responsive"
  | "system"
  | "interaction"
  | "motion"
  | "spatial"
  | "frontend"
  | "backend";

export type DeviceId = "desktop" | "tablet" | "mobile";

export const LOGICAL_WIDTH: Record<DeviceId, number> = { desktop: 1280, tablet: 768, mobile: 390 };

export const modes: { id: ModeId; label: string; caption: string }[] = [
  { id: "ui", label: "UI-дизайн", caption: "Типографика, цвет и компоненты, собранные в единый визуальный язык." },
  { id: "ux", label: "UX-архитектура", caption: "Сначала иерархия: что человек видит, в каком порядке и почему." },
  {
    id: "responsive",
    label: "Адаптивность",
    caption: "Одна система вёрстки от 1280 до 390 px — перестраивается вживую на container queries.",
  },
  { id: "system", label: "Дизайн-системы", caption: "Каждый элемент — именованный компонент на общих токенах." },
  {
    id: "interaction",
    label: "Взаимодействия",
    caption: "Продуманы все состояния: наведение, фокус, нажатие, загрузка, недоступность.",
  },
  { id: "motion", label: "Моушн-дизайн", caption: "Срежиссированное появление на общих токенах плавности и длительности." },
  { id: "spatial", label: "3D / WebGL", caption: "Мышление слоями и глубиной — та же модель, что и в нашей WebGL-работе." },
  { id: "frontend", label: "Фронтенд", caption: "Типизированные доступные компоненты. Дизайн — это и есть код." },
  {
    id: "backend",
    label: "Бэкенд-интеграция",
    caption: "Живая валидация по той же схеме, которую наш API проверяет на сервере.",
  },
];
