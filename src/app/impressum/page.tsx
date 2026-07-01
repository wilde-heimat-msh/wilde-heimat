import { PhotoCredit } from "@/components/PhotoCredit";
import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { BackLink } from "@/components/layout/BackLink";
import { PageCta } from "@/components/layout/PageCta";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { InfoBox } from "@/components/ui/InfoBox";
import { FadeIn } from "@/components/motion/FadeIn";
import { siteConfig } from "@/data/site";
import { vsbgHinweis } from "@/data/legal";
import { formatContactAddressLines } from "@/lib/contact";
import { pexelsLicense, stockPhotoCredits } from "@/data/photoCredits";
import { pagePhotos } from "@/data/pagePhotos";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Impressum",
  description: "Impressum der privaten Initiative Wilde Heimat.",
  path: "/impressum",
});

export default function ImpressumPage() {
  const addressLines = formatContactAddressLines();

  return (
    <>
      <PhotoPageHero
        eyebrow="Rechtliches"
        title="Impressum"
        subtitle="Angaben zur privaten Initiative Wilde Heimat gemäß § 5 TMG."
        backgroundPhoto={pagePhotos.about}
      />

      <Section>
        <FadeIn>
          <Card hover={false} className="max-w-3xl mx-auto">
            <div className="space-y-8 text-muted leading-relaxed">
              <div>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Angaben gemäß § 5 TMG
                </h2>
                <p>
                  <strong className="text-foreground">Wilde Heimat</strong>
                  <br />
                  Private Initiative für Waschbärhilfe und Aufklärung
                  <br />
                  <br />
                  {siteConfig.contact.name}
                  <br />
                  {addressLines.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                  {siteConfig.region}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-medium text-foreground mb-4">Kontakt</h2>
                <p>
                  E-Mail:{" "}
                  <a href={`mailto:${siteConfig.email}`} className="underline hover:no-underline">
                    {siteConfig.email}
                  </a>
                </p>
              </div>

              <div>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
                </h2>
                <p>
                  {siteConfig.contact.name}
                  <br />
                  {addressLines.join(", ")}
                </p>
              </div>

              <InfoBox className="text-muted">
                <strong className="text-foreground">Hinweis:</strong> Wilde Heimat ist
                aktuell eine private Initiative und kein eingetragener Verein. Es handelt
                sich nicht um eine gemeinnützige Organisation. Freiwillige Unterstützungen
                können derzeit keine steuerlich absetzbaren Bescheinigungen erhalten.
              </InfoBox>

              <div>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Verbraucherstreitbeilegung
                </h2>
                <p className="text-sm">
                  {vsbgHinweis} Informationen zur{" "}
                  <a href="/widerruf" className="underline hover:no-underline">
                    Widerrufsbelehrung
                  </a>{" "}
                  bei Patenschaften.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Haftungsausschluss
                </h2>
                <h3 className="text-lg font-medium mt-4 mb-2 text-foreground">
                  Haftung für Inhalte
                </h3>
                <p className="text-sm">
                  Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die
                  Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine
                  Gewähr übernommen werden. Die Ratgeber-Artikel dienen der Aufklärung und
                  ersetzen keine tierärztliche oder rechtliche Beratung.
                </p>
                <h3 className="text-lg font-medium mt-4 mb-2 text-foreground">
                  Haftung für Links
                </h3>
                <p className="text-sm">
                  Dieses Angebot enthält Links zu externen Webseiten Dritter, auf deren
                  Inhalte kein Einfluss besteht. Für die Inhalte der verlinkten Seiten ist
                  stets der jeweilige Anbieter verantwortlich.
                </p>
              </div>

              <div id="bildnachweise">
                <h2 className="text-xl font-medium text-foreground mb-4">
                  Bildnachweise & Lizenzen
                </h2>
                <p className="text-sm mb-6">
                  Stock-Fotos auf dieser Website stammen von Drittanbietern und sind
                  gemäß der jeweiligen Lizenzbedingungen eingebunden. Eigene Waschbär-
                  Aufnahmen und Tassen-Fotos werden separat gekennzeichnet, sobald die
                  finale Zuordnung erfolgt.
                </p>

                <div className="space-y-6">
                  {stockPhotoCredits.map((credit) => (
                    <div
                      key={credit.id}
                      className="p-4 rounded-xl border border-border bg-muted-light/20"
                    >
                      <PhotoCredit credit={credit} />
                    </div>
                  ))}
                </div>

                <InfoBox className="mt-6 text-sm">
                  <strong className="text-foreground">
                    {pexelsLicense.name}
                  </strong>
                  <p className="mt-2">{pexelsLicense.summary}</p>
                  <p className="mt-3">
                    Vollständige Lizenz:{" "}
                    <a
                      href={pexelsLicense.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:no-underline"
                    >
                      {pexelsLicense.url}
                    </a>
                  </p>
                  <ul className="mt-3 space-y-1 list-disc list-inside">
                    {pexelsLicense.allowed.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-3 font-medium text-foreground">Nicht erlaubt:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    {pexelsLicense.notAllowed.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </InfoBox>
              </div>
            </div>
          </Card>
        </FadeIn>
      </Section>
    </>
  );
}
