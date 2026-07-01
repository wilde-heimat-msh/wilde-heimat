import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import {
  deleteFormSubmission,
  listFormSubmissions,
} from "@/lib/supabase/formSubmissions";
import {
  getFormMailFrom,
  getFormMailProvider,
  getFormMailTo,
  isFormMailConfigured,
  isFormMailDomainVerified,
} from "@/lib/formMail";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase ist nicht konfiguriert. Formular-Anfragen sind nur mit Supabase verfügbar." },
      { status: 503 }
    );
  }

  try {
    const submissions = await listFormSubmissions();
    return NextResponse.json({
      submissions,
      mail: {
        configured: isFormMailConfigured(),
        domainVerified: isFormMailDomainVerified(),
        provider: getFormMailProvider(),
        to: getFormMailTo(),
        from: getFormMailFrom(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Anfragen konnten nicht geladen werden.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID fehlt." }, { status: 400 });
  }

  try {
    const ok = await deleteFormSubmission(id);
    if (!ok) {
      return NextResponse.json({ error: "Anfrage nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Löschen fehlgeschlagen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
