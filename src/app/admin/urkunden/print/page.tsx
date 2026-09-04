import { PatenschaftUrkunde } from "@/components/PatenschaftUrkunde";
import { verifyUrkundePrintToken } from "@/lib/urkundePrintToken";
import { adminMetadata } from "@/lib/seo";

export const metadata = adminMetadata("Urkunden-Druckvorschau");

type PageProps = {
  searchParams: Promise<{ t?: string }>;
};

export default async function UrkundePrintPage({ searchParams }: PageProps) {
  const { t } = await searchParams;
  const data = t ? verifyUrkundePrintToken(t) : null;

  if (!data) {
    return (
      <div className="urkunde-print-root min-h-screen flex items-center justify-center p-8 bg-white text-forest">
        <p className="text-sm text-muted">
          Druckvorschau ungültig oder abgelaufen. Bitte die PDF erneut erzeugen.
        </p>
      </div>
    );
  }

  return (
    <div className="urkunde-print-root">
      <PatenschaftUrkunde data={data} mode="a4" className="urkunde-print-sheet" />
    </div>
  );
}
