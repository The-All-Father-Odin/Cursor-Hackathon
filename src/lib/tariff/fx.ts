import type { FxQuote } from "@/types/tariff";

const FX_SERIES_BY_CURRENCY: Record<string, string> = {
  USD: "FXUSDCAD",
  EUR: "FXEURCAD",
  CNY: "FXCNYCAD",
  MXN: "FXMXNCAD",
};

interface BankOfCanadaObservation {
  d?: string;
  [series: string]: { v?: string } | string | undefined;
}

export async function getCadFxRate(currency: string): Promise<FxQuote> {
  const normalizedCurrency = currency.trim().toUpperCase();

  if (normalizedCurrency === "CAD") {
    return {
      source: "Bank of Canada",
      series: "CAD",
      rate: 1,
      asOf: new Date().toISOString().slice(0, 10),
    };
  }

  const series = FX_SERIES_BY_CURRENCY[normalizedCurrency];
  if (!series) {
    throw new Error(`Unsupported invoice currency: ${currency}`);
  }

  const response = await fetch(`https://www.bankofcanada.ca/valet/observations/${series}/json`, {
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) {
    throw new Error(`Bank of Canada FX lookup failed: ${response.status}`);
  }

  const payload = (await response.json()) as { observations?: BankOfCanadaObservation[] };
  const latest = payload.observations?.filter((entry) => {
    const value = entry[series];
    return typeof value === "object" && value !== null && typeof value.v === "string";
  }).at(-1);

  const rawValue = latest?.[series];
  const rate = typeof rawValue === "object" && rawValue !== null ? Number(rawValue.v) : NaN;

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`Bank of Canada FX data missing for ${currency}`);
  }

  return {
    source: "Bank of Canada",
    series,
    rate,
    asOf: latest?.d ?? new Date().toISOString().slice(0, 10),
  };
}
