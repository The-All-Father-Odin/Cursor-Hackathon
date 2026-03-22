import suppliersData from "@/data/suppliers-db.json";
import sourcesData from "@/data/sources-db.json";

type SupplierRow = Record<string, unknown>;

const suppliers: SupplierRow[] = suppliersData as SupplierRow[];
const sources: SupplierRow[] = sourcesData as SupplierRow[];

const LIST_SEARCH_COLS = [
  "business_name", "brief_info", "tags", "city",
  "business_sector", "business_subsector", "naics_description", "source_provider",
];

const LIST_DEFAULT_FIELDS = [
  "supplier_id", "business_name", "brief_info", "province_code", "city",
  "contact_summary", "capacity_tier", "derived_naics", "naics_description",
  "source_provider", "status",
];

const DETAIL_DEFAULT_FIELDS = [
  "supplier_id", "business_name", "alt_business_name", "brief_info",
  "business_sector", "business_subsector", "business_description",
  "province_code", "province_name", "city", "csd_name",
  "full_address", "contact_address", "contact_summary", "contact_availability",
  "postal_code", "latitude", "longitude", "geo_source",
  "derived_naics", "source_naics_primary", "source_naics_secondary",
  "naics_description", "naics_description_secondary",
  "employee_count_raw", "capacity_tier",
  "licence_type", "licence_number", "business_id_no",
  "status", "source_provider", "source_dataset_count", "source_match_method",
];

function pickFields(row: SupplierRow, fields: string[]): SupplierRow {
  const result: SupplierRow = {};
  for (const f of fields) {
    if (f in row) result[f] = row[f];
  }
  return result;
}

function matchesToken(row: SupplierRow, token: string): boolean {
  const lower = token.toLowerCase();
  return LIST_SEARCH_COLS.some(col => {
    const val = row[col];
    return typeof val === "string" && val.toLowerCase().includes(lower);
  });
}

export interface SearchOptions {
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

export async function searchSuppliers(opts: SearchOptions) {
  const limit = Math.min(Math.max(opts.limit || 20, 1), 500);
  const offset = Math.max(opts.offset || 0, 0);

  const requestedFields = opts.fields
    ? opts.fields.split(",").map(f => f.trim()).filter(f => DETAIL_DEFAULT_FIELDS.includes(f))
    : LIST_DEFAULT_FIELDS;

  let filtered = suppliers;

  if (opts.province) {
    const prov = opts.province.toUpperCase();
    filtered = filtered.filter(r => r.province_code === prov);
  }

  if (opts.city) {
    const city = opts.city.toLowerCase();
    filtered = filtered.filter(r => typeof r.city === "string" && r.city.toLowerCase().includes(city));
  }

  if (opts.capacity) {
    filtered = filtered.filter(r => r.capacity_tier === opts.capacity);
  }

  if (opts.provider) {
    const prov = opts.provider.toLowerCase();
    filtered = filtered.filter(r => typeof r.source_provider === "string" && r.source_provider.toLowerCase().includes(prov));
  }

  if (opts.status) {
    filtered = filtered.filter(r => r.status === opts.status);
  }

  if (opts.has_geocode) {
    filtered = filtered.filter(r => r.latitude != null && r.longitude != null);
  }

  if (opts.query) {
    const tokens = opts.query.trim().split(/\s+/);
    filtered = filtered.filter(row => tokens.every(token => matchesToken(row, token)));
  }

  if (opts.naics) {
    const naics = opts.naics.replace(/\D/g, "");
    if (naics) {
      filtered = filtered.filter((row) =>
        [row.derived_naics, row.source_naics_primary, row.source_naics_secondary]
          .filter(Boolean)
          .some((value) => String(value).startsWith(naics))
      );
    }
  }

  const count = filtered.length;
  const rows = filtered.slice(offset, offset + limit).map(r => pickFields(r, requestedFields));

  return { ok: true, count, limit, offset, rows };
}

export async function getSupplierDetail(supplierId: string, fields?: string) {
  const requestedFields = fields
    ? fields.split(",").map(f => f.trim()).filter(f => DETAIL_DEFAULT_FIELDS.includes(f))
    : DETAIL_DEFAULT_FIELDS;

  const row = suppliers.find(r => r.supplier_id === supplierId);
  if (!row) return null;
  return { ok: true, row: pickFields(row, requestedFields) };
}

export async function getStats() {
  const providerCounts: Record<string, number> = {};
  for (const s of suppliers) {
    const p = s.source_provider as string;
    if (p) providerCounts[p] = (providerCounts[p] || 0) + 1;
  }

  const topProviders = Object.entries(providerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([source_provider, supplier_count]) => ({ source_provider, supplier_count }));

  return {
    ok: true,
    stats: {
      supplier_count: suppliers.length,
      source_count: sources.length,
      top_providers: topProviders,
    },
  };
}

export async function getSources(opts: { provider?: string; province?: string; city?: string; limit?: number; offset?: number }) {
  const limit = Math.min(Math.max(opts.limit || 50, 1), 500);
  const offset = Math.max(opts.offset || 0, 0);

  let filtered = sources;

  if (opts.provider) {
    const prov = opts.provider.toLowerCase();
    filtered = filtered.filter(r => typeof r.provider_name === "string" && r.provider_name.toLowerCase().includes(prov));
  }
  if (opts.province) {
    const p = opts.province.toUpperCase();
    filtered = filtered.filter(r => r.province_code === p);
  }
  if (opts.city) {
    const c = opts.city.toLowerCase();
    filtered = filtered.filter(r => typeof r.city === "string" && r.city.toLowerCase().includes(c));
  }

  const count = filtered.length;
  const rows = filtered.slice(offset, offset + limit);
  return { ok: true, count, limit, offset, rows };
}
