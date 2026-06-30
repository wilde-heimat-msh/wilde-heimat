/** Kanonische Domain – wird gesetzt, sobald wilde-heimat-msh.de verbunden ist. */
export const productionSiteUrl = "https://wilde-heimat-msh.de";

/**
 * Aktuelle öffentliche Basis-URL der Website.
 * Vercel: automatisch *.vercel.app, später NEXT_PUBLIC_SITE_URL auf die echte Domain setzen.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const vercelHost = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercelHost) return `https://${vercelHost}`;

  return productionSiteUrl;
}
