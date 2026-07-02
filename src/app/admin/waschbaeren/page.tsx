import { AdminGate } from "@/components/admin/AdminGate";
import { AdminWaschbaerenManager } from "@/components/admin/AdminWaschbaerenManager";
import { adminMetadata } from "@/lib/seo";

export const metadata = adminMetadata("Waschbären verwalten");

export default function AdminWaschbaerenPage() {
  return (
    <AdminGate>
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AdminWaschbaerenManager />
        </div>
      </div>
    </AdminGate>
  );
}
