import { AdminGate } from "@/components/admin/AdminGate";
import { AdminAnfragenManager } from "@/components/admin/AdminAnfragenManager";
import { adminMetadata } from "@/lib/seo";

export const metadata = adminMetadata("Formular-Anfragen");

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
