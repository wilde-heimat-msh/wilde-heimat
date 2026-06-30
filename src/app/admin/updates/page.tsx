import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminUpdatesManager } from "@/components/admin/AdminUpdatesManager";

export const metadata: Metadata = {
  title: "Paten-Updates",
  robots: { index: false, follow: false },
};

export default function AdminUpdatesPage() {
  return (
    <AdminGate>
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AdminUpdatesManager />
        </div>
      </div>
    </AdminGate>
  );
}
