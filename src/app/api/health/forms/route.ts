import { NextResponse } from "next/server";
import { getFormMailProvider, isFormMailConfigured } from "@/lib/formMail";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET() {
  const supabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const supabaseKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

  return NextResponse.json({
    formsReady: isSupabaseConfigured() || isFormMailConfigured(),
    supabase: {
      configured: isSupabaseConfigured(),
      urlSet: supabaseUrl,
      serviceKeySet: supabaseKey,
    },
    email: {
      configured: isFormMailConfigured(),
      provider: getFormMailProvider(),
    },
  });
}
