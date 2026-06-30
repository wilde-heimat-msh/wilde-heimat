import { getSupabaseAdmin, isSupabaseConfigured, UPLOADS_BUCKET } from "@/lib/supabase/admin";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function isSupabaseStorageEnabled(): boolean {
  return isSupabaseConfigured();
}

export async function uploadImage(
  folder: "paten-updates" | "form-uploads",
  file: File
): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Nur JPG, PNG, WebP oder GIF erlaubt." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Datei ist zu groß (max. 8 MB)." };
  }

  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  return uploadBuffer(path, buffer, file.type);
}

export async function uploadBuffer(
  storagePath: string,
  buffer: Buffer,
  contentType: string
): Promise<{ url: string } | { error: string }> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(UPLOADS_BUCKET).upload(storagePath, buffer, {
    contentType,
    upsert: false,
  });

  if (error) {
    return { error: error.message };
  }

  const { data } = supabase.storage.from(UPLOADS_BUCKET).getPublicUrl(storagePath);
  return { url: data.publicUrl };
}

export async function saveFormSubmission(input: {
  type: string;
  payload: Record<string, string | undefined>;
  replyTo?: string;
  attachmentUrl?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("form_submissions").insert({
    type: input.type,
    payload: input.payload,
    reply_to: input.replyTo ?? null,
    attachment_url: input.attachmentUrl ?? null,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
