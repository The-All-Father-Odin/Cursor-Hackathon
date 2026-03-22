import type { Metadata } from "next";
import { getCapacityTierLabel, getProvinceLabel, type Locale } from "@/lib/i18n";

type SearchParamValue = string | string[] | undefined;
type SearchParamRecord = Record<string, SearchParamValue>;

function firstValue(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function clip(value: string | undefined, max = 80): string | undefined {
  if (!value) return undefined;
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;
}

function getBaseAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const altLocale = locale === "en" ? "fr" : "en";
  return {
    canonical: `/${locale}${path}`,
    languages: {
      [locale]: `/${locale}${path}`,
      [altLocale]: `/${altLocale}${path}`,
    },
  };
}

const originLabels: Record<string, { en: string; fr: string }> = {
  CN: { en: "China", fr: "Chine" },
  US: { en: "United States", fr: "États-Unis" },
  MX: { en: "Mexico", fr: "Mexique" },
  EU: { en: "European Union", fr: "Union européenne" },
  GB: { en: "United Kingdom", fr: "Royaume-Uni" },
  JP: { en: "Japan", fr: "Japon" },
  KR: { en: "South Korea", fr: "Corée du Sud" },
  VN: { en: "Vietnam", fr: "Vietnam" },
  OTHER: { en: "Other / MFN", fr: "Autre / NPF" },
};

function getOriginLabel(origin: string | undefined, locale: Locale) {
  if (!origin) return undefined;
  return originLabels[origin]?.[locale] ?? origin;
}

export function buildSearchPageMetadata(
  locale: Locale,
  searchParams: SearchParamRecord
): Metadata {
  const query = clip(firstValue(searchParams.query) || firstValue(searchParams.q), 60);
  const provinceCode = firstValue(searchParams.province);
  const province = getProvinceLabel(provinceCode, locale) || undefined;
  const capacity = getCapacityTierLabel(firstValue(searchParams.capacity), locale) || undefined;
  const naics = clip(firstValue(searchParams.naics), 24);

  let title =
    locale === "fr"
      ? "Rechercher des fournisseurs canadiens | SourceLocal"
      : "Search Canadian Suppliers | SourceLocal";

  if (query && province) {
    title =
      locale === "fr"
        ? `Fournisseurs « ${query} » en ${province} | SourceLocal`
        : `${query} suppliers in ${province} | SourceLocal`;
  } else if (query) {
    title =
      locale === "fr"
        ? `Fournisseurs « ${query} » au Canada | SourceLocal`
        : `${query} suppliers in Canada | SourceLocal`;
  } else if (province) {
    title =
      locale === "fr"
        ? `Fournisseurs en ${province} | SourceLocal`
        : `${province} suppliers | SourceLocal`;
  }

  const detailParts = [province, capacity, naics ? `NAICS ${naics}` : undefined].filter(Boolean);
  const defaultDescription =
    locale === "fr"
      ? "Recherchez plus de 50 000 fournisseurs canadiens par produit, province, secteur et capacité."
      : "Search 50,000+ Canadian suppliers by product, province, industry, and capacity.";

  const description = query
    ? locale === "fr"
      ? `Recherchez des fournisseurs canadiens pour ${query}${
          detailParts.length ? ` avec des filtres ${detailParts.join(", ")}` : ""
        }.`
      : `Search Canadian suppliers for ${query}${
          detailParts.length ? ` with ${detailParts.join(", ")} filters` : ""
        }.`
    : defaultDescription;

  return {
    title,
    description,
    alternates: getBaseAlternates(locale, "/search"),
  };
}

export function buildMapPageMetadata(
  locale: Locale,
  searchParams: SearchParamRecord
): Metadata {
  const query = clip(firstValue(searchParams.query) || firstValue(searchParams.q), 60);
  const provinceCode = firstValue(searchParams.province);
  const province = getProvinceLabel(provinceCode, locale) || undefined;
  const supplierId = firstValue(searchParams.supplier_id) || firstValue(searchParams.selected);
  const view = firstValue(searchParams.view);

  let title =
    locale === "fr"
      ? "Carte des fournisseurs canadiens | SourceLocal"
      : "Canadian Supplier Map | SourceLocal";

  if (supplierId) {
    title =
      locale === "fr"
        ? "Carte ciblée d’un fournisseur | SourceLocal"
        : "Focused supplier map | SourceLocal";
  } else if (query && province) {
    title =
      locale === "fr"
        ? `Carte des fournisseurs « ${query} » en ${province} | SourceLocal`
        : `Map of ${query} suppliers in ${province} | SourceLocal`;
  } else if (query) {
    title =
      locale === "fr"
        ? `Carte des fournisseurs « ${query} » | SourceLocal`
        : `Map of ${query} suppliers | SourceLocal`;
  } else if (province) {
    title =
      locale === "fr"
        ? `Carte des fournisseurs en ${province} | SourceLocal`
        : `${province} supplier map | SourceLocal`;
  }

  const mapMode =
    view === "heatmap"
      ? locale === "fr"
        ? "vue thermique"
        : "heatmap view"
      : locale === "fr"
      ? "vue par marqueurs"
      : "pin view";

  const description =
    locale === "fr"
      ? `Explorez les fournisseurs canadiens sur une carte interactive${
          query ? ` pour ${query}` : ""
        }${province ? ` en ${province}` : ""} avec ${mapMode}.`
      : `Explore Canadian suppliers on an interactive map${
          query ? ` for ${query}` : ""
        }${province ? ` in ${province}` : ""} with ${mapMode}.`;

  return {
    title,
    description,
    alternates: getBaseAlternates(locale, "/map"),
  };
}

export function buildTariffsPageMetadata(
  locale: Locale,
  searchParams: SearchParamRecord
): Metadata {
  const product = clip(firstValue(searchParams.product), 60);
  const hs = clip(firstValue(searchParams.hs), 20);
  const origin = getOriginLabel(firstValue(searchParams.origin), locale);

  let title =
    locale === "fr"
      ? "Contexte tarifaire et coût rendu | SourceLocal"
      : "Tariff & Landed-Cost Context | SourceLocal";

  if (product && hs) {
    title =
      locale === "fr"
        ? `Estimation tarifaire pour ${product} (${hs}) | SourceLocal`
        : `Tariff estimate for ${product} (${hs}) | SourceLocal`;
  } else if (product) {
    title =
      locale === "fr"
        ? `Estimation tarifaire pour ${product} | SourceLocal`
        : `Tariff estimate for ${product} | SourceLocal`;
  } else if (hs) {
    title =
      locale === "fr"
        ? `Estimation tarifaire ${hs} | SourceLocal`
        : `HS ${hs} tariff estimate | SourceLocal`;
  }

  const description =
    locale === "fr"
      ? `Comparez le coût de l’importation${
          product ? ` pour ${product}` : ""
        }${origin ? ` depuis ${origin}` : ""}${hs ? ` avec le code ${hs}` : ""}.`
      : `Compare the cost of importing${
          product ? ` ${product}` : ""
        }${origin ? ` from ${origin}` : ""}${hs ? ` with HS code ${hs}` : ""}.`;

  return {
    title,
    description,
    alternates: getBaseAlternates(locale, "/tariffs"),
  };
}
