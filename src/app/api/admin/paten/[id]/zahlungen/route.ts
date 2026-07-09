import { NextResponse } from "next/server";
import {
  buildMonatlicherVerwendungszweck,
  buildPatenschaftVerwendungszweck,
  getMonthlyPatenschaftTotal,
  getPatenschaftFaelligAm,
  getPatenschaftZahlungszielTag,
  listPatenschaftMonate,
  toLocalPeriod,
} from "@/lib/patenschaftPayment";
import {
  createPatenschaftZahlung,
  deletePatenschaftZahlung,
  listZahlungenByAccessCode,
} from "@/lib/patenschaftZahlungenStore";
import {
  getPatenById,
  listPatenschaftenForPatron,
  updateZahlungszielForPatron,
} from "@/lib/patenschaftStore";
import { requireAdmin } from "@/lib/requireAdmin";
import { apiErrorResponse } from "@/lib/apiError";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context.params;

  try {
    const pate = await getPatenById(id);
    if (!pate) {
      return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
    }

    const patenschaften = await listPatenschaftenForPatron(id);
    const zahlungen = await listZahlungenByAccessCode(pate.accessCode);
    const zahlungszielTag = getPatenschaftZahlungszielTag(patenschaften);
    const monate = listPatenschaftMonate({ paten: patenschaften, zahlungen });
    const currentPeriod = toLocalPeriod();

    return NextResponse.json({
      accessCode: pate.accessCode,
      monatlicherBeitrag: getMonthlyPatenschaftTotal(patenschaften),
      zahlungszielTag,
      verwendungszweck: buildPatenschaftVerwendungszweck(pate.accessCode),
      monatlicherVerwendungszweck: buildMonatlicherVerwendungszweck(
        pate.accessCode,
        currentPeriod
      ),
      currentPeriod,
      faelligAm: getPatenschaftFaelligAm(currentPeriod, zahlungszielTag),
      heute: new Date().toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      zahlungen,
      monate,
      patenschaften: patenschaften.map((entry) => ({
        id: entry.id,
        waschbaerSlug: entry.waschbaerSlug,
        stufeId: entry.stufeId,
        active: entry.active,
      })),
    });
  } catch (error) {
    return apiErrorResponse(error, "Zahlungsübersicht konnte nicht geladen werden.");
  }
}

export async function POST(request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context.params;

  let body: { period?: string; amount?: number; paidAt?: string; note?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  try {
    const pate = await getPatenById(id);
    if (!pate) {
      return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
    }

    const period = body.period?.trim();
    const paidAt = body.paidAt?.trim();
    const amount = body.amount;

    if (!period || !paidAt || amount === undefined) {
      return NextResponse.json(
        { error: "Monat, Betrag und Zahlungseingang sind Pflichtfelder." },
        { status: 400 }
      );
    }

    const zahlung = await createPatenschaftZahlung({
      accessCode: pate.accessCode,
      period,
      amount,
      paidAt,
      note: body.note?.trim(),
    });

    return NextResponse.json({ zahlung });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Zahlung konnte nicht erfasst werden.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const zahlungId = searchParams.get("zahlungId");

  if (!zahlungId) {
    return NextResponse.json({ error: "zahlungId fehlt." }, { status: 400 });
  }

  try {
    const pate = await getPatenById(id);
    if (!pate) {
      return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
    }

    const zahlungen = await listZahlungenByAccessCode(pate.accessCode);
    if (!zahlungen.some((z) => z.id === zahlungId)) {
      return NextResponse.json({ error: "Zahlung nicht gefunden." }, { status: 404 });
    }

    await deletePatenschaftZahlung(zahlungId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiErrorResponse(error, "Zahlung konnte nicht gelöscht werden.");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context.params;

  let body: { zahlungszielTag?: number };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (body.zahlungszielTag === undefined || Number.isNaN(body.zahlungszielTag)) {
    return NextResponse.json({ error: "zahlungszielTag fehlt." }, { status: 400 });
  }

  try {
    const pate = await updateZahlungszielForPatron(id, body.zahlungszielTag);
    if (!pate) {
      return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
    }

    const patenschaften = await listPatenschaftenForPatron(id);
    const zahlungszielTag = getPatenschaftZahlungszielTag(patenschaften);

    return NextResponse.json({
      ok: true,
      zahlungszielTag,
      message: `Zahlungsziel auf den ${zahlungszielTag}. jedes Monats gesetzt (gilt für alle Patentiere mit diesem Zugangscode).`,
    });
  } catch (error) {
    return apiErrorResponse(error, "Zahlungsziel konnte nicht gespeichert werden.");
  }
}
