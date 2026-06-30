import type { ReactNode } from "react";
import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { InfoBox } from "@/components/ui/InfoBox";
import { FadeIn } from "@/components/motion/FadeIn";
import { CONSENT_STORAGE_KEY } from "@/data/privacy";
import { siteConfig } from "@/data/site";
import { formatContactAddressLines } from "@/lib/contact";
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

              <SectionBlock title="3. Server-Logfiles und Hosting">
                <p>
                  Beim Aufruf dieser Website werden durch den Hosting-Anbieter automatisch
                  technische Daten erfasst (Server-Logfiles), z. B. Browsertyp, Betriebssystem,
                  Referrer-URL, Hostname, Zeitpunkt der Anfrage und IP-Adresse. Diese Daten
                  dienen der technischen Bereitstellung und Sicherheit der Website.
                </p>
                <p className="mt-4">
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem
                  sicheren Betrieb).
                </p>
              </SectionBlock>

              <SectionBlock id="formulare" title="4. Kontakt- und Anfrageformulare">
                <p>
                  Wenn du uns über Formulare kontaktierst, verarbeiten wir die von dir eingegebenen
                  Daten (z. B. Name, E-Mail, Anschrift, Telefon, Nachricht) ausschließlich zur
                  Bearbeitung deiner Anfrage.
                </p>
                <p className="mt-4">Formulare auf dieser Website:</p>
                <ul className="mt-3 space-y-2 list-disc list-inside">
                  <li>Kontaktformular</li>
                  <li>Patenschaftsanfrage (inkl. optionaler Geschenk-Patenschaft)</li>
                  <li>Vermittlungs- und Hilfsanfragen</li>
                </ul>
                <p className="mt-4">
                  Bei Patenschaften benötigen wir deine Anschrift für die Zusendung der Urkunde
                  (DIN A4). Bei Geschenk-Patenschaften zusätzlich Name und Anschrift des
                  Beschenkten sowie optional eine Grußbotschaft.
                </p>
                <p className="mt-4">
                  Die Übertragung erfolgt verschlüsselt (SSL/TLS). Eine Weitergabe an Dritte
                  erfolgt nicht, sofern keine gesetzliche Verpflichtung besteht.
                </p>
                <p className="mt-4">
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen /
                  Vertragsanbahnung) bzw. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung über
                  Formularhinweis).
                </p>
                <p className="mt-4">
                  Speicherdauer: bis zur vollständigen Bearbeitung der Anfrage, längstens jedoch
                  24 Monate – sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
                </p>
              </SectionBlock>

              <SectionBlock id="cookies" title="5. Cookies und lokale Speicherung">
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

              <SectionBlock id="externe-dienste" title="6. Externe Dienste und Links">
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

              <SectionBlock title="7. Bildnachweise">
                <p>
                  Auf einigen Seiten werden Stock-Fotos (z. B. Pexels) verwendet. Details findest
                  du im{" "}
                  <a href="/impressum#bildnachweise" className="underline hover:no-underline">
                    Impressum unter Bildnachweise
                  </a>
                  .
                </p>
              </SectionBlock>

              <SectionBlock title="8. Deine Rechte">
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

              <SectionBlock title="9. Beschwerderecht">
                <p>
                  Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
                  Zuständig in Sachsen-Anhalt ist u. a. der Landesbeauftragte für den
                  Datenschutz Sachsen-Anhalt.
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
