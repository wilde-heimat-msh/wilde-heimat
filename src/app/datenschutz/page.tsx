import type { ReactNode } from "react";
import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { InfoBox } from "@/components/ui/InfoBox";
import { FadeIn } from "@/components/motion/FadeIn";
import { CONSENT_STORAGE_KEY } from "@/data/privacy";
import { siteConfig } from "@/data/site";
import { formatContactAddressLines } from "@/lib/contact";
import { PATEN_SESSION_COOKIE } from "@/lib/patenAuth";
import { pagePhotos } from "@/data/pagePhotos";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Datenschutz",
  description: "Datenschutzerklärung der privaten Initiative Wilde Heimat.",
  path: "/datenschutz",
});

function SectionBlock({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="text-xl font-medium text-foreground mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function DatenschutzPage() {
  const addressLines = formatContactAddressLines();

  return (
    <>
      <PhotoPageHero
        eyebrow="Rechtliches"
        title="Datenschutzerklärung"
        subtitle="Informationen zur Verarbeitung personenbezogener Daten bei Wilde Heimat."
        backgroundPhoto={pagePhotos.about}
      />

      <Section>
        <FadeIn>
          <Card hover={false} className="max-w-3xl mx-auto">
            <div className="space-y-10 text-muted leading-relaxed">
              <SectionBlock title="1. Verantwortlicher">
                <p>
                  Wilde Heimat – Private Initiative
                  <br />
                  {siteConfig.contact.name}
                  <br />
                  {addressLines.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                  E-Mail:{" "}
                  <a href={`mailto:${siteConfig.email}`} className="underline hover:no-underline">
                    {siteConfig.email}
                  </a>
                </p>
              </SectionBlock>

              <InfoBox className="text-muted">
                <strong className="text-foreground">Hinweis:</strong> Wilde Heimat ist eine
                private Initiative von Juja – kein eingetragener Verein und keine gemeinnützige
                Organisation.
              </InfoBox>

              <SectionBlock title="2. Allgemeines">
                <p>
                  Der Schutz deiner personenbezogenen Daten ist uns wichtig. Wir verarbeiten
                  Daten nur, soweit dies für den Betrieb dieser Website, die Bearbeitung deiner
                  Anfragen oder freiwillige Unterstützung (Patenschaften, Spenden) erforderlich
                  ist.
                </p>
              </SectionBlock>

              <SectionBlock title="3. Hosting und Server-Logfiles">
                <p>
                  Diese Website wird bei <strong className="text-foreground">Vercel Inc.</strong>{" "}
                  gehostet. Beim Aufruf werden durch den Hosting-Anbieter automatisch technische
                  Daten erfasst (Server-Logfiles), z. B. Browsertyp, Betriebssystem, Referrer-URL,
                  Hostname, Zeitpunkt der Anfrage und IP-Adresse. Diese Daten dienen der technischen
                  Bereitstellung, Stabilität und Sicherheit der Website.
                </p>
                <p className="mt-4">
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem
                  sicheren Betrieb).
                </p>
                <p className="mt-4">
                  Speicherdauer: Die Logdaten werden vom Hosting-Anbieter nur so lange gespeichert,
                  wie es für den Betrieb erforderlich ist (in der Regel wenige Tage bis Wochen).
                </p>
              </SectionBlock>

              <SectionBlock id="auftragsverarbeiter" title="4. Auftragsverarbeiter">
                <p>
                  Zur Bereitstellung dieser Website setzen wir folgende Dienstleister ein, die
                  personenbezogene Daten in unserem Auftrag verarbeiten (Art. 28 DSGVO):
                </p>
                <ul className="mt-4 space-y-3 list-disc list-inside">
                  <li>
                    <strong className="text-foreground">Vercel Inc.</strong> – Hosting der Website,
                    Auslieferung der Inhalte und technische Server-Logfiles
                  </li>
                  <li>
                    <strong className="text-foreground">Supabase Inc.</strong> – Speicherung von
                    Formular-Eingängen, Paten-Daten und hochgeladenen Dateien (Datenbank &
                    Dateispeicher, EU-Region sofern im Projekt gewählt)
                  </li>
                  <li>
                    <strong className="text-foreground">checkdomain GmbH</strong> – Versand von
                    E-Mail-Benachrichtigungen bei neuen Formular-Eingängen über unser Postfach
                  </li>
                </ul>
                <p className="mt-4">
                  Mit diesen Anbietern bestehen Verträge zur Auftragsverarbeitung bzw. entsprechende
                  Standardvertragsklauseln der Anbieter (z. B. Vercel DPA, Supabase DPA). Die
                  Verarbeitung erfolgt ausschließlich nach unseren Weisungen und nur soweit für den
                  Betrieb der Website erforderlich.
                </p>
                <p className="mt-4">
                  Soweit Dienstleister außerhalb der EU/des EWR eingesetzt werden, erfolgt die
                  Übermittlung auf Grundlage geeigneter Garantien (insbesondere EU-Standardvertragsklauseln
                  gemäß Art. 46 DSGVO), sofern kein Angemessenheitsbeschluss vorliegt.
                </p>
              </SectionBlock>

              <SectionBlock id="formulare" title="5. Kontakt- und Anfrageformulare">
                <p>
                  Wenn du uns über Formulare kontaktierst, verarbeiten wir die von dir eingegebenen
                  Daten ausschließlich zur Bearbeitung deiner Anfrage. Vor dem Absenden musst du
                  die Datenschutzerklärung aktiv bestätigen (Pflicht-Checkbox).
                </p>
                <p className="mt-4">Formulare auf dieser Website:</p>
                <ul className="mt-3 space-y-2 list-disc list-inside">
                  <li>Kontaktformular (Name, E-Mail, Betreff, Nachricht)</li>
                  <li>Patenschaftsanfrage (inkl. Anschrift, optional Telefon, Geschenk-Patenschaft)</li>
                  <li>Fundmeldung „Waschbär gefunden“ (inkl. optional Foto-Upload)</li>
                  <li>Anmeldung als Pflegestelle</li>
                  <li>Vermittlungs- und Hilfsanfragen</li>
                </ul>
                <p className="mt-4">
                  Bei Patenschaften benötigen wir deine Anschrift für die Zusendung der Urkunde
                  (DIN A4). Bei Geschenk-Patenschaften verarbeiten wir zusätzlich Name, Anschrift
                  und ggf. eine Grußbotschaft des Beschenkten – ausschließlich zur Urkunde und
                  Zusendung.
                </p>
                <p className="mt-4">
                  Bei Patenschaftsanfragen musst du zusätzlich die{" "}
                  <a href="/widerruf" className="underline hover:no-underline">
                    Widerrufsbelehrung
                  </a>{" "}
                  zur Kenntnis nehmen. Diese Bestätigung wird ebenfalls mit Zeitstempel gespeichert.
                </p>
                <p className="mt-4">
                  Bei Fundmeldungen kannst du optional ein Foto hochladen (max. 8 MB, JPG/PNG/WebP/GIF).
                  Fund-Fotos werden in einem geschützten Dateispeicher abgelegt und sind{" "}
                  <strong className="text-foreground">nicht öffentlich</strong> abrufbar – nur wir
                  können sie im Admin-Bereich einsehen (zeitlich begrenzte Zugriffs-Links). Das Foto
                  wird ausschließlich zur Bearbeitung der Meldung genutzt.
                </p>
                <p className="mt-4">
                  Die Übertragung erfolgt verschlüsselt (SSL/TLS). Eine Weitergabe an Dritte
                  erfolgt nicht, sofern keine gesetzliche Verpflichtung besteht.
                </p>
                <p className="mt-4">
                  Speicherort: Formularinhalte werden in einer Datenbank (Supabase) gespeichert und
                  sind nur für uns im geschützten Admin-Bereich einsehbar. Die Einwilligung in die
                  Datenschutzerklärung wird mit Zeitstempel im Formular-Datensatz dokumentiert.
                  Optional erhalten wir zusätzlich eine E-Mail-Benachrichtigung (Fund-Fotos als
                  E-Mail-Anhang, nicht als öffentlicher Link).
                </p>
                <p className="mt-4">
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch die
                  Pflicht-Checkbox vor dem Absenden). Für Anfragen, die auf einen späteren Vertrag
                  abzielen (z. B. Patenschaft), zusätzlich Art. 6 Abs. 1 lit. b DSGVO
                  (vorvertragliche Maßnahmen).
                </p>
                <p className="mt-4">
                  Speicherdauer: bis zur vollständigen Bearbeitung der Anfrage, längstens jedoch
                  24 Monate – sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
                  Danach werden die Daten gelöscht.
                </p>
              </SectionBlock>

              <SectionBlock id="paten-bereich" title="6. Paten-Bereich">
                <p>
                  Für aktive Paten stellen wir einen geschützten Bereich mit persönlichem
                  Zugangscode bereit. Dort werden der Patenname, die gewählte Patenschaftsstufe,
                  der zugeordnete Waschbär sowie veröffentlichte Updates (Texte und Fotos)
                  angezeigt.
                </p>
                <p className="mt-4">
                  Nach erfolgreicher Anmeldung setzen wir ein technisch notwendiges Session-Cookie{" "}
                  <code className="text-xs bg-muted-light px-1.5 py-0.5 rounded">
                    {PATEN_SESSION_COOKIE}
                  </code>{" "}
                  (httpOnly, max. 30 Tage). Es dient ausschließlich dazu, dich im Paten-Bereich
                  angemeldet zu halten. Es werden keine Tracking- oder Profiling-Daten erhoben.
                </p>
                <p className="mt-4">
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Durchführung der Patenschaft) bzw.
                  Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Kommunikation mit
                  Unterstützern).
                </p>
                <p className="mt-4">
                  Speicherdauer: für die Dauer der Patenschaft und anschließend bis zu 24 Monate,
                  sofern keine längere Aufbewahrung erforderlich ist.
                </p>
              </SectionBlock>

              <SectionBlock id="cookies" title="7. Cookies und lokale Speicherung">
                <p>
                  <strong className="text-foreground">
                    Es werden keine Tracking-, Analyse- oder Marketing-Cookies eingesetzt.
                  </strong>{" "}
                  Wir nutzen weder Google Analytics noch vergleichbare Statistik-Tools.
                </p>
                <p className="mt-4">
                  Beim ersten Besuch erscheint ein Datenschutz-Hinweis. Deine Auswahl
                  („Verstanden“ oder „Hinweis schließen“) speichern wir lokal im Browser unter
                  dem Schlüssel{" "}
                  <code className="text-xs bg-muted-light px-1.5 py-0.5 rounded">
                    {CONSENT_STORAGE_KEY}
                  </code>{" "}
                  (localStorage), damit der Hinweis nicht bei jedem Besuch erneut angezeigt wird.
                </p>
                <ul className="mt-4 space-y-2 list-disc list-inside">
                  <li>Zweck: Speicherung deiner Entscheidung zum Datenschutz-Hinweis</li>
                  <li>Speicherdauer: bis zur manuellen Löschung im Browser</li>
                  <li>Keine Weitergabe an Dritte</li>
                </ul>
                <p className="mt-4">
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer
                  nutzerfreundlichen Einwilligungsverwaltung) bzw. § 25 Abs. 2 Nr. 2 TDDDG
                  (technisch notwendige Speicherung).
                </p>
                <p className="mt-4">
                  Du kannst die Speicherung jederzeit in den Browser-Einstellungen löschen
                  (Website-Daten / localStorage).
                </p>
              </SectionBlock>

              <SectionBlock id="externe-dienste" title="8. Externe Dienste und Links">
                <p>
                  Auf dieser Website verlinken wir zu externen Angeboten. Beim Anklicken
                  verlässt du unsere Website; es gelten die Datenschutzbestimmungen des jeweiligen
                  Anbieters:
                </p>
                <ul className="mt-4 space-y-3 list-disc list-inside">
                  <li>
                    <strong className="text-foreground">PayPal</strong> – für Patenschaften und
                    Spenden (Zahlungsabwicklung durch PayPal)
                  </li>
                  <li>
                    <strong className="text-foreground">GoFundMe</strong> – für Spendenkampagnen
                    (Zahlungsabwicklung durch GoFundMe). Auf unserer Website zeigen wir ausgewählte
                    Spenden in gekürzter Form (Vorname und Anfangsbuchstabe des Nachnamens) sowie
                    Betrag und Datum – Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (transparente
                    Darstellung der Kampagne). Vollständige Namen sind nur auf GoFundMe einsehbar.
                  </li>
                  <li>
                    <strong className="text-foreground">Amazon</strong> – Wunschliste für
                    Sachspenden
                  </li>
                  <li>
                    <strong className="text-foreground">Instagram & TikTok</strong> – Social-Media-
                    Profile (externe Plattformen)
                  </li>
                </ul>
                <p className="mt-4">
                  Wir haben keinen Einfluss auf die Datenverarbeitung durch diese Dienste. Bitte
                  informiere dich dort über deren Datenschutzinformationen, bevor du
                  personenbezogene oder Zahlungsdaten eingibst.
                </p>
              </SectionBlock>

              <SectionBlock id="widerruf" title="9. Widerrufsrecht bei Patenschaften">
                <p>
                  Für entgeltliche Patenschaften und damit verbundene Leistungen (z. B. Urkunde,
                  Tasse) gelten die Regelungen zum Widerrufsrecht bei Fernabsatzverträgen. Die
                  vollständige Widerrufsbelehrung inkl. Muster-Widerrufsformular findest du unter{" "}
                  <a href="/widerruf" className="underline hover:no-underline">
                    Widerrufsbelehrung
                  </a>
                  .
                </p>
              </SectionBlock>

              <SectionBlock title="10. Bildnachweise">
                <p>
                  Auf einigen Seiten werden Stock-Fotos (z. B. Pexels) verwendet. Details findest
                  du im{" "}
                  <a href="/impressum#bildnachweise" className="underline hover:no-underline">
                    Impressum unter Bildnachweise
                  </a>
                  .
                </p>
              </SectionBlock>

              <SectionBlock title="11. Deine Rechte">
                <p>Du hast gegenüber uns folgende Rechte bezüglich deiner personenbezogenen Daten:</p>
                <ul className="mt-4 space-y-2 list-disc list-inside">
                  <li>Auskunft (Art. 15 DSGVO)</li>
                  <li>Berichtigung (Art. 16 DSGVO)</li>
                  <li>Löschung (Art. 17 DSGVO)</li>
                  <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                  <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                  <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                  <li>Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
                </ul>
                <p className="mt-4">
                  Wende dich hierzu an:{" "}
                  <a href={`mailto:${siteConfig.email}`} className="underline hover:no-underline">
                    {siteConfig.email}
                  </a>
                </p>
              </SectionBlock>

              <SectionBlock title="12. Beschwerderecht">
                <p>
                  Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
                  Zuständig in Sachsen-Anhalt ist der Landesbeauftragte für den Datenschutz
                  Sachsen-Anhalt, Leiterstraße 9, 39104 Magdeburg.
                </p>
              </SectionBlock>

              <p className="text-sm pt-8 border-t border-border">
                Stand: Juni 2026
              </p>
            </div>
          </Card>
        </FadeIn>
      </Section>
    </>
  );
}
