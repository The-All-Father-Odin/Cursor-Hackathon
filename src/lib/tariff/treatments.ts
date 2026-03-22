import type { TariffTreatmentCode } from "@/types/tariff";

export interface OriginOption {
  value: string;
  label: string;
  treatment: TariffTreatmentCode;
}

const EU_COUNTRY_CODES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
]);

const COUNTRY_TREATMENTS: Record<string, TariffTreatmentCode> = {
  OTHER: "MFN",
  CN: "MFN",
  US: "UST",
  MX: "MXT",
  GB: "UKT",
  UK: "UKT",
  AU: "AUT",
  NZ: "NZT",
  CL: "CT",
  CO: "COLT",
  CR: "CRT",
  IL: "IT",
  JP: "JT",
  HN: "HNT",
  KR: "KRT",
  PA: "PAT",
  UA: "UAT",
  PE: "CPTPT",
  SG: "CPTPT",
  VN: "CPTPT",
  MY: "CPTPT",
  BN: "CPTPT",
};

export const ORIGIN_OPTIONS: OriginOption[] = [
  { value: "CN", label: "China", treatment: "MFN" },
  { value: "US", label: "United States", treatment: "UST" },
  { value: "MX", label: "Mexico", treatment: "MXT" },
  { value: "EU", label: "European Union", treatment: "CEUT" },
  { value: "GB", label: "United Kingdom", treatment: "UKT" },
  { value: "AU", label: "Australia", treatment: "AUT" },
  { value: "NZ", label: "New Zealand", treatment: "NZT" },
  { value: "JP", label: "Japan", treatment: "JT" },
  { value: "KR", label: "South Korea", treatment: "KRT" },
  { value: "CL", label: "Chile", treatment: "CT" },
  { value: "CO", label: "Colombia", treatment: "COLT" },
  { value: "CR", label: "Costa Rica", treatment: "CRT" },
  { value: "IL", label: "Israel", treatment: "IT" },
  { value: "HN", label: "Honduras", treatment: "HNT" },
  { value: "PA", label: "Panama", treatment: "PAT" },
  { value: "UA", label: "Ukraine", treatment: "UAT" },
  { value: "PE", label: "Peru", treatment: "CPTPT" },
  { value: "SG", label: "Singapore", treatment: "CPTPT" },
  { value: "VN", label: "Vietnam", treatment: "CPTPT" },
  { value: "MY", label: "Malaysia", treatment: "CPTPT" },
  { value: "BN", label: "Brunei", treatment: "CPTPT" },
  { value: "OTHER", label: "Other / MFN", treatment: "MFN" },
];

export function getTreatmentCode(originCountry: string, claimPreference?: boolean): TariffTreatmentCode {
  if (!claimPreference) {
    return "MFN";
  }

  const normalized = originCountry.trim().toUpperCase();
  if (normalized === "EU" || EU_COUNTRY_CODES.has(normalized)) {
    return "CEUT";
  }

  return COUNTRY_TREATMENTS[normalized] ?? "MFN";
}
