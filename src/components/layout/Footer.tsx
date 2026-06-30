import Link from "next/link";
import { Logo } from "@/components/Logo";
import { footerNavigation } from "@/data/navigation";
import { siteConfig, unterstuetzungHinweis, showInternalLinks } from "@/data/site";
import { SocialLinks } from "@/components/SocialLinks";

export function Footer() {
  return (
    <footer className="bg-forest text-background mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Logo surface="dark" size={48} className="h-12 w-12" />
              <div>
                <span className="text-sm font-medium block">Wilde Heimat</span>
                <span className="text-xs text-muted-light">Private Initiative</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-light leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="mt-6">
              <SocialLinks light />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4">
              Projekt
            </h3>
            <ul className="space-y-2">
              {footerNavigation.projekt.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-light hover:text-background transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4">
              Unterstützen
            </h3>
            <ul className="space-y-2">
              {footerNavigation.unterstuetzen.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-light hover:text-background transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4">
              Rechtliches
            </h3>
            <ul className="space-y-2">
              {footerNavigation.rechtliches.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-light hover:text-background transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-light">
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-background transition-colors break-all"
              >
                {siteConfig.email}
              </a>
            </p>
            <p className="mt-2 text-sm text-muted-light">{siteConfig.region}</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-accent space-y-4">
          <p className="text-xs text-muted text-center max-w-3xl mx-auto leading-relaxed">
            {unterstuetzungHinweis} Wilde Heimat ist eine private Initiative von Juja –
            kein eingetragener Verein und keine gemeinnützige Organisation.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Wilde Heimat – Private Initiative
            {showInternalLinks ? (
              <>
                {" · "}
                <Link
                  href="/paten"
                  className="text-muted-light/80 hover:text-background transition-colors underline-offset-2 hover:underline"
                >
                  Paten-Bereich
                </Link>
                {" · "}
                <Link
                  href="/admin"
                  className="text-muted-light/80 hover:text-background transition-colors underline-offset-2 hover:underline"
                >
                  Administration
                </Link>
              </>
            ) : null}
          </p>
          <p className="text-xs text-muted">
            Waschbären eine Stimme geben.
          </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
