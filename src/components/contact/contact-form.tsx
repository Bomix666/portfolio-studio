"use client";

import { AnimatePresence, m } from "motion/react";
import { ArrowRight, CircleAlert, LoaderCircle, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { budgets, projectTypes, type BudgetValue, type ProjectTypeValue } from "@/config/contact";
import { siteConfig } from "@/config/site";
import { PREFILL_EVENT, type ContactPrefill } from "@/lib/contact-prefill";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  contactSchema,
  LIMITS,
  toFieldErrors,
  validateField,
  type ContactField,
  type ContactResponse,
  type FieldErrors,
} from "@/lib/validation/contact";
import { ChoiceGroup, TextAreaField, TextField } from "./fields";

interface Values {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: ProjectTypeValue | "";
  budget: BudgetValue | "";
  message: string;
}

const EMPTY: Values = { name: "", company: "", email: "", phone: "", projectType: "", budget: "", message: "" };

/** Visual/tab order — used to focus the first invalid field. */
const FIELD_ORDER: ContactField[] = ["name", "company", "email", "phone", "projectType", "budget", "message"];

/** Must match MIN_FILL_MS on the server; we wait it out rather than risk a silent drop. */
const MIN_TOKEN_AGE_MS = 3_200;

type Status = "idle" | "submitting" | "success" | "error";

/** «Ещё 1 символ / 3 символа / 12 символов» — русские формы множественного числа. */
function remainingLabel(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  const word =
    mod10 === 1 && mod100 !== 11
      ? "символ"
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? "символа"
        : "символов";
  return `Ещё ${n} ${word}`;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [sentTo, setSentTo] = useState("");

  const token = useRef<{ value: string; issuedAt: number } | null>(null);
  const tokenRequest = useRef<Promise<void> | null>(null);
  const refs = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const successHeading = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // --- anti-spam token --------------------------------------------------------------------
  const fetchToken = useCallback(async (force = false) => {
    if (token.current && !force) return;
    if (tokenRequest.current && !force) return tokenRequest.current;
    tokenRequest.current = (async () => {
      const res = await fetch("/api/contact/token", { cache: "no-store", credentials: "same-origin" });
      if (!res.ok) throw new Error(`token ${res.status}`);
      const data = (await res.json()) as { token?: string };
      if (!data.token) throw new Error("token missing");
      token.current = { value: data.token, issuedAt: Date.now() };
    })();
    try {
      await tokenRequest.current;
    } finally {
      tokenRequest.current = null;
    }
  }, []);

  const warmToken = () => {
    if (!token.current) fetchToken().catch(() => {});
  };

  // --- prefill from other sections ---------------------------------------------------------
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const detail = (e as CustomEvent<ContactPrefill>).detail;
      if (detail?.projectType) {
        setValues((v) => ({ ...v, projectType: detail.projectType! }));
        setErrors((er) => ({ ...er, projectType: undefined }));
        if (status === "success") setStatus("idle");
      }
      warmToken();
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // --- field handlers -------------------------------------------------------------------------
  const set = <K extends keyof Values>(field: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [field]: value }));
    // Once a field has been judged, re-judge live so errors clear as soon as they're fixed.
    if (touched[field as ContactField] || errors[field as ContactField]) {
      setErrors((er) => ({ ...er, [field]: validateField(field as ContactField, value) }));
    }
  };

  const blur = (field: ContactField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const value = values[field as keyof Values];
    // Don't shout about an empty required field the user merely tabbed through.
    if (value === "") return;
    setErrors((er) => ({ ...er, [field]: validateField(field, value) }));
  };

  const focusFirstInvalid = (fieldErrors: FieldErrors) => {
    const first = FIELD_ORDER.find((f) => fieldErrors[f]);
    if (first) refs.current[first]?.focus();
  };

  // --- submit ---------------------------------------------------------------------------------
  const post = async (payload: Record<string, unknown>): Promise<ContactResponse> => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });
    try {
      return (await res.json()) as ContactResponse;
    } catch {
      return { ok: false, error: "server_error", message: "Что-то пошло не так на нашей стороне. Попробуйте ещё раз." };
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
      setFormError(null);
      focusFirstInvalid(fieldErrors);
      return;
    }

    setStatus("submitting");
    setFormError(null);

    try {
      await fetchToken();
      const age = Date.now() - (token.current?.issuedAt ?? Date.now());
      if (age < MIN_TOKEN_AGE_MS) await new Promise((r) => setTimeout(r, MIN_TOKEN_AGE_MS - age));

      let result = await post({ ...parsed.data, token: token.current?.value ?? "", website: honeypot });

      if (!result.ok && result.error === "expired") {
        await fetchToken(true);
        await new Promise((r) => setTimeout(r, MIN_TOKEN_AGE_MS));
        result = await post({ ...parsed.data, token: token.current?.value ?? "", website: honeypot });
      }

      if (result.ok) {
        token.current = null;
        setSentTo(parsed.data.email);
        setStatus("success");
        return;
      }

      setStatus("error");
      setFormError(result.message);
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        focusFirstInvalid(result.fieldErrors);
      } else {
        requestAnimationFrame(() => errorRef.current?.focus());
      }
    } catch {
      setStatus("error");
      setFormError("Не удалось связаться с сервером. Проверьте подключение и попробуйте ещё раз.");
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setFormError(null);
    setStatus("idle");
    requestAnimationFrame(() => refs.current.name?.focus());
  };

  const submitting = status === "submitting";
  const messageLength = values.message.trim().length;

  return (
    <div className="liquid-glass relative rounded-[1.75rem] bg-ink-2/60 p-6 sm:p-9 md:p-12">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <m.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: ease.outExpo }}
            className="flex min-h-[32rem] flex-col items-start justify-center"
            role="status"
            // Mounts after the form's exit animation — move focus once it's actually on screen.
            onAnimationStart={() => successHeading.current?.focus({ preventScroll: true })}
          >
            <SuccessMark />
            <h3
              ref={successHeading}
              tabIndex={-1}
              className="mt-10 font-serif text-display-m text-fg outline-none"
            >
              Сообщение получено.
            </h3>
            <p className="mt-4 max-w-md text-body-l text-fg-muted">
              Скоро с вами свяжемся.
              {sentTo && (
                <>
                  {" "}
                  Ответ придёт на <span className="text-fg">{sentTo}</span>.
                </>
              )}
            </p>
            <button
              type="button"
              onClick={reset}
              className="group mt-10 inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm text-fg-muted transition-colors hover:border-fg hover:text-fg"
            >
              <RotateCcw aria-hidden="true" className="size-4 transition-transform duration-500 group-hover:-rotate-180" />
              Отправить ещё одно
            </button>
          </m.div>
        ) : (
          <m.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            onFocusCapture={warmToken}
            aria-busy={submitting}
            aria-describedby="form-required-note"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: ease.outExpo }}
            className="space-y-9"
          >
            <p id="form-required-note" className="sr-only">
              Поля, отмеченные звёздочкой, обязательны.
            </p>

            <div className="grid gap-9 md:grid-cols-2 md:gap-x-8">
              <TextField
                id="name"
                label="Имя"
                autoComplete="name"
                value={values.name}
                maxLength={LIMITS.name}
                onValue={(v) => set("name", v)}
                onBlur={() => blur("name")}
                error={errors.name}
                inputRef={(el) => void (refs.current.name = el)}
                placeholder="Как к вам обращаться"
              />
              <TextField
                id="company"
                label="Компания"
                optional
                autoComplete="organization"
                value={values.company}
                maxLength={LIMITS.company}
                onValue={(v) => set("company", v)}
                onBlur={() => blur("company")}
                error={errors.company}
                inputRef={(el) => void (refs.current.company = el)}
                placeholder="Компания или проект"
              />
              <TextField
                id="email"
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                value={values.email}
                maxLength={LIMITS.email}
                onValue={(v) => set("email", v)}
                onBlur={() => blur("email")}
                error={errors.email}
                inputRef={(el) => void (refs.current.email = el)}
                placeholder="name@company.ru"
              />
              <TextField
                id="phone"
                label="Телефон"
                optional
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={values.phone}
                maxLength={LIMITS.phone}
                onValue={(v) => set("phone", v)}
                onBlur={() => blur("phone")}
                error={errors.phone}
                inputRef={(el) => void (refs.current.phone = el)}
                placeholder="+7 900 000-00-00"
              />
            </div>

            <ChoiceGroup
              name="projectType"
              legend="Что создаём?"
              options={projectTypes}
              value={values.projectType}
              onValue={(v) => set("projectType", v)}
              error={errors.projectType}
              firstRef={(el) => void (refs.current.projectType = el)}
            />

            <ChoiceGroup
              name="budget"
              legend="Бюджет"
              options={budgets}
              value={values.budget}
              onValue={(v) => set("budget", v)}
              error={errors.budget}
              firstRef={(el) => void (refs.current.budget = el)}
            />

            <TextAreaField
              id="message"
              label="О проекте"
              rows={5}
              value={values.message}
              maxLength={LIMITS.messageMax}
              onValue={(v) => set("message", v)}
              onBlur={() => blur("message")}
              error={errors.message}
              inputRef={(el) => void (refs.current.message = el)}
              placeholder="Цели, сроки, ссылки на то, что вдохновляет…"
              hint={
                <span className={cn(messageLength > 0 && messageLength < LIMITS.messageMin && "text-fg-muted")}>
                  {messageLength < LIMITS.messageMin
                    ? remainingLabel(Math.max(0, LIMITS.messageMin - messageLength))
                    : `${messageLength} / ${LIMITS.messageMax}`}
                </span>
              }
            />

            {/* Honeypot — hidden from people and assistive tech */}
            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
              <label htmlFor="website">Оставьте это поле пустым</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <AnimatePresence>
              {formError && (
                <m.div
                  ref={errorRef}
                  tabIndex={-1}
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: ease.outExpo }}
                  className="overflow-hidden outline-none"
                >
                  <div className="flex gap-3 rounded-2xl border border-danger/40 bg-danger/[0.07] p-4 text-sm text-fg">
                    <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-danger" />
                    <div>
                      <p>{formError}</p>
                      {!formError.includes(siteConfig.contact.email) && (
                        <p className="mt-1 text-fg-muted">
                          Удобнее почтой?{" "}
                          <a
                            className="text-fg underline underline-offset-4"
                            href={`mailto:${siteConfig.contact.email}`}
                          >
                            {siteConfig.contact.email}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </m.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-xs leading-relaxed text-fg-subtle">
                Используем ваши данные только для ответа. Подробнее — в{" "}
                <a href="/privacy" className="underline underline-offset-4 hover:text-fg">
                  политике конфиденциальности
                </a>
                .
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="group relative inline-flex items-center justify-center gap-3 self-start rounded-full bg-fg py-1.5 pr-1.5 pl-6 text-sm font-medium text-ink transition-[background-color,transform,opacity] duration-300 hover:bg-white active:scale-[0.97] disabled:cursor-progress disabled:opacity-80 sm:self-auto"
              >
                <span aria-live="polite">{submitting ? "Отправляем…" : "Начать разговор"}</span>
                <span className="grid size-10 place-items-center rounded-full bg-ink text-fg">
                  {submitting ? (
                    <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                  ) : (
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5"
                    />
                  )}
                </span>
              </button>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuccessMark() {
  return (
    <svg viewBox="0 0 72 72" className="size-18 text-accent" aria-hidden="true">
      <m.circle
        cx="36"
        cy="36"
        r="34"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={{ pathLength: 0, rotate: -90 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: ease.outExpo }}
        style={{ originX: "50%", originY: "50%" }}
      />
      <m.path
        d="M23 37.5 L32 46 L50 27"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: ease.outExpo, delay: 0.55 }}
      />
    </svg>
  );
}
