import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { Resend } from "resend";
import { siteConfig } from "@/data/site";
import { getSiteUrl } from "@/lib/siteUrl";

export type FormAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

export type FormMailProvider = "smtp" | "resend" | null;

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim()
  );
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function isFormMailConfigured(): boolean {
  return isSmtpConfigured() || isResendConfigured();
}

export function getFormMailProvider(): FormMailProvider {
  if (isSmtpConfigured()) return "smtp";
  if (isResendConfigured()) return "resend";
  return null;
}

export function isFormMailDomainVerified(): boolean {
  if (isSmtpConfigured()) return true;
  return process.env.FORM_MAIL_DOMAIN_VERIFIED === "true";
}

export function getFormMailTo(): string {
  return process.env.FORM_MAIL_TO?.trim() || siteConfig.email;
}

export function getFormMailFrom(): string {
  const override = process.env.FORM_MAIL_FROM?.trim();
  if (override) return override;

  if (isSmtpConfigured() || isFormMailDomainVerified()) {
    return `Wilde Heimat <${siteConfig.email}>`;
  }

  return "Wilde Heimat <onboarding@resend.dev>";
}

export function getAdminAnfragenUrl(): string {
  return `${getSiteUrl()}/admin/anfragen`;
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getSmtpTransporter(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT?.trim() || "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtmlBody({
  fields,
  attachmentUrl,
  adminUrl,
}: {
  fields: Record<string, string | undefined>;
  attachmentUrl?: string;
  adminUrl: string;
}): string {
  const rows = Object.entries(fields)
    .filter(([, value]) => value?.trim())
    .map(
      ([key, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:600;vertical-align:top;color:#374151;">${escapeHtml(key)}</td><td style="padding:6px 0;color:#111827;white-space:pre-wrap;">${escapeHtml(value!.trim())}</td></tr>`
    )
    .join("");

  const imageBlock = attachmentUrl
    ? `<p style="margin:16px 0 8px;"><strong>Foto:</strong><br><a href="${escapeHtml(attachmentUrl)}">${escapeHtml(attachmentUrl)}</a></p>
       <p><img src="${escapeHtml(attachmentUrl)}" alt="Fundmeldung Foto" style="max-width:100%;height:auto;border-radius:8px;border:1px solid #e5e7eb;" /></p>`
    : "";

  return `<!DOCTYPE html>
<html lang="de">
<body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.5;color:#111827;max-width:640px;">
  <p style="margin:0 0 16px;">Neue Anfrage über die Website <strong>Wilde Heimat</strong>:</p>
  <table style="border-collapse:collapse;width:100%;">${rows}</table>
  ${imageBlock}
  <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e5e7eb;">
    <a href="${escapeHtml(adminUrl)}" style="color:#2d5016;font-weight:600;">Im Admin-Bereich ansehen</a>
  </p>
</body>
</html>`;
}

export function formatFormFields(fields: Record<string, string | undefined>): string {
  return Object.entries(fields)
    .filter(([, value]) => value?.trim())
    .map(([key, value]) => `${key}: ${value?.trim()}`)
    .join("\n");
}

async function sendViaSmtp({
  subject,
  text,
  html,
  replyTo,
  attachments,
}: {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  attachments: FormAttachment[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const transporter = getSmtpTransporter();
  if (!transporter) {
    return { ok: false, error: "SMTP ist nicht konfiguriert." };
  }

  try {
    await transporter.sendMail({
      from: getFormMailFrom(),
      to: getFormMailTo(),
      replyTo: replyTo || undefined,
      subject,
      text,
      html,
      attachments: attachments.map((file) => ({
        filename: file.filename,
        content: file.content,
        contentType: file.contentType,
      })),
    });
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "E-Mail konnte nicht gesendet werden.";
    return { ok: false, error: message };
  }
}

async function sendViaResend({
  subject,
  text,
  html,
  replyTo,
  attachments,
}: {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  attachments: FormAttachment[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "Resend ist nicht konfiguriert." };
  }

  const { error } = await resend.emails.send({
    from: getFormMailFrom(),
    to: [getFormMailTo()],
    replyTo: replyTo || undefined,
    subject,
    text,
    html,
    attachments: attachments.map((file) => ({
      filename: file.filename,
      content: file.content,
      contentType: file.contentType,
    })),
  });

  if (error) {
    return { ok: false, error: error.message || "E-Mail konnte nicht gesendet werden." };
  }

  return { ok: true };
}

export async function sendFormNotification({
  subject,
  text,
  fields,
  replyTo,
  attachments = [],
  attachmentUrl,
}: {
  subject: string;
  text: string;
  fields?: Record<string, string | undefined>;
  replyTo?: string;
  attachments?: FormAttachment[];
  attachmentUrl?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isFormMailConfigured()) {
    return {
      ok: false,
      error:
        "E-Mail-Versand ist noch nicht eingerichtet (SMTP- oder RESEND_API_KEY-Konfiguration fehlt).",
    };
  }

  const adminUrl = getAdminAnfragenUrl();
  const textWithFooter = `${text}\n\n───\nIm Admin ansehen: ${adminUrl}`;
  const html = buildHtmlBody({
    fields: fields ?? {},
    attachmentUrl,
    adminUrl,
  });

  const payload = {
    subject,
    text: textWithFooter,
    html,
    replyTo,
    attachments,
  };

  if (isSmtpConfigured()) {
    return sendViaSmtp(payload);
  }

  return sendViaResend(payload);
}
