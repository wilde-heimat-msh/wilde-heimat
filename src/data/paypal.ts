/**
 * PayPal-Pool für Wilde Heimat.
 * Zahlung läuft ausschließlich bei PayPal – keine API-Keys auf der Website.
 *
 * Pool: https://www.paypal.com/pool/9qruTaFVTi
 */

const DEFAULT_POOL_URL = "https://www.paypal.com/pool/9qruTaFVTi?sr=wccr";

export const paypalDonation = {
  title: "Spenden für die Waschbären",
  subtitle: "PayPal-Pool – Einmalspenden schnell und sicher",
  donateUrl: process.env.NEXT_PUBLIC_PAYPAL_DONATE_URL ?? DEFAULT_POOL_URL,
  logo: "/icons/paypal.png",
  organizer: "Julia Rothmann",
  /** Enddatum des PayPal-Pools (ISO) */
  deadline: "2026-12-20",
  purpose:
    "Das gesammelte Geld wird ausschließlich für Futter, Tierarzt und Gehegebau & Einrichtung verwendet.",
  /** Vorgeschlagene Beträge (Hinweis für Spender – Auswahl erfolgt bei PayPal) */
  suggestedAmounts: [5, 10, 15, 25, 50] as const,
  patenschaftNote:
    "Für monatliche Patenschaften (10 / 20 / 50 €) schicken wir dir nach deiner Anfrage den passenden PayPal-Link – persönlich und unkompliziert.",
} as const;

export function isPayPalConfigured(): boolean {
  const url = paypalDonation.donateUrl.trim();
  return url.startsWith("https://") && url.includes("paypal");
}
