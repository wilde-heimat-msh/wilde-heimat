"use client";

import { useState, type FormEvent } from "react";
import {
  FormField,
  FormHoneypot,
  PrivacyConsentField,
  SubmitButton,
  TextArea,
} from "./FormFields";
import { submitPublicForm } from "@/lib/submitPublicForm";

export function PflegestelleForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!privacyAccepted) {
      setError("Bitte bestätige die Datenschutzerklärung.");
      return;
    }
    setLoading(true);
    setError(null);

    const result = await submitPublicForm("pflegestelle", e.currentTarget);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl border border-border bg-muted-light/30 shadow-soft text-center">
        <p className="text-lg font-medium">Vielen Dank für deine Anmeldung!</p>
        <p className="mt-2 text-muted">
          Wir prüfen deine Angaben und melden uns bei dir.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative min-w-0 max-w-full space-y-6">
      <FormHoneypot />
      <FormField label="Name" name="name" required />
      <FormField label="Anschrift" name="anschrift" required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="E-Mail" name="email" type="email" required />
        <FormField label="Telefon" name="telefon" type="tel" required />
      </div>
      <TextArea
        label="Erfahrung mit Wildtieren / Waschbären"
        name="erfahrung"
        required
        hint="Beschreibe deine bisherige Erfahrung, Qualifikationen und Motivation."
      />
      <TextArea
        label="Platzangebot"
        name="platzangebot"
        required
        hint="Wie viele Tiere kannst du aufnehmen? Welche Ausstattung ist vorhanden?"
      />
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <PrivacyConsentField onConsentChange={setPrivacyAccepted} />
      <SubmitButton
        label={loading ? "Wird gesendet …" : "Als Pflegestelle melden"}
        disabled={loading || !privacyAccepted}
      />
    </form>
  );
}

export function WaschbaerGefundenForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!privacyAccepted) {
      setError("Bitte bestätige die Datenschutzerklärung.");
      return;
    }
    setLoading(true);
    setError(null);

    const result = await submitPublicForm("fund", e.currentTarget);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl border border-border bg-muted-light/30 shadow-soft text-center">
        <p className="text-lg font-medium">Meldung erhalten!</p>
        <p className="mt-2 text-muted">
          Wir melden uns umgehend bei dir. Bitte lass das Tier bis dahin in Ruhe,
          sofern es nicht in unmittelbarer Gefahr ist. Wilde Heimat nimmt keine
          Waschbären selbst auf – wir vermitteln dir passende Ansprechpartner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative min-w-0 max-w-full space-y-6">
      <FormHoneypot />
      <FormField label="Fundort" name="fundort" required />
      <FormField label="Datum des Fundes" name="datum" type="date" required />
      <div className="min-w-0">
        <label htmlFor="foto" className="block text-sm font-medium mb-2">
          Foto hochladen
        </label>
        <input
          type="file"
          id="foto"
          name="foto"
          accept="image/*"
          className="w-full min-w-0 text-sm text-muted file:mr-4 file:min-h-11 file:py-2 file:px-4 file:border file:border-border file:bg-muted-light file:text-foreground hover:file:bg-border overflow-hidden"
        />
        <p className="mt-1 text-xs text-muted">
          Optional – JPG, PNG oder WebP, max. 8 MB. Das Foto wird nur zur Bearbeitung deiner
          Meldung gespeichert (siehe{" "}
          <a href="/datenschutz#formulare" className="font-medium text-forest underline decoration-forest underline-offset-4 hover:text-forest-mid">
            Datenschutzerklärung
          </a>
          ).
        </p>
      </div>
      <TextArea
        label="Beschreibung"
        name="beschreibung"
        required
        hint="Altersschätzung, Zustand des Tieres, besondere Beobachtungen"
      />
      <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="Dein Name" name="name" required />
        <FormField label="Telefon" name="telefon" type="tel" required />
      </div>
      <FormField label="E-Mail" name="email" type="email" required />
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <PrivacyConsentField onConsentChange={setPrivacyAccepted} />
      <SubmitButton
        label={loading ? "Wird gesendet …" : "Fund melden"}
        disabled={loading || !privacyAccepted}
      />
    </form>
  );
}

export function VermittlungsForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!privacyAccepted) {
      setError("Bitte bestätige die Datenschutzerklärung.");
      return;
    }
    setLoading(true);
    setError(null);

    const result = await submitPublicForm("vermittlung", e.currentTarget);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl border border-border bg-muted-light/30 shadow-soft text-center">
        <p className="text-lg font-medium">Anfrage erhalten!</p>
        <p className="mt-2 text-muted">
          Wir bearbeiten dein Anliegen und melden uns bei dir.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative min-w-0 max-w-full space-y-6">
      <FormHoneypot />
      <FormField label="Anliegen" name="anliegen" required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Name" name="name" required />
        <FormField label="E-Mail" name="email" type="email" required />
      </div>
      <FormField label="Telefon" name="telefon" type="tel" />
      <TextArea label="Beschreibung" name="beschreibung" required rows={6} />
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <PrivacyConsentField onConsentChange={setPrivacyAccepted} />
      <SubmitButton
        label={loading ? "Wird gesendet …" : "Anfrage senden"}
        disabled={loading || !privacyAccepted}
      />
    </form>
  );
}
