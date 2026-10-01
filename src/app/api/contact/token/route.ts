import { contactTokenLimiter } from "@/lib/server/rate-limit";
import { clientKey, isSameOrigin } from "@/lib/server/request";
import { issueFormToken } from "@/lib/server/spam";

/**
 * GET /api/contact/token — issues a short-lived, HMAC-signed form token.
 * The form fetches it on first interaction; POST /api/contact verifies signature and age.
 */
export async function GET(request: Request) {
  const noStore = { "Cache-Control": "no-store, max-age=0" };

  if (!isSameOrigin(request)) {
    return Response.json({ error: "forbidden" }, { status: 403, headers: noStore });
  }

  const limit = await contactTokenLimiter(clientKey(request));
  if (!limit.allowed) {
    return Response.json(
      { error: "rate_limited" },
      { status: 429, headers: { ...noStore, "Retry-After": String(limit.retryAfter) } },
    );
  }

  const token = issueFormToken();
  if (!token) {
    console.error("[contact] CONTACT_FORM_SECRET is not set — form tokens cannot be issued.");
    return Response.json({ error: "unavailable" }, { status: 503, headers: noStore });
  }

  return Response.json({ token }, { headers: noStore });
}
