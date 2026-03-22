"use client";

import { useState } from "react";
import { mockTariffComparisons } from "@/data/mock-suppliers";
import { useLocale } from "@/hooks/useLocale";
import { TariffComparison } from "@/types/supplier";
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Package,
  Globe,
  Ship,
  Scale,
  ChevronDown,
  Leaf,
} from "lucide-react";

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-CA")}`;
}

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    "United States": "🇺🇸",
    China: "🇨🇳",
    Mexico: "🇲🇽",
    "European Union": "🇪🇺",
  };
  return flags[country] ?? "🌍";
}

function TariffCard({ comparison }: { comparison: TariffComparison }) {
  const {
    productName,
    hsCode,
    originCountry,
    mfnTariffRate,
    estimatedDuty,
    estimatedFreight,
    importedLandedCost,
    canadianEstimatedPrice,
    savings,
    savingsPercent,
  } = comparison;

  const isSavings = savings > 0;
  const basePrice = importedLandedCost - estimatedDuty - estimatedFreight;

  // Stacked bar segments as % of imported total
  const basePercent = (basePrice / importedLandedCost) * 100;
  const dutyPercent = (estimatedDuty / importedLandedCost) * 100;
  const freightPercent = (estimatedFreight / importedLandedCost) * 100;

  // Comparison bars relative to the higher cost
  const maxCost = Math.max(importedLandedCost, canadianEstimatedPrice);
  const importedBarWidth = (importedLandedCost / maxCost) * 100;
  const canadianBarWidth = (canadianEstimatedPrice / maxCost) * 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Card header */}
      <div className="p-5 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md tracking-wide">
                HS {hsCode}
              </span>
              <span className="text-xs bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {getCountryFlag(originCountry)} {originCountry}
              </span>
              <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md">
                MFN {mfnTariffRate}%
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 text-base leading-snug">
              {productName}
            </h3>
          </div>

          {/* Savings badge */}
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold shrink-0 ${
              isSavings
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {isSavings ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            <span>
              {isSavings ? "+" : ""}
              {formatCurrency(Math.abs(savings))}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Cost breakdown stacked bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <Package className="w-3.5 h-3.5" />
              Imported Cost Breakdown
            </span>
            <span className="text-sm font-bold text-slate-900">
              {formatCurrency(importedLandedCost)}
            </span>
          </div>
          <div className="h-8 rounded-lg overflow-hidden flex w-full">
            <div
              className="bg-slate-300 flex items-center justify-center transition-all duration-500"
              style={{ width: `${basePercent}%` }}
              title={`Base: ${formatCurrency(basePrice)}`}
            >
              {basePercent > 20 && (
                <span className="text-[10px] font-medium text-slate-700 truncate px-1">
                  {formatCurrency(basePrice)}
                </span>
              )}
            </div>
            <div
              className="bg-amber-400 flex items-center justify-center transition-all duration-500"
              style={{ width: `${dutyPercent}%` }}
              title={`Duty: ${formatCurrency(estimatedDuty)}`}
            >
              {dutyPercent > 10 && (
                <span className="text-[10px] font-medium text-amber-900 truncate px-1">
                  {formatCurrency(estimatedDuty)}
                </span>
              )}
            </div>
            <div
              className="bg-blue-400 flex items-center justify-center transition-all duration-500"
              style={{ width: `${freightPercent}%` }}
              title={`Freight: ${formatCurrency(estimatedFreight)}`}
            >
              {freightPercent > 8 && (
                <span className="text-[10px] font-medium text-blue-900 truncate px-1">
                  {formatCurrency(estimatedFreight)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 inline-block" />
              Base price
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />
              Duty ({mfnTariffRate}%)
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block" />
              Freight
            </span>
          </div>
        </div>

        {/* Side-by-side comparison bars */}
        <div className="space-y-3">
          {/* Imported */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Ship className="w-3.5 h-3.5" />
                Imported Landed Cost
              </span>
              <span className="text-sm font-bold text-slate-700">
                {formatCurrency(importedLandedCost)}
              </span>
            </div>
            <div className="h-5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${importedBarWidth}%` }}
              />
            </div>
          </div>

          {/* Canadian */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-maple" />
                Canadian Alternative
              </span>
              <span
                className={`text-sm font-bold ${isSavings ? "text-emerald-700" : "text-red-700"}`}
              >
                {formatCurrency(canadianEstimatedPrice)}
              </span>
            </div>
            <div className="h-5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out delay-100 ${
                  isSavings ? "bg-maple" : "bg-red-400"
                }`}
                style={{ width: `${canadianBarWidth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Summary row */}
        <div
          className={`flex items-center justify-between p-3 rounded-xl ${
            isSavings
              ? "bg-emerald-50 border border-emerald-100"
              : "bg-red-50 border border-red-100"
          }`}
        >
          <span
            className={`text-sm font-medium ${isSavings ? "text-emerald-800" : "text-red-800"}`}
          >
            {isSavings ? "Buying Canadian saves" : "Buying Canadian costs more"}
          </span>
          <span
            className={`text-sm font-bold flex items-center gap-1.5 ${
              isSavings ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {isSavings ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            {formatCurrency(Math.abs(savings))} ({Math.abs(savingsPercent).toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TariffsPageContent() {
  const { t } = useLocale();
  const [productQuery, setProductQuery] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [showResults, setShowResults] = useState(true);

  const cheaperCount = mockTariffComparisons.filter((c) => c.savings > 0).length;
  const totalCount = mockTariffComparisons.length;
  const totalSavings = mockTariffComparisons
    .filter((c) => c.savings > 0)
    .reduce((sum, c) => sum + c.savings, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-maple/10 rounded-2xl shrink-0">
              <Scale className="w-6 h-6 text-maple" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                {t("tariff.title")}
              </h1>
              <p className="text-slate-500 text-base max-w-2xl leading-relaxed">
                {t("tariff.description")} Compare the full landed cost — including
                duties and freight — against estimated Canadian alternative pricing.
              </p>
            </div>
          </div>

          {/* Disclaimer banner */}
          <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Directional estimates only</p>
              <p className="text-sm text-amber-700 mt-0.5">{t("tariff.disclaimer")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Input form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2">
            <Package className="w-4 h-4 text-slate-400" />
            Look up a product you import
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Product name */}
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">
                {t("tariff.product")}
              </label>
              <input
                type="text"
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                placeholder="e.g. stainless steel bolts"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Origin country */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">
                {t("tariff.origin")}
              </label>
              <div className="relative">
                <select
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select country...</option>
                  <option value="us">🇺🇸 United States</option>
                  <option value="cn">🇨🇳 China</option>
                  <option value="mx">🇲🇽 Mexico</option>
                  <option value="eu">🇪🇺 European Union</option>
                  <option value="other">🌍 Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* HS Code */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">
                {t("tariff.hsCode")}{" "}
                <span className="normal-case text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={hsCode}
                onChange={(e) => setHsCode(e.target.value)}
                placeholder="e.g. 7318.15"
                className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-maple focus:ring-2 focus:ring-maple/10 outline-none transition-all placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-400 mt-1">
                6-digit Harmonized System code
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing sample data from CBSA tariff schedules and Canadian supplier estimates.
            </p>
            <button
              onClick={() => setShowResults(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-maple text-white text-sm font-semibold rounded-xl hover:bg-maple-dark active:scale-95 transition-all shadow-sm"
            >
              <DollarSign className="w-4 h-4" />
              {t("tariff.calculate")}
            </button>
          </div>
        </div>

        {/* Summary stats */}
        {showResults && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <TrendingDown className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-800">
                  {cheaperCount} of {totalCount}
                </p>
                <p className="text-sm text-emerald-700 leading-tight">
                  products cheaper when sourced Canadian
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 bg-maple/10 rounded-xl flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-maple" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(totalSavings)}
                </p>
                <p className="text-sm text-slate-500 leading-tight">
                  potential savings across all products
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {[...new Set(mockTariffComparisons.map((c) => c.originCountry))].length}
                </p>
                <p className="text-sm text-slate-500 leading-tight">
                  import countries compared
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results grid */}
        {showResults && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-800">
                Cost Comparisons
              </h2>
              <span className="text-sm text-slate-400">
                {totalCount} products analyzed
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {mockTariffComparisons.map((comparison, i) => (
                <div
                  key={comparison.hsCode + i}
                  className="animate-[fadeInUp_0.4s_ease-out_both]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <TariffCard comparison={comparison} />
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="mt-8 flex items-start gap-2.5 bg-slate-100 rounded-xl p-4">
              <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                All tariff rates reflect MFN (Most Favoured Nation) rates from the CBSA Customs
                Tariff Schedule. Preferential rates (CUSMA/USMCA, CPTPP, CETA) may apply — consult
                your trade advisor. Freight estimates are directional only. Canadian pricing is
                estimated from category benchmarks and claimed supplier profiles.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
