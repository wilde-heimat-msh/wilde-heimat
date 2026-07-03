import { NextResponse } from "next/server";
import type { PatenschaftStufeId } from "@/data/patenschaften";
import { buildAdditionalPatenschaftFromPate } from "@/lib/patenschaftFromAnfrage";
import {
  createPaten,
  deletePaten,
  getPatenById,
  isPatenschaftSlotTaken,
  listPatenschaftenForPatron,
} from "@/lib/patenschaftStore";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";
import { listWaschbaeren } from "@/lib/waschbaerStore";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context.params;

  try {
    const patenschaften = await listPatenschaftenForPatron(id);
    if (patenschaften.length === 0) {
      return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
    }

    const waschbaeren = await listWaschbaeren();
    const items = patenschaften.map((pate) => {
      const waschbaer = waschbaeren.find((w) => w.slug === pate.waschbaerSlug);
      return {
        id: pate.id,
        waschbaerSlug: pate.waschbaerSlug,
        waschbaerName: waschbaer?.name ?? pate.waschbaerSlug,
        stufeId: pate.stufeId,
        active: pate.active,
        urkundenNr: pate.urkundenNr,
        patenschaftStart: pate.patenschaftStart,
      };
    });

    return NextResponse.json({
      accessCode: patenschaften[0]?.accessCode,
      patenschaften: items,
    });
  } catch (error) {
    return apiErrorResponse(error, "Patentiere konnten nicht geladen werden.");
  }
}

export async function POST(request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context.params;

  let body: { waschbaerSlug?: string; stufeId?: PatenschaftStufeId; notiz?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!body.waschbaerSlug || !body.stufeId) {
    return NextResponse.json({ error: "Waschbär und Stufe sind Pflichtfelder." }, { status: 400 });
  }

  try {
    const source = await getPatenById(id);
    if (!source) {
      return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
    }

    if (await isPatenschaftSlotTaken(source.accessCode, body.waschbaerSlug)) {
      return NextResponse.json(
        { error: "Für diesen Paten existiert bereits eine Patenschaft für diesen Waschbären." },
        { status: 409 }
      );
    }

    const waschbaeren = await listWaschbaeren();
    if (!waschbaeren.some((w) => w.slug === body.waschbaerSlug)) {
      return NextResponse.json({ error: "Waschbär nicht gefunden." }, { status: 400 });
    }

    const pate = await createPaten(
      buildAdditionalPatenschaftFromPate(source, {
        waschbaerSlug: body.waschbaerSlug,
        stufeId: body.stufeId,
        notiz: body.notiz?.trim() || undefined,
      })
    );

    return NextResponse.json({ pate }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, "Patenschaft konnte nicht hinzugefügt werden.");
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context.params;
  const patenschaftId = new URL(request.url).searchParams.get("patenschaftId")?.trim();

  if (!patenschaftId) {
    return NextResponse.json({ error: "Patenschaft-ID fehlt." }, { status: 400 });
  }

  try {
    const patenschaften = await listPatenschaftenForPatron(id);
    if (patenschaften.length === 0) {
      return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
    }

    const belongsToPatron = patenschaften.some((p) => p.id === patenschaftId);
    if (!belongsToPatron) {
      return NextResponse.json(
        { error: "Diese Patenschaft gehört nicht zu diesem Paten." },
        { status: 403 }
      );
    }

    const ok = await deletePaten(patenschaftId);
    if (!ok) {
      return NextResponse.json({ error: "Patenschaft nicht gefunden." }, { status: 404 });
    }

    const remaining = patenschaften.filter((p) => p.id !== patenschaftId);
    return NextResponse.json({
      ok: true,
      remainingCount: remaining.length,
      redirectTo: remaining[0] ? `/admin/paten/${remaining[0].id}` : "/admin/paten",
    });
  } catch (error) {
    return apiErrorResponse(error, "Patenschaft konnte nicht entfernt werden.");
  }
}
