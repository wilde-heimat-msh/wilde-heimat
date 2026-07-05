import { NextResponse } from "next/server";
import { textToPatenEmailHtml } from "@/data/patenEmailVorlagen";
import { logManualPatenschaftZahlungserinnerung } from "@/lib/patenschaftErinnerungService";
import { isFormMailConfigured, sendPatenMail, type FormAttachment } from "@/lib/formMail";
import { getPatenById } from "@/lib/patenschaftStore";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";

type RouteContext = { params: Promise<{ id: string }> };

const MAX_ATTACHMENTS = 6;
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!isFormMailConfigured()) {
    return NextResponse.json(
      {
        error:
          "E-Mail-Versand ist noch nicht eingerichtet. SMTP-Zugangsdaten in Vercel setzen – siehe docs/email-setup.md.",
      },
      { status: 503 }
    );
  }

  const { id } = await context.params;

  let body: {
    to?: string;
    subject?: string;
    text?: string;
    attachments?: { filename: string; contentBase64: string }[];
    zahlungserinnerungPeriod?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const to = body.to?.trim();
  const subject = body.subject?.trim();
  const text = body.text?.trim();

  if (!to || !subject || !text) {
    return NextResponse.json(
      { error: "Empfänger, Betreff und E-Mail-Text sind Pflichtfelder." },
      { status: 400 }
    );
  }

  if (!isValidEmail(to)) {
    return NextResponse.json({ error: "Bitte eine gültige E-Mail-Adresse angeben." }, { status: 400 });
  }

  const rawAttachments = body.attachments ?? [];
  if (rawAttachments.length > MAX_ATTACHMENTS) {
    return NextResponse.json(
      { error: `Maximal ${MAX_ATTACHMENTS} Anhänge pro E-Mail.` },
      { status: 400 }
    );
  }

  try {
    const pate = await getPatenById(id);
    if (!pate) {
      return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
    }

    const attachments: FormAttachment[] = [];
    let totalBytes = 0;

    for (const file of rawAttachments) {
      const filename = file.filename?.trim();
      const contentBase64 = file.contentBase64?.trim();
      if (!filename || !contentBase64) {
        return NextResponse.json({ error: "Ungültiger Anhang." }, { status: 400 });
      }

      const content = Buffer.from(contentBase64, "base64");
      if (content.length === 0) {
        return NextResponse.json({ error: `Anhang „${filename}“ ist leer.` }, { status: 400 });
      }
      if (content.length > MAX_ATTACHMENT_BYTES) {
        return NextResponse.json(
          { error: `Anhang „${filename}“ ist zu groß (max. 8 MB).` },
          { status: 400 }
        );
      }

      totalBytes += content.length;
      attachments.push({
        filename,
        content,
        contentType: "application/pdf",
      });
    }

    if (totalBytes > MAX_TOTAL_BYTES) {
      return NextResponse.json(
        { error: "Die Anhänge sind insgesamt zu groß (max. 20 MB)." },
        { status: 400 }
      );
    }

    const result = await sendPatenMail({
      to,
      subject,
      text,
      html: textToPatenEmailHtml(text),
      attachments,
      bccCopy: true,
    });

    if (!result.ok) {
      if (body.zahlungserinnerungPeriod?.trim()) {
        await logManualPatenschaftZahlungserinnerung({
          accessCode: pate.accessCode,
          pateId: pate.id,
          period: body.zahlungserinnerungPeriod.trim(),
          recipientEmail: to,
          recipientName: pate.name,
          subject,
          status: "failed",
          errorMessage: result.error,
        });
      }
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    if (body.zahlungserinnerungPeriod?.trim()) {
      await logManualPatenschaftZahlungserinnerung({
        accessCode: pate.accessCode,
        pateId: pate.id,
        period: body.zahlungserinnerungPeriod.trim(),
        recipientEmail: to,
        recipientName: pate.name,
        subject,
        status: "sent",
      });
    }

    return NextResponse.json({
      ok: true,
      sentTo: to,
      attachmentCount: attachments.length,
    });
  } catch (error) {
    return apiErrorResponse(error, "E-Mail konnte nicht gesendet werden.");
  }
}
