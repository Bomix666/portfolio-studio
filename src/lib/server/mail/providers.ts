import "server-only";
import { createHmac } from "node:crypto";
import { DeliveryError, type Lead, type LeadDelivery, type LeadMessage } from "./types";

const TIMEOUT_MS = 10_000;

/**
 * Resend via its REST API — no SDK dependency.
 * Env: RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL (a verified sender).
 */
export function resendDelivery(cfg: { apiKey: string; to: string; from: string }): LeadDelivery {
  return {
    name: "resend",
    async deliver(_lead: Lead, message: LeadMessage) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cfg.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: cfg.from,
          to: [cfg.to],
          reply_to: message.replyTo,
          subject: message.subject,
          text: message.text,
          html: message.html,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new DeliveryError(`Resend responded ${res.status}`, "resend", res.status);
    },
  };
}

/**
 * Generic JSON webhook (Slack/Zapier/Make/n8n/your CRM).
 * If CONTACT_WEBHOOK_SECRET is set, the body is signed: `X-Signature: sha256=<hex>`.
 */
export function webhookDelivery(cfg: { url: string; secret?: string }): LeadDelivery {
  return {
    name: "webhook",
    async deliver(lead: Lead, message: LeadMessage) {
      const body = JSON.stringify({ type: "lead.created", lead, subject: message.subject });
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (cfg.secret) {
        headers["X-Signature"] = `sha256=${createHmac("sha256", cfg.secret).update(body).digest("hex")}`;
      }
      const res = await fetch(cfg.url, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new DeliveryError(`Webhook responded ${res.status}`, "webhook", res.status);
    },
  };
}

/** Development only: prints a redacted summary instead of sending anything. */
export function consoleDelivery(): LeadDelivery {
  return {
    name: "console",
    async deliver(lead: Lead, message: LeadMessage) {
      const redactedEmail = lead.email.replace(/^(.).*(@.*)$/, "$1***$2");
      console.info(
        `[contact:console] ${lead.id} — ${message.subject} — reply-to ${redactedEmail} — ${lead.message.length} chars`,
      );
    },
  };
}
