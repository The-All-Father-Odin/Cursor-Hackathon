import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SupplierDetailPage from "@/components/suppliers/SupplierDetailPage";
import type { ApiSupplier } from "@/lib/api";
import { getSupplierDetail } from "@/lib/db";
import { getProvinceLabel } from "@/lib/i18n";
import { buildSocialMetadata } from "@/lib/route-metadata";
import { buildSupplierStructuredData, JsonLdScript } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getSupplierSummary(id: string) {
  const detail = await getSupplierDetail(
    id,
    "supplier_id,business_name,alt_business_name,brief_info,business_sector,business_subsector,business_description,city,province_code,province_name,postal_code,full_address,latitude,longitude,derived_naics,naics_description,source_provider,status"
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
      ...buildSocialMetadata(
        "en",
        "Supplier not found | SourceLocal",
        "This Canadian supplier profile could not be found.",
        `/en/suppliers/${id}`
      ),
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
    ...buildSocialMetadata(
      "en",
      `${supplier.business_name} | SourceLocal`,
      `View supplier details for ${supplier.business_name}${
        location ? ` in ${location}` : ""
      }. ${summary}.`,
      `/en/suppliers/${id}`
    ),
  };
}

export default async function EnSupplierDetailPage({ params }: PageProps) {
  const { id } = await params;
  const detail = await getSupplierDetail(id);
  const supplier = detail?.row as ApiSupplier | undefined;

  if (!supplier) {
    notFound();
  }

  return (
    <>
      {supplier ? <JsonLdScript data={buildSupplierStructuredData("en", supplier)} /> : null}
      <SupplierDetailPage initialSupplier={supplier} />
    </>
  );
}
