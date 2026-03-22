import type { ApiSupplier } from "@/lib/api";
import { getProvinceLabel, type Locale } from "@/lib/i18n";
import { toAbsoluteUrl } from "@/lib/site";

function compactJson(value: unknown): unknown {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }

  if (Array.isArray(value)) {
    const items = value.map(compactJson).filter((item) => item !== undefined);
    return items.length > 0 ? items : undefined;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, entry]) => [key, compactJson(entry)] as const)
      .filter(([, entry]) => entry !== undefined);

    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }

  return value;
}

function cleanStructuredData<T>(value: T): T {
  return compactJson(value) as T;
}

export function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

export function buildHomeStructuredData(locale: Locale) {
  const pageUrl = toAbsoluteUrl(`/${locale}`);
  const organizationId = `${pageUrl}#organization`;
  const websiteId = `${pageUrl}#website`;
  const description =
    locale === "fr"
      ? "Découvrez, évaluez et contactez des fournisseurs canadiens grâce à une expérience bilingue de recherche, de cartographie et de comparaison tarifaire."
      : "Discover, evaluate, and connect with Canadian suppliers through a bilingual search, map, and tariff-awareness workflow.";

  return cleanStructuredData([
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: "SourceLocal",
      url: pageUrl,
      logo: toAbsoluteUrl("/icon.svg"),
      description,
      areaServed: {
        "@type": "Country",
        name: "Canada",
      },
      availableLanguage: ["en-CA", "fr-CA"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      url: pageUrl,
      name: "SourceLocal",
      description,
      inLanguage: locale === "fr" ? "fr-CA" : "en-CA",
      publisher: {
        "@id": organizationId,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: toAbsoluteUrl(`/${locale}/search?query={search_term_string}`),
        },
        "query-input": "required name=search_term_string",
      },
    },
  ]);
}

export function buildSupplierStructuredData(locale: Locale, supplier: ApiSupplier) {
  const pageUrl = toAbsoluteUrl(`/${locale}/suppliers/${supplier.supplier_id}`);
  const provinceName = supplier.province_code
    ? getProvinceLabel(supplier.province_code, locale)
    : supplier.province_name || undefined;
  const hasGeo =
    typeof supplier.latitude === "number" && typeof supplier.longitude === "number";
  const description =
    supplier.brief_info ||
    supplier.business_description ||
    supplier.business_sector ||
    supplier.naics_description ||
    (locale === "fr" ? "Fournisseur canadien" : "Canadian supplier");

  return cleanStructuredData({
    "@context": "https://schema.org",
    "@type": hasGeo || supplier.full_address ? "LocalBusiness" : "Organization",
    "@id": `${pageUrl}#supplier`,
    name: supplier.business_name,
    alternateName: supplier.alt_business_name,
    url: pageUrl,
    description,
    areaServed: {
      "@type": "Country",
      name: "Canada",
    },
    identifier: {
      "@type": "PropertyValue",
      propertyID: "supplier_id",
      value: supplier.supplier_id,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: supplier.full_address,
      addressLocality: supplier.city,
      addressRegion: provinceName,
      postalCode: supplier.postal_code,
      addressCountry: "CA",
    },
    geo: hasGeo
      ? {
          "@type": "GeoCoordinates",
          latitude: supplier.latitude,
          longitude: supplier.longitude,
        }
      : undefined,
    keywords: [
      supplier.business_sector,
      supplier.business_subsector,
      supplier.naics_description,
    ],
    additionalProperty: [
      supplier.derived_naics
        ? {
            "@type": "PropertyValue",
            name: "NAICS",
            value: String(supplier.derived_naics),
          }
        : undefined,
      supplier.source_provider
        ? {
            "@type": "PropertyValue",
            name: locale === "fr" ? "Source de données" : "Data source",
            value: supplier.source_provider,
          }
        : undefined,
      supplier.status
        ? {
            "@type": "PropertyValue",
            name: locale === "fr" ? "Statut" : "Status",
            value: supplier.status,
          }
        : undefined,
    ],
  });
}
