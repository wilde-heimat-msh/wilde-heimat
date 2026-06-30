import { Resend } from "resend";
import { siteConfig } from "@/data/site";

export type FormAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

export function isFormMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getFromAddress(): string {
  return (
    process.env.FORM_MAIL_FROM?.trim() ||
    "Wilde Heimat <onboarding@resend.dev>"
  );
}

function getToAddress(): string {
  return process.env.FORM_MAIL_TO?.trim() || siteConfig.email;
}

export async function sendFormNotification({
  subject,
  text,
  replyTo,
  attachments = [],
}: {
  subject: string;
  text: string;
  replyTo?: string;
  attachments?: FormAttachment[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const resend = getResendClient();
  if (!resend) {
    return {
      ok: false,
      error:
        "E-Mail-Versand ist noch nicht eingerichtet (RESEND_API_KEY fehlt auf dem Server).",
    };
  }

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: [getToAddress()],
    replyTo: replyTo || undefined,
    subject,
    text,
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

export function formatFormFields(fields: Record<string, string | undefined>): string {
  return Object.entries(fields)
    .filter(([, value]) => value?.trim())
    .map(([key, value]) => `${key}: ${value?.trim()}`)
    .join("\n");
}
