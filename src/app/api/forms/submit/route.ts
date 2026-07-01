import { NextResponse } from "next/server";
import { getWaschbaerBySlug } from "@/data/waschbaeren";
import { FORM_WIDERRUF_CONSENT_FIELD } from "@/data/legal";
import { FORM_PRIVACY_CONSENT_FIELD } from "@/data/privacy";
import { patenschaftsStufen } from "@/data/site";
import { formatFormFields, isFormMailConfigured, sendFormNotification } from "@/lib/formMail";
import { isFormType, type FormType } from "@/lib/forms/types";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { isSupabaseStorageEnabled, saveFormSubmission, uploadImage } from "@/lib/supabase/storage";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function required(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) return null;
  return value.trim();
}

function optional(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) return undefined;
  return value.trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function buildMailPayload(
  type: FormType,
  formData: FormData
): Promise<
  | {
      subject: string;
      text: string;
      replyTo?: string;
      fields: Record<string, string | undefined>;
      attachment?: { filename: string; content: Buffer; contentType: string };
      attachmentFile?: File;
    }
  | { error: string; status: number }
> {
  switch (type) {
    case "kontakt": {
      const name = required(formData, "name");
      const email = required(formData, "email");
      const nachricht = required(formData, "nachricht");
      if (!name || !email || !nachricht) {
        return { error: "Bitte alle Pflichtfelder ausfüllen.", status: 400 };
      }
      if (!isValidEmail(email)) {
        return { error: "Bitte eine gültige E-Mail-Adresse angeben.", status: 400 };
      }
      return {
        subject: `[Kontakt] ${optional(formData, "betreff") || "Neue Nachricht"} – ${name}`,
        replyTo: email,
        fields: {
          Formular: "Kontakt",
          Name: name,
          "E-Mail": email,
          Betreff: optional(formData, "betreff"),
          Nachricht: nachricht,
        },
        text: formatFormFields({
          Formular: "Kontakt",
          Name: name,
          "E-Mail": email,
          Betreff: optional(formData, "betreff"),
          Nachricht: nachricht,
        }),
      };
    }

    case "patenschaft": {
      const name = required(formData, "name");
      const email = required(formData, "email");
      const anschrift = required(formData, "anschrift");
      const waschbaerSlug = required(formData, "waschbaer");
      const stufeId = required(formData, "stufe");
      if (!name || !email || !anschrift || !waschbaerSlug || !stufeId) {
        return { error: "Bitte alle Pflichtfelder ausfüllen.", status: 400 };
      }
      if (!isValidEmail(email)) {
        return { error: "Bitte eine gültige E-Mail-Adresse angeben.", status: 400 };
      }
      const waschbaer = getWaschbaerBySlug(waschbaerSlug);
      const stufe = patenschaftsStufen.find((s) => s.id === stufeId);
      const isGift = formData.get("geschenk") === "ja";

      const fields = {
        Formular: "Patenschaft",
        Name: name,
        "E-Mail": email,
        Anschrift: anschrift,
        Telefon: optional(formData, "telefon"),
        Waschbär: waschbaer?.name ?? waschbaerSlug,
        Stufe: stufe ? `${stufe.name} (${stufe.preis} €/Monat)` : stufeId,
        Geschenk: isGift ? "Ja" : "Nein",
        "Name Beschenkter": optional(formData, "beschenkter_name"),
        "Anschrift Beschenkter": optional(formData, "beschenkter_anschrift"),
        Grußbotschaft: optional(formData, "grussbotschaft"),
      };

      return {
        subject: `[Patenschaft] ${isGift ? "Geschenk" : "Anfrage"} – ${name}`,
        replyTo: email,
        fields,
        text: formatFormFields(fields),
      };
    }

    case "fund": {
      const fundort = required(formData, "fundort");
      const datum = required(formData, "datum");
      const beschreibung = required(formData, "beschreibung");
      const name = required(formData, "name");
      const telefon = required(formData, "telefon");
      const email = required(formData, "email");
      if (!fundort || !datum || !beschreibung || !name || !telefon || !email) {
        return { error: "Bitte alle Pflichtfelder ausfüllen.", status: 400 };
      }
      if (!isValidEmail(email)) {
        return { error: "Bitte eine gültige E-Mail-Adresse angeben.", status: 400 };
      }

      const file = formData.get("foto");
      let attachment: { filename: string; content: Buffer; contentType: string } | undefined;
      let attachmentFile: File | undefined;

      if (file instanceof File && file.size > 0) {
        if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
          return { error: "Nur JPG, PNG, WebP oder GIF erlaubt.", status: 400 };
        }
        if (file.size > MAX_FILE_BYTES) {
          return { error: "Foto ist zu groß (max. 8 MB).", status: 400 };
        }
        attachmentFile = file;
        const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
        attachment = {
          filename: `fund-${datum}.${ext}`,
          content: Buffer.from(await file.arrayBuffer()),
          contentType: file.type,
        };
      }

      const fields = {
        Formular: "Waschbär gefunden",
        Fundort: fundort,
        Datum: datum,
        Beschreibung: beschreibung,
        Name: name,
        Telefon: telefon,
        "E-Mail": email,
        Foto: attachment ? "Hochgeladen" : "Kein Foto",
      };

      return {
        subject: `[Fundmeldung] ${fundort} – ${name}`,
        replyTo: email,
        fields,
        text: formatFormFields(fields),
        attachment,
        attachmentFile,
      };
    }

    case "pflegestelle": {
      const name = required(formData, "name");
      const anschrift = required(formData, "anschrift");
      const email = required(formData, "email");
      const telefon = required(formData, "telefon");
      const erfahrung = required(formData, "erfahrung");
      const platzangebot = required(formData, "platzangebot");
      if (!name || !anschrift || !email || !telefon || !erfahrung || !platzangebot) {
        return { error: "Bitte alle Pflichtfelder ausfüllen.", status: 400 };
      }
      if (!isValidEmail(email)) {
        return { error: "Bitte eine gültige E-Mail-Adresse angeben.", status: 400 };
      }
      const fields = {
        Formular: "Pflegestelle werden",
        Name: name,
        Anschrift: anschrift,
        "E-Mail": email,
        Telefon: telefon,
        Erfahrung: erfahrung,
        Platzangebot: platzangebot,
      };

      return {
        subject: `[Pflegestelle] Anmeldung – ${name}`,
        replyTo: email,
        fields,
        text: formatFormFields(fields),
      };
    }

    case "vermittlung": {
      const anliegen = required(formData, "anliegen");
      const name = required(formData, "name");
      const email = required(formData, "email");
      const beschreibung = required(formData, "beschreibung");
      if (!anliegen || !name || !email || !beschreibung) {
        return { error: "Bitte alle Pflichtfelder ausfüllen.", status: 400 };
      }
      if (!isValidEmail(email)) {
        return { error: "Bitte eine gültige E-Mail-Adresse angeben.", status: 400 };
      }
      const fields = {
        Formular: "Vermittlungsanfrage",
        Anliegen: anliegen,
        Name: name,
        "E-Mail": email,
        Telefon: optional(formData, "telefon"),
        Beschreibung: beschreibung,
      };

      return {
        subject: `[Vermittlung] ${anliegen} – ${name}`,
        replyTo: email,
        fields,
        text: formatFormFields(fields),
      };
    }

    default:
      return { error: "Unbekannter Formulartyp.", status: 400 };
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    if (optional(formData, "website")) {
      return NextResponse.json({ ok: true });
    }

    if (formData.get(FORM_PRIVACY_CONSENT_FIELD) !== "ja") {
      return NextResponse.json(
        { error: "Bitte bestätige die Datenschutzerklärung." },
        { status: 400 }
      );
    }

    const typeRaw = formData.get("type");
    if (typeof typeRaw !== "string" || !isFormType(typeRaw)) {
      return NextResponse.json({ error: "Ungültiger Formulartyp." }, { status: 400 });
    }

    if (typeRaw === "patenschaft" && formData.get(FORM_WIDERRUF_CONSENT_FIELD) !== "ja") {
      return NextResponse.json(
        { error: "Bitte bestätige die Kenntnisnahme der Widerrufsbelehrung." },
        { status: 400 }
      );
    }

    const consentAt = new Date().toISOString();

    const payload = await buildMailPayload(typeRaw, formData);
    if ("error" in payload) {
      return NextResponse.json({ error: payload.error }, { status: payload.status });
    }

    if (!isSupabaseConfigured() && !isFormMailConfigured()) {
      return NextResponse.json(
        {
          error:
            "Formular-Versand ist noch nicht eingerichtet (Supabase oder E-Mail-Versand fehlt auf dem Server).",
        },
        { status: 503 }
      );
    }

    let attachmentRef: string | undefined;

    if (payload.attachmentFile && isSupabaseStorageEnabled()) {
      const uploaded = await uploadImage("form-uploads", payload.attachmentFile);
      if ("error" in uploaded) {
        return NextResponse.json({ error: uploaded.error }, { status: 400 });
      }
      if ("storagePath" in uploaded) {
        attachmentRef = uploaded.storagePath;
        payload.fields.Foto = "Im Admin-Bereich einsehbar";
      }
    }

    const storedPayload: Record<string, string | undefined> = {
      ...payload.fields,
      [FORM_PRIVACY_CONSENT_FIELD]: "ja",
      datenschutz_einwilligung_zeitpunkt: consentAt,
    };

    if (typeRaw === "patenschaft") {
      storedPayload[FORM_WIDERRUF_CONSENT_FIELD] = "ja";
      storedPayload.widerrufsbelehrung_zeitpunkt = consentAt;
    }

    if (isSupabaseConfigured()) {
      const saved = await saveFormSubmission({
        type: typeRaw,
        payload: storedPayload,
        replyTo: payload.replyTo,
        attachmentUrl: attachmentRef,
      });
      if (!saved.ok) {
        return NextResponse.json({ error: saved.error }, { status: 503 });
      }
    }

    if (isFormMailConfigured()) {
      const result = await sendFormNotification({
        subject: payload.subject,
        text: payload.text,
        fields: storedPayload,
        replyTo: payload.replyTo,
        attachments: payload.attachment ? [payload.attachment] : [],
      });

      if (!result.ok && !isSupabaseConfigured()) {
        return NextResponse.json({ error: result.error }, { status: 503 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Die Anfrage konnte nicht verarbeitet werden." },
      { status: 500 }
    );
  }
}
