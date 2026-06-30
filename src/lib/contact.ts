import { siteConfig } from "@/data/site";

/** Mehrzeilige Postanschrift für Impressum & Datenschutz */
export function formatContactAddressLines(): string[] {
  const { street, postalCode, city, country } = siteConfig.contact;
  return [street, `${postalCode} ${city}`, country];
}
