import { AdminGate } from "@/components/admin/AdminGate";
import { AdminUpdatesManager } from "@/components/admin/AdminUpdatesManager";
import { adminMetadata } from "@/lib/seo";

export const metadata = adminMetadata("Paten-Updates");

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
