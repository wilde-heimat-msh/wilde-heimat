import { isAdminAuthenticated, isAdminPasswordConfigured } from "@/lib/adminAuth";
import { AdminLogin, AdminNotConfigured } from "@/components/admin/AdminLogin";

export async function AdminGate({ children }: { children: React.ReactNode }) {
  if (!isAdminPasswordConfigured()) {
    return (
      <div className="py-12 px-4">
        <AdminNotConfigured />
      </div>
    );
  }

  if (!(await isAdminAuthenticated())) {
    return (
      <div className="py-12 px-4">
        <AdminLogin />
      </div>
    );
  }

  return children;
}
