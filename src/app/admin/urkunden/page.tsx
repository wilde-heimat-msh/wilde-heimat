import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminUrkundenEditor } from "@/components/admin/AdminUrkundenEditor";

export const metadata: Metadata = {
  title: "Urkunden-Administration",
  robots: { index: false, follow: false },
};

export default function AdminUrkundenPage() {
  return (
    <AdminGate>
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AdminUrkundenEditor />
        </div>
      </div>
    </AdminGate>
  );
}
