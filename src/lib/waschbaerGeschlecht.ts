const WEIBLICH = new Set([
  "mausi",
  "lotti",
  "minnie",
  "mika",
  "charlie",
  "luna",
  "mila",
]);

export function istWaschbaerWeiblich(slug: string): boolean {
  return WEIBLICH.has(slug);
}

/** „auf seinem Weg“ / „auf ihrem Weg“ */
export function waschbaerBegleitenPhrase(slug: string): string {
  return istWaschbaerWeiblich(slug) ? "auf ihrem Weg" : "auf seinem Weg";
}
