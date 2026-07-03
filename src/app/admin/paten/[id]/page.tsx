import { AdminGate } from "@/components/admin/AdminGate";
import { AdminPatenKartei } from "@/components/admin/AdminPatenKartei";
import { adminMetadata } from "@/lib/seo";

export const metadata = adminMetadata("Paten-Kartei");

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPatenKarteiPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminGate>
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AdminPatenKartei pateId={id} />
        </div>
      </div>
    </AdminGate>
  );
}
