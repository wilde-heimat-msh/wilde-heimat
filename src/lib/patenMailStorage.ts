import { randomUUID } from "crypto";
import { getSupabaseAdmin, UPLOADS_BUCKET } from "@/lib/supabase/admin";

export const PATEN_MAIL_TEMP_PREFIX = "paten-mail-temp";
export const MAX_PATEN_MAIL_PDF_BYTES = 25 * 1024 * 1024;
export const MAX_PATEN_MAIL_PDFS_TOTAL_BYTES = 60 * 1024 * 1024;

function sanitizeFilename(filename: string): string {
  return filename.trim().replace(/[^\w.\-äöüÄÖÜß]/g, "_") || "anhang.pdf";
}

export function isPatenMailStoragePathForPate(storagePath: string, pateId: string): boolean {
  const prefix = `${PATEN_MAIL_TEMP_PREFIX}/${pateId}/`;
  return storagePath.startsWith(prefix) && !storagePath.includes("..");
}

export async function createPatenMailPdfUploadSlot(
  pateId: string,
  filename: string
): Promise<
  | { storagePath: string; signedUrl: string; token: string }
  | { error: string }
> {
  const safeName = sanitizeFilename(filename);
  const storagePath = `${PATEN_MAIL_TEMP_PREFIX}/${pateId}/${randomUUID()}-${safeName}`;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error || !data?.signedUrl) {
    return { error: error?.message ?? "Upload-Slot konnte nicht erstellt werden." };
  }

  return {
    storagePath,
    signedUrl: data.signedUrl,
    token: data.token,
  };
}

export async function downloadPatenMailPdf(
  storagePath: string
): Promise<{ buffer: Buffer } | { error: string }> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.from(UPLOADS_BUCKET).download(storagePath);

  if (error || !data) {
    return { error: error?.message ?? "PDF konnte nicht geladen werden." };
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  if (buffer.length === 0) {
    return { error: "PDF-Anhang ist leer." };
  }

  return { buffer };
}

export async function removePatenMailPdfs(storagePaths: string[]): Promise<void> {
  if (storagePaths.length === 0) return;
  const supabase = getSupabaseAdmin();
  await supabase.storage.from(UPLOADS_BUCKET).remove(storagePaths);
}
