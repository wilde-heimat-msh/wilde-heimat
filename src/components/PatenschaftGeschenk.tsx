import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeader } from "@/components/ui/Section";
import { patenschaftGeschenk } from "@/data/patenschaften";

export function PatenschaftGeschenk() {
  return (
    <FadeIn className="max-w-3xl mx-auto">
      <SectionHeader
        title={patenschaftGeschenk.title}
        subtitle={patenschaftGeschenk.subtitle}
        centered
      />
      <Card hover={false} className="bg-cream/90 border-sand/60 mt-6">
        <p className="text-muted leading-relaxed">{patenschaftGeschenk.text}</p>
        <ul className="mt-5 space-y-2">
          {patenschaftGeschenk.hinweise.map((hinweis) => (
            <li key={hinweis} className="flex items-start gap-2 text-sm text-muted">
              <span className="text-sage mt-0.5 shrink-0">✓</span>
              {hinweis}
            </li>
          ))}
        </ul>
        <div className="mt-6 [&_a]:w-full sm:[&_a]:w-auto [&_a]:justify-center flex">
          <Button href="#patenschaft-anfragen" variant="outline">
            Geschenk-Patenschaft anfragen
          </Button>
        </div>
      </Card>
    </FadeIn>
  );
}
