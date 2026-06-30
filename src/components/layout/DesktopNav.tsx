"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { NavItem } from "@/data/navigation";

type NavDropdownProps = {
  label: string;
  children: { label: string; href: string }[];
};

function NavDropdown({ label, children }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-center gap-1 px-2.5 xl:px-3 py-2 text-sm text-muted hover:text-foreground transition-colors whitespace-nowrap"
      >
        {label}
        <svg
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 min-w-[11rem] bg-background border border-border shadow-soft-hover rounded-xl py-1.5 z-50 overflow-hidden">
          {children.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-muted-light/60 transition-colors rounded-lg mx-1"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-2.5 xl:px-3 py-2 text-sm text-muted hover:text-foreground rounded-lg hover:bg-muted-light/50 transition-all duration-200 whitespace-nowrap"
    >
      {label}
    </Link>
  );
}

export function DesktopNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" aria-label="Hauptnavigation">
      {items.map((item) =>
        item.type === "group" ? (
          <NavDropdown key={item.label} label={item.label} children={item.children} />
        ) : (
          <NavLink key={item.href} href={item.href} label={item.label} />
        )
      )}
    </nav>
  );
}
