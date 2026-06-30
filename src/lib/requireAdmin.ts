import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function requireAdmin(): Promise<NextResponse | null> {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }
  return null;
}
