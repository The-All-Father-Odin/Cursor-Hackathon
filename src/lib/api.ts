import type { TariffEstimateRequest, TariffEstimateResponse, TariffLookupResponse } from "@/types/tariff";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface ApiSupplier {
  supplier_id: string;
  business_name: string;
  alt_business_name?: string | null;
  brief_info?: string | null;
  business_sector?: string | null;
  business_subsector?: string | null;
  business_description?: string | null;
  province_code: string;
  province_name?: string;
  city?: string | null;
  csd_name?: string | null;
  full_address?: string | null;
  contact_address?: string | null;
  contact_summary?: string | null;
  contact_availability?: string | null;
  postal_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  geo_source?: string | null;
  derived_naics?: number | null;
  source_naics_primary?: string | null;
  source_naics_secondary?: string | null;
  naics_description?: string | null;
  naics_description_secondary?: string | null;
  employee_count_raw?: string | null;
  capacity_tier?: string | null;
  licence_type?: string | null;
  licence_number?: string | null;
  business_id_no?: string | null;
  status?: string | null;
  source_provider?: string | null;
  source_dataset_count?: number | null;
  source_match_method?: string | null;
}

export interface SuppliersResponse {
  ok: boolean;
  count: number;
  limit: number;
  offset: number;
  rows: ApiSupplier[];
}

export interface SupplierDetailResponse {
  ok: boolean;
  row: ApiSupplier;
}

export interface StatsResponse {
  ok: boolean;
  stats: {
    supplier_count: number;
    source_count: number;
    top_providers: Array<{
      source_provider: string;
      supplier_count: number;
    }>;
  };
}

export interface SourcesResponse {
  ok: boolean;
  count: number;
  limit: number;
  offset: number;
  rows: Array<{
    source_id: number;
    province_code: string;
    province_name: string;
    city: string;
    dataset_name: string;
    dataset_url: string;
    license_url: string;
    last_updated: string;
    provider_name: string;
    match_method: string;
  }>;
}

export interface HealthResponse {
  ok: boolean;
  service: string;
  supplier_count: number;
}

export interface SearchParams {
  supplier_id?: string;
  query?: string;
  naics?: string;
  province?: string;
  city?: string;
  capacity?: string;
  provider?: string;
  status?: string;
  has_geocode?: boolean;
  limit?: number;
  offset?: number;
  fields?: string;
}

async function apiFetch<T>(
  path: string,
  options?: {
    method?: "GET" | "POST";
    params?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
    cache?: RequestCache;
  }
): Promise<T> {
  const queryParts: string[] = [];

  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      }
    });
  }

  const query = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  const fetchUrl = `${API_BASE}${path}${query}`;

  const res = await fetch(fetchUrl, {
    method: options?.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: options?.cache ?? "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `API error: ${res.status}`);
  }

  return res.json();
}

export async function searchSuppliers(params: SearchParams): Promise<SuppliersResponse> {
  return apiFetch<SuppliersResponse>("/suppliers", {
    params: {
      supplier_id: params.supplier_id,
      query: params.query,
      naics: params.naics,
      province: params.province,
      city: params.city,
      capacity: params.capacity,
      provider: params.provider,
      status: params.status,
      has_geocode: params.has_geocode,
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
      fields: params.fields,
    },
  });
}

export async function getSupplierDetail(supplierId: string): Promise<SupplierDetailResponse> {
  return apiFetch<SupplierDetailResponse>(`/suppliers/${encodeURIComponent(supplierId)}`);
}

export async function getStats(): Promise<StatsResponse> {
  return apiFetch<StatsResponse>("/stats");
}

export async function getSources(params?: { provider?: string; province?: string; city?: string; limit?: number; offset?: number }): Promise<SourcesResponse> {
  return apiFetch<SourcesResponse>("/sources", { params });
}

export async function getHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("/health");
}

export async function estimateTariff(body: TariffEstimateRequest): Promise<TariffEstimateResponse> {
  return apiFetch<TariffEstimateResponse>("/tariffs/estimate", {
    method: "POST",
    body,
  });
}

export async function lookupTariffItems(params: { hs: string; originCountry?: string; claimPreference?: boolean; locale?: "en" | "fr" }): Promise<TariffLookupResponse> {
  return apiFetch<TariffLookupResponse>("/tariffs/lookup", {
    params: {
      hs: params.hs,
      originCountry: params.originCountry,
      claimPreference: params.claimPreference,
      locale: params.locale,
    },
  });
}

// Province code to name mapping
export const PROVINCE_CODES: Record<string, string> = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  NT: "Northwest Territories",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
  YT: "Yukon",
};

export const PROVINCE_CODE_LIST = Object.keys(PROVINCE_CODES);

// Derive a Canadian content confidence indicator from available data
export function deriveCanadianConfidence(supplier: ApiSupplier): { score: number; label: string } {
  let score = 25; // Base: registered in Canadian business registry
  const signals: string[] = ["Registered in Canadian business registry"];

  // Has Canadian address
  if (supplier.full_address || supplier.city) {
    score += 25;
    signals.push("Canadian address confirmed");
  }

  // Active status
  if (supplier.status === "Active") {
    score += 10;
    signals.push("Active business status");
  }

  // Multiple data sources
  if (supplier.source_dataset_count && supplier.source_dataset_count > 1) {
    score += 10;
    signals.push(`Found in ${supplier.source_dataset_count} datasets`);
  }

  // Has NAICS classification
  if (supplier.derived_naics) {
    score += 10;
    signals.push("Industry classified (NAICS)");
  }

  // Has employee data
  if (supplier.employee_count_raw) {
    score += 10;
    signals.push("Employee data available");
  }

  // Has geocode
  if (supplier.latitude && supplier.longitude) {
    score += 10;
    signals.push("Location verified");
  }

  return { score: Math.min(score, 100), label: signals.join("; ") };
}
