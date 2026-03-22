"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  ExternalLink,
  Bookmark,
  ChevronDown,
  X,
  SlidersHorizontal,
  AlertCircle,
  Package,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { useShortlists } from "@/hooks/useShortlists";
import {
  searchSuppliers,
  ApiSupplier,
  PROVINCE_CODE_LIST,
  deriveCanadianConfidence,
  SearchParams,
} from "@/lib/api";
import { getCapacityTierLabel, getProvinceLabel } from "@/lib/i18n";
import { buildReturnToPath, buildSupplierProfilePath } from "@/lib/navigation";
import { shortlistSupplierFromApi } from "@/lib/shortlists";
import { CanadianContentBadge } from "@/components/ui/CanadianContentBadge";
import { CapacityBadge } from "@/components/ui/CapacityBadge";
import SearchPageSkeleton from "@/components/search/SearchPageSkeleton";

const LIMIT = 20;

interface FilterPanelProps {
  locale: "en" | "fr";
  province: string;
  capacity: string;
  onProvinceChange: (v: string) => void;
  onCapacityChange: (v: string) => void;
  onClear: () => void;
  t: (key: string) => string;
}

function FilterPanel({
  locale,
  province,
  capacity,
  onProvinceChange,
  onCapacityChange,
  onClear,
  t,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      {/* Province */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {t("filter.province")}
        </label>
        <div className="relative">
          <select
            value={province}
            onChange={(e) => onProvinceChange(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-maple/20 focus:border-maple"
          >
            <option value="">{t("filter.province.all")}</option>
            {PROVINCE_CODE_LIST.map((code) => (
              <option key={code} value={code}>
                {getProvinceLabel(code, locale)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Capacity */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {t("filter.capacity")}
        </label>
        <div className="relative">
          <select
            value={capacity}
            onChange={(e) => onCapacityChange(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-maple/20 focus:border-maple"
          >
            <option value="">{t("filter.capacity.all")}</option>
            <option value="Small">{getCapacityTierLabel("Small", locale)}</option>
            <option value="Medium">{getCapacityTierLabel("Medium", locale)}</option>
            <option value="Large">{getCapacityTierLabel("Large", locale)}</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Clear */}
      <div className="pt-2">
        <button
          onClick={onClear}
          className="w-full px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          {t("filter.clear")}
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden animate-pulse">
      <div className="p-5 pb-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
        </div>
        <div className="h-3 bg-slate-100 rounded w-1/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
      </div>
      <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 h-10" />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status.toLowerCase() === "active";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
        isActive
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60"
          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200/60"
      }`}
    >
      {status}
    </span>
  );
}

function SearchContent() {
  const { t, getLocalePath, locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const copy =
    locale === "fr"
      ? {
          loading: "Chargement…",
          showing: "Affichage",
          of: "sur",
          failedToLoad: "Impossible de charger les fournisseurs",
          retry: "Réessayer",
          source: "Source",
          previous: "Précédent",
          next: "Suivant",
          page: "Page",
          industryFilter: "Filtre d'industrie",
          clearIndustryFilter: "Effacer le filtre d'industrie",
        }
      : {
          loading: "Loading…",
          showing: "Showing",
          of: "of",
          failedToLoad: "Failed to load suppliers",
          retry: "Retry",
          source: "Source",
          previous: "Previous",
          next: "Next",
          page: "Page",
          industryFilter: "Industry filter",
          clearIndustryFilter: "Clear industry filter",
        };
  const searchParams = useSearchParams();
  const syncingFromUrlRef = useRef(true);
  const supplierReturnTo = buildReturnToPath("/search", searchParams.toString());
  const { isShortlisted, toggleDefaultSupplier } = useShortlists();

  const [query, setQuery] = useState("");
  const [naics, setNaics] = useState("");
  const [province, setProvince] = useState("");
  const [capacity, setCapacity] = useState("");
  const [page, setPage] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [suppliers, setSuppliers] = useState<ApiSupplier[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill query from URL params
  useEffect(() => {
    syncingFromUrlRef.current = true;

    const pageParam = Number.parseInt(searchParams.get("page") || "1", 10);
    const nextPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam - 1 : 0;

    setNaics(searchParams.get("naics") || searchParams.get("category") || "");
    setQuery(searchParams.get("q") || searchParams.get("query") || "");
    setProvince(searchParams.get("province") || "");
    setCapacity(searchParams.get("capacity") || "");
    setPage(nextPage);
  }, [searchParams]);

  // Keep URL in sync with current search state
  useEffect(() => {
    if (syncingFromUrlRef.current) {
      syncingFromUrlRef.current = false;
      return;
    }

    const nextParams = new URLSearchParams();
    if (query) nextParams.set("query", query);
    if (naics) nextParams.set("naics", naics);
    if (province) nextParams.set("province", province);
    if (capacity) nextParams.set("capacity", capacity);
    if (page > 0) nextParams.set("page", String(page + 1));

    const nextQueryString = nextParams.toString();
    const currentQueryString = searchParams.toString();
    const nextUrl = nextQueryString ? `${pathname}?${nextQueryString}` : pathname;
    const currentUrl = currentQueryString ? `${pathname}?${currentQueryString}` : pathname;

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [capacity, naics, page, pathname, province, query, router, searchParams]);

  // Fetch whenever filters or page change
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params: SearchParams = {
          query: query || undefined,
          naics: naics || undefined,
          province: province || undefined,
          capacity: capacity || undefined,
          limit: LIMIT,
          offset: page * LIMIT,
        };
        const result = await searchSuppliers(params);
        if (!cancelled) {
          setSuppliers(result.rows);
          setTotalCount(result.count);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : copy.failedToLoad);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [capacity, copy.failedToLoad, naics, page, province, query, reloadKey]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    // Effect re-runs because query is already updated via controlled input
  };

  const handleClearFilters = () => {
    setNaics("");
    setProvince("");
    setCapacity("");
    setPage(0);
  };

  const totalPages = Math.ceil(totalCount / LIMIT);
  const startIndex = page * LIMIT + 1;
  const endIndex = Math.min((page + 1) * LIMIT, totalCount);

  const filterPanelProps = {
    locale,
    province,
    capacity,
    onProvinceChange: (v: string) => { setProvince(v); setPage(0); },
    onCapacityChange: (v: string) => { setCapacity(v); setPage(0); },
    onClear: handleClearFilters,
    t,
  };

  return (
    <div className="min-h-screen bg-snow">
      {/* Search Bar */}
      <div className="bg-white border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(0); }}
                placeholder={t("search.placeholder")}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maple/20 focus:border-maple focus:bg-white transition-all text-base"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-maple text-white font-medium rounded-xl hover:bg-maple-dark transition-colors shadow-sm flex items-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">{t("search.button")}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden px-4 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">{t("search.filters")}</span>
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-700">{t("search.filters")}</h2>
              </div>
              <FilterPanel {...filterPanelProps} />
            </div>
          </aside>

          {/* Results area */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-slate-600">
                  {loading ? (
                    <span className="text-slate-400">{copy.loading}</span>
                  ) : totalCount > 0 ? (
                    <>
                      {copy.showing}{" "}
                      <span className="font-semibold text-slate-900">
                        {startIndex}–{endIndex}
                      </span>{" "}
                      {copy.of}{" "}
                      <span className="font-semibold text-slate-900">{totalCount.toLocaleString()}</span>{" "}
                      {t("search.results")}
                    </>
                  ) : (
                    !error && <span className="text-slate-400">{t("search.noResults")}</span>
                  )}
                </p>
                {naics && (
                  <button
                    onClick={() => {
                      setNaics("");
                      setPage(0);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-maple/10 text-maple rounded-full border border-maple/20 hover:bg-maple/15 transition-colors"
                    aria-label={copy.clearIndustryFilter}
                  >
                    {copy.industryFilter}: {naics}
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Error state */}
            {error && (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200/60 mb-4">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-700 mb-1">{copy.failedToLoad}</h3>
                <p className="text-sm text-slate-500 mb-4 text-center max-w-sm">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setReloadKey((value) => value + 1);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-maple border border-maple/30 rounded-lg hover:bg-maple/5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {copy.retry}
                </button>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && suppliers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200/60">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Package className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  {t("search.noResults")}
                </h3>
                <p className="text-sm text-slate-500 text-center max-w-sm">
                  {t("search.noResults.suggestion")}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 px-4 py-2 text-sm font-medium text-maple border border-maple/30 rounded-lg hover:bg-maple/5 transition-colors"
                >
                  {t("filter.clear")}
                </button>
              </div>
            )}

            {/* Supplier cards grid */}
            {!loading && !error && suppliers.length > 0 && (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
	                  {suppliers.map((supplier, index) => {
	                    const confidence = deriveCanadianConfidence(supplier);
	                    const validTier =
	                      supplier.capacity_tier === "Small" ||
	                      supplier.capacity_tier === "Medium" ||
	                      supplier.capacity_tier === "Large"
	                        ? (supplier.capacity_tier as "Small" | "Medium" | "Large")
	                        : null;
                        const provinceLabel = getProvinceLabel(supplier.province_code, locale);
                        const saved = isShortlisted(supplier.supplier_id);

                    return (
                      <article
                        key={supplier.supplier_id}
                        className={`animate-slide-in-right stagger-${Math.min(
                          index + 1,
                          5
                        )} bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}
                      >
                        <div className="p-5 pb-4">
                          {/* Card header */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-bold text-slate-900 text-base leading-tight">
                                  {supplier.business_name}
                                </h3>
                                {supplier.status && (
                                  <StatusBadge status={supplier.status} />
                                )}
                              </div>
                              {(supplier.city || supplier.province_code) && (
                                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                  <MapPin className="w-3.5 h-3.5 text-maple shrink-0" />
                                  <span>
                                    {[supplier.city, provinceLabel]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </span>
                                </div>
                              )}
                            </div>
                            <CanadianContentBadge score={confidence.score} size="sm" />
                          </div>

                          {/* Badges row */}
                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            {validTier && <CapacityBadge tier={validTier} />}
                            {supplier.naics_description && (
                              <span className="inline-flex items-center px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[11px] text-slate-500">
                                {supplier.naics_description.length > 36
                                  ? supplier.naics_description.slice(0, 36) + "…"
                                  : supplier.naics_description}
                              </span>
                            )}
                          </div>

                          {/* Low confidence warning */}
                          {confidence.score < 40 && (
                            <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-100 mb-3">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span className="text-[11px] text-amber-700 leading-relaxed">
                                {t("supplier.lowConfidence")}
                              </span>
                            </div>
                          )}

                          {/* Brief info */}
                          {supplier.brief_info && (
                            <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                              {supplier.brief_info}
                            </p>
                          )}

                          {/* Source provider */}
                          {supplier.source_provider && (
                            <p className="text-[11px] text-slate-400">
                              {copy.source}: {supplier.source_provider}
                            </p>
                          )}
                        </div>

                        {/* Card footer */}
	                        <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-end gap-2 flex-wrap">
	                          <button
	                            onClick={() => toggleDefaultSupplier(shortlistSupplierFromApi(supplier))}
	                            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
	                              saved
	                                ? "bg-maple/10 border-maple/30 text-maple"
	                                : "border-slate-200 text-slate-600 hover:bg-white"
	                            }`}
	                          >
	                            <Bookmark
	                              className={`w-3.5 h-3.5 ${
	                                saved ? "fill-maple" : ""
	                              }`}
	                            />
	                            <span className="hidden sm:inline">{t("supplier.addToShortlist")}</span>
	                          </button>
                          <Link
                            href={getLocalePath(
                              buildSupplierProfilePath(supplier.supplier_id, supplierReturnTo)
                            )}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-white transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t("supplier.viewProfile")}</span>
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/60">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {copy.previous}
                    </button>
                    <span className="text-sm text-slate-500">
                      {copy.page} <span className="font-semibold text-slate-800">{page + 1}</span> {copy.of}{" "}
                      <span className="font-semibold text-slate-800">{totalPages}</span>
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {copy.next}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-700">{t("search.filters")}</h2>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterPanel
                {...filterPanelProps}
                onClear={() => { handleClearFilters(); setMobileFiltersOpen(false); }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPageContent() {
  return (
    <Suspense
      fallback={<SearchPageSkeleton />}
    >
      <SearchContent />
    </Suspense>
  );
}
