import { NextResponse } from "next/server";
import { listWaschbaerenPublic } from "@/lib/waschbaerStore";

export async function GET() {
  try {
    const waschbaeren = await listWaschbaerenPublic();
    return NextResponse.json({ waschbaeren });
  } catch {
    return NextResponse.json({ error: "Waschbären konnten nicht geladen werden." }, { status: 500 });
  }
}
