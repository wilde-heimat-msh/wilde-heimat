import Link from "next/link";
import { AdminLogoutButton, AdminNav } from "@/components/admin/AdminLogin";

export function AdminDashboard() {
  const cards = [
    {
      href: "/admin/anfragen",
      title: "Formular-Anfragen",
      description:
        "Kontakt-, Fund- und Patenschaftsanfragen aus der Website einsehen und beantworten.",
    },
    {
      href: "/admin/waschbaeren",
      title: "Waschbären verwalten",
      description:
        "Profile anlegen und bearbeiten: Steckbrief, Geschichte, Charakter und Galerie-Fotos für jeden Waschbären.",
    },
    {
      href: "/admin/paten",
      title: "Paten verwalten",
      description:
        "Paten anlegen, Zugangscodes vergeben und Stufen zuweisen. Jeder Pate erhält einen individuellen Code für das Paten-Portal.",
    },
    {
      href: "/admin/updates",
      title: "Updates schreiben",
      description:
        "Wöchentliche Neuigkeiten und Fotos für Gold-Paten (und Fotos für Silber) veröffentlichen – pro Waschbär oder individuell.",
    },
    {
      href: "/admin/urkunden",
      title: "Urkunden erstellen",
      description: "Patenschaftsurkunden personalisieren, als PDF speichern oder drucken.",
    },
    {
      href: "/paten",
      title: "Paten-Portal (Vorschau)",
      description: "So sehen Paten ihre Updates – Zugang nur mit persönlichem Code.",
      external: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-forest">Administration</h1>
          <p className="mt-1 text-sm text-muted">Interne Werkzeuge für Wilde Heimat</p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminNav />

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-border bg-background/90 p-5 shadow-soft hover:shadow-soft-hover hover:-translate-y-0.5 transition-all duration-300"
          >
            <h2 className="font-medium text-forest">{card.title}</h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">{card.description}</p>
            {card.external ? (
              <span className="mt-3 inline-block text-xs text-accent">Öffnen →</span>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
