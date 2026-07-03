import { NextResponse } from "next/server";
import { isFormMailConfigured, sendTestFormMail } from "@/lib/formMail";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST() {
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

  const result = await sendTestFormMail();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
