import * as z from "zod/mini";
import { budgetValues, projectTypeValues } from "@/config/contact";

/**
 * Single source of truth for contact-form validation.
 * Imported by the client form (instant feedback) and the API route (authoritative check).
 *
 * Uses `zod/mini` (≈6 KB gz vs ≈24 KB for classic Zod) because this module ships to the
 * browser. `jitless` skips Zod's `new Function` probe, which a strict CSP would report.
 */
z.config({ jitless: true });

export const LIMITS = {
  name: 100,
  company: 120,
  email: 254,
  phone: 32,
  messageMin: 20,
  messageMax: 4000,
} as const;

const PHONE_PATTERN = /^\+?[0-9\s().-]{6,}$/;

export const contactSchema = z.object({
  name: z.string({ error: "Укажите, как к вам обращаться." }).check(
    z.trim(),
    z.minLength(2, { error: "Укажите, как к вам обращаться." }),
    z.maxLength(LIMITS.name, { error: `Не длиннее ${LIMITS.name} символов.` }),
  ),
  company: z._default(
    z.optional(
      z.string().check(
        z.trim(),
        z.maxLength(LIMITS.company, { error: `Не длиннее ${LIMITS.company} символов.` }),
      ),
    ),
    "",
  ),
  email: z.pipe(
    z.string({ error: "Нужен email, чтобы мы могли ответить." }).check(
      z.trim(),
      z.minLength(1, { error: "Нужен email, чтобы мы могли ответить." }),
      z.maxLength(LIMITS.email, { error: "Слишком длинный адрес." }),
    ),
    z.email({ error: "Введите корректный email." }),
  ),
  phone: z._default(
    z.optional(
      z.string().check(
        z.trim(),
        z.maxLength(LIMITS.phone, { error: "Слишком длинный номер." }),
        z.refine((v) => v === "" || PHONE_PATTERN.test(v), { error: "Только цифры, пробелы и + ( ) -." }),
      ),
    ),
    "",
  ),
  projectType: z.enum(projectTypeValues, { error: "Выберите, что будем создавать." }),
  budget: z.enum(budgetValues, { error: "Выберите бюджет — можно примерно." }),
  message: z.string({ error: "Расскажите немного о проекте." }).check(
    z.trim(),
    z.minLength(LIMITS.messageMin, {
      error: `Пара предложений поможет нам подготовиться (минимум ${LIMITS.messageMin} символов).`,
    }),
    z.maxLength(LIMITS.messageMax, { error: `Не длиннее ${LIMITS.messageMax} символов.` }),
  ),
});

export type ContactPayload = z.output<typeof contactSchema>;
export type ContactField = keyof ContactPayload;
export type FieldErrors = Partial<Record<ContactField, string>>;

/** The wire format: form fields + anti-spam envelope. */
export const contactRequestSchema = z.extend(contactSchema, {
  /** Signed form token issued by GET /api/contact/token. */
  token: z.string().check(z.maxLength(512)),
  /** Honeypot. Humans never see it; anything non-empty is a bot. */
  website: z._default(z.optional(z.string().check(z.maxLength(500))), ""),
});

type ValidationError = Parameters<typeof z.flattenError>[0];

export function toFieldErrors(error: ValidationError): FieldErrors {
  const flat = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  const out: FieldErrors = {};
  for (const key of Object.keys(contactSchema.shape) as ContactField[]) {
    const first = flat[key]?.[0];
    if (first) out[key] = first;
  }
  return out;
}

/** Validate a single field (used on blur for instant feedback). */
export function validateField(field: ContactField, value: unknown): string | undefined {
  const result = contactSchema.shape[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

/** API response contract shared by client and server. */
export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      error:
        | "validation"
        | "invalid_request"
        | "forbidden"
        | "expired"
        | "rate_limited"
        | "unavailable"
        | "server_error";
      message: string;
      fieldErrors?: FieldErrors;
      retryAfter?: number;
    };
