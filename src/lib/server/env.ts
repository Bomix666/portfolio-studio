import "server-only";
import * as z from "zod";

/**
 * Server-side environment, validated once at first use.
 * Nothing here is ever imported by client components (enforced by `server-only`).
 */

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.url().optional(),

  /** HMAC secret for the anti-spam form token. Required in production. */
  CONTACT_FORM_SECRET: z.string().min(32).optional(),

  /** Which delivery adapter handles contact submissions. */
  CONTACT_PROVIDER: z.enum(["resend", "webhook", "console"]).optional(),
  CONTACT_TO_EMAIL: z.email().optional(),
  CONTACT_FROM_EMAIL: z.string().min(3).optional(),

  RESEND_API_KEY: z.string().min(10).optional(),

  CONTACT_WEBHOOK_URL: z.url().optional(),
  CONTACT_WEBHOOK_SECRET: z.string().min(16).optional(),

  /** Set to "true" only behind a proxy you control that sets X-Forwarded-For / X-Real-IP. */
  TRUST_PROXY: z.enum(["true", "false"]).optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

let cached: ServerEnv | null = null;

export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // Log which keys are wrong — never their values.
    const keys = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    console.error(`[env] Invalid server environment variables: ${keys}`);
    cached = envSchema.parse({ NODE_ENV: process.env.NODE_ENV });
    return cached;
  }
  cached = parsed.data;
  return cached;
}

export const isProduction = () => serverEnv().NODE_ENV === "production";
