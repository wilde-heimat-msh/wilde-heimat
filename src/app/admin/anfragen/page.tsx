import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminAnfragenManager } from "@/components/admin/AdminAnfragenManager";

export const metadata: Metadata = {
  title: "Formular-Anfragen",
  robots: { index: false, follow: false },
};

export default function AdminAnfragenPage() {
  return (
    <AdminGate>
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AdminAnfragenManager />
        </div>
      </div>
    </AdminGate>
  );
}
