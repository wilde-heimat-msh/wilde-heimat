import Link from "next/link";
import { Logo } from "@/components/Logo";
import { desktopNavigation } from "@/data/navigation";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { ScrollHeader } from "./ScrollHeader";

export function Header() {
  return (
    <ScrollHeader>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 lg:h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group min-w-0">
            <Logo size={36} className="h-8 w-8 lg:h-9 lg:w-9 transition-transform duration-300 group-hover:scale-105 shrink-0" priority />
            <span className="hidden md:block text-sm font-medium tracking-wide truncate">
              Wilde Heimat
            </span>
          </Link>

          <DesktopNav items={desktopNavigation} />

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/unterstuetzen"
              className="hidden sm:inline-flex items-center min-h-11 px-4 py-2 text-sm font-medium bg-foreground text-background hover:bg-accent rounded-xl shadow-soft hover:shadow-soft-hover hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
            >
              Unterstützen
            </Link>
            <MobileMenu />
          </div>
        </div>
      </div>
    </ScrollHeader>
  );
}
