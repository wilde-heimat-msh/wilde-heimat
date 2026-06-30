"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mobileNavigationGroups } from "@/data/navigation";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center min-h-11 min-w-11 p-2 text-foreground -mr-2"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          )}
        </svg>
      </button>

      {open && (
        <nav
          id="mobile-menu"
          className="absolute left-0 right-0 top-14 bg-background border-b border-border shadow-lg max-h-[calc(100vh-3.5rem)] overflow-y-auto"
          aria-label="Mobile Navigation"
        >
          <div className="px-4 py-4">
            {mobileNavigationGroups.map((group, i) => (
              <div key={group.title} className={i > 0 ? "mt-6 pt-6 border-t border-border" : ""}>
                <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center min-h-11 px-3 py-3 text-base text-foreground hover:bg-muted-light transition-colors rounded-sm"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href="/unterstuetzen"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center min-h-11 mt-6 px-3 py-3 text-center text-base font-medium bg-foreground text-background rounded-xl"
            >
              Unterstützen
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
