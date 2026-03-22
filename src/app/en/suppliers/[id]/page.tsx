import type { Metadata } from "next";
import SupplierDetailPage from "@/components/suppliers/SupplierDetailPage";
import type { ApiSupplier } from "@/lib/api";
import { getSupplierDetail } from "@/lib/db";
import { getProvinceLabel } from "@/lib/i18n";

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
      title: "Supplier not found | SourceLocal",
      description: "This Canadian supplier profile could not be found.",
      alternates: {
        canonical: `/en/suppliers/${id}`,
        languages: {
          en: `/en/suppliers/${id}`,
          fr: `/fr/suppliers/${id}`,
        },
      },
    };
  }

  const provinceName = supplier.province_code
    ? getProvinceLabel(supplier.province_code, "en")
    : supplier.province_name || "";
  const location = [supplier.city, provinceName].filter(Boolean).join(", ");
  const summary =
    supplier.brief_info || supplier.business_sector || supplier.naics_description || "Canadian supplier";

  return {
    title: `${supplier.business_name} | SourceLocal`,
    description: `View supplier details for ${supplier.business_name}${
      location ? ` in ${location}` : ""
    }. ${summary}.`,
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
