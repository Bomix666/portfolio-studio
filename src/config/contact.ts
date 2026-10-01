/**
 * Варианты в форме заявки. Меняйте подписи и значения здесь — Zod-схема (клиент + сервер)
 * строится из этих массивов, поэтому валидация всегда совпадает с тем, что видит пользователь.
 */

export const projectTypes = [
  { value: "website", label: "Сайт" },
  { value: "ecommerce", label: "Интернет-магазин" },
  { value: "web-app", label: "Веб-приложение" },
  { value: "ui-ux", label: "UI/UX-дизайн" },
  { value: "3d-webgl", label: "3D / WebGL" },
  { value: "other", label: "Другое" },
] as const;

/** Диапазоны ориентировочные и легко меняются — это не прайс. Можно перевести в рубли. */
export const budgets = [
  { value: "lt-2k", label: "до $2k" },
  { value: "2k-5k", label: "$2–5k" },
  { value: "5k-10k", label: "$5–10k" },
  { value: "10k-plus", label: "$10k+" },
  { value: "discuss", label: "Обсудим" },
] as const;

export type ProjectTypeValue = (typeof projectTypes)[number]["value"];
export type BudgetValue = (typeof budgets)[number]["value"];

export const projectTypeValues = projectTypes.map((p) => p.value) as [
  ProjectTypeValue,
  ...ProjectTypeValue[],
];
export const budgetValues = budgets.map((b) => b.value) as [BudgetValue, ...BudgetValue[]];

export const labelFor = {
  projectType: (v: string) => projectTypes.find((p) => p.value === v)?.label ?? v,
  budget: (v: string) => budgets.find((b) => b.value === v)?.label ?? v,
};
