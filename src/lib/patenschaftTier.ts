import type { PatenschaftStufeId } from "@/data/patenschaften";

const STUFE_RANK: Record<PatenschaftStufeId, number> = {
  bronze: 1,
  silber: 2,
  gold: 3,
};

export function stufeMeetsMinimum(
  patronStufe: PatenschaftStufeId,
  requiredStufe: PatenschaftStufeId
): boolean {
  return STUFE_RANK[patronStufe] >= STUFE_RANK[requiredStufe];
}

export function normalizeAccessCode(code: string): string {
  return code.trim().toUpperCase();
}

/** Vorschlag für einen neuen Paten-Zugangscode – z. B. MILA-SILBER-CG-2026 */
export function suggestPatenAccessCode(input: {
  waschbaerSlug: string;
  stufeId: PatenschaftStufeId;
  name?: string;
  year?: number;
}): string {
  const year = input.year ?? new Date().getFullYear();
  const waschbaerPart = input.waschbaerSlug.replace(/-/g, "").slice(0, 8).toUpperCase();
  const stufePart = input.stufeId.toUpperCase();
  const namePart = (input.name ?? "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 4);

  return `${waschbaerPart}-${stufePart}-${namePart || "PATE"}-${year}`;
}

export function getPatenPortalUrl(origin: string, accessCode: string): string {
  return `${origin}/paten/zugang/${encodeURIComponent(accessCode)}`;
}
