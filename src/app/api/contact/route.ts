import { randomUUID } from "node:crypto";
import { siteConfig } from "@/config/site";
import { resolveDelivery, renderLeadMessage, DeliveryError, type Lead } from "@/lib/server/mail";
import { contactSubmitLimiter } from "@/lib/server/rate-limit";
import { clientKey, isJson, isSameOrigin, readJsonBody } from "@/lib/server/request";
import { cleanLine, cleanText } from "@/lib/server/sanitize";
import { contentProblem, formProtectionReady, verifyFormToken } from "@/lib/server/spam";
import { contactRequestSchema, toFieldErrors, type ContactResponse } from "@/lib/validation/contact";

/**
 * POST /api/contact
 *
 * Pipeline: same-origin → content-type → rate limit → config check → size-capped body
 * → sanitise → honeypot → validate (Zod) → signed token → content heuristics → deliver.
 * Every failure returns a stable `error` code plus a message that is safe to show.
 */

const MAX_BODY_BYTES = 16 * 1024;

const UNAVAILABLE = `Форма временно недоступна. Напишите нам на ${siteConfig.contact.email}.`;

function reply(body: ContactResponse, status: number, headers?: Record<string, string>) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return reply({ ok: false, error: "forbidden", message: "Этот запрос не разрешён." }, 403);
    }
    if (!isJson(request)) {
      return reply({ ok: false, error: "invalid_request", message: "Неподдерживаемый тип содержимого." }, 415);
    }

    const limit = await contactSubmitLimiter(clientKey(request));
    if (!limit.allowed) {
      const minutes = Math.max(1, Math.ceil(limit.retryAfter / 60));
      return reply(
        {
          ok: false,
          error: "rate_limited",
          message: `Слишком много сообщений за короткое время. Попробуйте снова через ${minutes} мин или напишите нам на почту.`,
          retryAfter: limit.retryAfter,
        },
        429,
        { "Retry-After": String(limit.retryAfter) },
      );
    }

    const delivery = resolveDelivery();
    if (!delivery || !formProtectionReady()) {
      console.error("[contact] Form is not configured for delivery (see .env.example).");
      return reply({ ok: false, error: "unavailable", message: UNAVAILABLE }, 503);
    }

    const body = await readJsonBody(request, MAX_BODY_BYTES);
    if (!body.ok) {
      return reply(
        {
          ok: false,
          error: "invalid_request",
          message: body.reason === "too_large" ? "Сообщение слишком длинное для отправки." : "Не удалось прочитать запрос.",
        },
        body.reason === "too_large" ? 413 : 400,
      );
    }
    if (typeof body.data !== "object" || body.data === null || Array.isArray(body.data)) {
      return reply({ ok: false, error: "invalid_request", message: "Не удалось прочитать запрос." }, 400);
    }

    const raw = body.data as Record<string, unknown>;
    const cleaned = {
      name: cleanLine(raw.name),
      company: cleanLine(raw.company),
      email: cleanLine(raw.email),
      phone: cleanLine(raw.phone),
      projectType: cleanLine(raw.projectType),
      budget: cleanLine(raw.budget),
      message: cleanText(raw.message),
      token: typeof raw.token === "string" ? raw.token.trim() : "",
      website: cleanLine(raw.website),
    };

    // Honeypot: pretend success, drop silently.
    if (cleaned.website) {
      console.info("[contact] Dropped submission (honeypot).");
      return reply({ ok: true }, 200);
    }

    const parsed = contactRequestSchema.safeParse(cleaned);
    if (!parsed.success) {
      return reply(
        {
          ok: false,
          error: "validation",
          message: "Проверьте, пожалуйста, отмеченные поля.",
          fieldErrors: toFieldErrors(parsed.error),
        },
        422,
      );
    }

    const tokenState = verifyFormToken(parsed.data.token);
    if (tokenState === "too_fast") {
      console.info("[contact] Dropped submission (filled too fast).");
      return reply({ ok: true }, 200);
    }
    if (tokenState !== "ok") {
      return reply(
        { ok: false, error: "expired", message: "Сессия формы истекла — отправьте, пожалуйста, ещё раз." },
        400,
      );
    }

    const problem = contentProblem(parsed.data);
    if (problem) {
      return reply({ ok: false, error: "validation", message: problem }, 422);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token, website, ...fields } = parsed.data;
    const lead: Lead = {
      ...fields,
      id: `lead_${randomUUID()}`,
      receivedAt: new Date().toISOString(),
    };

    await delivery.deliver(lead, renderLeadMessage(lead));
    return reply({ ok: true }, 200);
  } catch (error) {
    if (error instanceof DeliveryError) {
      console.error(`[contact] Delivery failed via ${error.provider} (${error.status ?? "network"}).`);
      return reply(
        {
          ok: false,
          error: "unavailable",
          message: `Не удалось доставить сообщение. Попробуйте чуть позже или напишите на ${siteConfig.contact.email}.`,
        },
        502,
      );
    }
    // Log the error type only — never request contents.
    console.error("[contact] Unexpected error:", error instanceof Error ? error.name : typeof error);
    return reply(
      { ok: false, error: "server_error", message: "Что-то пошло не так на нашей стороне. Попробуйте ещё раз." },
      500,
    );
  }
}
