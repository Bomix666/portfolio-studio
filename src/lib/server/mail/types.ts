import type { ContactPayload } from "@/lib/validation/contact";

/** A normalised lead, ready for delivery. */
export interface Lead extends ContactPayload {
  id: string;
  receivedAt: string;
}

/** A rendered notification, independent of the delivery mechanism. */
export interface LeadMessage {
  subject: string;
  text: string;
  html: string;
  replyTo: string;
}

/**
 * Delivery adapter contract. Add a provider (SMTP, Postmark, a CRM…) by implementing
 * this interface and registering it in `mail/index.ts` — the API route never changes.
 */
export interface LeadDelivery {
  readonly name: string;
  deliver(lead: Lead, message: LeadMessage): Promise<void>;
}

export class DeliveryError extends Error {
  constructor(
    message: string,
    readonly provider: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "DeliveryError";
  }
}
