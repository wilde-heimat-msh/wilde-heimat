import type { ReactNode } from "react";
import { PhotoPageHero } from "@/components/layout/PhotoPageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { InfoBox } from "@/components/ui/InfoBox";
import { FadeIn } from "@/components/motion/FadeIn";
import { getWiderrufContactBlock, widerrufMetadata } from "@/data/legal";
import { patenschaftBank } from "@/data/patenschaftBank";
import { siteConfig } from "@/data/site";
import { pagePhotos } from "@/data/pagePhotos";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: widerrufMetadata.title,
  description: widerrufMetadata.description,
  path: widerrufMetadata.path,
});

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="scroll-mt-24">
      <h2 className="text-xl font-medium text-foreground mb-4">{title}</h2>
      <div className="space-y-4 text-muted leading-relaxed">{children}</div>
    </div>
  );
}

export default function WiderrufPage() {
  const contactBlock = getWiderrufContactBlock();

  return (
    <>
      <PhotoPageHero
        eyebrow="Rechtliches"
        title="Widerrufsbelehrung"
        subtitle="Informationen zum Widerrufsrecht bei Patenschaften und entgeltlichen Leistungen von Wilde Heimat."
        backgroundPhoto={pagePhotos.about}
      />

      <Section>
        <FadeIn>
          <Card hover={false} className="max-w-3xl mx-auto">
            <div className="space-y-10 text-muted leading-relaxed">
              <InfoBox className="text-muted">
                <strong className="text-foreground">Gilt für:</strong> Patenschaften und damit
                verbundene Leistungen (z. B. personalisierte Urkunde, Tasse), die du über diese
                Website anfragst oder abschließt. Eine Patenschaft ist persönlich, aber nicht
                exklusiv – mehrere Personen können denselben Waschbären parallel unterstützen.
                Freiwillige Spenden ohne Gegenleistung (z. B. über GoFundMe) sind davon nicht
                betroffen.
              </InfoBox>

              <Block title="Widerrufsrecht">
                <p>
                  Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag
                  zu widerrufen.
                </p>
                <p>
                  Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
                  Maßgeblich ist der Zeitpunkt, zu dem wir deine Patenschaft bestätigen bzw. die
                  monatliche Unterstützung vereinbaren – in der Regel nach deiner Anfrage über das
                  Formular und unserer schriftlichen Bestätigung per E-Mail.
                </p>
                <p>
                  Um dein Widerrufsrecht auszuüben, musst du uns (
                  <strong className="text-foreground">{siteConfig.contact.name}</strong>,{" "}
                  {siteConfig.region}) mittels einer eindeutigen Erklärung (z. B. per E-Mail an{" "}
                  <a href={`mailto:${siteConfig.email}`} className="underline hover:no-underline">
                    {siteConfig.email}
                  </a>
                  ) über deinen Entschluss, diesen Vertrag zu widerrufen, informieren. Du kannst
                  dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht
                  vorgeschrieben ist.
                </p>
                <p>
                  Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die
                  Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.
                </p>
              </Block>

              <Block title="Folgen des Widerrufs">
                <p>
                  Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir
                  erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen
                  Kosten, die sich daraus ergeben, dass du eine andere Art der Lieferung als die von
                  uns angebotene, günstigste Standardlieferung gewählt hast), unverzüglich und
                  spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung
                  über deinen Widerruf bei uns eingegangen ist.
                </p>
                <p>
                  Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du bei der
                  ursprünglichen Transaktion eingesetzt hast – bei Patenschaften in der Regel eine{" "}
                  <strong className="text-foreground">Banküberweisung</strong> auf unser Konto (
                  {patenschaftBank.accountHolder}). Erstattungen erfolgen auf das Bankkonto, von dem
                  die Zahlung ursprünglich eingegangen ist, sofern uns keine abweichende
                  Vereinbarung vorliegt. Dir entstehen durch die Rückzahlung keine Entgelte.
                </p>
                <p>
                  Hast du verlangt, dass die Leistungen während der Widerrufsfrist beginnen sollen,
                  hast du uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem
                  Zeitpunkt, zu dem du uns von der Ausübung des Widerrufsrechts unterrichtest,
                  bereits erbrachten Leistungen im Vergleich zum Gesamtumfang der im Vertrag
                  vorgesehenen Leistungen entspricht.
                </p>
              </Block>

              <Block title="Besondere Hinweise zur Patenschaft">
                <p>
                  Die Patenschaft umfasst eine monatliche freiwillige Unterstützung per
                  Banküberweisung sowie ggf. physische Leistungen (z. B. personalisierte Urkunde,
                  Tasse). Nach Beginn der Ausführung des Vertrags kann das Widerrufsrecht gemäß §
                  356 Abs. 5 BGB erlöschen, wenn du ausdrücklich zugestimmt hast, dass wir vor Ende
                  der Widerrufsfrist mit der Ausführung beginnen und du deine Kenntnis davon
                  bestätigt hast, dass du durch deine Zustimmung mit Beginn der Ausführung dein
                  Widerrufsrecht verlierst.
                </p>
                <p>
                  <strong className="text-foreground">Personalisierte Urkunden:</strong> Bei
                  individuell angefertigten oder eindeutig auf dich zugeschnittenen Waren (z. B.
                  Urkunde mit deinem Namen oder einer persönlichen Grußbotschaft) kann das
                  Widerrufsrecht gemäß § 312g Abs. 2 Nr. 1 BGB ausgeschlossen sein, sobald die
                  Personalisierung begonnen hat.
                </p>
                <p>
                  <strong className="text-foreground">Laufende Zahlungen:</strong> Nach Kündigung
                  der Patenschaft entfällt die Verpflichtung zu weiteren monatlichen Beiträgen ab
                  dem Folgemonat. Es sind keine Daueraufträge oder Lastschriften eingerichtet – du
                  überweist den Beitrag monatlich selbstständig. Bereits geleistete Beiträge sind
                  freiwillige Unterstützungen.
                </p>
              </Block>

              <Block title="Muster-Widerrufsformular">
                <p>
                  Wenn du den Vertrag widerrufen willst, fülle dieses Formular aus und sende es
                  zurück an:
                </p>
                <pre className="whitespace-pre-wrap rounded-xl border border-border bg-muted-light/30 p-4 text-sm text-foreground">
                  {contactBlock}
                </pre>
                <pre className="whitespace-pre-wrap rounded-xl border border-border bg-muted-light/20 p-4 text-sm">
                  {`Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Leistung (*)/den Kauf der folgenden Waren (*)

– Patenschaft / folgende Leistung: _________________________________

– Bestellt am (*) / erhalten am (*): _________________________________

– Name des/der Verbraucher(s): _________________________________

– Anschrift des/der Verbraucher(s): _________________________________

– Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): _________________________________

– Datum: _________________________________

(*) Unzutreffendes streichen.`}
                </pre>
              </Block>

              <p className="text-sm pt-8 border-t border-border">
                Stand: Juni 2026 · Verantwortlich: {siteConfig.contact.name}
              </p>
            </div>
          </Card>
        </FadeIn>
      </Section>
    </>
  );
}
