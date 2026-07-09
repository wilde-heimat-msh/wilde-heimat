import { NextResponse } from "next/server";
import { textToPatenEmailHtml } from "@/data/patenEmailVorlagen";
import {
  downloadPatenMailPdf,
  isPatenMailStoragePathForPate,
  MAX_PATEN_MAIL_PDF_BYTES,
  MAX_PATEN_MAIL_PDFS_TOTAL_BYTES,
  removePatenMailPdfs,
} from "@/lib/patenMailStorage";
import { logManualPatenschaftZahlungserinnerung } from "@/lib/patenschaftErinnerungService";
import { isFormMailConfigured, sendPatenMail, type FormAttachment } from "@/lib/formMail";
import { getPatenById } from "@/lib/patenschaftStore";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";

type RouteContext = { params: Promise<{ id: string }> };

const MAX_ATTACHMENTS = 6;
/** Fallback für kleine Anhänge ohne Supabase-Upload (Base64 im JSON). */
const MAX_INLINE_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const MAX_INLINE_TOTAL_BYTES = 4 * 1024 * 1024;

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
    attachmentStoragePaths?: { storagePath: string; filename: string }[];
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
  const rawStorageAttachments = body.attachmentStoragePaths ?? [];
  const attachmentCount = rawAttachments.length + rawStorageAttachments.length;

  if (attachmentCount > MAX_ATTACHMENTS) {
    return NextResponse.json(
      { error: `Maximal ${MAX_ATTACHMENTS} Anhänge pro E-Mail.` },
      { status: 400 }
    );
  }

  const tempStoragePaths: string[] = [];

  try {
    const pate = await getPatenById(id);
    if (!pate) {
      return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
    }

    const attachments: FormAttachment[] = [];
    let totalBytes = 0;

    for (const file of rawStorageAttachments) {
      const storagePath = file.storagePath?.trim();
      const filename = file.filename?.trim();
      if (!storagePath || !filename) {
        return NextResponse.json({ error: "Ungültiger Speicher-Anhang." }, { status: 400 });
      }
      if (!isPatenMailStoragePathForPate(storagePath, id)) {
        return NextResponse.json({ error: "Ungültiger Anhang-Pfad." }, { status: 400 });
      }

      const downloaded = await downloadPatenMailPdf(storagePath);
      if ("error" in downloaded) {
        return NextResponse.json({ error: downloaded.error }, { status: 400 });
      }
      if (downloaded.buffer.length > MAX_PATEN_MAIL_PDF_BYTES) {
        return NextResponse.json(
          {
            error: `Anhang „${filename}“ ist zu groß (max. ${Math.round(MAX_PATEN_MAIL_PDF_BYTES / 1024 / 1024)} MB).`,
          },
          { status: 400 }
        );
      }

      totalBytes += downloaded.buffer.length;
      tempStoragePaths.push(storagePath);
      attachments.push({
        filename,
        content: downloaded.buffer,
        contentType: "application/pdf",
      });
    }

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
      if (content.length > MAX_INLINE_ATTACHMENT_BYTES) {
        return NextResponse.json(
          {
            error: `Anhang „${filename}“ ist zu groß für den direkten Versand. Bitte erneut senden – große PDFs werden automatisch über den Speicher hochgeladen.`,
          },
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

    if (totalBytes > MAX_PATEN_MAIL_PDFS_TOTAL_BYTES) {
      return NextResponse.json(
        {
          error: `Die Anhänge sind insgesamt zu groß (max. ${Math.round(MAX_PATEN_MAIL_PDFS_TOTAL_BYTES / 1024 / 1024)} MB).`,
        },
        { status: 400 }
      );
    }

    if (rawAttachments.length > 0 && totalBytes > MAX_INLINE_TOTAL_BYTES) {
      return NextResponse.json(
        {
          error:
            "Die PDF-Anhänge sind zu groß für den direkten Versand. Bitte erneut senden – große PDFs werden automatisch über den Speicher hochgeladen.",
        },
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
  } finally {
    if (tempStoragePaths.length > 0) {
      await removePatenMailPdfs(tempStoragePaths);
    }
  }
}
