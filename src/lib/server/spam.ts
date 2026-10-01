import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { isProduction, serverEnv } from "./env";

/**
 * Layered spam protection for the contact form:
 *
 * 1. Signed form token — issued by GET /api/contact/token, HMAC-signed with
 *    CONTACT_FORM_SECRET. Proves the submitter loaded our form and bounds its age.
 * 2. Minimum fill time — humans can't complete the form in under MIN_FILL_MS.
 * 3. Honeypot field — invisible to people, irresistible to naive bots.
 * 4. Content heuristics — link stuffing, links in the name field (answered with a
 *    fixable 422, since real people trip these too).
 * 5. Rate limiting (see rate-limit.ts).
 *
 * Honeypot and too-fast submissions receive a normal success response and are dropped,
 * so bots can't learn which check tripped.
 */

export const MIN_FILL_MS = 3_000;
export const MAX_TOKEN_AGE_MS = 2 * 60 * 60_000;

let devSecret: string | null = null;

/** Returns the signing secret, or null when the form must be disabled (prod misconfig). */
function secret(): string | null {
  const configured = serverEnv().CONTACT_FORM_SECRET;
  if (configured) return configured;
  if (isProduction()) return null;
  // Development convenience: an ephemeral per-process secret.
  devSecret ??= randomBytes(32).toString("hex");
  return devSecret;
}

export function formProtectionReady(): boolean {
  return secret() !== null;
}

function sign(payload: string, key: string) {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function issueFormToken(now = Date.now()): string | null {
  const key = secret();
  if (!key) return null;
  const payload = `v1.${now}.${randomBytes(9).toString("base64url")}`;
  return `${payload}.${sign(payload, key)}`;
}

export type TokenCheck = "ok" | "invalid" | "too_fast" | "expired";

export function verifyFormToken(token: string, now = Date.now()): TokenCheck {
  const key = secret();
  if (!key) return "invalid";

  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return "invalid";

  const payload = parts.slice(0, 3).join(".");
  const expected = Buffer.from(sign(payload, key));
  const given = Buffer.from(parts[3] ?? "");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid";

  const issuedAt = Number(parts[1]);
  if (!Number.isFinite(issuedAt)) return "invalid";
  const age = now - issuedAt;
  if (age < MIN_FILL_MS) return "too_fast";
  if (age > MAX_TOKEN_AGE_MS) return "expired";
  return "ok";
}

const HAS_URL = /\b(?:https?:\/\/|www\.)\S+/i;
const ALL_URLS = /\b(?:https?:\/\/|www\.)\S+/gi;
export const MAX_LINKS = 3;

/** Returns a user-facing reason when content trips a heuristic, otherwise null. */
export function contentProblem(input: { name: string; message: string; company: string }) {
  if (HAS_URL.test(input.name) || HAS_URL.test(input.company)) {
    return "Пожалуйста, не указывайте ссылки в полях «Имя» и «Компания».";
  }
  const links = input.message.match(ALL_URLS)?.length ?? 0;
  if (links > MAX_LINKS) return `Пожалуйста, не больше ${MAX_LINKS} ссылок — остальное запросим сами.`;
  return null;
}
