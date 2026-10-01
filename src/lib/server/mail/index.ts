import "server-only";
import { isProduction, serverEnv } from "../env";
import { consoleDelivery, resendDelivery, webhookDelivery } from "./providers";
import type { LeadDelivery } from "./types";

export { renderLeadMessage } from "./template";
export { DeliveryError, type Lead, type LeadDelivery } from "./types";

/**
 * Resolves the configured delivery adapter from environment variables.
 * Returns null when nothing usable is configured — the route then answers 503
 * instead of silently losing a lead.
 */
export function resolveDelivery(): LeadDelivery | null {
  const env = serverEnv();
  const provider = env.CONTACT_PROVIDER ?? (isProduction() ? undefined : "console");

  switch (provider) {
    case "resend":
      if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL) {
        return resendDelivery({
          apiKey: env.RESEND_API_KEY,
          to: env.CONTACT_TO_EMAIL,
          from: env.CONTACT_FROM_EMAIL,
        });
      }
      console.error("[contact] CONTACT_PROVIDER=resend but RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL are missing.");
      return null;

    case "webhook":
      if (env.CONTACT_WEBHOOK_URL) {
        return webhookDelivery({ url: env.CONTACT_WEBHOOK_URL, secret: env.CONTACT_WEBHOOK_SECRET });
      }
      console.error("[contact] CONTACT_PROVIDER=webhook but CONTACT_WEBHOOK_URL is missing.");
      return null;

    case "console":
      if (isProduction()) {
        console.error("[contact] The console provider is disabled in production.");
        return null;
      }
      return consoleDelivery();

    default:
      console.error("[contact] No CONTACT_PROVIDER configured.");
      return null;
  }
}
