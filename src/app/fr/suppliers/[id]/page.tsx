import type { Metadata } from "next";
import SupplierDetailPage from "@/components/suppliers/SupplierDetailPage";
import type { ApiSupplier } from "@/lib/api";
import { getSupplierDetail } from "@/lib/db";
import { getProvinceLabel } from "@/lib/i18n";
import { buildSocialMetadata } from "@/lib/route-metadata";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getSupplierSummary(id: string) {
  const detail = await getSupplierDetail(
    id,
    "supplier_id,business_name,brief_info,city,province_code,province_name,business_sector,naics_description"
  );

  return detail?.row as ApiSupplier | undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supplier = await getSupplierSummary(id);

  if (!supplier) {
    return {
      title: "Fournisseur introuvable | SourceLocal",
      description: "Ce profil de fournisseur canadien est introuvable.",
      alternates: {
        canonical: `/fr/suppliers/${id}`,
        languages: {
          en: `/en/suppliers/${id}`,
          fr: `/fr/suppliers/${id}`,
        },
      },
      ...buildSocialMetadata(
        "fr",
        "Fournisseur introuvable | SourceLocal",
        "Ce profil de fournisseur canadien est introuvable.",
        `/fr/suppliers/${id}`
      ),
    };
  }

  const provinceName = supplier.province_code
    ? getProvinceLabel(supplier.province_code, "fr")
    : supplier.province_name || "";
  const location = [supplier.city, provinceName].filter(Boolean).join(", ");
  const summary =
    supplier.brief_info || supplier.business_sector || supplier.naics_description || "Fournisseur canadien";

  return {
    title: `${supplier.business_name} | SourceLocal`,
    description: `Consultez le profil de ${supplier.business_name}${
      location ? ` à ${location}` : ""
    }. ${summary}.`,
    alternates: {
      canonical: `/fr/suppliers/${id}`,
      languages: {
        en: `/en/suppliers/${id}`,
        fr: `/fr/suppliers/${id}`,
      },
    },
    ...buildSocialMetadata(
      "fr",
      `${supplier.business_name} | SourceLocal`,
      `Consultez le profil de ${supplier.business_name}${
        location ? ` à ${location}` : ""
      }. ${summary}.`,
      `/fr/suppliers/${id}`
    ),
  };
}

export default function FrSupplierDetailPage() {
  return <SupplierDetailPage />;
}
