"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, MapPin, Layers, Menu, X, Search, RefreshCw } from "lucide-react";
import {
  searchSuppliers,
  ApiSupplier,
  PROVINCE_CODES,
  PROVINCE_CODE_LIST,
  deriveCanadianConfidence,
} from "@/lib/api";
import { useLocale } from "@/hooks/useLocale";

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-slate-100">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

function getScoreDotColor(score: number) {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function MapPageContent() {
  const { t, locale } = useLocale();
  const searchParams = useSearchParams();
  const copy =
    locale === "fr"
      ? {
          suppliers: "fournisseurs",
          toggleSidebar: "Afficher ou masquer le panneau",
          searchPlaceholder: "Rechercher des fournisseurs…",
          allProvinces: "Toutes les provinces",
          loading: "Chargement…",
          loadError: "Impossible de charger les fournisseurs",
          retry: "Réessayer",
          noResults: "Aucun fournisseur trouvé",
          legend: "Légende",
          canadianContent: "Contenu canadien",
          heatmapSoon: "La carte thermique sera disponible prochainement. Passez en mode Marqueurs pour voir les emplacements.",
          focusedSupplier: "Fournisseur ciblé",
          clearFocusedSupplier: "Effacer le fournisseur ciblé",
        }
      : {
          suppliers: "suppliers",
          toggleSidebar: "Toggle sidebar",
          searchPlaceholder: "Search suppliers…",
          allProvinces: "All Provinces",
          loading: "Loading…",
          loadError: "Failed to load suppliers",
          retry: "Retry",
          noResults: "No suppliers found",
          legend: "Legend",
          canadianContent: "Canadian Content",
          heatmapSoon: "Heatmap view is coming soon. Switch to Pins to see supplier locations.",
          focusedSupplier: "Focused supplier",
          clearFocusedSupplier: "Clear focused supplier",
        };
  const [suppliers, setSuppliers] = useState<ApiSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [supplierIdFilter, setSupplierIdFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [province, setProvince] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"pins" | "heatmap">("pins");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const supplierId = searchParams.get("supplier_id") || "";
    const query = searchParams.get("query") || "";
    const provinceParam = searchParams.get("province") || "";

    setSupplierIdFilter(supplierId);
    setSelectedId(supplierId || null);
    setSearchQuery(query);
    setProvince(provinceParam);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    async function fetchSuppliers() {
      setLoading(true);
      setError(null);
      try {
        const result = await searchSuppliers({
          supplier_id: supplierIdFilter || undefined,
          has_geocode: true,
          limit: 200,
          query: searchQuery || undefined,
          fields: [
            "supplier_id",
            "business_name",
            "brief_info",
            "province_code",
            "city",
            "capacity_tier",
            "source_provider",
            "status",
            "latitude",
            "longitude",
          ].join(","),
          province: province || undefined,
        });
        if (!cancelled) {
          setSuppliers(result.rows);
          if (supplierIdFilter && result.rows.some((row) => row.supplier_id === supplierIdFilter)) {
            setSelectedId(supplierIdFilter);
          }
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : copy.loadError);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchSuppliers();
    return () => {
      cancelled = true;
    };
  }, [copy.loadError, province, reloadKey, searchQuery, supplierIdFilter]);

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
            aria-label={copy.toggleSidebar}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-red-600" />
            <h1 className="text-sm font-semibold text-slate-900">{t("map.title")}</h1>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {loading ? "…" : suppliers.length}{" "}
            {copy.suppliers}
          </span>
        </div>

        {/* View mode toggle */}
        <div className="flex rounded-lg overflow-hidden border border-slate-200">
          <button
            onClick={() => setViewMode("pins")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === "pins"
                ? "bg-red-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <MapPin size={12} />
            {t("map.pins")}
          </button>
          <button
            onClick={() => setViewMode("heatmap")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === "heatmap"
                ? "bg-red-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Layers size={12} />
            {t("map.heatmap")}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-72 bg-white border-r border-slate-200 flex flex-col overflow-hidden shrink-0">
            {/* Search box */}
            <div className="p-3 border-b border-slate-100 shrink-0">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder={copy.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSupplierIdFilter("");
                    setSearchQuery(e.target.value);
                    setSelectedId(null);
                  }}
                  className="w-full text-sm border border-slate-200 rounded-lg pl-8 pr-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
                />
              </div>
            </div>

            {/* Province filter */}
            <div className="p-3 border-b border-slate-100 shrink-0">
              <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Filter size={10} />
                {t("filter.province")}
              </label>
              <select
                value={province}
                onChange={(e) => {
                  setSupplierIdFilter("");
                  setProvince(e.target.value);
                  setSelectedId(null);
                }}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
              >
                <option value="">{copy.allProvinces}</option>
                {PROVINCE_CODE_LIST.map((code) => (
                  <option key={code} value={code}>
                    {PROVINCE_CODES[code]}
                  </option>
                ))}
              </select>
            </div>

            {supplierIdFilter && (
              <div className="px-3 py-2 border-b border-slate-100">
                <button
                  onClick={() => {
                    setSupplierIdFilter("");
                    setSelectedId(null);
                    setReloadKey((value) => value + 1);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-maple/10 text-maple rounded-full border border-maple/20 hover:bg-maple/15 transition-colors"
                  aria-label={copy.clearFocusedSupplier}
                >
                  {copy.focusedSupplier}
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Supplier list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-6 flex flex-col items-center justify-center text-slate-400">
                  <div className="w-7 h-7 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm">{copy.loading}</p>
                </div>
              ) : error ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-red-500 mb-3">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      setReloadKey((value) => value + 1);
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 mx-auto"
                  >
                    <RefreshCw size={12} />
                    {copy.retry}
                  </button>
                </div>
              ) : suppliers.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400">
                  {copy.noResults}
                </div>
              ) : (
                suppliers.map((supplier) => {
                  const { score } = deriveCanadianConfidence(supplier);
                  const isSelected = selectedId === supplier.supplier_id;
                  return (
                    <button
                      key={supplier.supplier_id}
                      onClick={() =>
                        setSelectedId(isSelected ? null : supplier.supplier_id)
                      }
                      className={`w-full text-left px-3 py-2.5 border-b border-slate-100 transition-colors border-l-2 ${
                        isSelected
                          ? "bg-blue-50 border-l-blue-500"
                          : "border-l-transparent hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate leading-snug">
                            {supplier.business_name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {[supplier.city, supplier.province_code]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                          {supplier.capacity_tier && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {supplier.capacity_tier}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div
                            className={`w-2 h-2 rounded-full ${getScoreDotColor(score)}`}
                          />
                          <span className="text-xs font-semibold text-slate-600">
                            {score}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Legend */}
            <div className="p-3 border-t border-slate-100 shrink-0 bg-slate-50">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {copy.legend}
              </p>
              <div className="space-y-1">
                {[
                  { label: "70–100", color: "bg-emerald-500" },
                  { label: "50–69", color: "bg-amber-500" },
                  { label: "0–49", color: "bg-red-500" },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color} shrink-0`} />
                    <span className="text-xs text-slate-500">
                      {copy.canadianContent} {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Map area */}
        <div className="flex-1 relative overflow-hidden">
          {viewMode === "heatmap" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="text-center text-slate-400 max-w-xs">
                <Layers size={48} className="mx-auto mb-4 opacity-30" />
                <p className="font-semibold text-slate-600 mb-1">
                  {t("map.heatmap")}
                </p>
                <p className="text-sm">
                  {copy.heatmapSoon}
                </p>
                <button
                  onClick={() => setViewMode("pins")}
                  className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t("map.pins")}
                </button>
              </div>
            </div>
          ) : (
            <MapView
              suppliers={suppliers}
              locale={locale}
              selectedSupplierId={selectedId}
              onSupplierClick={(id) =>
                setSelectedId(selectedId === id ? null : id)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center bg-slate-100" style={{ height: "calc(100vh - 64px)" }}>
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MapPageContent />
    </Suspense>
  );
}
