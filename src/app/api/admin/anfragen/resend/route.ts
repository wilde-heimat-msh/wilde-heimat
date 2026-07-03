import { NextResponse } from "next/server";
import { isFormMailConfigured, sendSubmissionNotification } from "@/lib/formMail";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { getFormSubmissionById } from "@/lib/supabase/formSubmissions";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase ist nicht konfiguriert." }, { status: 503 });
  }

  if (!isFormMailConfigured()) {
    return NextResponse.json(
      {
        error:
          "E-Mail-Versand ist noch nicht eingerichtet. SMTP-Zugangsdaten in Vercel setzen – siehe docs/email-setup.md.",
      },
      { status: 503 }
    );
  }

  let body: { id?: string };
  try {
    body = (await request.json()) as { id?: string };
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const id = body.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "ID fehlt." }, { status: 400 });
  }

  try {
    const submission = await getFormSubmissionById(id);
    if (!submission) {
      return NextResponse.json({ error: "Anfrage nicht gefunden." }, { status: 404 });
    }

    const result = await sendSubmissionNotification(submission, { resend: true });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "E-Mail konnte nicht gesendet werden.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
