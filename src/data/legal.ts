import { siteConfig } from "@/data/site";
import { formatContactAddressLines } from "@/lib/contact";

/** Pflichtfeld in der Patenschaftsanfrage (Kenntnisnahme der Widerrufsbelehrung) */
export const FORM_WIDERRUF_CONSENT_FIELD = "widerrufsbelehrung_kenntnis";

export const widerrufMetadata = {
  title: "Widerrufsbelehrung",
  description:
    "Widerrufsrecht und Muster-Widerrufsformular für Patenschaften der privaten Initiative Wilde Heimat.",
  path: "/widerruf",
} as const;

export function getWiderrufContactBlock(): string {
  const lines = formatContactAddressLines();
  return [
    siteConfig.contact.name,
    ...lines,
    siteConfig.region,
    `E-Mail: ${siteConfig.email}`,
  ].join("\n");
}

/** VSBG-Hinweis für das Impressum (§ 36 VSBG) */
export const vsbgHinweis =
  "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.";
