import type { Metadata } from "next";
import SupplierDetailPage from "@/components/suppliers/SupplierDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: "Canadian Supplier Profile | SourceLocal",
    description:
      "Review a Canadian supplier profile with business details, location data, industry classification, and map links.",
    alternates: {
      canonical: `/en/suppliers/${id}`,
      languages: {
        en: `/en/suppliers/${id}`,
        fr: `/fr/suppliers/${id}`,
      },
    },
  };
}

export default function EnSupplierDetailPage() {
  return <SupplierDetailPage />;
}
