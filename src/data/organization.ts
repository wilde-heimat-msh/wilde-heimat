/**
 * Organisationsmodus der Website.
 * Aktuell: private Initiative. Bei Vereinsgründung auf "verein" umstellen
 * und entsprechende Module aktivieren (siehe Ordner /verein-vorbereitung).
 */
export const organization = {
  mode: "private" as const,
  legalForm: "Private Initiative",
  operator: "Julia Rothmann",
  operatorAlias: "Juja",
  isRegisteredVerein: false,
  canIssueDonationReceipts: false,
} as const;
