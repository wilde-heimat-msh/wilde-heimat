"use client";

import { useState, type FormEvent } from "react";
import { waschbaeren, getWaschbaerBySlug } from "@/data/waschbaeren";
import { patenschaftsStufen } from "@/data/site";
import {
  Checkbox,
  FormField,
  FormNotice,
  Select,
  SubmitButton,
  TextArea,
} from "./FormFields";

function resolveWaschbaer(slug?: string) {
  if (!slug) return undefined;
  return getWaschbaerBySlug(slug) ? slug : undefined;
}

function resolveStufe(id?: string) {
  if (!id) return undefined;
  return patenschaftsStufen.some((s) => s.id === id) ? id : undefined;
}

type PatenschaftFormProps = {
  preselectedWaschbaer?: string;
  preselectedStufe?: string;
};

export function PatenschaftForm({
  preselectedWaschbaer,
  preselectedStufe,
}: PatenschaftFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isGift, setIsGift] = useState(false);

  const waschbaerSlug = resolveWaschbaer(preselectedWaschbaer);
  const stufeId = resolveStufe(preselectedStufe);
  const selectedWaschbaer = waschbaerSlug ? getWaschbaerBySlug(waschbaerSlug) : undefined;
  const selectedStufe = stufeId
    ? patenschaftsStufen.find((s) => s.id === stufeId)
    : undefined;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-muted-light/30 shadow-soft text-center">
        <p className="text-lg font-medium">Vielen Dank für dein Interesse!</p>
        <p className="mt-2 text-muted leading-relaxed">
          Wir melden uns in Kürze bei dir, schicken den PayPal-Link für die monatliche
          Unterstützung und starten dann
          {isGift ? " die Geschenk-Patenschaft" : " deine Patenschaft"}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(selectedWaschbaer || selectedStufe) && (
        <div className="rounded-xl border border-sage/25 bg-sage/5 px-4 py-3 text-sm">
          <p className="font-medium text-forest">Deine Auswahl</p>
          <p className="mt-1 text-muted">
            {selectedWaschbaer && (
              <>
                Waschbär: <strong className="text-foreground">{selectedWaschbaer.name}</strong>
              </>
            )}
            {selectedWaschbaer && selectedStufe && " · "}
            {selectedStufe && (
              <>
                Stufe:{" "}
                <strong className="text-foreground">
                  {selectedStufe.name} ({selectedStufe.preis} €/Monat)
                </strong>
              </>
            )}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Dein Name" name="name" required />
        <FormField label="E-Mail" name="email" type="email" required />
      </div>
      <FormField
        label="Deine Anschrift"
        name="anschrift"
        required
        hint="Für die Urkunde und unseren Schriftverkehr"
      />
      <FormField label="Telefon" name="telefon" type="tel" hint="Optional – für Rückfragen" />

      <Select
        label="Gewählter Waschbär"
        name="waschbaer"
        required
        placeholder="Waschbär auswählen"
        defaultValue={waschbaerSlug ?? ""}
        options={waschbaeren.map((w) => ({
          value: w.slug,
          label: w.name,
        }))}
      />
      <Select
        label="Patenschaftsstufe"
        name="stufe"
        required
        placeholder="Stufe auswählen"
        defaultValue={stufeId ?? ""}
        options={patenschaftsStufen.map((s) => ({
          value: s.id,
          label: `${s.name} – ${s.preis} € monatlich`,
        }))}
      />

      <div className="rounded-xl border border-border bg-background/60 p-4 sm:p-5 space-y-4">
        <Checkbox
          label="Patenschaft verschenken"
          name="geschenk"
          checked={isGift}
          onChange={setIsGift}
          hint="Die Urkunde geht an eine andere Person – du bleibst Ansprechpartner für die Zahlung."
        />

        {isGift && (
          <div className="space-y-4 pt-2 border-t border-border/60">
            <FormField
              label="Name des Beschenkten"
              name="beschenkter_name"
              required
            />
            <FormField
              label="Anschrift des Beschenkten"
              name="beschenkter_anschrift"
              required
              hint="Hier senden wir die Urkunde hin"
            />
            <TextArea
              label="Grußbotschaft für die Urkunde"
              name="grussbotschaft"
              rows={3}
              hint="Optional – z. B. „Alles Gute zum Geburtstag!“"
            />
          </div>
        )}
      </div>

      <FormNotice />
      <SubmitButton label={isGift ? "Geschenk-Patenschaft anfragen" : "Patenschaft anfragen"} />
    </form>
  );
}
