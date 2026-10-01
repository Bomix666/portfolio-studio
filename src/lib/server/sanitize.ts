import "server-only";

/**
 * Input normalisation. Validation (Zod) decides *whether* input is acceptable;
 * sanitisation makes accepted input safe to store, log and put into an email.
 */

// C0/C1 control characters except tab (\u0009) and newline (\u000A).
const CONTROL_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g;
// Zero-width and bidi-override characters used to disguise content.
const INVISIBLE_CHARS = /[​-‏‪-‮⁠-⁤﻿]/g;

/** Single-line fields: no newlines at all (prevents email header injection). */
export function cleanLine(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFC")
    .replace(/[\r\n\t]+/g, " ")
    .replace(CONTROL_CHARS, "")
    .replace(INVISIBLE_CHARS, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Multi-line text: keep paragraphs, normalise line endings, cap blank lines. */
export function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS, "")
    .replace(INVISIBLE_CHARS, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
