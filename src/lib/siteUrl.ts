/** Kanonische Produktions-URL (www – Apex leitet per Vercel auf www weiter). */
export const productionSiteUrl = "https://www.wilde-heimat-msh.de";
export const productionSiteHost = "www.wilde-heimat-msh.de";
export const productionSiteApex = "wilde-heimat-msh.de";

/**
 * Aktuelle öffentliche Basis-URL der Website.
 * In Vercel: NEXT_PUBLIC_SITE_URL=https://www.wilde-heimat-msh.de setzen.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const vercelHost = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercelHost) return `https://${vercelHost}`;

  return productionSiteUrl;
}
