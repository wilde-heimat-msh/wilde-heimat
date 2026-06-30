import { NextResponse } from "next/server";
import {
  createPaten,
  deletePaten,
  isAccessCodeTaken,
  listPaten,
  updatePaten,
} from "@/lib/patenschaftStore";
import { requireAdmin } from "@/lib/requireAdmin";
import type { PatenschaftStufeId } from "@/data/patenschaften";

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  const paten = await listPaten();
  return NextResponse.json({ paten });
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
  };

  if (!body.name?.trim() || !body.accessCode?.trim() || !body.waschbaerSlug || !body.stufeId) {
    return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
  }

  if (await isAccessCodeTaken(body.accessCode)) {
    return NextResponse.json({ error: "Dieser Zugangscode ist bereits vergeben." }, { status: 409 });
  }

  const pate = await createPaten({
    name: body.name.trim(),
    accessCode: body.accessCode.trim(),
    waschbaerSlug: body.waschbaerSlug,
    stufeId: body.stufeId,
    email: body.email?.trim() || undefined,
    notiz: body.notiz?.trim() || undefined,
    active: body.active ?? true,
  });

  return NextResponse.json({ pate }, { status: 201 });
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
  };

  if (!body.id) {
    return NextResponse.json({ error: "ID fehlt." }, { status: 400 });
  }

  if (body.accessCode && (await isAccessCodeTaken(body.accessCode, body.id))) {
    return NextResponse.json({ error: "Dieser Zugangscode ist bereits vergeben." }, { status: 409 });
  }

  const pate = await updatePaten(body.id, {
    name: body.name?.trim(),
    accessCode: body.accessCode?.trim(),
    waschbaerSlug: body.waschbaerSlug,
    stufeId: body.stufeId,
    email: body.email?.trim(),
    notiz: body.notiz?.trim(),
    active: body.active,
  });

  if (!pate) {
    return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
  }

  return NextResponse.json({ pate });
}

export async function DELETE(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID fehlt." }, { status: 400 });
  }

  const ok = await deletePaten(id);
  if (!ok) {
    return NextResponse.json({ error: "Pate nicht gefunden." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
