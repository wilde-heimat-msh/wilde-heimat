import type { PatenschaftStufeId } from "@/data/patenschaften";

/** Registrierter Pate/Patin mit Zugangscode */
export type PatenschaftPate = {
  id: string;
  /** Anzeigename auf dem Portal */
  name: string;
  /** Vom Admin vergebener Zugangscode (Großbuchstaben empfohlen) */
  accessCode: string;
  waschbaerSlug: string;
  stufeId: PatenschaftStufeId;
  active: boolean;
  /** Nur für Admin-Referenz, nicht öffentlich */
  email?: string;
  notiz?: string;
  /** Verknüpfung zur ursprünglichen Patenschafts-Anfrage */
  formSubmissionId?: string;
  anschrift?: string;
  telefon?: string;
  urkundenNr?: string;
  /** ISO-Datum YYYY-MM-DD */
  ausgestelltAm?: string;
  isGift?: boolean;
  beschenkterName?: string;
  beschenkterAnschrift?: string;
  grussbotschaft?: string;
  widerrufBestaetigtAt?: string;
  datenschutzBestaetigtAt?: string;
  /** ISO-Datum YYYY-MM-DD – Start der Patenschaft */
  patenschaftStart?: string;
  createdAt: string;
  updatedAt: string;
};

/** Erfasste Patenschafts-Zahlung (pro Person / access_code und Monat) */
export type PatenschaftZahlung = {
  id: string;
  accessCode: string;
  /** Abrechnungsmonat YYYY-MM */
  period: string;
  amount: number;
  /** ISO-Datum YYYY-MM-DD – Eingang auf dem Konto */
  paidAt: string;
  note?: string;
  createdAt: string;
};

/** Update zu einem Patentier – sichtbar je nach Stufe */
export type PatenschaftUpdate = {
  id: string;
  waschbaerSlug: string;
  /** Mindest-Stufe, ab der das Update sichtbar ist */
  minStufe: PatenschaftStufeId;
  /** Optional: nur für einen bestimmten Paten */
  patronId?: string;
  title: string;
  body: string;
  imageUrls: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type PatenschaftStore = {
  paten: PatenschaftPate[];
  updates: PatenschaftUpdate[];
};
