import "server-only";
import { serverEnv } from "./env";

/**
 * Best-effort client identifier for rate limiting.
 * Forwarded headers are only trusted when TRUST_PROXY=true (e.g. behind Vercel,
 * Cloudflare or your own reverse proxy) — otherwise they're trivially spoofable.
 */
export function clientKey(request: Request): string {
  if (serverEnv().TRUST_PROXY === "true") {
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const real = request.headers.get("x-real-ip")?.trim();
    const cf = request.headers.get("cf-connecting-ip")?.trim();
    const ip = cf || real || forwarded;
    if (ip) return `ip:${ip}`;
  }
  // Fallback: coarse fingerprint. Weak on purpose — it only groups identical clients.
  const ua = request.headers.get("user-agent") ?? "unknown";
  const lang = request.headers.get("accept-language") ?? "";
  return `fp:${hash(`${ua}|${lang}`)}`;
}

function hash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/**
 * CSRF / cross-site protection for a cookie-less JSON endpoint.
 *
 * - Browsers always send `Origin` on cross-origin POSTs; it must match our host.
 * - `Sec-Fetch-Site: cross-site` is rejected outright.
 * - Requiring `application/json` forces a CORS preflight for any cross-origin browser
 *   request, which we never approve (no CORS headers are emitted).
 */
export function isSameOrigin(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;

  const origin = request.headers.get("origin");
  if (!origin) return true; // Non-browser clients; covered by token + rate limit.

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const allowed = new Set<string>();
  const host = request.headers.get("host");
  if (host) allowed.add(host);
  const siteUrl = serverEnv().NEXT_PUBLIC_SITE_URL;
  if (siteUrl) allowed.add(new URL(siteUrl).host);

  return allowed.has(originHost);
}

export function isJson(request: Request): boolean {
  const type = request.headers.get("content-type") ?? "";
  return type.split(";")[0]?.trim().toLowerCase() === "application/json";
}

/** Read the body with a hard size cap (protects against oversized payloads). */
export async function readJsonBody(
  request: Request,
  maxBytes: number,
): Promise<{ ok: true; data: unknown } | { ok: false; reason: "too_large" | "malformed" }> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > maxBytes) return { ok: false, reason: "too_large" };

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) return { ok: false, reason: "too_large" };

  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false, reason: "malformed" };
  }
}
