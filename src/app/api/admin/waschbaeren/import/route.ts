import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { importStaticWaschbaeren } from "@/lib/waschbaerStore";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";

export async function POST() {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Import erfordert Supabase." }, { status: 503 });
  }

  try {
    const result = await importStaticWaschbaeren();
    revalidatePath("/waschbaeren");
    revalidatePath("/");
    revalidatePath("/patenschaften");
    revalidatePath("/sitemap.xml");
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import fehlgeschlagen.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
