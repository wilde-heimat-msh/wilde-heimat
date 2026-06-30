import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminGate>
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AdminDashboard />
        </div>
      </div>
    </AdminGate>
  );
}
