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
