import "server-only";

import { existsSync } from "node:fs";
import { join } from "node:path";
import suppliersData from "@/data/suppliers-db.json";
import sourcesData from "@/data/sources-db.json";

type SupplierRow = Record<string, unknown>;
type SourceRow = Record<string, unknown>;
type SQLiteDatabase = import("node:sqlite").DatabaseSync;

type Backend =
  | { kind: "sqlite"; db: SQLiteDatabase; databasePath: string }
  | { kind: "json"; suppliers: SupplierRow[]; sources: SourceRow[]; reason: string };

const DEFAULT_DATABASE_PATH = join(/* turbopackIgnore: true */ process.cwd(), "data", "odbus-subset.sqlite");
const FORCE_JSON = process.env.SOURCELOCAL_FORCE_JSON === "true";

const fallbackSuppliers: SupplierRow[] = (suppliersData as SupplierRow[]).map(normalizeSupplierRow);
const fallbackSources: SourceRow[] = sourcesData as SourceRow[];

const LIST_SEARCH_COLS = [
  "business_name",
  "brief_info",
  "tags",
  "city",
  "business_sector",
  "business_subsector",
  "naics_description",
  "source_provider",
];

const LIST_DEFAULT_FIELDS = [
  "supplier_id",
  "business_name",
  "brief_info",
  "province_code",
  "city",
  "contact_summary",
  "capacity_tier",
  "derived_naics",
  "naics_description",
  "source_provider",
  "status",
];

const DETAIL_DEFAULT_FIELDS = [
  "supplier_id",
  "business_name",
  "alt_business_name",
  "brief_info",
  "business_sector",
  "business_subsector",
  "business_description",
  "province_code",
  "province_name",
  "city",
  "csd_name",
  "full_address",
  "contact_address",
  "contact_summary",
  "contact_availability",
  "postal_code",
  "latitude",
  "longitude",
  "geo_source",
  "derived_naics",
  "source_naics_primary",
  "source_naics_secondary",
  "naics_description",
  "naics_description_secondary",
  "employee_count_raw",
  "capacity_tier",
  "licence_type",
  "licence_number",
  "business_id_no",
  "status",
  "source_provider",
  "source_dataset_count",
  "source_match_method",
];

const SQLITE_FIELD_SELECT: Record<string, string> = {
  supplier_id: "supplier_id",
  business_name: "business_name",
  alt_business_name: "alt_business_name",
  brief_info: "brief_info",
  business_sector: "business_sector",
  business_subsector: "business_subsector",
  business_description: "NULL AS business_description",
  province_code: "province_code",
  province_name: "province_name",
  city: "city",
  csd_name: "csd_name",
  full_address: "contact_address AS full_address",
  contact_address: "contact_address",
  contact_summary: "contact_summary",
  contact_availability: "contact_availability",
  postal_code: "postal_code",
  latitude: "latitude",
  longitude: "longitude",
  geo_source: "NULL AS geo_source",
  derived_naics: "derived_naics",
  source_naics_primary: "NULL AS source_naics_primary",
  source_naics_secondary: "NULL AS source_naics_secondary",
  naics_description: "naics_description",
  naics_description_secondary: "NULL AS naics_description_secondary",
  employee_count_raw: "employee_count_raw",
  capacity_tier: "capacity_tier",
  licence_type: "licence_type",
  licence_number: "NULL AS licence_number",
  business_id_no: "NULL AS business_id_no",
  status: "status",
  source_provider: "source_provider",
  source_dataset_count: "source_dataset_count",
  source_match_method: "source_match_method",
};

const SOURCE_SEARCH_COLS = ["dataset_name", "attribution_statement", "province_name", "city"];

let backendPromise: Promise<Backend> | null = null;

function getDatabasePath() {
  return process.env.DATABASE_PATH || DEFAULT_DATABASE_PATH;
}

function normalizeSupplierRow(row: SupplierRow): SupplierRow {
  const normalized = { ...row };
  if (!("full_address" in normalized) && typeof normalized.contact_address === "string") {
    normalized.full_address = normalized.contact_address;
  }
  return normalized;
}

function pickFields<T extends SupplierRow | SourceRow>(row: T, fields: string[]): T {
  const result: Record<string, unknown> = {};
  for (const field of fields) {
    if (field in row) result[field] = row[field];
  }
  return result as T;
}

function matchesToken(row: SupplierRow, token: string): boolean {
  const lower = token.toLowerCase();
  return LIST_SEARCH_COLS.some((col) => {
    const value = row[col];
    return typeof value === "string" && value.toLowerCase().includes(lower);
  });
}

function matchesSourceToken(row: SourceRow, token: string): boolean {
  const lower = token.toLowerCase();
  return SOURCE_SEARCH_COLS.some((col) => {
    const value = row[col];
    return typeof value === "string" && value.toLowerCase().includes(lower);
  });
}

function sanitizeSupplierFields(fields?: string, defaults = LIST_DEFAULT_FIELDS): string[] {
  const allowed = new Set(DETAIL_DEFAULT_FIELDS);
  if (!fields) return defaults;

  const selected = fields
    .split(",")
    .map((field) => field.trim())
    .filter((field) => allowed.has(field));

  return selected.length > 0 ? selected : defaults;
}

function buildSQLiteSelect(fields: string[]): string {
  return fields.map((field) => SQLITE_FIELD_SELECT[field] ?? field).join(", ");
}

async function getBackend(): Promise<Backend> {
  if (!backendPromise) {
    backendPromise = initializeBackend();
  }

  return backendPromise;
}

async function initializeBackend(): Promise<Backend> {
  if (FORCE_JSON) {
    return {
      kind: "json",
      suppliers: fallbackSuppliers,
      sources: fallbackSources,
      reason: "SOURCELOCAL_FORCE_JSON=true",
    };
  }

  const databasePath = getDatabasePath();
  if (!existsSync(databasePath)) {
    return {
      kind: "json",
      suppliers: fallbackSuppliers,
      sources: fallbackSources,
      reason: `SQLite file not found at ${databasePath}`,
    };
  }

  try {
    const { DatabaseSync } = await import("node:sqlite");
    const db = new DatabaseSync(databasePath);
    db.exec("PRAGMA query_only = ON");
    return { kind: "sqlite", db, databasePath };
  } catch (error) {
    return {
      kind: "json",
      suppliers: fallbackSuppliers,
      sources: fallbackSources,
      reason: `Failed to initialize SQLite backend: ${String(error)}`,
    };
  }
}

function buildSupplierWhereClause(opts: SearchOptions) {
  const clauses: string[] = [];
  const params: Record<string, string | number> = {};

  if (opts.supplier_id) {
    clauses.push("supplier_id = $supplierId");
    params.$supplierId = opts.supplier_id;
  }

  if (opts.province) {
    clauses.push("province_code = $province");
    params.$province = opts.province.toUpperCase();
  }

  if (opts.city) {
    clauses.push("lower(coalesce(city, '')) LIKE $city");
    params.$city = `%${opts.city.toLowerCase()}%`;
  }

  if (opts.capacity) {
    clauses.push("capacity_tier = $capacity");
    params.$capacity = opts.capacity;
  }

  if (opts.provider) {
    clauses.push("lower(coalesce(source_provider, '')) LIKE $provider");
    params.$provider = `%${opts.provider.toLowerCase()}%`;
  }

  if (opts.status) {
    clauses.push("status = $status");
    params.$status = opts.status;
  }

  if (opts.has_geocode) {
    clauses.push("latitude IS NOT NULL AND longitude IS NOT NULL");
  }

  if (opts.query) {
    const tokens = opts.query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    tokens.forEach((token, index) => {
      const paramName = `$query_${index}`;
      params[paramName] = `%${token}%`;
      clauses.push(
        `(${LIST_SEARCH_COLS.map((column) => `lower(coalesce(${column}, '')) LIKE ${paramName}`).join(" OR ")})`
      );
    });
  }

  if (opts.naics) {
    const naics = opts.naics.replace(/\D/g, "");
    if (naics) {
      clauses.push("CAST(derived_naics AS TEXT) LIKE $naics");
      params.$naics = `${naics}%`;
    }
  }

  return {
    whereClause: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

function buildSourceWhereClause(opts: { provider?: string; province?: string; city?: string }) {
  const clauses: string[] = [];
  const params: Record<string, string> = {};

  if (opts.provider) {
    const token = `%${opts.provider.toLowerCase()}%`;
    params.$provider = token;
    clauses.push(
      `(${SOURCE_SEARCH_COLS.map((column) => `lower(coalesce(${column}, '')) LIKE $provider`).join(" OR ")})`
    );
  }

  if (opts.province) {
    clauses.push("province_code = $province");
    params.$province = opts.province.toUpperCase();
  }

  if (opts.city) {
    clauses.push("lower(coalesce(city, '')) LIKE $city");
    params.$city = `%${opts.city.toLowerCase()}%`;
  }

  return {
    whereClause: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

export interface SearchOptions {
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

export async function searchSuppliers(opts: SearchOptions) {
  const limit = Math.min(Math.max(opts.limit || 20, 1), 500);
  const offset = Math.max(opts.offset || 0, 0);
  const requestedFields = sanitizeSupplierFields(opts.fields, LIST_DEFAULT_FIELDS);
  const backend = await getBackend();

  if (backend.kind === "sqlite") {
    const { whereClause, params } = buildSupplierWhereClause(opts);
    const countRow = backend.db
      .prepare(`SELECT COUNT(*) AS count FROM supplier_cards ${whereClause}`)
      .get(params) as { count: number };
    const rows = backend.db
      .prepare(
        `SELECT ${buildSQLiteSelect(requestedFields)}
         FROM supplier_cards
         ${whereClause}
         ORDER BY business_name
         LIMIT $limit OFFSET $offset`
      )
      .all({ ...params, $limit: limit, $offset: offset }) as SupplierRow[];

    return {
      ok: true,
      count: countRow.count,
      limit,
      offset,
      rows: rows.map(normalizeSupplierRow),
    };
  }

  let filtered = backend.suppliers;

  if (opts.supplier_id) {
    filtered = filtered.filter((row) => row.supplier_id === opts.supplier_id);
  }

  if (opts.province) {
    const province = opts.province.toUpperCase();
    filtered = filtered.filter((row) => row.province_code === province);
  }

  if (opts.city) {
    const city = opts.city.toLowerCase();
    filtered = filtered.filter(
      (row) => typeof row.city === "string" && row.city.toLowerCase().includes(city)
    );
  }

  if (opts.capacity) {
    filtered = filtered.filter((row) => row.capacity_tier === opts.capacity);
  }

  if (opts.provider) {
    const provider = opts.provider.toLowerCase();
    filtered = filtered.filter(
      (row) =>
        typeof row.source_provider === "string" &&
        row.source_provider.toLowerCase().includes(provider)
    );
  }

  if (opts.status) {
    filtered = filtered.filter((row) => row.status === opts.status);
  }

  if (opts.has_geocode) {
    filtered = filtered.filter((row) => row.latitude != null && row.longitude != null);
  }

  if (opts.query) {
    const tokens = opts.query.trim().split(/\s+/).filter(Boolean);
    filtered = filtered.filter((row) => tokens.every((token) => matchesToken(row, token)));
  }

  if (opts.naics) {
    const naics = opts.naics.replace(/\D/g, "");
    if (naics) {
      filtered = filtered.filter((row) =>
        String(row.derived_naics ?? "").startsWith(naics)
      );
    }
  }

  const count = filtered.length;
  const rows = filtered
    .slice(offset, offset + limit)
    .map((row) => pickFields(normalizeSupplierRow(row), requestedFields));

  return { ok: true, count, limit, offset, rows };
}

export async function getSupplierDetail(supplierId: string, fields?: string) {
  const requestedFields = sanitizeSupplierFields(fields, DETAIL_DEFAULT_FIELDS);
  const backend = await getBackend();

  if (backend.kind === "sqlite") {
    const row = backend.db
      .prepare(
        `SELECT ${buildSQLiteSelect(requestedFields)}
         FROM supplier_cards
         WHERE supplier_id = $supplierId
         LIMIT 1`
      )
      .get({ $supplierId: supplierId }) as SupplierRow | undefined;

    if (!row) return null;
    return { ok: true, row: normalizeSupplierRow(row) };
  }

  const row = backend.suppliers.find((entry) => entry.supplier_id === supplierId);
  if (!row) return null;
  return { ok: true, row: pickFields(normalizeSupplierRow(row), requestedFields) };
}

export async function getStats() {
  const backend = await getBackend();

  if (backend.kind === "sqlite") {
    const supplierCountRow = backend.db
      .prepare("SELECT COUNT(*) AS count FROM supplier_cards")
      .get() as { count: number };
    const sourceCountRow = backend.db
      .prepare("SELECT COUNT(*) AS count FROM sources")
      .get() as { count: number };
    const topProviders = backend.db
      .prepare(
        `SELECT source_provider, COUNT(*) AS supplier_count
         FROM supplier_cards
         WHERE source_provider IS NOT NULL AND source_provider <> ''
         GROUP BY source_provider
         ORDER BY supplier_count DESC, source_provider ASC
         LIMIT 10`
      )
      .all() as Array<{ source_provider: string; supplier_count: number }>;

    return {
      ok: true,
      stats: {
        supplier_count: supplierCountRow.count,
        source_count: sourceCountRow.count,
        top_providers: topProviders,
      },
    };
  }

  const providerCounts: Record<string, number> = {};
  for (const supplier of backend.suppliers) {
    const provider = supplier.source_provider as string;
    if (provider) providerCounts[provider] = (providerCounts[provider] || 0) + 1;
  }

  const topProviders = Object.entries(providerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([source_provider, supplier_count]) => ({ source_provider, supplier_count }));

  return {
    ok: true,
    stats: {
      supplier_count: backend.suppliers.length,
      source_count: backend.sources.length,
      top_providers: topProviders,
    },
  };
}

export async function getSources(opts: {
  provider?: string;
  province?: string;
  city?: string;
  limit?: number;
  offset?: number;
}) {
  const limit = Math.min(Math.max(opts.limit || 50, 1), 500);
  const offset = Math.max(opts.offset || 0, 0);
  const backend = await getBackend();

  if (backend.kind === "sqlite") {
    const { whereClause, params } = buildSourceWhereClause(opts);
    const countRow = backend.db
      .prepare(`SELECT COUNT(*) AS count FROM sources ${whereClause}`)
      .get(params) as { count: number };
    const rows = backend.db
      .prepare(
        `SELECT *
         FROM sources
         ${whereClause}
         ORDER BY province_name, city, dataset_name
         LIMIT $limit OFFSET $offset`
      )
      .all({ ...params, $limit: limit, $offset: offset }) as SourceRow[];

    return { ok: true, count: countRow.count, limit, offset, rows };
  }

  let filtered = backend.sources;

  if (opts.provider) {
    const provider = opts.provider.toLowerCase();
    filtered = filtered.filter((row) => matchesSourceToken(row, provider));
  }

  if (opts.province) {
    const province = opts.province.toUpperCase();
    filtered = filtered.filter((row) => row.province_code === province);
  }

  if (opts.city) {
    const city = opts.city.toLowerCase();
    filtered = filtered.filter(
      (row) => typeof row.city === "string" && row.city.toLowerCase().includes(city)
    );
  }

  const count = filtered.length;
  const rows = filtered.slice(offset, offset + limit);
  return { ok: true, count, limit, offset, rows };
}
