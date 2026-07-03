import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isSupabaseStorageEnabled, uploadImage } from "@/lib/supabase/storage";
import { requireAdmin } from "@/lib/requireAdmin";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function resolveMimeType(file: File): string | null {
  if (file.type && ALLOWED_TYPES.has(file.type)) {
    return file.type;
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  const byExt: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };

  return ext ? byExt[ext] ?? null : null;
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei übermittelt." }, { status: 400 });
  }

  const mime = resolveMimeType(file);
  if (!mime) {
    return NextResponse.json(
      { error: "Nur JPG, PNG, WebP oder GIF erlaubt." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Datei ist zu groß (max. 8 MB)." }, { status: 400 });
  }

  const folder = (formData.get("folder") as string) || "paten-updates";
  const subfolder = (formData.get("subfolder") as string) || undefined;
  const allowedFolders = new Set(["paten-updates", "waschbaeren"]);
  if (!allowedFolders.has(folder)) {
    return NextResponse.json({ error: "Ungültiger Upload-Ordner." }, { status: 400 });
  }

  if (isSupabaseStorageEnabled()) {
    const result = await uploadImage(
      folder as "paten-updates" | "waschbaeren",
      file,
      subfolder,
      mime
    );
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    if ("publicUrl" in result) {
      return NextResponse.json({ url: result.publicUrl });
    }
    return NextResponse.json({ error: "Upload fehlgeschlagen." }, { status: 500 });
  }

  const ext = mime.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir =
    folder === "waschbaeren" && subfolder
      ? path.join(process.cwd(), "public", folder, subfolder)
      : path.join(process.cwd(), "public", folder === "waschbaeren" ? "waschbaeren" : "paten-updates");
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  const url =
    folder === "waschbaeren" && subfolder
      ? `/${folder}/${subfolder}/${filename}`
      : folder === "waschbaeren"
        ? `/waschbaeren/${filename}`
        : `/paten-updates/${filename}`;

  return NextResponse.json({ url });
}
