"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { patenPortalNav } from "@/data/navigation";

function isActive(pathname: string, href: string): boolean {
  if (href === "/paten") {
    return pathname === "/paten" || pathname.startsWith("/paten/zugang");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PatenPortalNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap gap-2"
      aria-label="Paten-Bereich Navigation"
    >
      {patenPortalNav.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`min-h-10 inline-flex items-center px-3 py-2 text-sm rounded-xl border transition-colors ${
              active
                ? "border-forest/30 bg-sage/15 text-forest font-medium"
                : "border-border bg-background/80 hover:bg-muted-light/60 text-muted hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function PatenLogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <button
      type="button"
      onClick={onLogout}
      className="min-h-11 shrink-0 px-4 py-2 text-sm rounded-xl border border-border hover:bg-muted-light/60 transition-colors"
    >
      Abmelden
    </button>
  );
}
