"use client";

import { useState, type FormEvent } from "react";
import {
  FormField,
  FormNotice,
  SubmitButton,
  TextArea,
} from "./FormFields";

export function PflegestelleForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} className="space-y-6">
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
      <FormNotice />
      <SubmitButton label="Als Pflegestelle melden" />
    </form>
  );
}

export function WaschbaerGefundenForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Fundort" name="fundort" required />
      <FormField label="Datum des Fundes" name="datum" type="date" required />
      <div>
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
      </div>
      <TextArea
        label="Beschreibung"
        name="beschreibung"
        required
        hint="Altersschätzung, Zustand des Tieres, besondere Beobachtungen"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Dein Name" name="name" required />
        <FormField label="Telefon" name="telefon" type="tel" required />
      </div>
      <FormField label="E-Mail" name="email" type="email" required />
      <FormNotice />
      <SubmitButton label="Fund melden" />
    </form>
  );
}

export function VermittlungsForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Anliegen" name="anliegen" required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Name" name="name" required />
        <FormField label="E-Mail" name="email" type="email" required />
      </div>
      <FormField label="Telefon" name="telefon" type="tel" />
      <TextArea label="Beschreibung" name="beschreibung" required rows={6} />
      <FormNotice />
      <SubmitButton label="Anfrage senden" />
    </form>
  );
}
