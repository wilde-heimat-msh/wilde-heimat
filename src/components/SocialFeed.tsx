import Image from "next/image";
import { siteConfig } from "@/data/site";
import { getDesignWaschbaerBild } from "@/data/photos";
import { waschbaeren } from "@/data/waschbaeren";
import { SocialLinks } from "./SocialLinks";
import { TikTokPreview } from "./TikTokPreview";
import { FadeIn, Stagger, StaggerItem } from "./motion/FadeIn";

export function SocialFeed() {
  return (
    <section className="relative overflow-hidden bg-sand-light/70 py-16 md:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight">
            Folge uns
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Erlebe die Waschbären im Alltag – auf Instagram und TikTok teilen
            wir Einblicke, Geschichten und aktuelle Updates.
          </p>
        </FadeIn>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StaggerItem>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group hover-lift block rounded-2xl border border-border bg-background p-8 shadow-soft hover:border-foreground/20 hover:shadow-soft-hover"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-xl bg-foreground text-background flex items-center justify-center shadow-sm">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium group-hover:underline">Instagram</p>
                  <p className="text-sm text-muted">@ju.ja91</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {waschbaeren.slice(0, 3).map((w, index) => (
                  <div key={w.slug} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={getDesignWaschbaerBild(index)}
                      alt="Waschbär-Impression"
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">
                Aktuelle Beiträge auf Instagram ansehen →
              </p>
            </a>
          </StaggerItem>

          <StaggerItem>
            <div className="group hover-lift rounded-2xl border border-border bg-background p-8 shadow-soft hover:border-foreground/20 hover:shadow-soft-hover">
              <a
                href={siteConfig.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 flex items-center gap-4"
              >
                <div className="h-12 w-12 rounded-xl bg-foreground text-background flex items-center justify-center shadow-sm">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium group-hover:underline">TikTok</p>
                  <p className="text-sm text-muted">@juja030691</p>
                </div>
              </a>
              <TikTokPreview />
              <a
                href={siteConfig.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-sm text-muted hover:underline"
              >
                Videos auf TikTok ansehen →
              </a>
            </div>
          </StaggerItem>
        </Stagger>

        <FadeIn className="mt-8 flex justify-center">
          <SocialLinks />
        </FadeIn>

        <FadeIn className="mt-6 text-center text-xs text-muted max-w-xl mx-auto">
          Folge uns auf Instagram und TikTok für aktuelle Einblicke und Geschichten.
        </FadeIn>
      </div>
    </section>
  );
}
