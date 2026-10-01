import "server-only";
import { labelFor } from "@/config/contact";
import { siteConfig } from "@/config/site";
import { escapeHtml } from "../sanitize";
import type { Lead, LeadMessage } from "./types";

/** Renders the internal notification for a new lead. All user input is escaped. */
export function renderLeadMessage(lead: Lead): LeadMessage {
  const rows: [string, string][] = [
    ["Имя", lead.name],
    ["Компания", lead.company || "—"],
    ["Email", lead.email],
    ["Телефон", lead.phone || "—"],
    ["Тип проекта", labelFor.projectType(lead.projectType)],
    ["Бюджет", labelFor.budget(lead.budget)],
  ];

  const subjectParts = [lead.name, lead.company].filter(Boolean).join(" · ");
  const subject = `Новая заявка — ${subjectParts} (${labelFor.projectType(lead.projectType)})`;

  const text = [
    `Новая заявка с сайта ${siteConfig.name} (${lead.id})`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Сообщение:",
    lead.message,
    "",
    `Получено: ${lead.receivedAt}`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="ru"><body style="margin:0;padding:32px;background:#0b0b0c;color:#f4f3ef;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;border-collapse:collapse">
    <tr><td style="padding-bottom:24px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#a6a5a0">Новая заявка · ${escapeHtml(siteConfig.name)}</td></tr>
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:10px 0;border-top:1px solid #222;font-size:14px"><span style="display:inline-block;width:140px;color:#a6a5a0">${escapeHtml(k)}</span>${escapeHtml(v)}</td></tr>`,
      )
      .join("")}
    <tr><td style="padding:24px 0 8px;border-top:1px solid #222;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#a6a5a0">Сообщение</td></tr>
    <tr><td style="font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(lead.message)}</td></tr>
    <tr><td style="padding-top:32px;font-size:12px;color:#7d7c78">${escapeHtml(lead.id)} · ${escapeHtml(lead.receivedAt)}</td></tr>
  </table>
</body></html>`;

  return { subject, text, html, replyTo: lead.email };
}
