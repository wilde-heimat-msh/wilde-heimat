import { NextResponse } from "next/server";
import {
  createUpdate,
  deleteUpdate,
  listPaten,
  listUpdates,
  updatePatenschaftUpdate,
} from "@/lib/patenschaftStore";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";
import type { PatenschaftStufeId } from "@/data/patenschaften";

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const [updates, paten] = await Promise.all([listUpdates(), listPaten()]);
    return NextResponse.json({ updates, paten });
  } catch (error) {
    return apiErrorResponse(error, "Updates konnten nicht geladen werden.");
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = (await request.json()) as {
    waschbaerSlug?: string;
    minStufe?: PatenschaftStufeId;
    patronId?: string;
    title?: string;
    body?: string;
    imageUrls?: string[];
    publishedAt?: string;
  };

  if (!body.waschbaerSlug || !body.minStufe || !body.title?.trim() || !body.body?.trim()) {
    return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
  }

  try {
    const update = await createUpdate({
      waschbaerSlug: body.waschbaerSlug,
      minStufe: body.minStufe,
      patronId: body.patronId || undefined,
      title: body.title.trim(),
      body: body.body.trim(),
      imageUrls: body.imageUrls ?? [],
      publishedAt: body.publishedAt ?? new Date().toISOString(),
    });

    return NextResponse.json({ update }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, "Update konnte nicht erstellt werden.");
  }
}

export async function PUT(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = (await request.json()) as {
    id?: string;
    waschbaerSlug?: string;
    minStufe?: PatenschaftStufeId;
    patronId?: string | null;
    title?: string;
    body?: string;
    imageUrls?: string[];
    publishedAt?: string;
  };

  if (!body.id) {
    return NextResponse.json({ error: "ID fehlt." }, { status: 400 });
  }

  try {
    const update = await updatePatenschaftUpdate(body.id, {
      waschbaerSlug: body.waschbaerSlug,
      minStufe: body.minStufe,
      patronId: body.patronId === null ? undefined : body.patronId,
      title: body.title?.trim(),
      body: body.body?.trim(),
      imageUrls: body.imageUrls,
      publishedAt: body.publishedAt,
    });

    if (!update) {
      return NextResponse.json({ error: "Update nicht gefunden." }, { status: 404 });
    }

    return NextResponse.json({ update });
  } catch (error) {
    return apiErrorResponse(error, "Update konnte nicht aktualisiert werden.");
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
    const ok = await deleteUpdate(id);
    if (!ok) {
      return NextResponse.json({ error: "Update nicht gefunden." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiErrorResponse(error, "Update konnte nicht gelöscht werden.");
  }
}
