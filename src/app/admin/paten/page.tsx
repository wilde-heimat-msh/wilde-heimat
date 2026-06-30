import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminPatenManager } from "@/components/admin/AdminPatenManager";

export const metadata: Metadata = {
  title: "Paten verwalten",
  robots: { index: false, follow: false },
};

export default function AdminPatenPage() {
  return (
    <AdminGate>
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AdminPatenManager />
        </div>
      </div>
    </AdminGate>
  );
}
