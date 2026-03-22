#!/usr/bin/env node
/**
 * Export SQLite data to JSON for Vercel deployment.
 * JSON files are properly traced by the Next.js bundler.
 */
import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "odbus-subset.sqlite");
const OUT_DIR = path.join(process.cwd(), "src", "data");

async function main() {
  console.log(`Reading database from: ${DB_PATH}`);
  const SQL = await initSqlJs();
  const buffer = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(buffer);

  // Export suppliers
  const suppliersStmt = db.prepare("SELECT * FROM supplier_cards LIMIT 10000");
  const suppliers = [];
  while (suppliersStmt.step()) {
    suppliers.push(suppliersStmt.getAsObject());
  }
  suppliersStmt.free();
  console.log(`Exported ${suppliers.length} suppliers`);

  // Export sources
  const sourcesStmt = db.prepare("SELECT * FROM sources");
  const sources = [];
  while (sourcesStmt.step()) {
    sources.push(sourcesStmt.getAsObject());
  }
  sourcesStmt.free();
  console.log(`Exported ${sources.length} sources`);

  // Write JSON files
  fs.writeFileSync(
    path.join(OUT_DIR, "suppliers-db.json"),
    JSON.stringify(suppliers)
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "sources-db.json"),
    JSON.stringify(sources)
  );

  const suppSize = (fs.statSync(path.join(OUT_DIR, "suppliers-db.json")).size / 1024 / 1024).toFixed(1);
  console.log(`Written suppliers-db.json (${suppSize} MB)`);
  console.log(`Written sources-db.json`);

  db.close();
}

main().catch(console.error);
