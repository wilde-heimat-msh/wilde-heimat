import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InfoBox } from "@/components/ui/InfoBox";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { formatAbsoluteDateDe } from "@/lib/relativeTime";
import { isPayPalConfigured, paypalDonation } from "@/data/paypal";
import { unterstuetzungHinweis } from "@/data/site";

const schritte = [
  {
    nr: "1",
    title: "PayPal öffnen",
    text: "Du wirst sicher zu PayPal weitergeleitet – keine Zahlungsdaten auf dieser Website.",
  },
  {
    nr: "2",
    title: "Betrag wählen",
    text: "Lege deinen Beitrag fest – als Gast oder mit PayPal-Konto.",
  },
  {
    nr: "3",
    title: "Spende abschließen",
    text: "Dein Beitrag landet im Spenden-Pool für unsere Waschbären – geschützt durch PayPal.",
  },
];

export function PayPalDonate() {
  const configured = isPayPalConfigured();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <FadeIn>
        <Card hover={false} className="bg-cream/90 border-sand/60">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="h-14 w-14 rounded-2xl bg-white border border-border flex items-center justify-center shrink-0 shadow-sm p-2.5">
              <Image
                src={paypalDonation.logo}
                alt="PayPal"
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-wider text-muted">PayPal-Pool</p>
              <h3 className="mt-1 text-2xl font-light">{paypalDonation.title}</h3>
              <p className="mt-3 text-muted leading-relaxed">{paypalDonation.purpose}</p>
              <p className="mt-2 text-sm text-muted">
                Organisiert von {paypalDonation.organizer} · Pool läuft bis{" "}
                {formatAbsoluteDateDe(paypalDonation.deadline)}
              </p>
              <p className="mt-3 text-muted leading-relaxed">
                Unterstütze Wilde Heimat direkt per PayPal-Pool – ideal für spontane
                Einmalspenden neben GoFundMe. Die Zahlung wird vollständig und
                verschlüsselt über PayPal abgewickelt.
              </p>

              {configured ? (
                <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3 [&_a]:w-full sm:[&_a]:w-auto [&_a]:justify-center">
                  <Button
                    href={paypalDonation.donateUrl}
                    variant="primary"
                    external
                    className="inline-flex items-center gap-2 bg-[#003087] border-[#003087] hover:bg-[#002570] hover:border-[#002570] text-white"
                  >
                    Zum PayPal-Pool
                    <span aria-hidden>↗</span>
                  </Button>
                  <Button href="/patenschaften" variant="outline">
                    Monatliche Patenschaft
                  </Button>
                </div>
              ) : (
                <InfoBox className="mt-6 text-sm text-muted">
                  <strong className="text-foreground">PayPal-Link wird eingerichtet.</strong>{" "}
                  Bis dahin kannst du über{" "}
                  <a href="#gofundme" className="underline hover:no-underline">
                    GoFundMe
                  </a>{" "}
                  spenden oder uns{" "}
                  <a href="/kontakt" className="underline hover:no-underline">
                    kontaktieren
                  </a>
                  .
                </InfoBox>
              )}
            </div>
          </div>
        </Card>
      </FadeIn>

      <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-4" stagger={0.08}>
        {schritte.map((schritt) => (
          <StaggerItem key={schritt.nr}>
            <div className="h-full p-5 rounded-2xl border border-border bg-background/80 text-center">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sand-light text-sm font-medium text-forest">
                {schritt.nr}
              </span>
              <h4 className="mt-3 font-medium">{schritt.title}</h4>
              <p className="mt-2 text-sm text-muted leading-relaxed">{schritt.text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <FadeIn>
        <p className="text-sm font-medium text-center mb-4">Typische Spendenbeträge</p>
        <div className="flex flex-wrap justify-center gap-2">
          {paypalDonation.suggestedAmounts.map((amount) => (
            <span
              key={amount}
              className="px-4 py-2 rounded-full border border-border bg-sand-light/40 text-sm text-muted"
            >
              {amount} €
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-center text-muted">
          Den genauen Betrag wählst du bei PayPal – jeder freiwillige Beitrag hilft.
        </p>
      </FadeIn>

      <FadeIn className="space-y-4">
        <InfoBox className="text-sm text-muted">
          <strong className="text-foreground">Sicherheit:</strong> Wir speichern keine
          Kreditkarten- oder PayPal-Zugangsdaten. Die Transaktion findet ausschließlich auf
          den Servern von PayPal statt (SSL/TLS, Käuferschutz).
        </InfoBox>
        <InfoBox className="text-sm text-muted">{paypalDonation.patenschaftNote}</InfoBox>
        <InfoBox className="text-sm text-muted">{unterstuetzungHinweis}</InfoBox>
      </FadeIn>
    </div>
  );
}
