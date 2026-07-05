/** Bankverbindung für Patenschafts-Beiträge per Überweisung */
export const patenschaftBank = {
  accountHolder: "Julia Rothmann",
  iban: "DE63 1007 7777 0053 0014 00",
  ibanCompact: "DE63100777770053001400",
  bic: "NORSDE51XXX",
  bankName: "Norisbank",
  paymentMethodLabel: "Banküberweisung (monatlich)",
  /** Hinweis für Dokumente und rechtliche Texte */
  legalNote:
    "Der monatliche Patenschaftsbeitrag ist per Banküberweisung auf das unten genannte Konto zu leisten. Bitte gib den persönlichen Verwendungszweck exakt an, damit wir deine Zahlung zuordnen können.",
  /** Öffentlicher Hinweis auf der Patenschafts-Seite */
  publicNote:
    "Monatliche Patenschaften (10 / 20 / 50 €) werden per Banküberweisung geleistet. Nach deiner Anfrage erhältst du die Bankverbindung und deinen persönlichen Verwendungszweck.",
  /** Text nach Formular-Absendung */
  afterAnfrageNote:
    "Wir melden uns in Kürze bei dir und senden dir die Zahlungsinformationen zur monatlichen Banküberweisung.",
} as const;

export function formatPatenschaftIbanDisplay(iban = patenschaftBank.iban): string {
  return iban.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
}
