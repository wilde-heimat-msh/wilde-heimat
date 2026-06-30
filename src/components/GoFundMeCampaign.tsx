import { Button } from "@/components/ui/Button";
import { InfoBox } from "@/components/ui/InfoBox";
import { RelativeTime } from "@/components/RelativeTime";
import { GoFundMeStatsCard } from "@/components/GoFundMeStatsCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { formatAbsoluteDateDe } from "@/lib/relativeTime";
import {
  formatEuro,
  gofundmeCampaign,
  gofundmeTopDonors,
  gofundmeUpdates,
} from "@/data/gofundme";

function DonorAvatar({ name, anonym }: { name: string; anonym?: boolean }) {
  const initial = anonym ? "♥" : name.charAt(0).toUpperCase();
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sand-light text-sm font-medium text-forest shrink-0">
      {initial}
    </span>
  );
}

export function GoFundMeCampaign() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <FadeIn>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <GoFundMeStatsCard
            raised={gofundmeCampaign.raised}
            goal={gofundmeCampaign.goal}
            donorCount={gofundmeCampaign.donorCount}
            url={gofundmeCampaign.url}
          />

          <div className="lg:col-span-3 flex flex-col justify-center">
            <p className="text-sm uppercase tracking-wider text-muted">GoFundMe</p>
            <h3 className="mt-1 text-2xl md:text-3xl font-light">{gofundmeCampaign.title}</h3>
            <p className="mt-4 text-muted leading-relaxed">{gofundmeCampaign.intro}</p>
            <p className="mt-3 text-sm text-muted">
              Organisiert von {gofundmeCampaign.organizer} · Datenstand:{" "}
              <RelativeTime date={gofundmeCampaign.lastSynced} className="text-muted" />
            </p>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <FadeIn>
          <h4 className="text-lg font-medium mb-4">Aktuelle Updates</h4>
          <div className="space-y-4">
            {gofundmeUpdates.map((update) => (
              <article
                key={update.id}
                className="p-5 rounded-2xl border border-border bg-background/80"
              >
                <time className="text-xs uppercase tracking-wider text-muted flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-0.5 sm:gap-0">
                  <RelativeTime
                    date={update.date}
                    precision={update.precision ?? "day"}
                    className="uppercase"
                  />
                  <span className="normal-case tracking-normal text-muted/80">
                    <span className="hidden sm:inline">{" · "}</span>
                    {formatAbsoluteDateDe(update.date, update.precision ?? "day")}
                  </span>
                </time>
                {update.titel && (
                  <h5 className="mt-1 font-medium">{update.titel}</h5>
                )}
                <p className="mt-2 text-sm text-muted leading-relaxed whitespace-pre-line">
                  {update.text}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-4">
            <Button href={gofundmeCampaign.url} variant="outline" external className="text-sm">
              Alle Updates auf GoFundMe
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h4 className="text-lg font-medium mb-4">
            Spenden · {gofundmeCampaign.donorCount}
          </h4>
          <ul className="space-y-3">
            {gofundmeTopDonors.map((donor, i) => (
              <li
                key={`${donor.name}-${i}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-sand-light/30"
              >
                <DonorAvatar name={donor.name} anonym={donor.anonym} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {donor.anonym ? "Anonym" : donor.name}
                  </p>
                  <RelativeTime date={donor.date} className="text-xs text-muted" />
                </div>
                <span className="text-sm font-medium shrink-0">
                  {formatEuro(donor.amount)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button href={gofundmeCampaign.url} variant="outline" external className="text-sm">
              Alle Spenden anzeigen
            </Button>
          </div>
        </FadeIn>
      </div>

      <FadeIn>
        <InfoBox className="text-sm text-muted">
          Spenden laufen über GoFundMe und sind freiwillig. Aktuell können keine
          steuerlich absetzbaren Spendenbescheinigungen ausgestellt werden. Zahlen
          und Updates werden regelmäßig mit der{" "}
          <a
            href={gofundmeCampaign.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest underline underline-offset-2 hover:text-sage"
          >
            Kampagne auf GoFundMe
          </a>{" "}
          abgeglichen.
        </InfoBox>
      </FadeIn>
    </div>
  );
}
