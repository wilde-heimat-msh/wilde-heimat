"use client";

import { useState, type FormEvent } from "react";
import {
  FormField,
  FormNotice,
  SubmitButton,
  TextArea,
} from "./FormFields";

export function KontaktForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl border border-border bg-muted-light/30 shadow-soft text-center">
        <p className="text-lg font-medium">Nachricht gesendet!</p>
        <p className="mt-2 text-muted">Wir melden uns so schnell wie möglich bei dir.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Name" name="name" required />
        <FormField label="E-Mail" name="email" type="email" required />
      </div>
      <FormField label="Betreff" name="betreff" />
      <TextArea label="Nachricht" name="nachricht" required rows={6} />
      <FormNotice />
      <SubmitButton label="Nachricht senden" />
    </form>
  );
}
