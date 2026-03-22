import type { Metadata } from "next";
import SupplierDetailPage from "@/components/suppliers/SupplierDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: "Profil de fournisseur canadien | SourceLocal",
    description:
      "Consultez le profil d’un fournisseur canadien avec ses informations d’entreprise, sa localisation, sa classification industrielle et ses liens cartographiques.",
    alternates: {
      canonical: `/fr/suppliers/${id}`,
      languages: {
        en: `/en/suppliers/${id}`,
        fr: `/fr/suppliers/${id}`,
      },
    },
  };
}

export default function FrSupplierDetailPage() {
  return <SupplierDetailPage />;
}
