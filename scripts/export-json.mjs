#!/usr/bin/env node
/**
 * Export SQLite data to JSON for deployment fallbacks.
 *
 * Defaults to a 10k supplier snapshot to keep the JSON bundle smaller.
 * Override with EXPORT_SUPPLIERS_LIMIT=all (or 0) to export the full dataset.
 */
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const DB_PATH =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "odbus-subset.sqlite");
const OUT_DIR = path.join(process.cwd(), "src", "data");

function parseSupplierLimit() {
  const raw = (process.env.EXPORT_SUPPLIERS_LIMIT || "10000").trim().toLowerCase();
  if (raw === "all" || raw === "0") return null;

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Invalid EXPORT_SUPPLIERS_LIMIT: ${process.env.EXPORT_SUPPLIERS_LIMIT}`);
  }

  return parsed;
}

function main() {
  const supplierLimit = parseSupplierLimit();
  const db = new DatabaseSync(DB_PATH);
  const supplierLimitClause = supplierLimit == null ? "" : ` LIMIT ${supplierLimit}`;

  console.log(`Reading database from: ${DB_PATH}`);
  console.log(
    `Supplier export limit: ${supplierLimit == null ? "all rows" : supplierLimit.toLocaleString()}`
  );

  const totalSupplierCount = db
    .prepare("SELECT COUNT(*) AS count FROM supplier_cards")
    .get().count;
  const suppliers = db
    .prepare(
      `SELECT *
       FROM supplier_cards
       ORDER BY business_name${supplierLimitClause}`
    )
    .all();
  const sources = db
    .prepare(
      `SELECT *
       FROM sources
       ORDER BY province_name, city, dataset_name`
    )
    .all();

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(path.join(OUT_DIR, "suppliers-db.json"), JSON.stringify(suppliers));
  writeFileSync(path.join(OUT_DIR, "sources-db.json"), JSON.stringify(sources));

  const suppliersSizeMb = (
    statSync(path.join(OUT_DIR, "suppliers-db.json")).size /
    1024 /
    1024
  ).toFixed(1);
  const sourcesSizeMb = (
    statSync(path.join(OUT_DIR, "sources-db.json")).size /
    1024 /
    1024
  ).toFixed(1);

  console.log(
    `Written suppliers-db.json (${suppliers.length.toLocaleString()} of ${totalSupplierCount.toLocaleString()} suppliers, ${suppliersSizeMb} MB)`
  );
  console.log(
    `Written sources-db.json (${sources.length.toLocaleString()} rows, ${sourcesSizeMb} MB)`
  );

  db.close();
}

main();
