"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminPortalNav } from "@/data/navigation";

type AdminLoginProps = {
  title?: string;
  description?: string;
};

export function AdminLogin({
  title = "Administration",
  description = "Interner Bereich für Wilde Heimat. Bitte mit dem Admin-Passwort anmelden.",
}: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Anmeldung fehlgeschlagen.");
        return;
      }

      window.location.reload();
    } catch {
      setError("Verbindungsfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-border bg-background/90 p-6 sm:p-8 shadow-soft">
        <h1 className="text-xl font-medium text-forest">{title}</h1>
        <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium mb-2">
              Passwort
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-11 px-4 py-3 text-sm font-medium bg-foreground text-background hover:bg-accent rounded-xl transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Wird angemeldet …" : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminNotConfigured() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-amber-300/60 bg-amber-50/80 p-6 sm:p-8">
      <h1 className="text-xl font-medium text-forest">Admin noch nicht eingerichtet</h1>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        Setze in der Datei <code className="text-xs">.env.local</code> die Variable{" "}
        <code className="text-xs">ADMIN_URKUNDEN_PASSWORD</code> und starte den Server neu.
      </p>
    </div>
  );
}

export function AdminLogoutButton() {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="min-h-11 shrink-0 px-4 py-2 text-sm rounded-xl border border-border hover:bg-muted-light/60 transition-colors"
    >
      Abmelden
    </button>
  );
}

export function AdminNav() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      className="flex flex-wrap gap-2"
      aria-label="Admin-Navigation"
    >
      {adminPortalNav.map((link) => {
        const active = isActive(link.href);
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
      <Link
        href="/paten"
        className="min-h-10 inline-flex items-center px-3 py-2 text-sm rounded-xl border border-border bg-background/80 hover:bg-muted-light/60 text-muted hover:text-foreground transition-colors"
      >
        Paten-Portal
      </Link>
    </nav>
  );
}
