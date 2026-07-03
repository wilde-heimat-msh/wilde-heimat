"use client";

import { FormField } from "@/components/forms/FormFields";
import { patenDokumente, type PatenDokumentId } from "@/data/patenDokumente";
import {
  buildPatenEmailPlatzhalter,
  fillPatenEmailTemplate,
  getPatenEmailVorlage,
  patenEmailVorlagen,
  type PatenEmailVorlageId,
} from "@/data/patenEmailVorlagen";
import { patenschaftsStufen } from "@/data/site";
import type { PatenschaftPate } from "@/types/patenschaftPortal";
import { useEffect, useMemo, useState } from "react";

export type PatenMailAttachment = {
  filename: string;
  contentBase64: string;
};

type PatenDokumentVersandProps = {
  pateId: string;
  pate: PatenschaftPate;
  waschbaerName: string;
  recipientEmail?: string;
  mailConfigured: boolean;
  hasMultiplePatentiere?: boolean;
  generateAttachments: (documentIds: PatenDokumentId[]) => Promise<PatenMailAttachment[]>;
  onSent?: (message: string) => void;
  onError?: (message: string | null) => void;
};

export function PatenDokumentVersand({
  pateId,
  pate,
  waschbaerName,
  recipientEmail,
  mailConfigured,
  hasMultiplePatentiere = false,
  generateAttachments,
  onSent,
  onError,
}: PatenDokumentVersandProps) {
  const stufe = patenschaftsStufen.find((item) => item.id === pate.stufeId);
  const [vorlageId, setVorlageId] = useState<PatenEmailVorlageId>("urkunde-vorab");
  const [to, setTo] = useState(recipientEmail ?? pate.email ?? "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<PatenDokumentId[]>(["urkunde"]);
  const [sending, setSending] = useState(false);

  const platzhalter = useMemo(() => {
    return buildPatenEmailPlatzhalter({
      pateName: pate.name,
      waschbaerName,
      stufeName: stufe?.name ?? pate.stufeId,
      stufePreis: stufe?.preis ?? 0,
      accessCode: pate.accessCode,
      urkundenNr: pate.urkundenNr,
      siteOrigin: typeof window !== "undefined" ? window.location.origin : "",
    });
  }, [pate, stufe, waschbaerName]);

  useEffect(() => {
    const vorlage = getPatenEmailVorlage(vorlageId);
    setSubject(fillPatenEmailTemplate(vorlage.subject, platzhalter));
    setBody(fillPatenEmailTemplate(vorlage.body, platzhalter));
    setSelectedDocs(vorlage.dokumente);
  }, [vorlageId, platzhalter]);

  function toggleDocument(id: PatenDokumentId) {
    setSelectedDocs((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  async function handleSend() {
    if (!mailConfigured) {
      onError?.("E-Mail-Versand ist noch nicht eingerichtet (SMTP in Vercel fehlt).");
      return;
    }

    if (!to.trim()) {
      onError?.("Bitte eine E-Mail-Adresse des Paten angeben.");
      return;
    }

    if (selectedDocs.length === 0) {
      onError?.("Bitte mindestens ein Dokument als Anhang auswählen.");
      return;
    }

    setSending(true);
    onError?.(null);

    try {
      const attachments = await generateAttachments(selectedDocs);
      const res = await fetch(`/api/admin/paten/${encodeURIComponent(pateId)}/send-mail`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: to.trim(),
          subject: subject.trim(),
          text: body.trim(),
          attachments,
        }),
      });

      const json = (await res.json()) as { error?: string; sentTo?: string };
      if (!res.ok) {
        onError?.(json.error ?? "E-Mail konnte nicht gesendet werden.");
        return;
      }

      onSent?.(
        `E-Mail mit ${attachments.length} Anhang/Anhängen wurde an ${json.sentTo ?? to} gesendet.`
      );
    } catch {
      onError?.("E-Mail konnte nicht gesendet werden.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-background/90 p-5 sm:p-6 shadow-soft space-y-5">
      <div>
        <h2 className="font-medium text-forest">An Paten senden</h2>
        <p className="mt-1 text-sm text-muted">
          Dokumente als PDF-Anhang per E-Mail versenden – für{" "}
          <strong className="font-medium text-forest">{waschbaerName}</strong>
          {hasMultiplePatentiere
            ? " (ausgewähltes Patentier oben – bei mehreren Tieren je Patentier eigene Unterlagen senden)."
            : " – z. B. Urkunde vorab, bevor die gedruckte Version per Post rausgeht."}
        </p>
      </div>

      {!mailConfigured ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          E-Mail-Versand ist noch nicht aktiv. SMTP-Zugangsdaten in Vercel setzen – siehe{" "}
          <code className="text-xs">docs/email-setup.md</code>.
        </p>
      ) : null}

      <FormField label="Vorlage" name="vorlage">
        <select
          id="vorlage"
          value={vorlageId}
          onChange={(event) => setVorlageId(event.target.value as PatenEmailVorlageId)}
          className="w-full min-w-0 min-h-11 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
        >
          {patenEmailVorlagen.map((vorlage) => (
            <option key={vorlage.id} value={vorlage.id}>
              {vorlage.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Empfänger"
        name="to"
        required
        hint="E-Mail des Paten bzw. der bestellenden Person"
      >
        <input
          id="to"
          type="email"
          required
          value={to}
          onChange={(event) => setTo(event.target.value)}
          className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
        />
      </FormField>

      <FormField label="Betreff" name="subject" required>
        <input
          id="subject"
          type="text"
          required
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
        />
      </FormField>

      <FormField label="E-Mail-Text" name="body" required>
        <textarea
          id="body"
          required
          rows={12}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="w-full px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none resize-y font-mono text-sm"
        />
      </FormField>

      <div>
        <p className="text-sm font-medium text-forest mb-2">PDF-Anhänge</p>
        <ul className="space-y-2">
          {patenDokumente.map((doc) => (
            <li key={doc.id}>
              <label className="flex items-start gap-3 min-h-10 cursor-pointer rounded-lg border border-border px-3 py-2 hover:bg-muted-light/30">
                <input
                  type="checkbox"
                  checked={selectedDocs.includes(doc.id)}
                  onChange={() => toggleDocument(doc.id)}
                  className="mt-1 h-4 w-4 rounded border-border"
                />
                <span>
                  <span className="text-sm text-forest">{doc.title}</span>
                  <span className="block text-xs text-muted">{doc.description}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={handleSend}
        disabled={sending || !mailConfigured || selectedDocs.length === 0}
        className="min-h-11 w-full sm:w-auto px-5 py-3 text-sm font-medium rounded-xl bg-foreground text-background hover:bg-accent disabled:opacity-60"
      >
        {sending ? "PDFs werden erstellt und gesendet …" : "E-Mail mit PDFs senden"}
      </button>
    </section>
  );
}
