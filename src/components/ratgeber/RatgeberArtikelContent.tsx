import type { RatgeberArtikel } from "@/data/ratgeber/types";

export function RatgeberArtikelContent({ artikel }: { artikel: RatgeberArtikel }) {
  return (
    <article className="space-y-10">
      <p className="text-lg sm:text-xl text-foreground leading-relaxed">{artikel.intro}</p>

      {artikel.sections.map((section) => (
        <section
          key={section.heading}
          className="space-y-4 pt-8 border-t border-border first:pt-0 first:border-t-0"
        >
          <h2 className="text-xl sm:text-2xl font-medium text-forest">{section.heading}</h2>

          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="text-muted leading-relaxed text-base sm:text-lg">
              {paragraph}
            </p>
          ))}

          {section.bullets && section.bullets.length > 0 ? (
            <ul className="space-y-2.5 pl-1">
              {section.bullets.map((item) => (
                <li
                  key={item.slice(0, 48)}
                  className="flex items-start gap-3 text-muted leading-relaxed text-base sm:text-lg"
                >
                  <span
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </article>
  );
}
