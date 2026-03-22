import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  localizeTariffError,
  localizeTariffRateText,
  normalizeTariffLocale,
  type TariffLocale,
} from "@/lib/tariff/messages";
import { getTreatmentCode } from "@/lib/tariff/treatments";
import type { TariffLookupResponse, TariffMatchCandidate, TariffRate, TariffResolution } from "@/types/tariff";

interface TariffRow {
  baseCode: string;
  suffix: string;
  description: string;
  generalRateText: string;
  specialRateText: string;
}

const chapterRowsCache = new Map<string, Promise<TariffRow[]>>();
const CBSA_TARIFF_YEAR = process.env.CBSA_TARIFF_YEAR || "2026";
let snapshotRowsPromise: Promise<TariffRow[] | null> | null = null;

function decodeHtml(input: string) {
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

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatTariffLabel(baseCode: string, suffix: string) {
  return suffix ? `${baseCode}.${suffix}` : baseCode;
}

function parseTariffRate(rateText: string, locale: TariffLocale): TariffRate {
  if (/^free$/i.test(rateText)) {
    return { kind: "free", text: localizeTariffRateText("Free", locale), percent: 0 };
  }

  const simplePercentMatch = rateText.match(/^([0-9]+(?:\.[0-9]+)?)%$/);
  if (simplePercentMatch) {
    return {
      kind: "ad_valorem",
      text: rateText,
      percent: Number(simplePercentMatch[1]),
    };
  }

  return {
    kind: "complex",
    text: rateText,
    percent: null,
  };
}

function parseSpecialRates(rateText: string) {
  const rates = new Map<string, string>();
  for (const segment of rateText.split(/\n+/).map((entry) => entry.trim()).filter(Boolean)) {
    const [codesPart, valuePart] = segment.split(/:\s*/, 2);
    if (!codesPart || !valuePart) continue;

    for (const code of codesPart.split(",").map((entry) => entry.trim()).filter(Boolean)) {
      rates.set(code, valuePart.trim());
    }
  }
  return rates;
}

async function fetchChapterRows(chapter: string): Promise<TariffRow[]> {
  const existing = chapterRowsCache.get(chapter);
  if (existing) return existing;

  const promise = (async () => {
    const snapshotRows = await readSnapshotRows();
    if (snapshotRows) {
      const filtered = snapshotRows.filter((row) => digitsOnly(row.baseCode).startsWith(chapter));
      if (filtered.length > 0) {
        return filtered;
      }
    }

    const chapterUrl = `https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/${CBSA_TARIFF_YEAR}/html/00/ch${chapter}-eng.html`;
    const response = await fetch(chapterUrl, {
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      throw new Error(`CBSA chapter lookup failed for chapter ${chapter}: ${response.status}`);
    }

    const html = await response.text();
    const rows: TariffRow[] = [];

    for (const rowMatch of html.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)) {
      const cells = [...rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((match) => decodeHtml(match[1]));
      if (cells.length !== 6) continue;

      const [baseCode, suffix, description, _unit, generalRateText, specialRateText] = cells;
      const baseDigits = digitsOnly(baseCode);
      const suffixDigits = digitsOnly(suffix);

      if (baseDigits.length < 6) continue;
      if (!generalRateText && !specialRateText) continue;

      rows.push({
        baseCode,
        suffix: suffixDigits,
        description,
        generalRateText,
        specialRateText,
      });
    }

    return rows;
  })();

  chapterRowsCache.set(chapter, promise);
  return promise;
}

async function readSnapshotRows(): Promise<TariffRow[] | null> {
  if (!snapshotRowsPromise) {
    snapshotRowsPromise = (async () => {
      const snapshotPath = path.join(
        process.cwd(),
        "src",
        "data",
        "tariffs",
        `cbsa-tariff-snapshot-${CBSA_TARIFF_YEAR}.json`
      );

      try {
        const raw = await readFile(snapshotPath, "utf8");
        const payload = JSON.parse(raw) as {
          rows?: Array<{
            baseCode?: string;
            suffix?: string;
            description?: string;
            generalRateText?: string;
            specialRateText?: string;
          }>;
        };

        return (payload.rows ?? [])
          .filter((row) => row.baseCode && row.description && row.generalRateText != null)
          .map((row) => ({
            baseCode: row.baseCode ?? "",
            suffix: row.suffix ?? "",
            description: row.description ?? "",
            generalRateText: row.generalRateText ?? "",
            specialRateText: row.specialRateText ?? "",
          }));
      } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
          return null;
        }
        throw error;
      }
    })();
  }

  return snapshotRowsPromise;
}

function toCandidate(
  row: TariffRow,
  treatment: ReturnType<typeof getTreatmentCode>,
  locale: TariffLocale
): TariffMatchCandidate {
  const specialRates = parseSpecialRates(row.specialRateText);
  const rateText = treatment === "MFN" ? row.generalRateText : specialRates.get(treatment) ?? row.generalRateText;
  const label = formatTariffLabel(row.baseCode, row.suffix);

  return {
    code: digitsOnly(row.baseCode) + row.suffix,
    label,
    description: row.description,
    treatment,
    rateText: localizeTariffRateText(rateText, locale),
  };
}

function toResolution(match: TariffMatchCandidate, chapterUrl: string, locale: TariffLocale): TariffResolution {
  return {
    code: match.code,
    label: match.label,
    description: match.description,
    treatment: match.treatment,
    rate: parseTariffRate(match.rateText, locale),
    source: "CBSA",
    chapterUrl,
  };
}

export async function lookupTariffMatches(
  hsCodeInput: string,
  originCountry: string,
  claimPreference?: boolean,
  locale?: TariffLocale
) {
  const resolvedLocale = normalizeTariffLocale(locale);
  const hsDigits = digitsOnly(hsCodeInput);
  if (hsDigits.length < 6) {
    return {
      ok: false as const,
      error: localizeTariffError("Enter at least a 6-digit HS code.", resolvedLocale),
    };
  }

  const chapter = hsDigits.slice(0, 2);
  const chapterUrl = `https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/${CBSA_TARIFF_YEAR}/html/00/ch${chapter}-eng.html`;
  const rows = await fetchChapterRows(chapter);
  const treatment = getTreatmentCode(originCountry, claimPreference);
  const leafRows = rows.filter((row) => digitsOnly(row.baseCode).length >= 8);

  const matches = leafRows
    .filter((row) => {
      const baseDigits = digitsOnly(row.baseCode);
      const fullDigits = `${baseDigits}${row.suffix}`;
      return (
        baseDigits === hsDigits ||
        fullDigits === hsDigits ||
        baseDigits.startsWith(hsDigits) ||
        fullDigits.startsWith(hsDigits)
      );
    })
    .map((row) => toCandidate(row, treatment, resolvedLocale))
    .slice(0, 20);

  if (matches.length === 0) {
    return {
      ok: false as const,
      error: localizeTariffError(`No CBSA tariff item match found for ${hsCodeInput}.`, resolvedLocale),
    };
  }

  const exactMatch = matches.find((match) => match.code === hsDigits || digitsOnly(match.label) === hsDigits) ?? null;

  return {
    ok: true as const,
    query: hsDigits,
    treatment,
    chapterUrl,
    matches,
    exactMatch,
  };
}

export async function resolveTariff(
  hsCodeInput: string,
  originCountry: string,
  claimPreference?: boolean,
  locale?: TariffLocale
): Promise<{ ok: true; tariff: TariffResolution } | { ok: false; error: string; matches?: TariffMatchCandidate[] }> {
  const resolvedLocale = normalizeTariffLocale(locale);
  const lookup = await lookupTariffMatches(hsCodeInput, originCountry, claimPreference, resolvedLocale);

  if (!lookup.ok) {
    return lookup;
  }

  if (lookup.exactMatch) {
    return {
      ok: true,
      tariff: toResolution(lookup.exactMatch, lookup.chapterUrl, resolvedLocale),
    };
  }

  if (lookup.matches.length === 1) {
    return {
      ok: true,
      tariff: toResolution(lookup.matches[0], lookup.chapterUrl, resolvedLocale),
    };
  }

  return {
    ok: false,
    error: localizeTariffError("The HS code is ambiguous. Pick a more specific tariff item.", resolvedLocale),
    matches: lookup.matches.slice(0, 12),
  };
}

export async function lookupTariffResponse(
  hsCodeInput: string,
  originCountry: string,
  claimPreference?: boolean,
  locale?: TariffLocale
): Promise<TariffLookupResponse> {
  const resolvedLocale = normalizeTariffLocale(locale);
  const lookup = await lookupTariffMatches(hsCodeInput, originCountry, claimPreference, resolvedLocale);

  if (!lookup.ok) {
    return lookup;
  }

  return {
    ok: true,
    query: lookup.query,
    treatment: lookup.treatment,
    chapterUrl: lookup.chapterUrl,
    matches: lookup.matches.slice(0, 12),
    exactMatch: lookup.exactMatch ? toResolution(lookup.exactMatch, lookup.chapterUrl, resolvedLocale) : null,
  };
}
