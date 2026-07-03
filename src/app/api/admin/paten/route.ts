import { NextResponse } from "next/server";
import {
  createPaten,
  deletePaten,
  isPatenschaftSlotTaken,
  listPaten,
  updatePaten,
} from "@/lib/patenschaftStore";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";
import type { PatenschaftStufeId } from "@/data/patenschaften";

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const paten = await listPaten();
    return NextResponse.json({ paten });
  } catch (error) {
    return apiErrorResponse(error, "Paten konnten nicht geladen werden.");
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = (await request.json()) as {
    name?: string;
    accessCode?: string;
    waschbaerSlug?: string;
    stufeId?: PatenschaftStufeId;
    email?: string;
    notiz?: string;
    active?: boolean;
    formSubmissionId?: string;
    anschrift?: string;
    telefon?: string;
    urkundenNr?: string;
    ausgestelltAm?: string;
    isGift?: boolean;
    beschenkterName?: string;
    beschenkterAnschrift?: string;
    grussbotschaft?: string;
    widerrufBestaetigtAt?: string;
    datenschutzBestaetigtAt?: string;
    patenschaftStart?: string;
  };

  if (!body.name?.trim() || !body.accessCode?.trim() || !body.waschbaerSlug || !body.stufeId) {
    return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
  }

  if (await isPatenschaftSlotTaken(body.accessCode, body.waschbaerSlug)) {
    return NextResponse.json(
      { error: "Für diesen Zugangscode existiert bereits eine Patenschaft für diesen Waschbären." },
      { status: 409 }
    );
  }

  try {
    const pate = await createPaten({
      name: body.name.trim(),
      accessCode: body.accessCode.trim(),
      waschbaerSlug: body.waschbaerSlug,
      stufeId: body.stufeId,
      email: body.email?.trim() || undefined,
      notiz: body.notiz?.trim() || undefined,
      active: body.active ?? true,
      formSubmissionId: body.formSubmissionId,
      anschrift: body.anschrift?.trim(),
      telefon: body.telefon?.trim(),
      urkundenNr: body.urkundenNr?.trim(),
      ausgestelltAm: body.ausgestelltAm,
      isGift: body.isGift,
      beschenkterName: body.beschenkterName?.trim(),
      beschenkterAnschrift: body.beschenkterAnschrift?.trim(),
      grussbotschaft: body.grussbotschaft?.trim(),
      widerrufBestaetigtAt: body.widerrufBestaetigtAt,
      datenschutzBestaetigtAt: body.datenschutzBestaetigtAt,
      patenschaftStart: body.patenschaftStart,
    });

    return NextResponse.json({ pate }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, "Pate konnte nicht angelegt werden.");
  }
}

export async function PUT(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = (await request.json()) as {
    id?: string;
    name?: string;
    accessCode?: string;
    waschbaerSlug?: string;
    stufeId?: PatenschaftStufeId;
    email?: string;
    notiz?: string;
    active?: boolean;
    formSubmissionId?: string;
    anschrift?: string;
    telefon?: string;
    urkundenNr?: string;
    ausgestelltAm?: string;
    isGift?: boolean;
    beschenkterName?: string;
    beschenkterAnschrift?: string;
    grussbotschaft?: string;
    widerrufBestaetigtAt?: string;
    datenschutzBestaetigtAt?: string;
    patenschaftStart?: string;
  };

  if (!body.id) {
    return NextResponse.json({ error: "ID fehlt." }, { status: 400 });
  }

  if (
    body.accessCode &&
    body.waschbaerSlug &&
    (await isPatenschaftSlotTaken(body.accessCode, body.waschbaerSlug, body.id))
  ) {
    return NextResponse.json(
      { error: "Für diesen Zugangscode existiert bereits eine Patenschaft für diesen Waschbären." },
      { status: 409 }
    );
  }

  try {
    const pate = await updatePaten(body.id, {
      name: body.name?.trim(),
      accessCode: body.accessCode?.trim(),
      waschbaerSlug: body.waschbaerSlug,
      stufeId: body.stufeId,
      email: body.email?.trim(),
      notiz: body.notiz?.trim(),
      active: body.active,
      formSubmissionId: body.formSubmissionId,
      anschrift: body.anschrift?.trim(),
      telefon: body.telefon?.trim(),
      urkundenNr: body.urkundenNr?.trim(),
      ausgestelltAm: body.ausgestelltAm,
      isGift: body.isGift,
      beschenkterName: body.beschenkterName?.trim(),
      beschenkterAnschrift: body.beschenkterAnschrift?.trim(),
      grussbotschaft: body.grussbotschaft?.trim(),
      widerrufBestaetigtAt: body.widerrufBestaetigtAt,
      datenschutzBestaetigtAt: body.datenschutzBestaetigtAt,
      patenschaftStart: body.patenschaftStart,
    });

    if (!pate) {
      return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
    }

    return NextResponse.json({ pate });
  } catch (error) {
    return apiErrorResponse(error, "Pate konnte nicht aktualisiert werden.");
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
    const ok = await deletePaten(id);
    if (!ok) {
      return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiErrorResponse(error, "Pate konnte nicht gelöscht werden.");
  }
}
