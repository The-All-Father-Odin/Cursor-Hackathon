#!/usr/bin/env node
import fs from "fs";
import path from "path";

const YEAR = process.env.CBSA_TARIFF_YEAR || "2026";
const chapterArg = process.argv.find((entry) => entry.startsWith("--chapters="));
const requestedChapters = chapterArg
  ? chapterArg.split("=")[1].split(",").map((entry) => entry.trim().padStart(2, "0")).filter(Boolean)
  : Array.from({ length: 99 }, (_, index) => String(index + 1).padStart(2, "0"));

function decodeHtml(input) {
  return input
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&rsquo;/gi, "'")
    .replace(/&ldquo;/gi, '"')
    .replace(/&rdquo;/gi, '"')
    .replace(/&ndash;/gi, "-")
    .replace(/&mdash;/gi, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function digitsOnly(value) {
  return value.replace(/\D/g, "");
}

async function fetchChapter(chapter) {
  const url = `https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/${YEAR}/html/00/ch${chapter}-eng.html`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch chapter ${chapter}: ${response.status}`);
  }

  const html = await response.text();
  const rows = [];

  for (const rowMatch of html.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((match) => decodeHtml(match[1]));
    if (cells.length !== 6) continue;

    const [baseCode, suffix, description, unit, generalRateText, specialRateText] = cells;
    const baseDigits = digitsOnly(baseCode);
    const suffixDigits = digitsOnly(suffix);
    if (baseDigits.length < 8) continue;

    rows.push({
      chapter,
      code: `${baseDigits}${suffixDigits}`,
      label: suffixDigits ? `${baseCode}.${suffixDigits}` : baseCode,
      baseCode,
      suffix: suffixDigits,
      description,
      unit,
      generalRateText,
      specialRateText,
      chapterUrl: url,
    });
  }

  return { chapter, url, rowCount: rows.length, rows };
}

async function main() {
  console.log(`Fetching CBSA tariff chapters for ${YEAR}...`);
  const chapterResults = [];
  const rows = [];

  for (const chapter of requestedChapters) {
    const result = await fetchChapter(chapter);
    chapterResults.push({ chapter: result.chapter, url: result.url, rowCount: result.rowCount });
    rows.push(...result.rows);
    console.log(`Chapter ${chapter}: ${result.rowCount} rows`);
  }

  const output = {
    generatedAt: new Date().toISOString(),
    sourceYear: Number(YEAR),
    chapters: chapterResults,
    rows,
  };

  const outDir = path.join(process.cwd(), "src", "data", "tariffs");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `cbsa-tariff-snapshot-${YEAR}.json`);
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Wrote ${rows.length} rows to ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
