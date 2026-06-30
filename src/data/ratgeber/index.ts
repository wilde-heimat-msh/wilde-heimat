import type { RatgeberArtikel } from "./types";
import { fundtierHilfe } from "./artikel/fundtier-hilfe";
import { ersteSchritteBeiNotfaellen } from "./artikel/erste-schritte-bei-notfaellen";
import { waschbaerbabyGefunden } from "./artikel/waschbaerbaby-gefunden";
import { wannBrauchtEinWaschbaerHilfe } from "./artikel/wann-braucht-ein-waschbaer-hilfe";
import { waschbaerAnfassen } from "./artikel/waschbaer-anfassen";
import { waschbaerenImGarten } from "./artikel/waschbaeren-im-garten";
import { haeufigeIrrtuemer } from "./artikel/haeufige-irrtuemer";
import { waschbaerenVerstehen } from "./artikel/waschbaeren-verstehen";
import { rechtlicheHinweise } from "./artikel/rechtliche-hinweise";

export type { RatgeberArtikel, RatgeberSection } from "./types";

export const ratgeberArtikel: RatgeberArtikel[] = [
  fundtierHilfe,
  ersteSchritteBeiNotfaellen,
  waschbaerbabyGefunden,
  wannBrauchtEinWaschbaerHilfe,
  waschbaerAnfassen,
  waschbaerenImGarten,
  haeufigeIrrtuemer,
  waschbaerenVerstehen,
  rechtlicheHinweise,
];

export function getArtikelBySlug(slug: string): RatgeberArtikel | undefined {
  return ratgeberArtikel.find((a) => a.slug === slug);
}
