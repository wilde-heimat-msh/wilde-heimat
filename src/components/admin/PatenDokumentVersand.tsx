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
import {
  uploadPatenMailPdfs,
  type PatenMailPdfBlob,
} from "@/lib/uploadPatenMailPdf";
import { useEffect, useMemo, useRef, useState } from "react";

export type PatenMailAttachment = PatenMailPdfBlob;

/** Entspricht dem Server-Limit für E-Mail-Anhänge gesamt. */
const MAX_MAIL_ATTACHMENTS_BYTES = 60 * 1024 * 1024;

type SendFeedback = {
  type: "success" | "error" | "info";
  message: string;
};

type PatenDokumentVersandProps = {
  pateId: string;
  pate: PatenschaftPate;
  waschbaerName: string;
  recipientEmail?: string;
  mailConfigured: boolean;
  hasMultiplePatentiere?: boolean;
  zahlungszielTag?: number;
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
  zahlungszielTag = 5,
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
  const [feedback, setFeedback] = useState<SendFeedback | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  function showFeedback(next: SendFeedback | null) {
    setFeedback(next);
    if (next) {
      requestAnimationFrame(() => {
        feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }

  function attachmentBytes(attachments: PatenMailPdfBlob[]): number {
    return attachments.reduce((sum, file) => sum + file.blob.size, 0);
  }

  async function parseSendMailResponse(res: Response): Promise<{ error?: string; sentTo?: string }> {
    const raw = await res.text();
    if (!raw.trim()) {
      if (res.status === 413) {
        return {
          error:
            "Die PDF-Anhänge sind zu groß für den direkten Versand. Bitte Seite neu laden und erneut versuchen.",
        };
      }
      return { error: `Serverfehler (${res.status}). Bitte erneut versuchen.` };
    }
    try {
      return JSON.parse(raw) as { error?: string; sentTo?: string };
    } catch {
      return {
        error:
          res.status === 413
            ? "Die PDF-Anhänge sind zu groß für den direkten Versand. Bitte Seite neu laden und erneut versuchen."
            : `Unerwartete Server-Antwort (${res.status}). Bitte erneut versuchen.`,
      };
    }
  }

  const platzhalter = useMemo(() => {
    return buildPatenEmailPlatzhalter({
      pateName: pate.name,
      waschbaerName,
      stufeName: stufe?.name ?? pate.stufeId,
      stufePreis: stufe?.preis ?? 0,
      accessCode: pate.accessCode,
      urkundenNr: pate.urkundenNr,
      siteOrigin: typeof window !== "undefined" ? window.location.origin : "",
      zahlungszielTag,
    });
  }, [pate, stufe, waschbaerName, zahlungszielTag]);

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
      const message = "E-Mail-Versand ist noch nicht eingerichtet (SMTP in Vercel fehlt).";
      showFeedback({ type: "error", message });
      onError?.(message);
      return;
    }

    if (!to.trim()) {
      const message = "Bitte eine E-Mail-Adresse des Paten angeben.";
      showFeedback({ type: "error", message });
      onError?.(message);
      return;
    }

    if (selectedDocs.length === 0 && getPatenEmailVorlage(vorlageId).dokumente.length > 0) {
      const message = "Bitte mindestens ein Dokument als Anhang auswählen.";
      showFeedback({ type: "error", message });
      onError?.(message);
      return;
    }

    setSending(true);
    onError?.(null);
    showFeedback(
      selectedDocs.length > 0
        ? { type: "info", message: "PDFs werden erstellt … Das kann einige Sekunden dauern." }
        : { type: "info", message: "E-Mail wird gesendet …" }
    );

    try {
      const attachments =
        selectedDocs.length > 0 ? await generateAttachments(selectedDocs) : [];

      const totalBytes = attachmentBytes(attachments);
      if (totalBytes > MAX_MAIL_ATTACHMENTS_BYTES) {
        const message = `Die PDF-Anhänge sind zusammen zu groß (${Math.round(totalBytes / 1024 / 1024)} MB). Bitte weniger Dokumente auswählen oder einzeln senden.`;
        showFeedback({ type: "error", message });
        onError?.(message);
        return;
      }

      showFeedback({ type: "info", message: "PDFs werden hochgeladen …" });

      const attachmentStoragePaths =
        attachments.length > 0 ? await uploadPatenMailPdfs(pateId, attachments) : [];

      showFeedback({ type: "info", message: "E-Mail wird versendet …" });

      const mailPayload: {
        to: string;
        subject: string;
        text: string;
        attachments?: { filename: string; contentBase64: string }[];
        attachmentStoragePaths?: { storagePath: string; filename: string }[];
      } = {
        to: to.trim(),
        subject: subject.trim(),
        text: body.trim(),
      };

      if (attachmentStoragePaths.length > 0) {
        mailPayload.attachmentStoragePaths = attachmentStoragePaths;
      }

      const res = await fetch(`/api/admin/paten/${encodeURIComponent(pateId)}/send-mail`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mailPayload),
      });

      const json = await parseSendMailResponse(res);
      if (!res.ok) {
        const message = json.error ?? "E-Mail konnte nicht gesendet werden.";
        showFeedback({ type: "error", message });
        onError?.(message);
        return;
      }

      const successMessage =
        attachments.length > 0
          ? `E-Mail mit ${attachments.length} Anhang/Anhängen wurde erfolgreich an ${json.sentTo ?? to} gesendet.`
          : `E-Mail wurde erfolgreich an ${json.sentTo ?? to} gesendet.`;
      showFeedback({ type: "success", message: successMessage });
      onSent?.(successMessage);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "E-Mail konnte nicht gesendet werden.";
      showFeedback({ type: "error", message });
      onError?.(message);
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
        disabled={
          sending ||
          !mailConfigured ||
          (selectedDocs.length === 0 &&
            getPatenEmailVorlage(vorlageId).dokumente.length > 0)
        }
        className="min-h-11 w-full sm:w-auto px-5 py-3 text-sm font-medium rounded-xl bg-foreground text-background hover:bg-accent disabled:opacity-60"
      >
        {sending
          ? selectedDocs.length > 0
            ? "PDFs werden erstellt und gesendet …"
            : "E-Mail wird gesendet …"
          : selectedDocs.length > 0
            ? "E-Mail mit PDFs senden"
            : "E-Mail senden"}
      </button>

      {feedback ? (
        <div
          ref={feedbackRef}
          role="status"
          aria-live="polite"
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-900"
              : feedback.type === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}
    </section>
  );
}
