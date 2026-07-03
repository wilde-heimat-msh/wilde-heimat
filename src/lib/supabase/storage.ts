import { randomUUID } from "crypto";
import { getSupabaseAdmin, isSupabaseConfigured, UPLOADS_BUCKET } from "@/lib/supabase/admin";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const SIGNED_URL_TTL_SECONDS = 60 * 60;

export function isSupabaseStorageEnabled(): boolean {
  return isSupabaseConfigured();
}

export function isStoragePath(value: string): boolean {
  return (
    !value.startsWith("http") &&
    (value.startsWith("form-uploads/") ||
      value.startsWith("paten-updates/") ||
      value.startsWith("waschbaeren/"))
  );
}

export async function uploadImage(
  folder: "paten-updates" | "form-uploads" | "waschbaeren",
  file: File,
  subfolder?: string,
  contentType?: string
): Promise<{ publicUrl: string } | { storagePath: string } | { error: string }> {
  const mime = contentType ?? file.type;
  if (!ALLOWED_TYPES.has(mime)) {
    return { error: "Nur JPG, PNG, WebP oder GIF erlaubt." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Datei ist zu groß (max. 8 MB)." };
  }

  const ext = mime.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const prefix = subfolder ? `${folder}/${subfolder}` : folder;
  const storagePath = `${prefix}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const uploaded = await uploadBuffer(storagePath, buffer, mime);
  if ("error" in uploaded) {
    return uploaded;
  }

  if (folder === "form-uploads") {
    return { storagePath };
  }

  const { data } = getSupabaseAdmin().storage.from(UPLOADS_BUCKET).getPublicUrl(storagePath);
  return { publicUrl: data.publicUrl };
}

export async function uploadBuffer(
  storagePath: string,
  buffer: Buffer,
  contentType: string
): Promise<{ storagePath: string } | { error: string }> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(UPLOADS_BUCKET).upload(storagePath, buffer, {
    contentType,
    upsert: false,
  });

  if (error) {
    return { error: error.message };
  }

  return { storagePath };
}

export async function resolveAttachmentPreviewUrl(
  storagePathOrUrl: string
): Promise<string | null> {
  if (storagePathOrUrl.startsWith("http")) {
    return storagePathOrUrl;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .createSignedUrl(storagePathOrUrl, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
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
