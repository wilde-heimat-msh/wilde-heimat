import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isSupabaseStorageEnabled, uploadImage } from "@/lib/supabase/storage";
import { requireAdmin } from "@/lib/requireAdmin";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei übermittelt." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Nur JPG, PNG, WebP oder GIF erlaubt." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Datei ist zu groß (max. 8 MB)." }, { status: 400 });
  }

  if (isSupabaseStorageEnabled()) {
    const result = await uploadImage("paten-updates", file);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    if ("publicUrl" in result) {
      return NextResponse.json({ url: result.publicUrl });
    }
    return NextResponse.json({ error: "Upload fehlgeschlagen." }, { status: 500 });
  }

  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public/paten-updates");
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/paten-updates/${filename}` });
}
